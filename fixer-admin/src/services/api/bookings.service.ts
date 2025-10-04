import { api } from './base'
import type {
  Booking,
  UpdateBookingStatusRequest,
  BookingsResponse,
  BookingsQuery,
} from '../../types'

/**
 * Bookings Service
 * Handles all booking-related API calls
 */
export class BookingsService {
  /**
   * Get bookings with pagination and filters
   */
  static async getBookings(query: BookingsQuery = {}) {
    const params = new URLSearchParams()
    
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString())
      }
    })

    const endpoint = `/bookings${params.toString() ? `?${params.toString()}` : ''}`
    
    return api.get<BookingsResponse>(endpoint, {
      loadingMessage: 'Loading bookings...',
      showSuccessToast: false,
    })
  }

  /**
   * Get single booking by ID
   */
  static async getBooking(id: string) {
    return api.get<Booking>(`/bookings/${id}`, {
      loadingMessage: 'Loading booking...',
      showSuccessToast: false,
    })
  }

  /**
   * Update booking status
   */
  static async updateBookingStatus(id: string, statusData: UpdateBookingStatusRequest) {
    return api.put<Booking>(`/bookings/${id}/status`, statusData, {
      loadingMessage: 'Updating booking status...',
      successMessage: 'Booking status updated successfully!',
      errorMessage: 'Failed to update booking status.',
    })
  }

  /**
   * Cancel booking
   */
  static async cancelBooking(id: string, reason?: string) {
    return api.put<Booking>(`/bookings/${id}/cancel`, { reason }, {
      loadingMessage: 'Cancelling booking...',
      successMessage: 'Booking cancelled successfully!',
      errorMessage: 'Failed to cancel booking.',
    })
  }

  /**
   * Reschedule booking
   */
  static async rescheduleBooking(id: string, newDate: string, newTime: string) {
    return api.put<Booking>(`/bookings/${id}/reschedule`, { 
      scheduledDate: newDate, 
      scheduledTime: newTime 
    }, {
      loadingMessage: 'Rescheduling booking...',
      successMessage: 'Booking rescheduled successfully!',
      errorMessage: 'Failed to reschedule booking.',
    })
  }

  /**
   * Complete booking
   */
  static async completeBooking(id: string, notes?: string) {
    return api.put<Booking>(`/bookings/${id}/complete`, { notes }, {
      loadingMessage: 'Completing booking...',
      successMessage: 'Booking completed successfully!',
      errorMessage: 'Failed to complete booking.',
    })
  }

  /**
   * Get bookings by customer
   */
  static async getBookingsByCustomer(customerId: string, query: Omit<BookingsQuery, 'customerId'> = {}) {
    return this.getBookings({
      ...query,
      customerId,
    })
  }

  /**
   * Get bookings by provider
   */
  static async getBookingsByProvider(providerId: string, query: Omit<BookingsQuery, 'providerId'> = {}) {
    return this.getBookings({
      ...query,
      providerId,
    })
  }

  /**
   * Get bookings by status
   */
  static async getBookingsByStatus(status: string, query: Omit<BookingsQuery, 'status'> = {}) {
    return this.getBookings({
      ...query,
      status,
    })
  }

  /**
   * Get scheduled bookings
   */
  static async getScheduledBookings(query: Omit<BookingsQuery, 'status'> = {}) {
    return this.getBookingsByStatus('scheduled', query)
  }

  /**
   * Get in-progress bookings
   */
  static async getInProgressBookings(query: Omit<BookingsQuery, 'status'> = {}) {
    return this.getBookingsByStatus('in_progress', query)
  }

  /**
   * Get completed bookings
   */
  static async getCompletedBookings(query: Omit<BookingsQuery, 'status'> = {}) {
    return this.getBookingsByStatus('completed', query)
  }

  /**
   * Get cancelled bookings
   */
  static async getCancelledBookings(query: Omit<BookingsQuery, 'status'> = {}) {
    return this.getBookingsByStatus('cancelled', query)
  }

  /**
   * Get bookings by date range
   */
  static async getBookingsByDateRange(startDate: string, endDate: string, query: Omit<BookingsQuery, 'startDate' | 'endDate'> = {}) {
    const params = new URLSearchParams()
    
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString())
      }
    })
    
    params.append('startDate', startDate)
    params.append('endDate', endDate)

    const endpoint = `/bookings/date-range${params.toString() ? `?${params.toString()}` : ''}`
    
    return api.get<BookingsResponse>(endpoint, {
      loadingMessage: 'Loading bookings...',
      showSuccessToast: false,
    })
  }

  /**
   * Get today's bookings
   */
  static async getTodaysBookings(query: Omit<BookingsQuery, 'date'> = {}) {
    const today = new Date().toISOString().split('T')[0]
    return this.getBookingsByDateRange(today, today, query)
  }

  /**
   * Get upcoming bookings
   */
  static async getUpcomingBookings(days: number = 7, query: Omit<BookingsQuery, 'upcoming'> = {}) {
    const params = new URLSearchParams()
    
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString())
      }
    })
    
    params.append('days', days.toString())

    const endpoint = `/bookings/upcoming${params.toString() ? `?${params.toString()}` : ''}`
    
    return api.get<BookingsResponse>(endpoint, {
      loadingMessage: 'Loading upcoming bookings...',
      showSuccessToast: false,
    })
  }

  /**
   * Get booking statistics
   */
  static async getBookingStats() {
    return api.get<{
      total: number
      byStatus: Record<string, number>
      totalRevenue: number
      averageBookingValue: number
      completionRate: number
      cancellationRate: number
      monthlyStats: Array<{
        month: string
        bookings: number
        revenue: number
      }>
    }>('/bookings/stats', {
      loadingMessage: 'Loading booking statistics...',
      showSuccessToast: false,
    })
  }

  /**
   * Get bookings for dashboard
   */
  static async getBookingsForDashboard(limit: number = 10) {
    return api.get<{
      recentBookings: Booking[]
      upcomingBookings: Booking[]
      todayBookings: Booking[]
      stats: {
        total: number
        scheduled: number
        inProgress: number
        completed: number
        cancelled: number
      }
    }>(`/bookings/dashboard?limit=${limit}`, {
      loadingMessage: 'Loading dashboard data...',
      showSuccessToast: false,
    })
  }
}
