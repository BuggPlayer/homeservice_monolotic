import { BaseRepository } from './BaseRepository';
import { pool } from '../../../config/database';
import { 
  Role, 
  Permission, 
  UserRole, 
  RolePermission, 
  UserApproval 
} from '../../rbac/types';

export class RBACRepository extends BaseRepository<any> {
  constructor() {
    super('roles');
  }

  /**
   * Get all roles
   */
  async getAllRoles(): Promise<Role[]> {
    const result = await this.query(
      'SELECT * FROM roles WHERE is_active = true ORDER BY name'
    );
    return result.rows;
  }

  /**
   * Get role by name
   */
  async getRoleByName(name: string): Promise<Role | null> {
    const result = await this.query(
      'SELECT * FROM roles WHERE name = $1 AND is_active = true',
      [name]
    );
    return result.rows[0] || null;
  }

  /**
   * Get all permissions
   */
  async getAllPermissions(): Promise<Permission[]> {
    const result = await this.query(
      'SELECT * FROM permissions WHERE is_active = true ORDER BY resource, action'
    );
    return result.rows;
  }

  /**
   * Get permission by name
   */
  async getPermissionByName(name: string): Promise<Permission | null> {
    const result = await this.query(
      'SELECT * FROM permissions WHERE name = $1 AND is_active = true',
      [name]
    );
    return result.rows[0] || null;
  }

  /**
   * Get user roles
   */
  async getUserRoles(userId: string): Promise<UserRole[]> {
    const result = await this.query(`
      SELECT ur.*, r.name as role_name, r.description as role_description
      FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = $1 AND ur.is_active = true AND r.is_active = true
      AND (ur.expires_at IS NULL OR ur.expires_at > CURRENT_TIMESTAMP)
      ORDER BY ur.assigned_at DESC
    `, [userId]);
    return result.rows;
  }

  /**
   * Get user permissions (direct and role-based)
   */
  async getUserPermissions(userId: string): Promise<string[]> {
    const result = await this.query(`
      -- Direct user permissions
      SELECT p.name
      FROM user_permissions up
      JOIN permissions p ON up.permission_id = p.id
      WHERE up.user_id = $1 AND up.granted = true AND up.is_active = true AND p.is_active = true
      
      UNION
      
      -- Role-based permissions
      SELECT p.name
      FROM user_roles ur
      JOIN role_permissions rp ON ur.role_id = rp.role_id
      JOIN permissions p ON rp.permission_id = p.id
      WHERE ur.user_id = $1 AND ur.is_active = true AND rp.granted = true AND p.is_active = true
      AND (ur.expires_at IS NULL OR ur.expires_at > CURRENT_TIMESTAMP)
    `, [userId]);
    
    return result.rows.map(row => row.name);
  }

  /**
   * Get role permissions
   */
  async getRolePermissions(roleId: string): Promise<RolePermission[]> {
    const result = await this.query(`
      SELECT rp.*, p.name as permission_name, p.resource, p.action
      FROM role_permissions rp
      JOIN permissions p ON rp.permission_id = p.id
      WHERE rp.role_id = $1 AND rp.granted = true AND p.is_active = true
      ORDER BY p.resource, p.action
    `, [roleId]);
    return result.rows;
  }

  /**
   * Assign role to user
   */
  async assignRoleToUser(userId: string, roleId: string, assignedBy: string): Promise<UserRole> {
    const result = await this.query(`
      INSERT INTO user_roles (user_id, role_id, assigned_by)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, role_id) 
      DO UPDATE SET 
        is_active = true,
        assigned_by = $3,
        assigned_at = CURRENT_TIMESTAMP
      RETURNING *
    `, [userId, roleId, assignedBy]);
    return result.rows[0];
  }

  /**
   * Remove role from user
   */
  async removeRoleFromUser(userId: string, roleId: string): Promise<boolean> {
    const result = await this.query(`
      UPDATE user_roles 
      SET is_active = false, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $1 AND role_id = $2
      RETURNING id
    `, [userId, roleId]);
    return result.rows.length > 0;
  }

  /**
   * Create user approval request
   */
  async createUserApproval(approvalData: Partial<UserApproval>): Promise<UserApproval> {
    const result = await this.query(`
      INSERT INTO user_approvals (user_id, requested_role, requested_by, approval_notes)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [
      approvalData.user_id,
      approvalData.requested_role,
      approvalData.requested_by,
      approvalData.approval_notes
    ]);
    return result.rows[0];
  }

  /**
   * Get pending user approvals
   */
  async getPendingUserApprovals(): Promise<UserApproval[]> {
    const result = await this.query(`
      SELECT ua.*, 
             u.email, u.first_name, u.last_name, u.phone,
             requester.email as requested_by_email, requester.first_name as requested_by_first_name
      FROM user_approvals ua
      JOIN users u ON ua.user_id = u.id
      LEFT JOIN users requester ON ua.requested_by = requester.id
      WHERE ua.status = 'pending'
      ORDER BY ua.requested_at DESC
    `);
    return result.rows;
  }

  /**
   * Approve user
   */
  async approveUser(approvalId: string, approvedBy: string, approvalNotes?: string): Promise<boolean> {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Update approval record
      const approvalResult = await client.query(`
        UPDATE user_approvals 
        SET status = 'approved', approved_by = $2, approved_at = CURRENT_TIMESTAMP, approval_notes = $3
        WHERE id = $1 AND status = 'pending'
        RETURNING user_id, requested_role
      `, [approvalId, approvedBy, approvalNotes]);
      
      if (approvalResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return false;
      }
      
      const { user_id, requested_role } = approvalResult.rows[0];
      
      // Get role ID
      const roleResult = await client.query(
        'SELECT id FROM roles WHERE name = $1',
        [requested_role]
      );
      
      if (roleResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return false;
      }
      
      const roleId = roleResult.rows[0].id;
      
      // Assign role to user
      await client.query(`
        INSERT INTO user_roles (user_id, role_id, assigned_by)
        VALUES ($1, $2, $3)
        ON CONFLICT (user_id, role_id) 
        DO UPDATE SET 
          is_active = true,
          assigned_by = $3,
          assigned_at = CURRENT_TIMESTAMP
      `, [user_id, roleId, approvedBy]);
      
      // Update user approval status
      await client.query(`
        UPDATE users 
        SET approval_status = 'approved', approved_by = $2, approved_at = CURRENT_TIMESTAMP
        WHERE id = $1
      `, [user_id, approvedBy]);
      
      await client.query('COMMIT');
      return true;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Reject user
   */
  async rejectUser(approvalId: string, rejectedBy: string, rejectionReason: string): Promise<boolean> {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Update approval record
      const approvalResult = await client.query(`
        UPDATE user_approvals 
        SET status = 'rejected', rejected_by = $2, rejected_at = CURRENT_TIMESTAMP, rejection_reason = $3
        WHERE id = $1 AND status = 'pending'
        RETURNING user_id
      `, [approvalId, rejectedBy, rejectionReason]);
      
      if (approvalResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return false;
      }
      
      const { user_id } = approvalResult.rows[0];
      
      // Update user approval status
      await client.query(`
        UPDATE users 
        SET approval_status = 'rejected'
        WHERE id = $1
      `, [user_id]);
      
      await client.query('COMMIT');
      return true;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Check if user has permission
   */
  async hasPermission(userId: string, permission: string): Promise<boolean> {
    const result = await this.query(`
      SELECT 1
      FROM (
        -- Direct user permissions
        SELECT 1
        FROM user_permissions up
        JOIN permissions p ON up.permission_id = p.id
        WHERE up.user_id = $1 AND up.granted = true AND up.is_active = true 
        AND p.is_active = true AND p.name = $2
        
        UNION
        
        -- Role-based permissions
        SELECT 1
        FROM user_roles ur
        JOIN role_permissions rp ON ur.role_id = rp.role_id
        JOIN permissions p ON rp.permission_id = p.id
        WHERE ur.user_id = $1 AND ur.is_active = true AND rp.granted = true 
        AND p.is_active = true AND p.name = $2
        AND (ur.expires_at IS NULL OR ur.expires_at > CURRENT_TIMESTAMP)
      ) permissions
      LIMIT 1
    `, [userId, permission]);
    
    return result.rows.length > 0;
  }
}
