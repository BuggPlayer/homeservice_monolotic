import { Router } from 'express';
import { AuthController } from '@/controllers/AuthController';
import { authenticateToken, requireAdmin } from '@/middleware/auth';
import { validate, validationSchemas } from '@/middleware/validation';

const router = Router();
const authController = new AuthController();

// Public routes
router.post('/register', validate(validationSchemas.userRegistration), authController.register);
router.post('/login', validate(validationSchemas.userLogin), authController.login);
router.post('/refresh-token', authController.refreshToken);

// Protected routes
router.use(authenticateToken); // All routes below require authentication

router.get('/profile', authController.getProfile);
router.put('/profile', authController.updateProfile);
router.put('/change-password', authController.changePassword);
router.post('/logout', authController.logout);

// Admin routes - getUsers method needs to be implemented in AuthController
// router.get('/users', requireAdmin, authController.getUsers);

export default router;
