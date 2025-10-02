import { Router } from 'express';
import { QuoteController } from '../controllers/QuoteController';
import { 
  authenticateToken, 
  requireProvider, 
  requireCustomer,
  requireAdmin,
  validateQuote,
  validateQuoteStatusUpdate,
  validatePagination,
  validateIdParam
} from '../../../core/middleware';
import { RateLimiter } from '../../../core/middleware/rateLimiter';

const router = Router();
const quoteController = new QuoteController();

// Apply rate limiting
router.use(RateLimiter.moderate);

// All routes require authentication
router.use(authenticateToken);

// Get quote statistics (admin only)
router.get('/stats', requireAdmin, quoteController.getQuoteStats);

// Get all quotes (public)
router.get('/', validatePagination, quoteController.getQuotes);

// Get quotes by service request (public)
router.get('/service-request/:serviceRequestId', validateIdParam, validatePagination, quoteController.getQuotesByServiceRequest);

// Get quotes by provider (provider only, own quotes)
router.get('/my-quotes', requireProvider, validatePagination, quoteController.getQuotesByProvider);

// Get provider quote statistics (provider only)
router.get('/my-stats', requireProvider, quoteController.getProviderQuoteStats);

// Get quote by ID (public)
router.get('/:id', validateIdParam, quoteController.getQuoteById);

// Create quote (provider only)
router.post('/', requireProvider, validateQuote, quoteController.createQuote);

// Update quote (provider only, own quotes)
router.put('/:id', requireProvider, validateIdParam, validateQuote, quoteController.updateQuote);

// Update quote status (customer only, for accepting/rejecting quotes)
router.patch('/:id/status', requireCustomer, validateIdParam, validateQuoteStatusUpdate, quoteController.updateQuoteStatus);

export default router;
