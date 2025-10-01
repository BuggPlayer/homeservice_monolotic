import { Router } from 'express';
import { CallController } from '@/controllers/CallController';
import { authenticateToken, requireProvider, requireCustomer } from '@/middleware/auth';
import {
  validateCall,
  validateCallStatusUpdate,
  validatePagination,
  validateIdParam,
} from '@/middleware/validation';

const router = Router();
const callController = new CallController();

// All routes require authentication
router.use(authenticateToken);

// Initiate call (customer only)
router.post('/', requireCustomer, validateCall, callController.initiateCall);

// Get calls by customer (customer only)
router.get('/customer', requireCustomer, validatePagination, callController.getCallsByCustomer);

// Get calls by provider (provider only)
router.get('/provider', requireProvider, validatePagination, callController.getCallsByProvider);

// Get recent calls
router.get('/recent', validatePagination, callController.getRecentCalls);

// Get call statistics (provider only)
router.get('/statistics', requireProvider, callController.getCallStatistics);

// Get call by ID with details
router.get('/:callId', validateIdParam, callController.getCallById);

// Update call status (webhook from Twilio)
router.patch('/twilio/:twilioCallSid', validateCallStatusUpdate, callController.updateCallStatus);

// End call
router.patch('/:callId/end', validateIdParam, callController.endCall);

export default router;
