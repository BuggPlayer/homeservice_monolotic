import { Quote } from '@/types';

export interface CreateQuoteRequest {
  service_request_id: string;
  amount: number;
  notes?: string;
  valid_until: Date;
}

export interface UpdateQuoteRequest {
  amount?: number;
  notes?: string;
  valid_until?: Date;
}

export interface GetQuotesRequest {
  page?: number;
  limit?: number;
  status?: 'pending' | 'accepted' | 'rejected' | 'expired';
  service_request_id?: string;
  provider_id?: string;
}

export interface GetQuotesResponse {
  quotes: Quote[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface GetQuoteResponse {
  quote: Quote;
}

export interface CreateQuoteResponse {
  quote: Quote;
  message: string;
}

export interface UpdateQuoteResponse {
  quote: Quote;
  message: string;
}

export interface UpdateQuoteStatusRequest {
  status: 'accepted' | 'rejected';
}

export interface UpdateQuoteStatusResponse {
  quote: Quote;
  message: string;
}

export interface GetQuoteStatsResponse {
  totalQuotes: number;
  pendingQuotes: number;
  acceptedQuotes: number;
  rejectedQuotes: number;
  expiredQuotes: number;
  averageAmount: number;
}
