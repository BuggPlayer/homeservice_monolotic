import { Router } from 'express';
import { QuoteController } from '@/controllers/QuoteController';
import { authenticateToken, requireProvider, requireCustomer } from '@/middleware/auth';
import { validate, createQuoteSchema, updateQuoteSchema } from '@/middleware/validation';

const router = Router();

// All quote routes require authentication
router.use(authenticateToken);

// Provider routes
router.post('/', requireProvider, validate(createQuoteSchema), QuoteController.createQuote);
router.get('/', QuoteController.getQuotes); // Both providers and customers can get quotes
router.get('/:id', QuoteController.getQuoteById);
router.put('/:id', requireProvider, validate(updateQuoteSchema), QuoteController.updateQuote);
router.delete('/:id', requireProvider, QuoteController.deleteQuote);

// Customer routes
router.post('/:id/accept', requireCustomer, QuoteController.acceptQuote);
router.post('/:id/reject', requireCustomer, QuoteController.rejectQuote);

export default router;
