import { Request, Response } from 'express';
import { BookingModel } from '@/models/Booking';
import { QuoteModel } from '@/models/Quote';
import { ServiceRequestModel } from '@/models/ServiceRequest';
import { ServiceProviderModel } from '@/models/ServiceProvider';
import { ApiResponse, PaginatedResponse } from '@/types';
import { AppError } from '@/middleware/errorHandler';

export class BookingController {
  private bookingModel: BookingModel;
  private quoteModel: QuoteModel;
  private serviceRequestModel: ServiceRequestModel;
  private serviceProviderModel: ServiceProviderModel;

  constructor() {
    this.bookingModel = new BookingModel();
    this.quoteModel = new QuoteModel();
    this.serviceRequestModel = new ServiceRequestModel();
    this.serviceProviderModel = new ServiceProviderModel();
  }

  /**
   * Create a new booking
   */
  createBooking = async (req: Request, res: Response): Promise<void> => {
    try {
      const customerId = req.user?.userId;
      if (!customerId) {
        throw new AppError('Customer ID not found in token', 401);
      }

      const { quote_id, scheduled_time, notes } = req.body;

      // Verify quote exists and is accepted
      const quote = await this.quoteModel.findById(quote_id);
      if (!quote) {
        throw new AppError('Quote not found', 404);
      }

      if (quote.status !== 'accepted') {
        throw new AppError('Quote must be accepted to create a booking', 400);
      }

      // Verify service request belongs to customer
      const serviceRequest = await this.serviceRequestModel.findById(quote.service_request_id);
      if (!serviceRequest) {
        throw new AppError('Service request not found', 404);
      }

      if (serviceRequest.customer_id !== customerId) {
        throw new AppError('You can only book quotes for your own service requests', 403);
      }

      // Check for booking conflicts
      const hasConflict = await this.bookingModel.hasConflictingBooking(
        quote.provider_id,
        new Date(scheduled_time)
      );

      if (hasConflict) {
        throw new AppError('Provider has a conflicting booking at this time', 400);
      }

      // Create booking
      const booking = await this.bookingModel.create({
        service_request_id: quote.service_request_id,
        quote_id: quote.id,
        provider_id: quote.provider_id,
        customer_id: customerId,
        scheduled_time: new Date(scheduled_time),
        status: 'scheduled',
        total_amount: quote.amount,
        notes,
      });

      // Update service request status
      await this.serviceRequestModel.updateStatus(quote.service_request_id, 'booked');

      const response: ApiResponse = {
        success: true,
        message: 'Booking created successfully',
        data: { booking },
      };

      res.status(201).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to create booking',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      const statusCode = error instanceof AppError ? error.statusCode : 500;
      res.status(statusCode).json(response);
    }
  };

  /**
   * Get bookings by customer
   */
  getBookingsByCustomer = async (req: Request, res: Response): Promise<void> => {
    try {
      const customerId = req.user?.userId;
      if (!customerId) {
        throw new AppError('Customer ID not found in token', 401);
      }

      const { page = 1, limit = 10, status } = req.query;

      const { bookings, total } = await this.bookingModel.findMany({
        customer_id: customerId,
        status: status as string,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
      });

      const response: PaginatedResponse<any> = {
        data: bookings,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total,
          totalPages: Math.ceil(total / parseInt(limit as string)),
        },
      };

      res.json({
        success: true,
        message: 'Bookings retrieved successfully',
        data: response,
      });
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve bookings',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      const statusCode = error instanceof AppError ? error.statusCode : 500;
      res.status(statusCode).json(response);
    }
  };

  /**
   * Get bookings by provider
   */
  getBookingsByProvider = async (req: Request, res: Response): Promise<void> => {
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

      const { bookings, total } = await this.bookingModel.findMany({
        provider_id: provider.id,
        status: status as string,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
      });

      const response: PaginatedResponse<any> = {
        data: bookings,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total,
          totalPages: Math.ceil(total / parseInt(limit as string)),
        },
      };

      res.json({
        success: true,
        message: 'Bookings retrieved successfully',
        data: response,
      });
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve bookings',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      const statusCode = error instanceof AppError ? error.statusCode : 500;
      res.status(statusCode).json(response);
    }
  };

  /**
   * Get booking by ID with details
   */
  getBookingById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { bookingId } = req.params;
      const userId = req.user?.userId;
      const userType = req.user?.userType;

      const booking = await this.bookingModel.findByIdWithDetails(bookingId);
      if (!booking) {
        throw new AppError('Booking not found', 404);
      }

      // Check if user has access to this booking
      if (userType === 'customer' && booking.customer_id !== userId) {
        throw new AppError('Access denied', 403);
      }

      if (userType === 'provider') {
        const provider = await this.serviceProviderModel.findByUserId(userId!);
        if (!provider || provider.id !== booking.provider_id) {
          throw new AppError('Access denied', 403);
        }
      }

      const response: ApiResponse = {
        success: true,
        message: 'Booking retrieved successfully',
        data: { booking },
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve booking',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      const statusCode = error instanceof AppError ? error.statusCode : 500;
      res.status(statusCode).json(response);
    }
  };

  /**
   * Update booking status
   */
  updateBookingStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { bookingId } = req.params;
      const { status } = req.body;
      const userId = req.user?.userId;
      const userType = req.user?.userType;

      if (!['scheduled', 'in_progress', 'completed', 'cancelled'].includes(status)) {
        throw new AppError('Invalid status', 400);
      }

      const booking = await this.bookingModel.findById(bookingId);
      if (!booking) {
        throw new AppError('Booking not found', 404);
      }

      // Check permissions
      if (userType === 'customer' && booking.customer_id !== userId) {
        throw new AppError('Access denied', 403);
      }

      if (userType === 'provider') {
        const provider = await this.serviceProviderModel.findByUserId(userId!);
        if (!provider || provider.id !== booking.provider_id) {
          throw new AppError('Access denied', 403);
        }
      }

      // Validate status transitions
      const validTransitions: { [key: string]: string[] } = {
        scheduled: ['in_progress', 'cancelled'],
        in_progress: ['completed', 'cancelled'],
        completed: [],
        cancelled: [],
      };

      if (!validTransitions[booking.status].includes(status)) {
        throw new AppError(`Cannot change status from ${booking.status} to ${status}`, 400);
      }

      const updatedBooking = await this.bookingModel.updateStatus(bookingId, status);

      // Update service request status if booking is completed or cancelled
      if (status === 'completed') {
        await this.serviceRequestModel.updateStatus(booking.service_request_id, 'completed');
      } else if (status === 'cancelled') {
        await this.serviceRequestModel.updateStatus(booking.service_request_id, 'cancelled');
      }

      const response: ApiResponse = {
        success: true,
        message: 'Booking status updated successfully',
        data: { booking: updatedBooking },
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to update booking status',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      const statusCode = error instanceof AppError ? error.statusCode : 500;
      res.status(statusCode).json(response);
    }
  };

  /**
   * Get upcoming bookings
   */
  getUpcomingBookings = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      const userType = req.user?.userType;
      const { limit = 10 } = req.query;

      if (!userId || !userType) {
        throw new AppError('User information not found in token', 401);
      }

      let upcomingBookings: any[] = [];

      if (userType === 'customer') {
        upcomingBookings = await this.bookingModel.findUpcomingForCustomer(
          userId,
          parseInt(limit as string)
        );
      } else if (userType === 'provider') {
        const provider = await this.serviceProviderModel.findByUserId(userId);
        if (!provider) {
          throw new AppError('Service provider profile not found', 404);
        }

        upcomingBookings = await this.bookingModel.findUpcomingForProvider(
          provider.id,
          parseInt(limit as string)
        );
      } else {
        throw new AppError('Invalid user type', 400);
      }

      const response: ApiResponse = {
        success: true,
        message: 'Upcoming bookings retrieved successfully',
        data: { bookings: upcomingBookings },
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve upcoming bookings',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      const statusCode = error instanceof AppError ? error.statusCode : 500;
      res.status(statusCode).json(response);
    }
  };

  /**
   * Update booking
   */
  updateBooking = async (req: Request, res: Response): Promise<void> => {
    try {
      const { bookingId } = req.params;
      const userId = req.user?.userId;
      const userType = req.user?.userType;

      const booking = await this.bookingModel.findById(bookingId);
      if (!booking) {
        throw new AppError('Booking not found', 404);
      }

      // Check permissions
      if (userType === 'customer' && booking.customer_id !== userId) {
        throw new AppError('Access denied', 403);
      }

      if (userType === 'provider') {
        const provider = await this.serviceProviderModel.findByUserId(userId!);
        if (!provider || provider.id !== booking.provider_id) {
          throw new AppError('Access denied', 403);
        }
      }

      // Only allow updates to scheduled bookings
      if (booking.status !== 'scheduled') {
        throw new AppError('Only scheduled bookings can be updated', 400);
      }

      const updatedBooking = await this.bookingModel.update(bookingId, req.body);

      const response: ApiResponse = {
        success: true,
        message: 'Booking updated successfully',
        data: { booking: updatedBooking },
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to update booking',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      const statusCode = error instanceof AppError ? error.statusCode : 500;
      res.status(statusCode).json(response);
    }
  };
}
