import { Router } from 'express';
import { BookingController } from '@/controllers/BookingController';
import { authenticateToken } from '@/middleware/auth';
import { validate, updateBookingStatusSchema, updateBookingNotesSchema } from '@/middleware/validation';

const router = Router();

// All booking routes require authentication
router.use(authenticateToken);

// General routes
router.get('/', BookingController.getBookings);
router.get('/:id', BookingController.getBookingById);

// Update routes
router.put('/:id/status', validate(updateBookingStatusSchema), BookingController.updateBookingStatus);
router.put('/:id/notes', validate(updateBookingNotesSchema), BookingController.updateBookingNotes);
router.put('/:id/cancel', BookingController.cancelBooking);
router.put('/:id/complete', BookingController.completeBooking);

export default router;
