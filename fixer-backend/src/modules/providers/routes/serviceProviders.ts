import { Router } from 'express';
import { ServiceProviderController } from '../controllers/ServiceProviderController';
import { 
  authenticateToken, 
  requireProvider, 
  requireAdmin,
  validatePagination,
  validateIdParam,
  validateServiceProviderRegistration
} from '../../../core/middleware';
import { RateLimiter } from '../../../core/middleware/rateLimiter';

const router = Router();
const serviceProviderController = new ServiceProviderController();

// Apply rate limiting
router.use(RateLimiter.moderate);

// All routes require authentication
router.use(authenticateToken);

// Get service provider statistics (admin only)
router.get('/stats', requireAdmin, serviceProviderController.getServiceProviderStats);

// Get all service providers (public)
router.get('/', validatePagination, serviceProviderController.getServiceProviders);

// Get service provider by ID (public)
router.get('/:id', validateIdParam, serviceProviderController.getServiceProviderById);

// Get service provider by user ID (public)
router.get('/user/:userId', validateIdParam, serviceProviderController.getServiceProviderByUserId);

// Create service provider profile (authenticated users only)
router.post('/', validateServiceProviderRegistration, serviceProviderController.createServiceProvider);

// Update service provider profile (provider only, own profile)
router.put('/:id', requireProvider, validateIdParam, validateServiceProviderRegistration, serviceProviderController.updateServiceProvider);

// Update verification status (admin only)
router.patch('/:id/verification-status', requireAdmin, validateIdParam, serviceProviderController.updateVerificationStatus);

export default router;
