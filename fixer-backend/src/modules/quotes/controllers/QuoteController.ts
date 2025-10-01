import { Request, Response } from 'express';
import { QuoteService } from '../services/QuoteService';
import { ApiResponse } from '@/types';
import { 
  CreateQuoteRequest, 
  UpdateQuoteRequest, 
  GetQuotesRequest, 
  UpdateQuoteStatusRequest 
} from '../types';

export class QuoteController {
  private quoteService: QuoteService;

  constructor() {
    this.quoteService = new QuoteService();
  }

  /**
   * Create a new quote
   */
  createQuote = async (req: Request, res: Response): Promise<void> => {
    try {
      const providerId = (req as any).user.userId;
      const data: CreateQuoteRequest = req.body;
      const result = await this.quoteService.createQuote(providerId, data);

      const response: ApiResponse = {
        success: true,
        message: result.message,
        data: result,
      };

      res.status(201).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to create quote',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(400).json(response);
    }
  };

  /**
   * Get quotes
   */
  getQuotes = async (req: Request, res: Response): Promise<void> => {
    try {
      const params: GetQuotesRequest = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        status: req.query.status as any,
        service_request_id: req.query.service_request_id as string,
        provider_id: req.query.provider_id as string,
      };

      const result = await this.quoteService.getQuotes(params);

      const response: ApiResponse = {
        success: true,
        message: 'Quotes retrieved successfully',
        data: result,
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
   * Get quote by ID
   */
  getQuoteById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.quoteService.getQuoteById(id);

      const response: ApiResponse = {
        success: true,
        message: 'Quote retrieved successfully',
        data: result,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve quote',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(404).json(response);
    }
  };

  /**
   * Update quote
   */
  updateQuote = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const data: UpdateQuoteRequest = req.body;
      const result = await this.quoteService.updateQuote(id, data);

      const response: ApiResponse = {
        success: true,
        message: result.message,
        data: result,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to update quote',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(400).json(response);
    }
  };

  /**
   * Update quote status
   */
  updateQuoteStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const data: UpdateQuoteStatusRequest = req.body;
      const result = await this.quoteService.updateQuoteStatus(id, data);

      const response: ApiResponse = {
        success: true,
        message: result.message,
        data: result,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to update quote status',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(400).json(response);
    }
  };

  /**
   * Get quotes by service request
   */
  getQuotesByServiceRequest = async (req: Request, res: Response): Promise<void> => {
    try {
      const { serviceRequestId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const result = await this.quoteService.getQuotesByServiceRequest(
        serviceRequestId, 
        page, 
        limit
      );

      const response: ApiResponse = {
        success: true,
        message: 'Service request quotes retrieved successfully',
        data: result,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve service request quotes',
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
      const providerId = (req as any).user.userId;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const result = await this.quoteService.getQuotesByProvider(
        providerId, 
        page, 
        limit
      );

      const response: ApiResponse = {
        success: true,
        message: 'Provider quotes retrieved successfully',
        data: result,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve provider quotes',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(500).json(response);
    }
  };

  /**
   * Get quote statistics
   */
  getQuoteStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.quoteService.getQuoteStats();

      const response: ApiResponse = {
        success: true,
        message: 'Quote statistics retrieved successfully',
        data: result,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve quote statistics',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(500).json(response);
    }
  };

  /**
   * Get provider quote statistics
   */
  getProviderQuoteStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const providerId = (req as any).user.userId;
      const result = await this.quoteService.getProviderQuoteStats(providerId);

      const response: ApiResponse = {
        success: true,
        message: 'Provider quote statistics retrieved successfully',
        data: result,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve provider quote statistics',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(500).json(response);
    }
  };
}
