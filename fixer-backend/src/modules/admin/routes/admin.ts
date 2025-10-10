import { Router } from 'express';
import { AdminController } from '../controllers/AdminController';
import { 
  authenticateToken, 

} from '../../../core/middleware';
import { SystemPermissions } from '../../../core/rbac/types';
import { requirePermission } from '../../../core/rbac/middleware';

const router = Router();
const adminController = new AdminController();

// All admin routes require authentication
router.use(authenticateToken);

// User approval routes (super admin and admin only)
router.get('/approvals/pending', 
  requirePermission(SystemPermissions.USER_APPROVE), 
  adminController.getPendingApprovals
);

router.post('/approvals/:approvalId/approve', 
  requirePermission(SystemPermissions.USER_APPROVE), 
  adminController.approveUser
);

router.post('/approvals/:approvalId/reject', 
  requirePermission(SystemPermissions.USER_APPROVE), 
  adminController.rejectUser
);

// Role management routes (super admin and admin only)
router.get('/roles', 
  requirePermission(SystemPermissions.USER_CREATE), 
  adminController.getRoles
);

router.get('/permissions', 
  requirePermission(SystemPermissions.USER_CREATE), 
  adminController.getPermissions
);

router.post('/users/:userId/roles', 
  requirePermission(SystemPermissions.USER_UPDATE), 
  adminController.assignRole
);

router.delete('/users/:userId/roles', 
  requirePermission(SystemPermissions.USER_UPDATE), 
  adminController.removeRole
);

export default router;
