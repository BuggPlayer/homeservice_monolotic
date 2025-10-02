import { QuoteRepository } from '../../../core/database/repositories';
import { Quote } from '@/types';
import { 
  CreateQuoteRequest, 
  UpdateQuoteRequest, 
  GetQuotesRequest, 
  GetQuotesResponse, 
  GetQuoteResponse, 
  CreateQuoteResponse, 
  UpdateQuoteResponse, 
  UpdateQuoteStatusRequest, 
  UpdateQuoteStatusResponse,
  GetQuoteStatsResponse 
} from '../types';

export class QuoteService {
  private quoteRepository: QuoteRepository;

  constructor() {
    this.quoteRepository = new QuoteRepository();
  }

  /**
   * Create a new quote
   */
  async createQuote(
    providerId: string, 
    data: CreateQuoteRequest
  ): Promise<CreateQuoteResponse> {
    const quoteData = {
      service_request_id: data.service_request_id,
      provider_id: providerId,
      amount: data.amount,
      notes: data.notes || '',
      status: 'pending' as const,
      valid_until: data.valid_until,
    };

    const quote = await this.quoteRepository.create(quoteData);

    return {
      quote,
      message: 'Quote created successfully',
    };
  }

  /**
   * Get quotes with filtering and pagination
   */
  async getQuotes(params: GetQuotesRequest): Promise<GetQuotesResponse> {
    const { page = 1, limit = 10, status, service_request_id, provider_id } = params;

    let result;
    
    if (service_request_id) {
      result = await this.quoteRepository.findByServiceRequestId(service_request_id, page, limit);
    } else if (provider_id) {
      result = await this.quoteRepository.findByProviderId(provider_id, page, limit);
    } else if (status) {
      result = await this.quoteRepository.findByStatus(status, page, limit);
    } else {
      result = await this.quoteRepository.findAll(page, limit);
    }

    const totalPages = Math.ceil(result.total / limit);

    return {
      quotes: result.data,
      pagination: {
        page,
        limit,
        total: result.total,
        totalPages,
      },
    };
  }

  /**
   * Get quote by ID
   */
  async getQuoteById(quoteId: string): Promise<GetQuoteResponse> {
    const quote = await this.quoteRepository.findById(quoteId);
    if (!quote) {
      throw new Error('Quote not found');
    }

    return {
      quote,
    };
  }

  /**
   * Update quote
   */
  async updateQuote(
    quoteId: string, 
    data: UpdateQuoteRequest
  ): Promise<UpdateQuoteResponse> {
    const quote = await this.quoteRepository.findById(quoteId);
    if (!quote) {
      throw new Error('Quote not found');
    }

    // Only allow updates if status is 'pending'
    if (quote.status !== 'pending') {
      throw new Error('Cannot update quote in current status');
    }

    const updatedQuote = await this.quoteRepository.update(quoteId, data);
    if (!updatedQuote) {
      throw new Error('Failed to update quote');
    }

    return {
      quote: updatedQuote,
      message: 'Quote updated successfully',
    };
  }

  /**
   * Update quote status
   */
  async updateQuoteStatus(
    quoteId: string, 
    data: UpdateQuoteStatusRequest
  ): Promise<UpdateQuoteStatusResponse> {
    const quote = await this.quoteRepository.findById(quoteId);
    if (!quote) {
      throw new Error('Quote not found');
    }

    // Only allow status updates if quote is pending
    if (quote.status !== 'pending') {
      throw new Error('Cannot update quote status in current state');
    }

    const updatedQuote = await this.quoteRepository.updateStatus(
      quoteId, 
      data.status
    );
    if (!updatedQuote) {
      throw new Error('Failed to update quote status');
    }

    return {
      quote: updatedQuote,
      message: 'Quote status updated successfully',
    };
  }

  /**
   * Get quotes by service request
   */
  async getQuotesByServiceRequest(
    serviceRequestId: string, 
    page: number = 1, 
    limit: number = 10
  ) {
    const result = await this.quoteRepository.findByServiceRequestId(
      serviceRequestId, 
      page, 
      limit
    );
    const totalPages = Math.ceil(result.total / limit);

    return {
      quotes: result.data,
      pagination: {
        page,
        limit,
        total: result.total,
        totalPages,
      },
    };
  }

  /**
   * Get quotes by provider
   */
  async getQuotesByProvider(
    providerId: string, 
    page: number = 1, 
    limit: number = 10
  ) {
    const result = await this.quoteRepository.findByProviderId(
      providerId, 
      page, 
      limit
    );
    const totalPages = Math.ceil(result.total / limit);

    return {
      quotes: result.data,
      pagination: {
        page,
        limit,
        total: result.total,
        totalPages,
      },
    };
  }

  /**
   * Get quote statistics
   */
  async getQuoteStats(): Promise<GetQuoteStatsResponse> {
    const totalQuotes = await this.quoteRepository.count();
    const pendingQuotes = await this.quoteRepository.count('status = $1', ['pending']);
    const acceptedQuotes = await this.quoteRepository.count('status = $1', ['accepted']);
    const rejectedQuotes = await this.quoteRepository.count('status = $1', ['rejected']);
    const expiredQuotes = await this.quoteRepository.count('status = $1', ['expired']);

    // Get average amount
    const result = await this.quoteRepository.executeQuery(
      'SELECT AVG(amount) as avg_amount FROM quotes WHERE status = $1',
      ['accepted']
    );

    const averageAmount = parseFloat((result.rows[0] as any).avg_amount) || 0;

    return {
      totalQuotes,
      pendingQuotes,
      acceptedQuotes,
      rejectedQuotes,
      expiredQuotes,
      averageAmount,
    };
  }

  /**
   * Get quote statistics for provider
   */
  async getProviderQuoteStats(providerId: string) {
    return await this.quoteRepository.getProviderStats(providerId);
  }

  /**
   * Mark expired quotes
   */
  async markExpiredQuotes(): Promise<{ count: number }> {
    const expiredQuotes = await this.quoteRepository.findExpiredQuotes();
    const ids = expiredQuotes.map(quote => quote.id);
    
    if (ids.length > 0) {
      const count = await this.quoteRepository.markAsExpired(ids);
      return { count };
    }

    return { count: 0 };
  }
}
