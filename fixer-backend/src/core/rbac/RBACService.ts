import { pool } from '@/config';
import { 
  Role, 
  Permission, 
  UserRole, 
  RolePermission, 
  SystemRoles, 
  SystemPermissions, 
  PermissionCheckResult, 
  RBACContext,
  PermissionCondition 
} from './types';

export class RBACService {
  /**
   * Check if user has permission
   */
  async checkPermission(
    userId: string, 
    permission: string, 
    context?: Partial<RBACContext>
  ): Promise<PermissionCheckResult> {
    try {
      // Get user roles and permissions
      const userRoles = await this.getUserRoles(userId);
      const userPermissions = await this.getUserPermissions(userId);
      
      // Check if user has the permission directly
      if (userPermissions.includes(permission)) {
        return { allowed: true };
      }
      
      // Check role-based permissions
      for (const role of userRoles) {
        const rolePermissions = await this.getRolePermissions(role.id);
        const hasPermission = rolePermissions.some(rp => 
          rp.permission_id === permission && rp.granted
        );
        
        if (hasPermission) {
          // Check conditions if any
          const rolePermission = rolePermissions.find(rp => 
            rp.permission_id === permission && rp.granted
          );
          
          if (rolePermission?.conditions && context) {
            const conditionsMet = await this.checkConditions(
              rolePermission.conditions, 
              context
            );
            if (!conditionsMet) {
              continue;
            }
          }
          
          return { allowed: true };
        }
      }
      
      return { 
        allowed: false, 
        reason: `User does not have permission: ${permission}` 
      };
    } catch (error) {
      return { 
        allowed: false, 
        reason: `Error checking permission: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  }

  /**
   * Check multiple permissions
   */
  async checkPermissions(
    userId: string, 
    permissions: string[], 
    context?: Partial<RBACContext>
  ): Promise<{ [key: string]: PermissionCheckResult }> {
    const results: { [key: string]: PermissionCheckResult } = {};
    
    for (const permission of permissions) {
      results[permission] = await this.checkPermission(userId, permission, context);
    }
    
    return results;
  }

  /**
   * Check if user has any of the specified permissions
   */
  async hasAnyPermission(
    userId: string, 
    permissions: string[], 
    context?: Partial<RBACContext>
  ): Promise<boolean> {
    for (const permission of permissions) {
      const result = await this.checkPermission(userId, permission, context);
      if (result.allowed) {
        return true;
      }
    }
    return false;
  }

  /**
   * Check if user has all of the specified permissions
   */
  async hasAllPermissions(
    userId: string, 
    permissions: string[], 
    context?: Partial<RBACContext>
  ): Promise<boolean> {
    for (const permission of permissions) {
      const result = await this.checkPermission(userId, permission, context);
      if (!result.allowed) {
        return false;
      }
    }
    return true;
  }

  /**
   * Get user roles
   */
  async getUserRoles(userId: string): Promise<Role[]> {
    const query = `
      SELECT r.* FROM roles r
      INNER JOIN user_roles ur ON r.id = ur.role_id
      WHERE ur.user_id = $1 AND ur.is_active = true
      AND (ur.expires_at IS NULL OR ur.expires_at > NOW())
    `;
    
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  /**
   * Get user permissions (direct and role-based)
   */
  async getUserPermissions(userId: string): Promise<string[]> {
    const query = `
      SELECT DISTINCT p.name FROM permissions p
      WHERE p.id IN (
        SELECT permission_id FROM user_permissions up
        WHERE up.user_id = $1 AND up.granted = true AND up.is_active = true
        UNION
        SELECT rp.permission_id FROM role_permissions rp
        INNER JOIN user_roles ur ON rp.role_id = ur.role_id
        WHERE ur.user_id = $1 AND rp.granted = true AND ur.is_active = true
        AND (ur.expires_at IS NULL OR ur.expires_at > NOW())
      )
    `;
    
    const result = await pool.query(query, [userId]);
    return result.rows.map(row => row.name);
  }

  /**
   * Get role permissions
   */
  async getRolePermissions(roleId: string): Promise<RolePermission[]> {
    const query = `
      SELECT rp.*, p.name as permission_name
      FROM role_permissions rp
      INNER JOIN permissions p ON rp.permission_id = p.id
      WHERE rp.role_id = $1 AND rp.granted = true
    `;
    
    const result = await pool.query(query, [roleId]);
    return result.rows;
  }

  /**
   * Assign role to user
   */
  async assignRole(
    userId: string, 
    roleId: string, 
    assignedBy: string, 
    expiresAt?: Date
  ): Promise<void> {
    const query = `
      INSERT INTO user_roles (user_id, role_id, assigned_by, expires_at, is_active)
      VALUES ($1, $2, $3, $4, true)
      ON CONFLICT (user_id, role_id) 
      DO UPDATE SET 
        assigned_by = $3,
        expires_at = $4,
        is_active = true,
        assigned_at = NOW()
    `;
    
    await pool.query(query, [userId, roleId, assignedBy, expiresAt]);
  }

  /**
   * Remove role from user
   */
  async removeRole(userId: string, roleId: string): Promise<void> {
    const query = `
      UPDATE user_roles 
      SET is_active = false 
      WHERE user_id = $1 AND role_id = $2
    `;
    
    await pool.query(query, [userId, roleId]);
  }

  /**
   * Create role
   */
  async createRole(roleData: Omit<Role, 'id' | 'created_at' | 'updated_at'>): Promise<Role> {
    const query = `
      INSERT INTO roles (name, description, is_active)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    
    const result = await pool.query(query, [roleData.name, roleData.description, roleData.is_active]);
    return result.rows[0];
  }

  /**
   * Create permission
   */
  async createPermission(permissionData: Omit<Permission, 'id' | 'created_at' | 'updated_at'>): Promise<Permission> {
    const query = `
      INSERT INTO permissions (name, resource, action, is_active)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    
    const result = await pool.query(query, [
      permissionData.name, 
      permissionData.resource, 
      permissionData.action, 
      permissionData.is_active
    ]);
    return result.rows[0];
  }

  /**
   * Assign permission to role
   */
  async assignPermissionToRole(
    roleId: string, 
    permissionId: string, 
    conditions?: PermissionCondition[]
  ): Promise<void> {
    const query = `
      INSERT INTO role_permissions (role_id, permission_id, granted, conditions)
      VALUES ($1, $2, true, $3)
      ON CONFLICT (role_id, permission_id) 
      DO UPDATE SET granted = true, conditions = $3
    `;
    
    await pool.query(query, [roleId, permissionId, JSON.stringify(conditions)]);
  }

  /**
   * Check permission conditions
   */
  private async checkConditions(
    conditions: PermissionCondition[], 
    context: Partial<RBACContext>
  ): Promise<boolean> {
    for (const condition of conditions) {
      const contextValue = this.getContextValue(context, condition.field);
      
      if (!this.evaluateCondition(contextValue, condition.operator, condition.value)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Get value from context by field path
   */
  private getContextValue(context: Partial<RBACContext>, field: string): any {
    const parts = field.split('.');
    let value: any = context;
    
    for (const part of parts) {
      if (value && typeof value === 'object' && part in value) {
        value = value[part];
      } else {
        return undefined;
      }
    }
    
    return value;
  }

  /**
   * Evaluate condition
   */
  private evaluateCondition(value: any, operator: string, expectedValue: any): boolean {
    switch (operator) {
      case 'equals':
        return value === expectedValue;
      case 'not_equals':
        return value !== expectedValue;
      case 'in':
        return Array.isArray(expectedValue) && expectedValue.includes(value);
      case 'not_in':
        return Array.isArray(expectedValue) && !expectedValue.includes(value);
      case 'contains':
        return typeof value === 'string' && value.includes(expectedValue);
      case 'starts_with':
        return typeof value === 'string' && value.startsWith(expectedValue);
      case 'ends_with':
        return typeof value === 'string' && value.endsWith(expectedValue);
      default:
        return false;
    }
  }

  /**
   * Initialize default roles and permissions
   */
  async initializeDefaultRoles(): Promise<void> {
    // Create default roles
    const roles = [
      {
        name: SystemRoles.SUPER_ADMIN,
        description: 'Full system access',
        is_active: true
      },
      {
        name: SystemRoles.ADMIN,
        description: 'Administrative access',
        is_active: true
      },
      {
        name: SystemRoles.MODERATOR,
        description: 'Moderation access',
        is_active: true
      },
      {
        name: SystemRoles.PROVIDER,
        description: 'Service provider access',
        is_active: true
      },
      {
        name: SystemRoles.CUSTOMER,
        description: 'Customer access',
        is_active: true
      },
      {
        name: SystemRoles.GUEST,
        description: 'Guest access',
        is_active: true
      }
    ];

    for (const roleData of roles) {
      await this.createRole(roleData);
    }

    // Create default permissions
    const permissions = Object.values(SystemPermissions).map(permission => {
      const [resource, action] = permission.split(':');
      return {
        name: permission,
        resource,
        action,
        is_active: true
      };
    });

    for (const permissionData of permissions) {
      await this.createPermission(permissionData);
    }
  }
}
