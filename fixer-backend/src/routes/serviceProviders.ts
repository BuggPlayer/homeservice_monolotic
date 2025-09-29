import { Router } from 'express';
import { ServiceProviderController } from '@/controllers/ServiceProviderController';
import { authenticateToken, requireProvider, requireAdmin } from '@/middleware/auth';
import { validate, validationSchemas } from '@/middleware/validation';

const router = Router();
const serviceProviderController = new ServiceProviderController();

// All routes require authentication
router.use(authenticateToken);

// Create or update provider profile (providers only)
router.post('/profile', requireProvider, validate(validationSchemas.providerProfile), serviceProviderController.createOrUpdateProfile);

// Get provider profile (providers only)
router.get('/profile', requireProvider, serviceProviderController.getProfile);

// Get providers with filters (public for authenticated users)
router.get('/', serviceProviderController.getProviders);

// Get single provider by ID
router.get('/:id', serviceProviderController.getProvider);

// Get providers by service type and location
router.get('/service/:serviceType/location/:city', serviceProviderController.getProvidersByServiceAndLocation);

// Update verification status (admin only)
router.put('/:id/verification-status', requireAdmin, serviceProviderController.updateVerificationStatus);

export default router;
