import { Request, Response } from 'express';
import { QuoteModel } from '@/models/Quote';
import { ServiceRequestModel } from '@/models/ServiceRequest';
import { ServiceProviderModel } from '@/models/ServiceProvider';
import { validationSchemas } from '@/middleware/validation';
import { ApiResponse, PaginatedResponse } from '@/types';
import { AppError } from '@/middleware/errorHandler';

export class QuoteController {
  private quoteModel: QuoteModel;
  private serviceRequestModel: ServiceRequestModel;
  private serviceProviderModel: ServiceProviderModel;

  constructor() {
    this.quoteModel = new QuoteModel();
    this.serviceRequestModel = new ServiceRequestModel();
    this.serviceProviderModel = new ServiceProviderModel();
  }

  /**
   * Create a new quote
   */
  createQuote = async (req: Request, res: Response): Promise<void> => {
    try {
      const providerId = req.user?.userId;
      if (!providerId) {
        throw new AppError('Provider ID not found in token', 401);
      }

      const { service_request_id, amount, notes, valid_until } = req.body;

      // Verify service request exists and is open
      const serviceRequest = await this.serviceRequestModel.findById(service_request_id);
      if (!serviceRequest) {
        throw new AppError('Service request not found', 404);
      }

      if (serviceRequest.status !== 'open') {
        throw new AppError('Service request is not available for quoting', 400);
      }

      // Get provider details
      const provider = await this.serviceProviderModel.findByUserId(providerId);
      if (!provider) {
        throw new AppError('Service provider profile not found', 404);
      }

      if (provider.verification_status !== 'verified') {
        throw new AppError('Provider must be verified to submit quotes', 403);
      }

      // Check if provider has already quoted on this request
      const hasQuoted = await this.quoteModel.hasProviderQuoted(service_request_id, provider.id);
      if (hasQuoted) {
        throw new AppError('You have already submitted a quote for this service request', 400);
      }

      // Validate amount is within budget range if specified
      if (serviceRequest.budget_min && amount < serviceRequest.budget_min) {
        throw new AppError(`Quote amount must be at least $${serviceRequest.budget_min}`, 400);
      }

      if (serviceRequest.budget_max && amount > serviceRequest.budget_max) {
        throw new AppError(`Quote amount must not exceed $${serviceRequest.budget_max}`, 400);
      }

      // Create quote
      const quote = await this.quoteModel.create({
        service_request_id,
        provider_id: provider.id,
        amount,
        notes,
        status: 'pending',
        valid_until: new Date(valid_until),
      });

      const response: ApiResponse = {
        success: true,
        message: 'Quote submitted successfully',
        data: { quote },
      };

      res.status(201).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to create quote',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      const statusCode = error instanceof AppError ? error.statusCode : 500;
      res.status(statusCode).json(response);
    }
  };

  /**
   * Get quotes for a service request
   */
  getQuotesForServiceRequest = async (req: Request, res: Response): Promise<void> => {
    try {
      const { serviceRequestId } = req.params;
      const { page = 1, limit = 10 } = req.query;

      const quotes = await this.quoteModel.findByServiceRequest(serviceRequestId);

      const response: ApiResponse = {
        success: true,
        message: 'Quotes retrieved successfully',
        data: { quotes },
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve quotes',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(500).json(response);
    }
  };

  /**
   * Get quotes by provider
   */
  getQuotesByProvider = async (req: Request, res: Response): Promise<void> => {
    try {
      const providerId = req.user?.userId;
      if (!providerId) {
        throw new AppError('Provider ID not found in token', 401);
      }

      const { page = 1, limit = 10, status } = req.query;

      // Get provider details
      const provider = await this.serviceProviderModel.findByUserId(providerId);
      if (!provider) {
        throw new AppError('Service provider profile not found', 404);
      }

      const { quotes, total } = await this.quoteModel.findMany({
        provider_id: provider.id,
        status: status as string,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
      });

      const response: PaginatedResponse<any> = {
        data: quotes,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total,
          totalPages: Math.ceil(total / parseInt(limit as string)),
        },
      };

      res.json({
        success: true,
        message: 'Quotes retrieved successfully',
        data: response,
      });
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve quotes',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      const statusCode = error instanceof AppError ? error.statusCode : 500;
      res.status(statusCode).json(response);
    }
  };

  /**
   * Update quote status (accept/reject)
   */
  updateQuoteStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { quoteId } = req.params;
      const { status } = req.body;

      if (!['accepted', 'rejected'].includes(status)) {
        throw new AppError('Invalid status. Must be "accepted" or "rejected"', 400);
      }

      const quote = await this.quoteModel.findById(quoteId);
      if (!quote) {
        throw new AppError('Quote not found', 404);
      }

      if (quote.status !== 'pending') {
        throw new AppError('Quote is no longer pending', 400);
      }

      // Check if quote has expired
      if (new Date() > new Date(quote.valid_until)) {
        throw new AppError('Quote has expired', 400);
      }

      // Update quote status
      const updatedQuote = await this.quoteModel.updateStatus(quoteId, status);

      // If accepted, update service request status and reject other quotes
      if (status === 'accepted') {
        await this.serviceRequestModel.updateStatus(quote.service_request_id, 'quoted');
        
        // Reject other pending quotes for this service request
        const otherQuotes = await this.quoteModel.findMany({
          service_request_id: quote.service_request_id,
          status: 'pending',
        });
        
        for (const otherQuote of otherQuotes.quotes) {
          if (otherQuote.id !== quoteId) {
            await this.quoteModel.updateStatus(otherQuote.id, 'rejected');
          }
        }
      }

      const response: ApiResponse = {
        success: true,
        message: `Quote ${status} successfully`,
        data: { quote: updatedQuote },
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to update quote status',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      const statusCode = error instanceof AppError ? error.statusCode : 500;
      res.status(statusCode).json(response);
    }
  };

  /**
   * Get quote by ID
   */
  getQuoteById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { quoteId } = req.params;

      const quote = await this.quoteModel.findById(quoteId);
      if (!quote) {
        throw new AppError('Quote not found', 404);
      }

      const response: ApiResponse = {
        success: true,
        message: 'Quote retrieved successfully',
        data: { quote },
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve quote',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      const statusCode = error instanceof AppError ? error.statusCode : 500;
      res.status(statusCode).json(response);
    }
  };

  /**
   * Update quote
   */
  updateQuote = async (req: Request, res: Response): Promise<void> => {
    try {
      const { quoteId } = req.params;
      const providerId = req.user?.userId;
      if (!providerId) {
        throw new AppError('Provider ID not found in token', 401);
      }

      const quote = await this.quoteModel.findById(quoteId);
      if (!quote) {
        throw new AppError('Quote not found', 404);
      }

      // Get provider details
      const provider = await this.serviceProviderModel.findByUserId(providerId);
      if (!provider || provider.id !== quote.provider_id) {
        throw new AppError('You can only update your own quotes', 403);
      }

      if (quote.status !== 'pending') {
        throw new AppError('Only pending quotes can be updated', 400);
      }

      const updatedQuote = await this.quoteModel.update(quoteId, req.body);

      const response: ApiResponse = {
        success: true,
        message: 'Quote updated successfully',
        data: { quote: updatedQuote },
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to update quote',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      const statusCode = error instanceof AppError ? error.statusCode : 500;
      res.status(statusCode).json(response);
    }
  };

  /**
   * Delete quote
   */
  deleteQuote = async (req: Request, res: Response): Promise<void> => {
    try {
      const { quoteId } = req.params;
      const providerId = req.user?.userId;
      if (!providerId) {
        throw new AppError('Provider ID not found in token', 401);
      }

      const quote = await this.quoteModel.findById(quoteId);
      if (!quote) {
        throw new AppError('Quote not found', 404);
      }

      // Get provider details
      const provider = await this.serviceProviderModel.findByUserId(providerId);
      if (!provider || provider.id !== quote.provider_id) {
        throw new AppError('You can only delete your own quotes', 403);
      }

      if (quote.status !== 'pending') {
        throw new AppError('Only pending quotes can be deleted', 400);
      }

      const deleted = await this.quoteModel.delete(quoteId);
      if (!deleted) {
        throw new AppError('Failed to delete quote', 500);
      }

      const response: ApiResponse = {
        success: true,
        message: 'Quote deleted successfully',
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to delete quote',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      const statusCode = error instanceof AppError ? error.statusCode : 500;
      res.status(statusCode).json(response);
    }
  };
}
