import { BookingRepository, QuoteRepository } from '@/core/database/repositories';
import { Booking, Quote } from '@/types';
import { 
  CreateBookingRequest, 
  UpdateBookingRequest, 
  GetBookingsRequest, 
  GetBookingsResponse, 
  GetBookingResponse, 
  CreateBookingResponse, 
  UpdateBookingResponse, 
  UpdateBookingStatusRequest, 
  UpdateBookingStatusResponse,
  GetBookingStatsResponse,
  GetUpcomingBookingsResponse 
} from '../types';

export class BookingService {
  private bookingRepository: BookingRepository;
  private quoteRepository: QuoteRepository;

  constructor() {
    this.bookingRepository = new BookingRepository();
    this.quoteRepository = new QuoteRepository();
  }

  /**
   * Create a new booking
   */
  async createBooking(
    customerId: string, 
    data: CreateBookingRequest
  ): Promise<CreateBookingResponse> {
    // Get the quote to validate and get details
    const quote = await this.quoteRepository.findById(data.quote_id);
    if (!quote) {
      throw new Error('Quote not found');
    }

    if (quote.status !== 'accepted') {
      throw new Error('Quote must be accepted before creating a booking');
    }

    // Check for booking conflicts
    const hasConflict = await this.bookingRepository.hasBookingConflict(
      quote.provider_id,
      data.scheduled_time,
      60, // 1 hour duration
    );

    if (hasConflict) {
      throw new Error('Provider has a conflicting booking at this time');
    }

    const bookingData = {
      service_request_id: quote.service_request_id,
      quote_id: data.quote_id,
      provider_id: quote.provider_id,
      customer_id: customerId,
      scheduled_time: data.scheduled_time,
      status: 'scheduled' as const,
      total_amount: quote.amount,
      notes: data.notes || '',
    };

    const booking = await this.bookingRepository.create(bookingData);

    // Update quote status to prevent multiple bookings
    await this.quoteRepository.updateStatus(data.quote_id, 'accepted');

    return {
      booking,
      message: 'Booking created successfully',
    };
  }

  /**
   * Get bookings with filtering and pagination
   */
  async getBookings(params: GetBookingsRequest): Promise<GetBookingsResponse> {
    const { page = 1, limit = 10, status, customer_id, provider_id, start_date, end_date } = params;

    let result;
    
    if (customer_id) {
      result = await this.bookingRepository.findByCustomerId(customer_id, page, limit);
    } else if (provider_id) {
      result = await this.bookingRepository.findByProviderId(provider_id, page, limit);
    } else if (status) {
      result = await this.bookingRepository.findByStatus(status, page, limit);
    } else if (start_date && end_date) {
      result = await this.bookingRepository.findByDateRange(start_date, end_date, page, limit);
    } else {
      result = await this.bookingRepository.findAll(page, limit);
    }

    const totalPages = Math.ceil(result.total / limit);

    return {
      bookings: result.data,
      pagination: {
        page,
        limit,
        total: result.total,
        totalPages,
      },
    };
  }

  /**
   * Get booking by ID
   */
  async getBookingById(bookingId: string): Promise<GetBookingResponse> {
    const booking = await this.bookingRepository.findById(bookingId);
    if (!booking) {
      throw new Error('Booking not found');
    }

    return {
      booking,
    };
  }

  /**
   * Update booking
   */
  async updateBooking(
    bookingId: string, 
    data: UpdateBookingRequest
  ): Promise<UpdateBookingResponse> {
    const booking = await this.bookingRepository.findById(bookingId);
    if (!booking) {
      throw new Error('Booking not found');
    }

    // Only allow updates if status is 'scheduled'
    if (booking.status !== 'scheduled') {
      throw new Error('Cannot update booking in current status');
    }

    // Check for conflicts if scheduled_time is being updated
    if (data.scheduled_time) {
      const hasConflict = await this.bookingRepository.hasBookingConflict(
        booking.provider_id,
        data.scheduled_time,
        60,
        bookingId
      );

      if (hasConflict) {
        throw new Error('Provider has a conflicting booking at this time');
      }
    }

    const updatedBooking = await this.bookingRepository.update(bookingId, data);
    if (!updatedBooking) {
      throw new Error('Failed to update booking');
    }

    return {
      booking: updatedBooking,
      message: 'Booking updated successfully',
    };
  }

  /**
   * Update booking status
   */
  async updateBookingStatus(
    bookingId: string, 
    data: UpdateBookingStatusRequest
  ): Promise<UpdateBookingStatusResponse> {
    const booking = await this.bookingRepository.findById(bookingId);
    if (!booking) {
      throw new Error('Booking not found');
    }

    const updatedBooking = await this.bookingRepository.updateStatus(
      bookingId, 
      data.status
    );
    if (!updatedBooking) {
      throw new Error('Failed to update booking status');
    }

    return {
      booking: updatedBooking,
      message: 'Booking status updated successfully',
    };
  }

  /**
   * Get bookings by customer
   */
  async getBookingsByCustomer(
    customerId: string, 
    page: number = 1, 
    limit: number = 10
  ) {
    const result = await this.bookingRepository.findByCustomerId(
      customerId, 
      page, 
      limit
    );
    const totalPages = Math.ceil(result.total / limit);

    return {
      bookings: result.data,
      pagination: {
        page,
        limit,
        total: result.total,
        totalPages,
      },
    };
  }

  /**
   * Get bookings by provider
   */
  async getBookingsByProvider(
    providerId: string, 
    page: number = 1, 
    limit: number = 10
  ) {
    const result = await this.bookingRepository.findByProviderId(
      providerId, 
      page, 
      limit
    );
    const totalPages = Math.ceil(result.total / limit);

    return {
      bookings: result.data,
      pagination: {
        page,
        limit,
        total: result.total,
        totalPages,
      },
    };
  }

  /**
   * Get upcoming bookings for provider
   */
  async getUpcomingBookings(
    providerId: string, 
    limit: number = 10
  ): Promise<GetUpcomingBookingsResponse> {
    const bookings = await this.bookingRepository.getUpcomingBookings(providerId, limit);

    return {
      bookings,
    };
  }

  /**
   * Get booking statistics
   */
  async getBookingStats(): Promise<GetBookingStatsResponse> {
    const totalBookings = await this.bookingRepository.count();
    const scheduledBookings = await this.bookingRepository.count('status = $1', ['scheduled']);
    const inProgressBookings = await this.bookingRepository.count('status = $1', ['in_progress']);
    const completedBookings = await this.bookingRepository.count('status = $1', ['completed']);
    const cancelledBookings = await this.bookingRepository.count('status = $1', ['cancelled']);

    // Get earnings statistics
    const result = await this.bookingRepository.query(
      'SELECT SUM(total_amount) as total_earnings, AVG(total_amount) as avg_booking_value FROM bookings WHERE status = $1',
      ['completed']
    );

    const totalEarnings = parseFloat(result.rows[0].total_earnings) || 0;
    const averageBookingValue = parseFloat(result.rows[0].avg_booking_value) || 0;

    return {
      totalBookings,
      scheduledBookings,
      inProgressBookings,
      completedBookings,
      cancelledBookings,
      totalEarnings,
      averageBookingValue,
    };
  }

  /**
   * Get booking statistics for provider
   */
  async getProviderBookingStats(providerId: string) {
    return await this.bookingRepository.getProviderStats(providerId);
  }
}
