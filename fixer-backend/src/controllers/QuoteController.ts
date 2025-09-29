import { Request, Response } from 'express';
import { QuoteModel } from '@/models/Quote';
import { AuthenticatedRequest } from '@/types';

export class QuoteController {
  static async createQuote(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user || req.user.role !== 'provider') {
        return res.status(403).json({ message: 'Only providers can create quotes' });
      }

      const { service_request_id, amount, notes, valid_until } = req.body;
      const provider_id = req.user.id;

      const newQuote = await QuoteModel.create({
        service_request_id,
        provider_id,
        amount,
        notes,
        valid_until,
      });

      res.status(201).json({ message: 'Quote created successfully', quote: newQuote });
    } catch (error: any) {
      res.status(500).json({ message: 'Failed to create quote', error: error.message });
    }
  }

  static async getQuotes(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const { status, service_request_id } = req.query;
      const filters: any = {};

      if (req.user.role === 'provider') {
        filters.provider_id = req.user.id;
      } else if (req.user.role === 'customer') {
        // Get quotes for service requests created by this customer
        filters.customer_id = req.user.id;
      }

      if (status) filters.status = status;
      if (service_request_id) filters.service_request_id = service_request_id;

      const quotes = await QuoteModel.findAll(filters);
      res.status(200).json(quotes);
    } catch (error: any) {
      res.status(500).json({ message: 'Failed to retrieve quotes', error: error.message });
    }
  }

  static async getQuoteById(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const { id } = req.params;
      const quote = await QuoteModel.findById(id);

      if (!quote) {
        return res.status(404).json({ message: 'Quote not found' });
      }

      // Check if user has permission to view this quote
      if (req.user.role === 'provider' && quote.provider_id !== req.user.id) {
        return res.status(403).json({ message: 'Unauthorized to view this quote' });
      }

      res.status(200).json(quote);
    } catch (error: any) {
      res.status(500).json({ message: 'Failed to retrieve quote', error: error.message });
    }
  }

  static async updateQuote(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user || req.user.role !== 'provider') {
        return res.status(403).json({ message: 'Only providers can update quotes' });
      }

      const { id } = req.params;
      const updates = req.body;

      const existingQuote = await QuoteModel.findById(id);
      if (!existingQuote) {
        return res.status(404).json({ message: 'Quote not found' });
      }

      if (existingQuote.provider_id !== req.user.id) {
        return res.status(403).json({ message: 'Unauthorized to update this quote' });
      }

      const updatedQuote = await QuoteModel.update(id, updates);
      if (!updatedQuote) {
        return res.status(500).json({ message: 'Failed to update quote' });
      }

      res.status(200).json({ message: 'Quote updated successfully', quote: updatedQuote });
    } catch (error: any) {
      res.status(500).json({ message: 'Failed to update quote', error: error.message });
    }
  }

  static async acceptQuote(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user || req.user.role !== 'customer') {
        return res.status(403).json({ message: 'Only customers can accept quotes' });
      }

      const { id } = req.params;
      const quote = await QuoteModel.findById(id);

      if (!quote) {
        return res.status(404).json({ message: 'Quote not found' });
      }

      // Check if quote belongs to a service request created by this customer
      const serviceRequest = await QuoteModel.getServiceRequest(quote.service_request_id);
      if (!serviceRequest || serviceRequest.customer_id !== req.user.id) {
        return res.status(403).json({ message: 'Unauthorized to accept this quote' });
      }

      if (quote.status !== 'pending') {
        return res.status(400).json({ message: 'Quote is not in pending status' });
      }

      // Accept the quote and create a booking
      const booking = await QuoteModel.acceptQuote(id, req.user.id);
      res.status(200).json({ message: 'Quote accepted successfully', booking });
    } catch (error: any) {
      res.status(500).json({ message: 'Failed to accept quote', error: error.message });
    }
  }

  static async rejectQuote(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user || req.user.role !== 'customer') {
        return res.status(403).json({ message: 'Only customers can reject quotes' });
      }

      const { id } = req.params;
      const quote = await QuoteModel.findById(id);

      if (!quote) {
        return res.status(404).json({ message: 'Quote not found' });
      }

      // Check if quote belongs to a service request created by this customer
      const serviceRequest = await QuoteModel.getServiceRequest(quote.service_request_id);
      if (!serviceRequest || serviceRequest.customer_id !== req.user.id) {
        return res.status(403).json({ message: 'Unauthorized to reject this quote' });
      }

      const updatedQuote = await QuoteModel.updateStatus(id, 'rejected');
      if (!updatedQuote) {
        return res.status(500).json({ message: 'Failed to reject quote' });
      }

      res.status(200).json({ message: 'Quote rejected successfully', quote: updatedQuote });
    } catch (error: any) {
      res.status(500).json({ message: 'Failed to reject quote', error: error.message });
    }
  }

  static async deleteQuote(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user || req.user.role !== 'provider') {
        return res.status(403).json({ message: 'Only providers can delete quotes' });
      }

      const { id } = req.params;
      const quote = await QuoteModel.findById(id);

      if (!quote) {
        return res.status(404).json({ message: 'Quote not found' });
      }

      if (quote.provider_id !== req.user.id) {
        return res.status(403).json({ message: 'Unauthorized to delete this quote' });
      }

      await QuoteModel.delete(id);
      res.status(200).json({ message: 'Quote deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ message: 'Failed to delete quote', error: error.message });
    }
  }
}
