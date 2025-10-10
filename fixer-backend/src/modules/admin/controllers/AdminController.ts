import { Request, Response } from 'express';
import { RBACService } from '../../../core/rbac/RBACService';
import { ApiResponse } from '../../../core/types';
import { SystemPermissions } from '../../../core/rbac/types';

export class AdminController {
  private rbacService: RBACService;

  constructor() {
    this.rbacService = new RBACService();
  }

  /**
   * Get pending user approvals
   */
  getPendingApprovals = async (req: Request, res: Response): Promise<void> => {
    try {
      const approvals = await this.rbacService.getPendingUserApprovals();

      const response: ApiResponse = {
        success: true,
        message: 'Pending approvals retrieved successfully',
        data: approvals,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve pending approvals',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(500).json(response);
    }
  };

  /**
   * Approve user
   */
  approveUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { approvalId } = req.params;
      const { approvalNotes } = req.body;
      const approvedBy = (req as any).user.userId;

      const success = await this.rbacService.approveUser(approvalId, approvedBy, approvalNotes);

      if (!success) {
        const response: ApiResponse = {
          success: false,
          message: 'Approval not found or already processed',
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        message: 'User approved successfully',
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to approve user',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(500).json(response);
    }
  };

  /**
   * Reject user
   */
  rejectUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { approvalId } = req.params;
      const { rejectionReason } = req.body;
      const rejectedBy = (req as any).user.userId;

      if (!rejectionReason) {
        const response: ApiResponse = {
          success: false,
          message: 'Rejection reason is required',
        };
        res.status(400).json(response);
        return;
      }

      const success = await this.rbacService.rejectUser(approvalId, rejectedBy, rejectionReason);

      if (!success) {
        const response: ApiResponse = {
          success: false,
          message: 'Approval not found or already processed',
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        message: 'User rejected successfully',
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to reject user',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(500).json(response);
    }
  };

  /**
   * Get all roles
   */
  getRoles = async (req: Request, res: Response): Promise<void> => {
    try {
      const roles = await this.rbacService.getAllRoles();

      const response: ApiResponse = {
        success: true,
        message: 'Roles retrieved successfully',
        data: roles,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve roles',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(500).json(response);
    }
  };

  /**
   * Get all permissions
   */
  getPermissions = async (req: Request, res: Response): Promise<void> => {
    try {
      const permissions = await this.rbacService.getAllPermissions();

      const response: ApiResponse = {
        success: true,
        message: 'Permissions retrieved successfully',
        data: permissions,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve permissions',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(500).json(response);
    }
  };

  /**
   * Assign role to user
   */
  assignRole = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;
      const { roleName } = req.body;
      const assignedBy = (req as any).user.userId;

      if (!roleName) {
        const response: ApiResponse = {
          success: false,
          message: 'Role name is required',
        };
        res.status(400).json(response);
        return;
      }

      const userRole = await this.rbacService.assignRoleToUser(userId, roleName, assignedBy);

      const response: ApiResponse = {
        success: true,
        message: 'Role assigned successfully',
        data: userRole,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to assign role',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(500).json(response);
    }
  };

  /**
   * Remove role from user
   */
  removeRole = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;
      const { roleName } = req.body;

      if (!roleName) {
        const response: ApiResponse = {
          success: false,
          message: 'Role name is required',
        };
        res.status(400).json(response);
        return;
      }

      const success = await this.rbacService.removeRoleFromUser(userId, roleName);

      if (!success) {
        const response: ApiResponse = {
          success: false,
          message: 'Role not found or user does not have this role',
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        message: 'Role removed successfully',
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to remove role',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(500).json(response);
    }
  };
}
