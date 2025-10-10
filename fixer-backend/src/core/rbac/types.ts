// Role-Based Access Control Types

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  conditions?: PermissionCondition[];
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface PermissionCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'in' | 'not_in' | 'contains' | 'starts_with' | 'ends_with';
  value: any;
}

export interface UserRole {
  id: string;
  user_id: string;
  role_id: string;
  assigned_by: string;
  assigned_at: Date;
  expires_at?: Date;
  is_active: boolean;
}

export interface RolePermission {
  id: string;
  role_id: string;
  permission_id: string;
  granted: boolean;
  conditions?: PermissionCondition[];
  created_at: Date;
  updated_at: Date;
}

// Predefined roles
export enum SystemRoles {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  PROVIDER = 'provider',
  CUSTOMER = 'customer',
  GUEST = 'guest'
}

// Predefined permissions
export enum SystemPermissions {
  // User Management
  USER_CREATE = 'user:create',
  USER_READ = 'user:read',
  USER_UPDATE = 'user:update',
  USER_DELETE = 'user:delete',
  USER_LIST = 'user:list',
  USER_APPROVE = 'user:approve',
  
  // Service Request Management
  SERVICE_REQUEST_CREATE = 'service_request:create',
  SERVICE_REQUEST_READ = 'service_request:read',
  SERVICE_REQUEST_UPDATE = 'service_request:update',
  SERVICE_REQUEST_DELETE = 'service_request:delete',
  SERVICE_REQUEST_LIST = 'service_request:list',
  SERVICE_REQUEST_UPDATE_STATUS = 'service_request:update_status',
  
  // Provider Management
  PROVIDER_CREATE = 'provider:create',
  PROVIDER_READ = 'provider:read',
  PROVIDER_UPDATE = 'provider:update',
  PROVIDER_DELETE = 'provider:delete',
  PROVIDER_LIST = 'provider:list',
  PROVIDER_VERIFY = 'provider:verify',
  
  // Quote Management
  QUOTE_CREATE = 'quote:create',
  QUOTE_READ = 'quote:read',
  QUOTE_UPDATE = 'quote:update',
  QUOTE_DELETE = 'quote:delete',
  QUOTE_LIST = 'quote:list',
  QUOTE_ACCEPT = 'quote:accept',
  QUOTE_REJECT = 'quote:reject',
  
  // Booking Management
  BOOKING_CREATE = 'booking:create',
  BOOKING_READ = 'booking:read',
  BOOKING_UPDATE = 'booking:update',
  BOOKING_DELETE = 'booking:delete',
  BOOKING_LIST = 'booking:list',
  BOOKING_UPDATE_STATUS = 'booking:update_status',
  
  // Product Management
  PRODUCT_CREATE = 'product:create',
  PRODUCT_READ = 'product:read',
  PRODUCT_UPDATE = 'product:update',
  PRODUCT_DELETE = 'product:delete',
  PRODUCT_LIST = 'product:list',
  
  // Category Management
  CATEGORY_CREATE = 'category:create',
  CATEGORY_READ = 'category:read',
  CATEGORY_UPDATE = 'category:update',
  CATEGORY_DELETE = 'category:delete',
  CATEGORY_LIST = 'category:list',
  
  // Payment Management
  PAYMENT_PROCESS = 'payment:process',
  PAYMENT_READ = 'payment:read',
  PAYMENT_REFUND = 'payment:refund',
  PAYMENT_LIST = 'payment:list',
  
  // Communication Management
  COMMUNICATION_INITIATE_CALL = 'communication:initiate_call',
  COMMUNICATION_SEND_MESSAGE = 'communication:send_message',
  COMMUNICATION_READ_MESSAGE = 'communication:read_message',
  
  // Analytics and Reports
  ANALYTICS_VIEW = 'analytics:view',
  REPORTS_GENERATE = 'reports:generate',
  
  // System Administration
  SYSTEM_CONFIG = 'system:config',
  SYSTEM_LOGS = 'system:logs',
  SYSTEM_BACKUP = 'system:backup'
}

// Permission check result
export interface PermissionCheckResult {
  allowed: boolean;
  reason?: string;
  conditions?: PermissionCondition[];
}

// User approval interface
export interface UserApproval {
  id: string;
  user_id: string;
  requested_role: string;
  status: 'pending' | 'approved' | 'rejected';
  requested_by?: string;
  approved_by?: string;
  rejected_by?: string;
  approval_notes?: string;
  rejection_reason?: string;
  requested_at: Date;
  approved_at?: Date;
  rejected_at?: Date;
  created_at: Date;
  updated_at: Date;
}

// RBAC context for permission checking
export interface RBACContext {
  user_id: string;
  user_type: string;
  roles: string[];
  permissions: string[];
  resource_owner_id?: string;
  resource_data?: any;
}
