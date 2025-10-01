export interface ProcessPaymentRequest {
  amount: number;
  currency: string;
  payment_method: 'stripe' | 'razorpay' | 'paypal';
  booking_id?: string;
  order_id?: string;
  customer_id: string;
  provider_id?: string;
  description?: string;
  metadata?: { [key: string]: any };
}

export interface ProcessPaymentResponse {
  payment_id: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  amount: number;
  currency: string;
  payment_method: string;
  transaction_id?: string;
  redirect_url?: string;
  message: string;
}

export interface RefundPaymentRequest {
  payment_id: string;
  amount?: number; // Partial refund if specified
  reason?: string;
}

export interface RefundPaymentResponse {
  refund_id: string;
  status: 'pending' | 'completed' | 'failed';
  amount: number;
  message: string;
}

export interface GetPaymentsRequest {
  page?: number;
  limit?: number;
  status?: 'pending' | 'completed' | 'failed' | 'cancelled';
  payment_method?: 'stripe' | 'razorpay' | 'paypal';
  customer_id?: string;
  provider_id?: string;
  start_date?: Date;
  end_date?: Date;
}

export interface Payment {
  id: string;
  customer_id: string;
  provider_id?: string;
  booking_id?: string;
  order_id?: string;
  amount: number;
  currency: string;
  payment_method: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  transaction_id?: string;
  description?: string;
  metadata?: { [key: string]: any };
  created_at: Date;
  updated_at: Date;
}

export interface GetPaymentsResponse {
  payments: Payment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface GetPaymentResponse {
  payment: Payment;
}

export interface GetPaymentStatsResponse {
  totalPayments: number;
  completedPayments: number;
  failedPayments: number;
  pendingPayments: number;
  totalAmount: number;
  averageAmount: number;
  totalRefunds: number;
  refundAmount: number;
}

export interface WebhookRequest {
  event_type: string;
  data: any;
  signature?: string;
}

export interface WebhookResponse {
  received: boolean;
  message: string;
}

export interface CreatePaymentIntentRequest {
  amount: number;
  currency: string;
  customer_id: string;
  description?: string;
  metadata?: { [key: string]: any };
}

export interface CreatePaymentIntentResponse {
  client_secret: string;
  payment_intent_id: string;
  amount: number;
  currency: string;
  message: string;
}

export interface ConfirmPaymentRequest {
  payment_intent_id: string;
  payment_method_id: string;
}

export interface ConfirmPaymentResponse {
  payment_id: string;
  status: 'succeeded' | 'requires_action' | 'failed';
  message: string;
}
