-- Seed RBAC data with roles, permissions, and role-permission mappings

-- Insert system roles
INSERT INTO roles (name, description, is_active) VALUES
('super_admin', 'Super Administrator with full system access', true),
('admin', 'Administrator with management access', true),
('moderator', 'Moderator with limited administrative access', true),
('provider', 'Service Provider with business management access', true),
('customer', 'Customer with basic access', true),
('guest', 'Guest user with minimal access', true)
ON CONFLICT (name) DO NOTHING;

-- Insert system permissions
INSERT INTO permissions (name, resource, action, is_active) VALUES
-- User Management
('user:create', 'user', 'create', true),
('user:read', 'user', 'read', true),
('user:update', 'user', 'update', true),
('user:delete', 'user', 'delete', true),
('user:list', 'user', 'list', true),
('user:approve', 'user', 'approve', true),
('user:verify', 'user', 'verify', true),

-- Service Request Management
('service_request:create', 'service_request', 'create', true),
('service_request:read', 'service_request', 'read', true),
('service_request:update', 'service_request', 'update', true),
('service_request:delete', 'service_request', 'delete', true),
('service_request:list', 'service_request', 'list', true),
('service_request:update_status', 'service_request', 'update_status', true),

-- Provider Management
('provider:create', 'provider', 'create', true),
('provider:read', 'provider', 'read', true),
('provider:update', 'provider', 'update', true),
('provider:delete', 'provider', 'delete', true),
('provider:list', 'provider', 'list', true),
('provider:verify', 'provider', 'verify', true),

-- Quote Management
('quote:create', 'quote', 'create', true),
('quote:read', 'quote', 'read', true),
('quote:update', 'quote', 'update', true),
('quote:delete', 'quote', 'delete', true),
('quote:list', 'quote', 'list', true),
('quote:accept', 'quote', 'accept', true),
('quote:reject', 'quote', 'reject', true),

-- Booking Management
('booking:create', 'booking', 'create', true),
('booking:read', 'booking', 'read', true),
('booking:update', 'booking', 'update', true),
('booking:delete', 'booking', 'delete', true),
('booking:list', 'booking', 'list', true),
('booking:update_status', 'booking', 'update_status', true),

-- Product Management
('product:create', 'product', 'create', true),
('product:read', 'product', 'read', true),
('product:update', 'product', 'update', true),
('product:delete', 'product', 'delete', true),
('product:list', 'product', 'list', true),

-- Category Management
('category:create', 'category', 'create', true),
('category:read', 'category', 'read', true),
('category:update', 'category', 'update', true),
('category:delete', 'category', 'delete', true),
('category:list', 'category', 'list', true),

-- Payment Management
('payment:process', 'payment', 'process', true),
('payment:read', 'payment', 'read', true),
('payment:refund', 'payment', 'refund', true),
('payment:list', 'payment', 'list', true),

-- Communication Management
('communication:initiate_call', 'communication', 'initiate_call', true),
('communication:send_message', 'communication', 'send_message', true),
('communication:read_message', 'communication', 'read_message', true),

-- Analytics and Reports
('analytics:view', 'analytics', 'view', true),
('reports:generate', 'reports', 'generate', true),

-- System Administration
('system:config', 'system', 'config', true),
('system:logs', 'system', 'logs', true),
('system:backup', 'system', 'backup', true)
ON CONFLICT (name) DO NOTHING;

-- Assign permissions to Super Admin (all permissions)
INSERT INTO role_permissions (role_id, permission_id, granted)
SELECT r.id, p.id, true
FROM roles r, permissions p
WHERE r.name = 'super_admin'
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Assign permissions to Admin (most permissions except system config)
INSERT INTO role_permissions (role_id, permission_id, granted)
SELECT r.id, p.id, true
FROM roles r, permissions p
WHERE r.name = 'admin' 
AND p.name NOT IN ('system:config', 'system:backup')
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Assign permissions to Moderator (limited admin permissions)
INSERT INTO role_permissions (role_id, permission_id, granted)
SELECT r.id, p.id, true
FROM roles r, permissions p
WHERE r.name = 'moderator' 
AND p.name IN (
    'user:read', 'user:list', 'user:verify',
    'service_request:read', 'service_request:list', 'service_request:update_status',
    'provider:read', 'provider:list', 'provider:verify',
    'quote:read', 'quote:list',
    'booking:read', 'booking:list', 'booking:update_status',
    'product:read', 'product:list',
    'category:read', 'category:list',
    'payment:read', 'payment:list',
    'communication:read_message',
    'analytics:view'
)
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Assign permissions to Provider (business management)
INSERT INTO role_permissions (role_id, permission_id, granted)
SELECT r.id, p.id, true
FROM roles r, permissions p
WHERE r.name = 'provider' 
AND p.name IN (
    'service_request:read', 'service_request:list',
    'quote:create', 'quote:read', 'quote:update', 'quote:list', 'quote:accept', 'quote:reject',
    'booking:create', 'booking:read', 'booking:update', 'booking:list', 'booking:update_status',
    'product:create', 'product:read', 'product:update', 'product:delete', 'product:list',
    'category:read', 'category:list',
    'payment:read', 'payment:list',
    'communication:initiate_call', 'communication:send_message', 'communication:read_message'
)
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Assign permissions to Customer (basic access)
INSERT INTO role_permissions (role_id, permission_id, granted)
SELECT r.id, p.id, true
FROM roles r, permissions p
WHERE r.name = 'customer' 
AND p.name IN (
    'service_request:create', 'service_request:read', 'service_request:list',
    'quote:read', 'quote:list', 'quote:accept', 'quote:reject',
    'booking:create', 'booking:read', 'booking:list',
    'product:read', 'product:list',
    'category:read', 'category:list',
    'payment:process', 'payment:read', 'payment:list',
    'communication:send_message', 'communication:read_message'
)
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Assign permissions to Guest (minimal access)
INSERT INTO role_permissions (role_id, permission_id, granted)
SELECT r.id, p.id, true
FROM roles r, permissions p
WHERE r.name = 'guest' 
AND p.name IN (
    'product:read', 'product:list',
    'category:read', 'category:list'
)
ON CONFLICT (role_id, permission_id) DO NOTHING;
