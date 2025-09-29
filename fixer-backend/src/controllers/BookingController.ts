import { Request, Response } from 'express';
import { BookingModel } from '@/models/Booking';
import { AuthenticatedRequest } from '@/types';

export class BookingController {
  static async getBookings(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const { status, customer_id, provider_id } = req.query;
      const filters: any = {};

      if (req.user.role === 'customer') {
        filters.customer_id = req.user.id;
      } else if (req.user.role === 'provider') {
        filters.provider_id = req.user.id;
      }

      if (status) filters.status = status;
      if (customer_id) filters.customer_id = customer_id;
      if (provider_id) filters.provider_id = provider_id;

      const bookings = await BookingModel.findAll(filters);
      res.status(200).json(bookings);
    } catch (error: any) {
      res.status(500).json({ message: 'Failed to retrieve bookings', error: error.message });
    }
  }

  static async getBookingById(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const { id } = req.params;
      const booking = await BookingModel.findById(id);

      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      // Check if user has permission to view this booking
      if (req.user.role === 'customer' && booking.customer_id !== req.user.id) {
        return res.status(403).json({ message: 'Unauthorized to view this booking' });
      }
      if (req.user.role === 'provider' && booking.provider_id !== req.user.id) {
        return res.status(403).json({ message: 'Unauthorized to view this booking' });
      }

      res.status(200).json(booking);
    } catch (error: any) {
      res.status(500).json({ message: 'Failed to retrieve booking', error: error.message });
    }
  }

  static async updateBookingStatus(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const { id } = req.params;
      const { status } = req.body;

      const existingBooking = await BookingModel.findById(id);
      if (!existingBooking) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      // Check permissions
      if (req.user.role === 'customer' && existingBooking.customer_id !== req.user.id) {
        return res.status(403).json({ message: 'Unauthorized to update this booking' });
      }
      if (req.user.role === 'provider' && existingBooking.provider_id !== req.user.id) {
        return res.status(403).json({ message: 'Unauthorized to update this booking' });
      }

      const updatedBooking = await BookingModel.updateStatus(id, status);
      if (!updatedBooking) {
        return res.status(500).json({ message: 'Failed to update booking status' });
      }

      res.status(200).json({ message: 'Booking status updated successfully', booking: updatedBooking });
    } catch (error: any) {
      res.status(500).json({ message: 'Failed to update booking status', error: error.message });
    }
  }

  static async updateBookingNotes(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const { id } = req.params;
      const { notes } = req.body;

      const existingBooking = await BookingModel.findById(id);
      if (!existingBooking) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      // Check permissions
      if (req.user.role === 'customer' && existingBooking.customer_id !== req.user.id) {
        return res.status(403).json({ message: 'Unauthorized to update this booking' });
      }
      if (req.user.role === 'provider' && existingBooking.provider_id !== req.user.id) {
        return res.status(403).json({ message: 'Unauthorized to update this booking' });
      }

      const updatedBooking = await BookingModel.updateNotes(id, notes);
      if (!updatedBooking) {
        return res.status(500).json({ message: 'Failed to update booking notes' });
      }

      res.status(200).json({ message: 'Booking notes updated successfully', booking: updatedBooking });
    } catch (error: any) {
      res.status(500).json({ message: 'Failed to update booking notes', error: error.message });
    }
  }

  static async cancelBooking(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const { id } = req.params;
      const { reason } = req.body;

      const existingBooking = await BookingModel.findById(id);
      if (!existingBooking) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      // Check permissions
      if (req.user.role === 'customer' && existingBooking.customer_id !== req.user.id) {
        return res.status(403).json({ message: 'Unauthorized to cancel this booking' });
      }
      if (req.user.role === 'provider' && existingBooking.provider_id !== req.user.id) {
        return res.status(403).json({ message: 'Unauthorized to cancel this booking' });
      }

      const updatedBooking = await BookingModel.cancel(id, reason);
      if (!updatedBooking) {
        return res.status(500).json({ message: 'Failed to cancel booking' });
      }

      res.status(200).json({ message: 'Booking cancelled successfully', booking: updatedBooking });
    } catch (error: any) {
      res.status(500).json({ message: 'Failed to cancel booking', error: error.message });
    }
  }

  static async completeBooking(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user || req.user.role !== 'provider') {
        return res.status(403).json({ message: 'Only providers can complete bookings' });
      }

      const { id } = req.params;
      const { completion_notes, final_amount } = req.body;

      const existingBooking = await BookingModel.findById(id);
      if (!existingBooking) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      if (existingBooking.provider_id !== req.user.id) {
        return res.status(403).json({ message: 'Unauthorized to complete this booking' });
      }

      const updatedBooking = await BookingModel.complete(id, completion_notes, final_amount);
      if (!updatedBooking) {
        return res.status(500).json({ message: 'Failed to complete booking' });
      }

      res.status(200).json({ message: 'Booking completed successfully', booking: updatedBooking });
    } catch (error: any) {
      res.status(500).json({ message: 'Failed to complete booking', error: error.message });
    }
  }
}
