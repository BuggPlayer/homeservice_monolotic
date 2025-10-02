import { Router } from 'express';
import { BookingController } from '../controllers/BookingController';
import { 
  authenticateToken, 
  requireProvider, 
  requireCustomer,
  requireAdmin,
  validateBooking,
  validateBookingStatusUpdate,
  validatePagination,
  validateIdParam
} from '../../../core/middleware';
import { RateLimiter } from '../../../core/middleware/rateLimiter';

const router = Router();
const bookingController = new BookingController();

// Apply rate limiting
router.use(RateLimiter.moderate);

// All routes require authentication
router.use(authenticateToken);

// Get booking statistics (admin only)
router.get('/stats', requireAdmin, bookingController.getBookingStats);

// Get all bookings (admin only)
router.get('/', requireAdmin, validatePagination, bookingController.getBookings);

// Get bookings by customer (customer only, own bookings)
router.get('/my-bookings', requireCustomer, validatePagination, bookingController.getBookingsByCustomer);

// Get bookings by provider (provider only, own bookings)
router.get('/provider/my-bookings', requireProvider, validatePagination, bookingController.getBookingsByProvider);

// Get upcoming bookings for provider (provider only)
router.get('/provider/upcoming', requireProvider, bookingController.getUpcomingBookings);

// Get provider booking statistics (provider only)
router.get('/provider/stats', requireProvider, bookingController.getProviderBookingStats);

// Get booking by ID (public for participants)
router.get('/:id', validateIdParam, bookingController.getBookingById);

// Create booking (customer only)
router.post('/', requireCustomer, validateBooking, bookingController.createBooking);

// Update booking (provider only, own bookings)
router.put('/:id', requireProvider, validateIdParam, validateBooking, bookingController.updateBooking);

// Update booking status (provider only, own bookings)
router.patch('/:id/status', requireProvider, validateIdParam, validateBookingStatusUpdate, bookingController.updateBookingStatus);

export default router;
