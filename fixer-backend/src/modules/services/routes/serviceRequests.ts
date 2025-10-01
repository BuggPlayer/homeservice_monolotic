import { Router } from 'express';
import { ServiceRequestController } from '../controllers/ServiceRequestController';
import { 
  authenticateToken, 
  requireCustomer, 
  requireAdmin,
  validateServiceRequest,
  validateStatusUpdate,
  validatePagination,
  validateIdParam
} from '@/core/middleware';
import { RateLimiter } from '@/core/middleware/rateLimiter';

const router = Router();
const serviceRequestController = new ServiceRequestController();

// Apply rate limiting
router.use(RateLimiter.moderate);

// All routes require authentication
router.use(authenticateToken);

// Get service request statistics (admin only)
router.get('/stats', requireAdmin, serviceRequestController.getServiceRequestStats);

// Get all service requests (public for providers, filtered for customers)
router.get('/', validatePagination, serviceRequestController.getServiceRequests);

// Get service requests by customer (customer only)
router.get('/my-requests', requireCustomer, validatePagination, serviceRequestController.getServiceRequestsByCustomer);

// Get service request by ID
router.get('/:id', validateIdParam, serviceRequestController.getServiceRequestById);

// Create service request (customer only)
router.post('/', requireCustomer, validateServiceRequest, serviceRequestController.createServiceRequest);

// Update service request (customer only, own requests)
router.put('/:id', requireCustomer, validateIdParam, validateServiceRequest, serviceRequestController.updateServiceRequest);

// Update service request status (admin only)
router.patch('/:id/status', requireAdmin, validateIdParam, validateStatusUpdate, serviceRequestController.updateStatus);

// Delete service request (customer only, own requests)
router.delete('/:id', requireCustomer, validateIdParam, serviceRequestController.deleteServiceRequest);

export default router;
