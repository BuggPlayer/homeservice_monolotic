import { Booking } from '@/types';

export interface CreateBookingRequest {
  quote_id: string;
  scheduled_time: Date;
  notes?: string;
}

export interface UpdateBookingRequest {
  scheduled_time?: Date;
  notes?: string;
}

export interface GetBookingsRequest {
  page?: number;
  limit?: number;
  status?: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  customer_id?: string;
  provider_id?: string;
  start_date?: Date;
  end_date?: Date;
}

export interface GetBookingsResponse {
  bookings: Booking[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface GetBookingResponse {
  booking: Booking;
}

export interface CreateBookingResponse {
  booking: Booking;
  message: string;
}

export interface UpdateBookingResponse {
  booking: Booking;
  message: string;
}

export interface UpdateBookingStatusRequest {
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
}

export interface UpdateBookingStatusResponse {
  booking: Booking;
  message: string;
}

export interface GetBookingStatsResponse {
  totalBookings: number;
  scheduledBookings: number;
  inProgressBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalEarnings: number;
  averageBookingValue: number;
}

export interface GetUpcomingBookingsResponse {
  bookings: Booking[];
}
