import { Request, Response } from 'express';
import { BookingService } from '../services/BookingService';
import { ApiResponse } from '@/types';
import { 
  CreateBookingRequest, 
  UpdateBookingRequest, 
  GetBookingsRequest, 
  UpdateBookingStatusRequest 
} from '../types';

export class BookingController {
  private bookingService: BookingService;

  constructor() {
    this.bookingService = new BookingService();
  }

  /**
   * Create a new booking
   */
  createBooking = async (req: Request, res: Response): Promise<void> => {
    try {
      const customerId = (req as any).user.userId;
      const data: CreateBookingRequest = req.body;
      const result = await this.bookingService.createBooking(customerId, data);

      const response: ApiResponse = {
        success: true,
        message: result.message,
        data: result,
      };

      res.status(201).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to create booking',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(400).json(response);
    }
  };

  /**
   * Get bookings
   */
  getBookings = async (req: Request, res: Response): Promise<void> => {
    try {
      const params: GetBookingsRequest = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        status: req.query.status as any,
        customer_id: req.query.customer_id as string,
        provider_id: req.query.provider_id as string,
        start_date: req.query.start_date ? new Date(req.query.start_date as string) : undefined,
        end_date: req.query.end_date ? new Date(req.query.end_date as string) : undefined,
      };

      const result = await this.bookingService.getBookings(params);

      const response: ApiResponse = {
        success: true,
        message: 'Bookings retrieved successfully',
        data: result,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve bookings',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(500).json(response);
    }
  };

  /**
   * Get booking by ID
   */
  getBookingById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.bookingService.getBookingById(id);

      const response: ApiResponse = {
        success: true,
        message: 'Booking retrieved successfully',
        data: result,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve booking',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(404).json(response);
    }
  };

  /**
   * Update booking
   */
  updateBooking = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const data: UpdateBookingRequest = req.body;
      const result = await this.bookingService.updateBooking(id, data);

      const response: ApiResponse = {
        success: true,
        message: result.message,
        data: result,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to update booking',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(400).json(response);
    }
  };

  /**
   * Update booking status
   */
  updateBookingStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const data: UpdateBookingStatusRequest = req.body;
      const result = await this.bookingService.updateBookingStatus(id, data);

      const response: ApiResponse = {
        success: true,
        message: result.message,
        data: result,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to update booking status',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(400).json(response);
    }
  };

  /**
   * Get bookings by customer
   */
  getBookingsByCustomer = async (req: Request, res: Response): Promise<void> => {
    try {
      const customerId = (req as any).user.userId;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const result = await this.bookingService.getBookingsByCustomer(
        customerId, 
        page, 
        limit
      );

      const response: ApiResponse = {
        success: true,
        message: 'Customer bookings retrieved successfully',
        data: result,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve customer bookings',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(500).json(response);
    }
  };

  /**
   * Get bookings by provider
   */
  getBookingsByProvider = async (req: Request, res: Response): Promise<void> => {
    try {
      const providerId = (req as any).user.userId;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const result = await this.bookingService.getBookingsByProvider(
        providerId, 
        page, 
        limit
      );

      const response: ApiResponse = {
        success: true,
        message: 'Provider bookings retrieved successfully',
        data: result,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve provider bookings',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(500).json(response);
    }
  };

  /**
   * Get upcoming bookings for provider
   */
  getUpcomingBookings = async (req: Request, res: Response): Promise<void> => {
    try {
      const providerId = (req as any).user.userId;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const result = await this.bookingService.getUpcomingBookings(providerId, limit);

      const response: ApiResponse = {
        success: true,
        message: 'Upcoming bookings retrieved successfully',
        data: result,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve upcoming bookings',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(500).json(response);
    }
  };

  /**
   * Get booking statistics
   */
  getBookingStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.bookingService.getBookingStats();

      const response: ApiResponse = {
        success: true,
        message: 'Booking statistics retrieved successfully',
        data: result,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve booking statistics',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(500).json(response);
    }
  };

  /**
   * Get provider booking statistics
   */
  getProviderBookingStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const providerId = (req as any).user.userId;
      const result = await this.bookingService.getProviderBookingStats(providerId);

      const response: ApiResponse = {
        success: true,
        message: 'Provider booking statistics retrieved successfully',
        data: result,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve provider booking statistics',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(500).json(response);
    }
  };
}
