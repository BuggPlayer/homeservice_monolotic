import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { 
  authenticateToken, 
  requireAdmin, 
  requireOwnershipOrAdmin,
  validatePagination,
  validateIdParam,
  validateUpdateProfile
} from '../../../core/middleware';
import { RateLimiter } from '../../../core/middleware/rateLimiter';

const router = Router();
const userController = new UserController();

// Apply rate limiting
router.use(RateLimiter.moderate);

// All routes require authentication
router.use(authenticateToken);

// Get all users (admin only)
router.get('/', requireAdmin, validatePagination, userController.getUsers);

// Get user statistics (admin only)
router.get('/stats', requireAdmin, userController.getUserStats);

// Get user by ID (admin or own profile)
router.get('/:id', requireOwnershipOrAdmin, validateIdParam, userController.getUserById);

// Update user (admin or own profile)
router.put('/:id', requireOwnershipOrAdmin, validateIdParam, validateUpdateProfile, userController.updateUser);

// Verify user email (admin only)
router.post('/:id/verify', requireAdmin, validateIdParam, userController.verifyUserEmail);

// Delete user (admin only)
router.delete('/:id', requireAdmin, validateIdParam, userController.deleteUser);

export default router;
