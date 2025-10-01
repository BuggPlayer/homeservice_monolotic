import { Request, Response, NextFunction } from 'express';
import { RBACService } from './RBACService';
import { SystemPermissions, RBACContext } from './types';

const rbacService = new RBACService();

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      rbacContext?: RBACContext;
    }
  }
}

/**
 * Middleware to check single permission
 */
export const requirePermission = (permission: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const context: RBACContext = {
        user_id: req.user.userId,
        user_type: req.user.userType,
        roles: [],
        permissions: [],
        resource_owner_id: req.params.userId || req.params.customerId || req.params.providerId,
        resource_data: req.body
      };

      const result = await rbacService.checkPermission(
        req.user.userId, 
        permission, 
        context
      );

      if (!result.allowed) {
        return res.status(403).json({
          success: false,
          message: result.reason || 'Insufficient permissions'
        });
      }

      req.rbacContext = context;
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Permission check failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };
};

/**
 * Middleware to check multiple permissions (any one required)
 */
export const requireAnyPermission = (permissions: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const context: RBACContext = {
        user_id: req.user.userId,
        user_type: req.user.userType,
        roles: [],
        permissions: [],
        resource_owner_id: req.params.userId || req.params.customerId || req.params.providerId,
        resource_data: req.body
      };

      const hasPermission = await rbacService.hasAnyPermission(
        req.user.userId, 
        permissions, 
        context
      );

      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions'
        });
      }

      req.rbacContext = context;
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Permission check failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };
};

/**
 * Middleware to check multiple permissions (all required)
 */
export const requireAllPermissions = (permissions: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const context: RBACContext = {
        user_id: req.user.userId,
        user_type: req.user.userType,
        roles: [],
        permissions: [],
        resource_owner_id: req.params.userId || req.params.customerId || req.params.providerId,
        resource_data: req.body
      };

      const hasPermissions = await rbacService.hasAllPermissions(
        req.user.userId, 
        permissions, 
        context
      );

      if (!hasPermissions) {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions'
        });
      }

      req.rbacContext = context;
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Permission check failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };
};

/**
 * Middleware to check resource ownership or admin permission
 */
export const requireOwnershipOrPermission = (permission: string, ownerField: string = 'id') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const resourceOwnerId = req.params[ownerField];
      const isOwner = req.user.userId === resourceOwnerId;
      const isAdmin = req.user.userType === 'admin' || req.user.userType === 'super_admin';

      // If user is owner or admin, allow access
      if (isOwner || isAdmin) {
        req.rbacContext = {
          user_id: req.user.userId,
          user_type: req.user.userType,
          roles: [],
          permissions: [],
          resource_owner_id: resourceOwnerId,
          resource_data: req.body
        };
        return next();
      }

      // Check specific permission
      const context: RBACContext = {
        user_id: req.user.userId,
        user_type: req.user.userType,
        roles: [],
        permissions: [],
        resource_owner_id: resourceOwnerId,
        resource_data: req.body
      };

      const result = await rbacService.checkPermission(
        req.user.userId, 
        permission, 
        context
      );

      if (!result.allowed) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You can only access your own resources or have specific permissions.'
        });
      }

      req.rbacContext = context;
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Permission check failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };
};

// Predefined permission middleware for common operations
export const requireUserCreate = requirePermission(SystemPermissions.USER_CREATE);
export const requireUserRead = requirePermission(SystemPermissions.USER_READ);
export const requireUserUpdate = requirePermission(SystemPermissions.USER_UPDATE);
export const requireUserDelete = requirePermission(SystemPermissions.USER_DELETE);
export const requireUserList = requirePermission(SystemPermissions.USER_LIST);

export const requireServiceRequestCreate = requirePermission(SystemPermissions.SERVICE_REQUEST_CREATE);
export const requireServiceRequestRead = requirePermission(SystemPermissions.SERVICE_REQUEST_READ);
export const requireServiceRequestUpdate = requirePermission(SystemPermissions.SERVICE_REQUEST_UPDATE);
export const requireServiceRequestDelete = requirePermission(SystemPermissions.SERVICE_REQUEST_DELETE);
export const requireServiceRequestList = requirePermission(SystemPermissions.SERVICE_REQUEST_LIST);
export const requireServiceRequestUpdateStatus = requirePermission(SystemPermissions.SERVICE_REQUEST_UPDATE_STATUS);

export const requireProviderCreate = requirePermission(SystemPermissions.PROVIDER_CREATE);
export const requireProviderRead = requirePermission(SystemPermissions.PROVIDER_READ);
export const requireProviderUpdate = requirePermission(SystemPermissions.PROVIDER_UPDATE);
export const requireProviderDelete = requirePermission(SystemPermissions.PROVIDER_DELETE);
export const requireProviderList = requirePermission(SystemPermissions.PROVIDER_LIST);
export const requireProviderVerify = requirePermission(SystemPermissions.PROVIDER_VERIFY);

export const requireQuoteCreate = requirePermission(SystemPermissions.QUOTE_CREATE);
export const requireQuoteRead = requirePermission(SystemPermissions.QUOTE_READ);
export const requireQuoteUpdate = requirePermission(SystemPermissions.QUOTE_UPDATE);
export const requireQuoteDelete = requirePermission(SystemPermissions.QUOTE_DELETE);
export const requireQuoteList = requirePermission(SystemPermissions.QUOTE_LIST);
export const requireQuoteAccept = requirePermission(SystemPermissions.QUOTE_ACCEPT);
export const requireQuoteReject = requirePermission(SystemPermissions.QUOTE_REJECT);

export const requireBookingCreate = requirePermission(SystemPermissions.BOOKING_CREATE);
export const requireBookingRead = requirePermission(SystemPermissions.BOOKING_READ);
export const requireBookingUpdate = requirePermission(SystemPermissions.BOOKING_UPDATE);
export const requireBookingDelete = requirePermission(SystemPermissions.BOOKING_DELETE);
export const requireBookingList = requirePermission(SystemPermissions.BOOKING_LIST);
export const requireBookingUpdateStatus = requirePermission(SystemPermissions.BOOKING_UPDATE_STATUS);

export const requireProductCreate = requirePermission(SystemPermissions.PRODUCT_CREATE);
export const requireProductRead = requirePermission(SystemPermissions.PRODUCT_READ);
export const requireProductUpdate = requirePermission(SystemPermissions.PRODUCT_UPDATE);
export const requireProductDelete = requirePermission(SystemPermissions.PRODUCT_DELETE);
export const requireProductList = requirePermission(SystemPermissions.PRODUCT_LIST);

export const requireCategoryCreate = requirePermission(SystemPermissions.CATEGORY_CREATE);
export const requireCategoryRead = requirePermission(SystemPermissions.CATEGORY_READ);
export const requireCategoryUpdate = requirePermission(SystemPermissions.CATEGORY_UPDATE);
export const requireCategoryDelete = requirePermission(SystemPermissions.CATEGORY_DELETE);
export const requireCategoryList = requirePermission(SystemPermissions.CATEGORY_LIST);

export const requirePaymentProcess = requirePermission(SystemPermissions.PAYMENT_PROCESS);
export const requirePaymentRead = requirePermission(SystemPermissions.PAYMENT_READ);
export const requirePaymentRefund = requirePermission(SystemPermissions.PAYMENT_REFUND);
export const requirePaymentList = requirePermission(SystemPermissions.PAYMENT_LIST);

export const requireAnalyticsView = requirePermission(SystemPermissions.ANALYTICS_VIEW);
export const requireReportsGenerate = requirePermission(SystemPermissions.REPORTS_GENERATE);
