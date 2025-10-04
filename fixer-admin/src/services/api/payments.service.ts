import { api } from './base'
import type {
  Payment,
  CreatePaymentIntentRequest,
  ConfirmPaymentRequest,
  PaymentIntentResponse,
} from '../../types'

/**
 * Payments Service
 * Handles all payment-related API calls
 */
export class PaymentsService {
  /**
   * Create payment intent
   */
  static async createPaymentIntent(paymentData: CreatePaymentIntentRequest) {
    return api.post<PaymentIntentResponse>('/payments/create-intent', paymentData, {
      loadingMessage: 'Creating payment intent...',
      successMessage: 'Payment intent created successfully!',
      errorMessage: 'Failed to create payment intent.',
    })
  }

  /**
   * Confirm payment
   */
  static async confirmPayment(confirmationData: ConfirmPaymentRequest) {
    return api.post<Payment>('/payments/confirm', confirmationData, {
      loadingMessage: 'Confirming payment...',
      successMessage: 'Payment confirmed successfully!',
      errorMessage: 'Failed to confirm payment.',
    })
  }

  /**
   * Get payment by ID
   */
  static async getPayment(id: string) {
    return api.get<Payment>(`/payments/${id}`, {
      loadingMessage: 'Loading payment...',
      showSuccessToast: false,
    })
  }

  /**
   * Get payments by booking
   */
  static async getPaymentsByBooking(bookingId: string) {
    return api.get<Payment[]>(`/payments/booking/${bookingId}`, {
      loadingMessage: 'Loading payments...',
      showSuccessToast: false,
    })
  }

  /**
   * Get payments with pagination and filters
   */
  static async getPayments(query: {
    page?: number
    limit?: number
    status?: string
    bookingId?: string
    customerId?: string
    providerId?: string
  } = {}) {
    const params = new URLSearchParams()
    
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString())
      }
    })

    const endpoint = `/payments${params.toString() ? `?${params.toString()}` : ''}`
    
    return api.get<{
      payments: Payment[]
      pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
      }
    }>(endpoint, {
      loadingMessage: 'Loading payments...',
      showSuccessToast: false,
    })
  }

  /**
   * Cancel payment
   */
  static async cancelPayment(id: string, reason?: string) {
    return api.post<Payment>(`/payments/${id}/cancel`, { reason }, {
      loadingMessage: 'Cancelling payment...',
      successMessage: 'Payment cancelled successfully!',
      errorMessage: 'Failed to cancel payment.',
    })
  }

  /**
   * Refund payment
   */
  static async refundPayment(id: string, amount?: number, reason?: string) {
    return api.post<Payment>(`/payments/${id}/refund`, { amount, reason }, {
      loadingMessage: 'Processing refund...',
      successMessage: 'Refund processed successfully!',
      errorMessage: 'Failed to process refund.',
    })
  }

  /**
   * Get payments by status
   */
  static async getPaymentsByStatus(status: string, query: {
    page?: number
    limit?: number
  } = {}) {
    return this.getPayments({
      ...query,
      status,
    })
  }

  /**
   * Get completed payments
   */
  static async getCompletedPayments(query: {
    page?: number
    limit?: number
  } = {}) {
    return this.getPaymentsByStatus('completed', query)
  }

  /**
   * Get failed payments
   */
  static async getFailedPayments(query: {
    page?: number
    limit?: number
  } = {}) {
    return this.getPaymentsByStatus('failed', query)
  }

  /**
   * Get pending payments
   */
  static async getPendingPayments(query: {
    page?: number
    limit?: number
  } = {}) {
    return this.getPaymentsByStatus('pending', query)
  }

  /**
   * Get refunded payments
   */
  static async getRefundedPayments(query: {
    page?: number
    limit?: number
  } = {}) {
    return this.getPaymentsByStatus('refunded', query)
  }

  /**
   * Get payments by customer
   */
  static async getPaymentsByCustomer(customerId: string, query: {
    page?: number
    limit?: number
    status?: string
  } = {}) {
    return this.getPayments({
      ...query,
      customerId,
    })
  }

  /**
   * Get payments by provider
   */
  static async getPaymentsByProvider(providerId: string, query: {
    page?: number
    limit?: number
    status?: string
  } = {}) {
    return this.getPayments({
      ...query,
      providerId,
    })
  }

  /**
   * Get payments by date range
   */
  static async getPaymentsByDateRange(startDate: string, endDate: string, query: {
    page?: number
    limit?: number
    status?: string
  } = {}) {
    const params = new URLSearchParams()
    
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString())
      }
    })
    
    params.append('startDate', startDate)
    params.append('endDate', endDate)

    const endpoint = `/payments/date-range${params.toString() ? `?${params.toString()}` : ''}`
    
    return api.get<{
      payments: Payment[]
      pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
      }
      totalAmount: number
    }>(endpoint, {
      loadingMessage: 'Loading payments...',
      showSuccessToast: false,
    })
  }

  /**
   * Get payment statistics
   */
  static async getPaymentStats() {
    return api.get<{
      total: number
      byStatus: Record<string, number>
      totalRevenue: number
      totalRefunds: number
      averageTransactionAmount: number
      successRate: number
      monthlyStats: Array<{
        month: string
        transactions: number
        revenue: number
        refunds: number
      }>
    }>('/payments/stats', {
      loadingMessage: 'Loading payment statistics...',
      showSuccessToast: false,
    })
  }

  /**
   * Get payments for dashboard
   */
  static async getPaymentsForDashboard(limit: number = 10) {
    return api.get<{
      recentPayments: Payment[]
      pendingPayments: Payment[]
      failedPayments: Payment[]
      stats: {
        total: number
        pending: number
        completed: number
        failed: number
        refunded: number
        totalRevenue: number
      }
    }>(`/payments/dashboard?limit=${limit}`, {
      loadingMessage: 'Loading dashboard data...',
      showSuccessToast: false,
    })
  }

  /**
   * Get payment methods
   */
  static async getPaymentMethods() {
    return api.get<Array<{
      id: string
      type: string
      last4?: string
      brand?: string
      expMonth?: number
      expYear?: number
      isDefault: boolean
    }>>('/payments/methods', {
      loadingMessage: 'Loading payment methods...',
      showSuccessToast: false,
    })
  }

  /**
   * Add payment method
   */
  static async addPaymentMethod(paymentMethodData: any) {
    return api.post<{
      id: string
      type: string
      isDefault: boolean
    }>('/payments/methods', paymentMethodData, {
      loadingMessage: 'Adding payment method...',
      successMessage: 'Payment method added successfully!',
      errorMessage: 'Failed to add payment method.',
    })
  }

  /**
   * Delete payment method
   */
  static async deletePaymentMethod(id: string) {
    return api.delete(`/payments/methods/${id}`, {
      loadingMessage: 'Deleting payment method...',
      successMessage: 'Payment method deleted successfully!',
      errorMessage: 'Failed to delete payment method.',
    })
  }
}
