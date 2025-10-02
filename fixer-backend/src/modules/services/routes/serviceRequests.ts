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
} from '../../../core/middleware';
import { 
  requireServiceRequestCreate,
  requireServiceRequestRead,
  requireServiceRequestUpdate,
  requireServiceRequestDelete,
  requireServiceRequestList,
  requireServiceRequestUpdateStatus,
  requireOwnershipOrPermission
} from '../../../core/rbac';
import { RateLimiter } from '../../../core/middleware/rateLimiter';

const router = Router();
const serviceRequestController = new ServiceRequestController();

// Apply rate limiting
router.use(RateLimiter.moderate);

// All routes require authentication
router.use(authenticateToken);

// Get service request statistics (admin only)
router.get('/stats', requireAdmin, serviceRequestController.getServiceRequestStats);

// Get service request analytics (admin only)
router.get('/analytics', requireAdmin, serviceRequestController.getServiceRequestAnalytics);

// Get all service requests (with RBAC permission check)
router.get('/', requireServiceRequestList, validatePagination, serviceRequestController.getServiceRequests);

// Search service requests (with RBAC permission check)
router.get('/search', requireServiceRequestList, validatePagination, serviceRequestController.searchServiceRequests);

// Get recent service requests (with RBAC permission check)
router.get('/recent', requireServiceRequestList, serviceRequestController.getRecentServiceRequests);

// Get service requests by type (with RBAC permission check)
router.get('/type/:serviceType', requireServiceRequestList, validatePagination, serviceRequestController.getServiceRequestsByType);

// Get service requests by location (with RBAC permission check)
router.get('/location/:city/:state', requireServiceRequestList, validatePagination, serviceRequestController.getServiceRequestsByLocation);

// Get service requests by urgency (with RBAC permission check)
router.get('/urgency/:urgency', requireServiceRequestList, validatePagination, serviceRequestController.getServiceRequestsByUrgency);

// Get service requests by customer (customer only)
router.get('/my-requests', requireCustomer, validatePagination, serviceRequestController.getServiceRequestsByCustomer);

// Get customer service request statistics (customer only)
router.get('/my-stats', requireCustomer, serviceRequestController.getCustomerServiceRequestStats);

// Get service request by ID (with RBAC permission check)
router.get('/:id', requireServiceRequestRead, validateIdParam, serviceRequestController.getServiceRequestById);

// Create service request (with RBAC permission check)
router.post('/', requireServiceRequestCreate, validateServiceRequest, serviceRequestController.createServiceRequest);

// Bulk update service request status (admin only)
router.patch('/bulk-status', requireAdmin, serviceRequestController.bulkUpdateStatus);

// Archive old service requests (admin only)
router.patch('/archive', requireAdmin, serviceRequestController.archiveOldServiceRequests);

// Update service request (with ownership or permission check)
router.put('/:id', requireOwnershipOrPermission('service_request:update', 'customerId'), validateIdParam, validateServiceRequest, serviceRequestController.updateServiceRequest);

// Update service request status (with RBAC permission check)
router.patch('/:id/status', requireServiceRequestUpdateStatus, validateIdParam, validateStatusUpdate, serviceRequestController.updateStatus);

// Delete service request (with ownership or permission check)
router.delete('/:id', requireOwnershipOrPermission('service_request:delete', 'customerId'), validateIdParam, serviceRequestController.deleteServiceRequest);

export default router;
