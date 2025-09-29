import { Router } from 'express';
import { ServiceRequestController } from '@/controllers/ServiceRequestController';
import { authenticateToken, requireCustomer, requireAdmin } from '@/middleware/auth';
import { validate, validationSchemas } from '@/middleware/validation';

const router = Router();
const serviceRequestController = new ServiceRequestController();

// All routes require authentication
router.use(authenticateToken);

// Create service request (customers only)
router.post('/', requireCustomer, validate(validationSchemas.serviceRequest), serviceRequestController.create);

// Get service requests (with filters)
router.get('/', serviceRequestController.getServiceRequests);

// Get single service request
router.get('/:id', serviceRequestController.getServiceRequest);

// Update service request (customers only)
router.put('/:id', requireCustomer, serviceRequestController.updateServiceRequest);

// Update service request status (admin only)
router.put('/:id/status', requireAdmin, serviceRequestController.updateStatus);

// Delete service request (customers only)
router.delete('/:id', requireCustomer, serviceRequestController.deleteServiceRequest);

export default router;
