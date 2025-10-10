import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { 
  authenticateToken, 
  validateRegister, 
  validateLogin, 
  validateRefreshToken, 
  validateChangePassword, 
  validateUpdateProfile 
} from '../../../core/middleware';
import { RateLimiter } from '../../../core/middleware/rateLimiter';
import { requirePermission } from '../../../core/rbac/middleware';
import { SystemPermissions } from '../../../core/rbac/types';

const router = Router();
const authController = new AuthController();

// Apply rate limiting to auth routes
router.use(RateLimiter.auth);

// Public routes
router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);
router.post('/refresh-token', validateRefreshToken, authController.refreshToken);

// Admin-only registration route (for creating admin users)
router.post('/register/admin', 
  authenticateToken, 
  requirePermission(SystemPermissions.USER_CREATE), 
  validateRegister, 
  authController.registerAdmin
);

// Protected routes
router.use(authenticateToken);

router.post('/logout', authController.logout);
router.get('/profile', authController.getProfile);
router.put('/profile', validateUpdateProfile, authController.updateProfile);
router.put('/change-password', validateChangePassword, authController.changePassword);
router.post('/verify-email', authController.verifyEmail);

export default router;
