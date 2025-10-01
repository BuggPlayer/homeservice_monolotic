import { Router } from 'express';
import { CommunicationController } from '../controllers/CommunicationController';
import { 
  authenticateToken, 
  requireProvider, 
  requireCustomer,
  requireAdmin,
  validateCall,
  validateCallStatusUpdate,
  validatePagination,
  validateIdParam
} from '@/core/middleware';
import { RateLimiter } from '@/core/middleware/rateLimiter';

const router = Router();
const communicationController = new CommunicationController();

// Apply rate limiting
router.use(RateLimiter.moderate);

// All routes require authentication
router.use(authenticateToken);

// Get call statistics (admin only)
router.get('/calls/stats', requireAdmin, communicationController.getCallStats);

// Get all calls (admin only)
router.get('/calls', requireAdmin, validatePagination, communicationController.getCalls);

// Get calls by customer (customer only, own calls)
router.get('/calls/my-calls', requireCustomer, validatePagination, communicationController.getCallsByCustomer);

// Get calls by provider (provider only, own calls)
router.get('/calls/provider/my-calls', requireProvider, validatePagination, communicationController.getCallsByProvider);

// Get customer call statistics (customer only)
router.get('/calls/my-stats', requireCustomer, communicationController.getCustomerCallStats);

// Get provider call statistics (provider only)
router.get('/calls/provider/stats', requireProvider, communicationController.getProviderCallStats);

// Get call by ID (public for participants)
router.get('/calls/:id', validateIdParam, communicationController.getCallById);

// Initiate call (customer only)
router.post('/calls', requireCustomer, validateCall, communicationController.initiateCall);

// Update call status (provider only, own calls)
router.patch('/calls/:id/status', requireProvider, validateIdParam, validateCallStatusUpdate, communicationController.updateCallStatus);

// Send message (authenticated users)
router.post('/messages', communicationController.sendMessage);

// Get messages (authenticated users)
router.get('/messages', validatePagination, communicationController.getMessages);

// Mark message as read (authenticated users)
router.patch('/messages/read', communicationController.markMessageRead);

export default router;
