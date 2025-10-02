import { Router } from 'express';
import { PaymentController } from '../controllers/PaymentController';
import { 
  authenticateToken, 
  requireProvider, 
  requireCustomer,
  requireAdmin,
  validatePagination,
  validateIdParam
} from '../../../core/middleware';
import { RateLimiter } from '../../../core/middleware/rateLimiter';

const router = Router();
const paymentController = new PaymentController();

// Apply rate limiting
router.use(RateLimiter.moderate);

// All routes require authentication
router.use(authenticateToken);

// Get payment statistics (admin only)
router.get('/stats', requireAdmin, paymentController.getPaymentStats);

// Get all payments (admin only)
router.get('/', requireAdmin, validatePagination, paymentController.getPayments);

// Get payments by customer (customer only, own payments)
router.get('/my-payments', requireCustomer, validatePagination, paymentController.getPaymentsByCustomer);

// Get payments by provider (provider only, own payments)
router.get('/provider/my-payments', requireProvider, validatePagination, paymentController.getPaymentsByProvider);

// Get customer payment statistics (customer only)
router.get('/my-stats', requireCustomer, paymentController.getCustomerPaymentStats);

// Get provider payment statistics (provider only)
router.get('/provider/stats', requireProvider, paymentController.getProviderPaymentStats);

// Get payment by ID (public for participants)
router.get('/:id', validateIdParam, paymentController.getPaymentById);

// Process payment (authenticated users)
router.post('/process', paymentController.processPayment);

// Refund payment (admin only)
router.post('/refund', requireAdmin, paymentController.refundPayment);

// Create payment intent (authenticated users)
router.post('/create-intent', paymentController.createPaymentIntent);

// Confirm payment (authenticated users)
router.post('/confirm', paymentController.confirmPayment);

// Webhook endpoints (no authentication required)
router.post('/webhook/stripe', paymentController.handleWebhook);
router.post('/webhook/razorpay', paymentController.handleWebhook);
router.post('/webhook/paypal', paymentController.handleWebhook);

export default router;
