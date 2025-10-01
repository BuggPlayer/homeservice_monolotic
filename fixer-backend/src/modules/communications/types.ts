import { Call } from '@/types';

export interface InitiateCallRequest {
  provider_id: string;
  service_request_id?: string;
}

export interface UpdateCallStatusRequest {
  status: 'initiated' | 'ringing' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  call_duration?: number;
  recording_url?: string;
}

export interface GetCallsRequest {
  page?: number;
  limit?: number;
  status?: 'initiated' | 'ringing' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  customer_id?: string;
  provider_id?: string;
}

export interface GetCallsResponse {
  calls: Call[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface GetCallResponse {
  call: Call;
}

export interface InitiateCallResponse {
  call: Call;
  message: string;
}

export interface UpdateCallStatusResponse {
  call: Call;
  message: string;
}

export interface GetCallStatsResponse {
  totalCalls: number;
  completedCalls: number;
  failedCalls: number;
  cancelledCalls: number;
  averageDuration: number;
  totalDuration: number;
}

export interface SendMessageRequest {
  to: string;
  message: string;
  type: 'text' | 'image' | 'file' | 'quote' | 'booking';
  metadata?: any;
}

export interface SendMessageResponse {
  messageId: string;
  message: string;
}

export interface GetMessagesRequest {
  page?: number;
  limit?: number;
  conversation_with?: string;
}

export interface Message {
  id: string;
  from: string;
  to: string;
  message: string;
  type: 'text' | 'image' | 'file' | 'quote' | 'booking';
  metadata?: any;
  timestamp: Date;
  read: boolean;
}

export interface GetMessagesResponse {
  messages: Message[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface MarkMessageReadRequest {
  messageId: string;
}

export interface MarkMessageReadResponse {
  message: string;
}
