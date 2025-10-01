import { Router } from 'express';
import { BookingController } from '@/controllers/BookingController';
import { authenticateToken, requireProvider, requireCustomer } from '@/middleware/auth';
import {
  validateBooking,
  validateBookingStatusUpdate,
  validatePagination,
  validateIdParam,
} from '@/middleware/validation';

const router = Router();
const bookingController = new BookingController();

// All routes require authentication
router.use(authenticateToken);

// Create booking (customer only)
router.post('/', requireCustomer, validateBooking, bookingController.createBooking);

// Get bookings by customer (customer only)
router.get('/customer', requireCustomer, validatePagination, bookingController.getBookingsByCustomer);

// Get bookings by provider (provider only)
router.get('/provider', requireProvider, validatePagination, bookingController.getBookingsByProvider);

// Get upcoming bookings
router.get('/upcoming', validatePagination, bookingController.getUpcomingBookings);

// Get booking by ID with details
router.get('/:bookingId', validateIdParam, bookingController.getBookingById);

// Update booking status
router.patch('/:bookingId/status', validateIdParam, validateBookingStatusUpdate, bookingController.updateBookingStatus);

// Update booking
router.put('/:bookingId', validateIdParam, bookingController.updateBooking);

export default router;
