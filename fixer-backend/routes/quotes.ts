import { Router } from 'express';
import { QuoteController } from '@/controllers/QuoteController';
import { authenticateToken, requireProvider, requireCustomer } from '@/middleware/auth';
import {
  validateQuote,
  validateQuoteStatusUpdate,
  validatePagination,
  validateIdParam,
} from '@/middleware/validation';

const router = Router();
const quoteController = new QuoteController();

// All routes require authentication
router.use(authenticateToken);

// Create quote (provider only)
router.post('/', requireProvider, validateQuote, quoteController.createQuote);

// Get quotes for a specific service request (public for authenticated users)
router.get('/service-request/:serviceRequestId', validateIdParam, quoteController.getQuotesForServiceRequest);

// Get quotes by provider (provider only)
router.get('/provider', requireProvider, validatePagination, quoteController.getQuotesByProvider);

// Get quote by ID
router.get('/:quoteId', validateIdParam, quoteController.getQuoteById);

// Update quote (provider only)
router.put('/:quoteId', requireProvider, validateIdParam, quoteController.updateQuote);

// Update quote status (accept/reject) - customer only
router.patch('/:quoteId/status', requireCustomer, validateIdParam, validateQuoteStatusUpdate, quoteController.updateQuoteStatus);

// Delete quote (provider only)
router.delete('/:quoteId', requireProvider, validateIdParam, quoteController.deleteQuote);

export default router;
