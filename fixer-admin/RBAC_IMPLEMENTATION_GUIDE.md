# Role-Based Access Control (RBAC) Implementation Guide

## Overview
This guide explains how to implement and use the Role-Based Access Control system in the Homeservice Admin Panel.

## Table of Contents
1. [System Architecture](#system-architecture)
2. [User Roles](#user-roles)
3. [Permissions](#permissions)
4. [Usage Examples](#usage-examples)
5. [Components](#components)
6. [Hooks](#hooks)
7. [Best Practices](#best-practices)

## System Architecture

### File Structure
```
src/
├── types/
│   └── rbac.types.ts          # TypeScript type definitions
├── config/
│   └── rbac.config.ts         # Role and permission configuration
├── hooks/
│   └── usePermissions.ts      # Custom hook for permission checks
├── components/
│   └── auth/
│       ├── PermissionGate.tsx # Component-level access control
│       └── RoleBasedRoute.tsx # Route-level access control
└── pages/
    └── unauthorized.tsx        # 403 Access Denied page
```

## User Roles

### Role Hierarchy (from highest to lowest)

1. **Super Admin** (Level 100)
   - Full system access
   - All permissions
   - System configuration

2. **Admin** (Level 90)
   - Administrative access
   - Cannot modify system settings
   - Can manage users (except super admin)

3. **Manager** (Level 70)
   - Operational management
   - Can create and edit content
   - Cannot delete critical data

4. **Staff** (Level 50)
   - Basic operational access
   - Can view and edit assigned content
   - Limited deletion rights

5. **Provider** (Level 30)
   - Service provider access
   - Can manage their own services
   - View bookings and quotes

6. **Customer** (Level 10)
   - Basic customer access
   - View-only permissions
   - Can access their own data

## Permissions

### Permission Categories

#### Dashboard Permissions
- `view_dashboard` - Access to main dashboard
- `view_analytics` - View analytics and reports

#### Product Permissions
- `view_products` - View product list
- `create_products` - Create new products
- `edit_products` - Edit existing products
- `delete_products` - Delete products
- `manage_product_inventory` - Manage stock levels
- `publish_products` - Publish/unpublish products

#### Service Permissions
- `view_services` - View service list
- `create_services` - Create new services
- `edit_services` - Edit existing services
- `delete_services` - Delete services
- `approve_services` - Approve service listings
- `manage_service_categories` - Manage service categories

#### Order Permissions
- `view_orders` - View order list
- `create_orders` - Create new orders
- `edit_orders` - Edit existing orders
- `delete_orders` - Delete orders
- `process_orders` - Process and fulfill orders
- `cancel_orders` - Cancel orders
- `refund_orders` - Issue refunds

#### User Permissions
- `view_users` - View user list
- `create_users` - Create new users
- `edit_users` - Edit user information
- `delete_users` - Delete users
- `manage_user_roles` - Change user roles
- `ban_users` - Ban/unban users

#### And more... (see rbac.types.ts for complete list)

## Usage Examples

### 1. Protecting Routes

```tsx
import { RoleBasedRoute } from './components/auth/RoleBasedRoute'

// Single permission
<Route 
  path="/products" 
  element={
    <RoleBasedRoute permissions={['view_products']}>
      <Products />
    </RoleBasedRoute>
  } 
/>

// Multiple permissions (user needs ANY of these)
<Route 
  path="/orders" 
  element={
    <RoleBasedRoute permissions={['view_orders', 'manage_orders']}>
      <Orders />
    </RoleBasedRoute>
  } 
/>

// Multiple permissions (user needs ALL of these)
<Route 
  path="/admin" 
  element={
    <RoleBasedRoute 
      permissions={['manage_users', 'manage_system_settings']} 
      requireAll
    >
      <AdminPanel />
    </RoleBasedRoute>
  } 
/>

// Role-based access
<Route 
  path="/super-admin" 
  element={
    <RoleBasedRoute roles={['super_admin']}>
      <SuperAdminPanel />
    </RoleBasedRoute>
  } 
/>
```

### 2. Conditional Rendering with PermissionGate

```tsx
import { PermissionGate } from './components/auth/PermissionGate'

// Show button only if user has permission
<PermissionGate permissions={['create_products']}>
  <Button onClick={handleCreateProduct}>
    Create Product
  </Button>
</PermissionGate>

// Show different content based on permission
<PermissionGate 
  permissions={['edit_products']}
  fallback={<Typography>View Only Mode</Typography>}
>
  <EditProductForm />
</PermissionGate>

// Redirect if no permission
<PermissionGate 
  permissions={['view_admin_panel']}
  redirectTo="/unauthorized"
>
  <AdminPanel />
</PermissionGate>

// Show unauthorized message
<PermissionGate 
  permissions={['delete_products']}
  showUnauthorized
>
  <DeleteButton />
</PermissionGate>
```

### 3. Using the usePermissions Hook

```tsx
import { usePermissions } from '../hooks/usePermissions'

function ProductActions() {
  const { 
    checkPermission, 
    checkAnyPermission,
    isAdmin,
    userRole 
  } = usePermissions()

  // Check single permission
  const canEdit = checkPermission('edit_products')
  
  // Check multiple permissions
  const canManage = checkAnyPermission(['edit_products', 'delete_products'])
  
  // Check role
  if (isAdmin()) {
    return <AdminControls />
  }

  return (
    <Box>
      {canEdit && <EditButton />}
      {checkPermission('delete_products') && <DeleteButton />}
      <Typography>Your role: {userRole}</Typography>
    </Box>
  )
}
```

### 4. Button-Level Permissions

```tsx
import { PermissionGate } from './components/auth/PermissionGate'

function ProductTable({ products }) {
  return (
    <Table>
      <TableBody>
        {products.map(product => (
          <TableRow key={product.id}>
            <TableCell>{product.name}</TableCell>
            <TableCell>
              {/* View button - everyone can see */}
              <IconButton onClick={() => handleView(product)}>
                <VisibilityIcon />
              </IconButton>
              
              {/* Edit button - only if has permission */}
              <PermissionGate permissions={['edit_products']}>
                <IconButton onClick={() => handleEdit(product)}>
                  <EditIcon />
                </IconButton>
              </PermissionGate>
              
              {/* Delete button - admin and super_admin only */}
              <PermissionGate roles={['super_admin', 'admin']}>
                <IconButton onClick={() => handleDelete(product)}>
                  <DeleteIcon />
                </IconButton>
              </PermissionGate>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
```

### 5. Form Field Permissions

```tsx
function ProductForm({ product, mode }) {
  const { checkPermission } = usePermissions()
  
  const canEditPrice = checkPermission('edit_product_price')
  const canPublish = checkPermission('publish_products')

  return (
    <form>
      <TextField 
        label="Product Name"
        disabled={!checkPermission('edit_products')}
      />
      
      <TextField 
        label="Price"
        disabled={!canEditPrice}
      />
      
      <PermissionGate permissions={['publish_products']}>
        <FormControlLabel
          control={<Switch />}
          label="Published"
        />
      </PermissionGate>
      
      <PermissionGate permissions={['manage_product_inventory']}>
        <TextField 
          label="Stock Quantity"
          type="number"
        />
      </PermissionGate>
    </form>
  )
}
```

### 6. Navigation Menu Filtering

```tsx
import { usePermissions } from '../hooks/usePermissions'

function Sidebar() {
  const { checkPermission, checkRouteAccess } = usePermissions()

  const menuItems = [
    { 
      path: '/dashboard', 
      label: 'Dashboard',
      permission: 'view_dashboard'
    },
    { 
      path: '/products', 
      label: 'Products',
      permission: 'view_products'
    },
    { 
      path: '/users', 
      label: 'Users',
      permission: 'view_users'
    },
    { 
      path: '/settings', 
      label: 'Settings',
      permission: 'view_settings'
    }
  ]

  return (
    <nav>
      {menuItems.map(item => (
        checkPermission(item.permission) && (
          <MenuItem key={item.path} to={item.path}>
            {item.label}
          </MenuItem>
        )
      ))}
    </nav>
  )
}
```

## Components

### PermissionGate

Component for conditional rendering based on permissions.

**Props:**
- `permissions?: Permission[]` - Required permissions
- `roles?: UserRole[]` - Required roles
- `requireAll?: boolean` - If true, user needs all permissions
- `fallback?: React.ReactNode` - Content to show if no permission
- `redirectTo?: string` - Redirect URL if no permission
- `showUnauthorized?: boolean` - Show unauthorized message

### RoleBasedRoute

Route wrapper for protecting entire pages.

**Props:**
- `permissions?: Permission[]` - Required permissions
- `roles?: UserRole[]` - Required roles
- `requireAll?: boolean` - If true, user needs all permissions
- `redirectTo?: string` - Redirect URL (default: '/unauthorized')

## Hooks

### usePermissions

Custom hook for permission checks.

**Returns:**
- `userRole` - Current user's role
- `customPermissions` - User's custom permissions
- `checkPermission(permission)` - Check single permission
- `checkAnyPermission(permissions)` - Check if user has any permission
- `checkAllPermissions(permissions)` - Check if user has all permissions
- `checkRouteAccess(path)` - Check if user can access route
- `isRole(role)` - Check if user is specific role
- `isAnyRole(roles)` - Check if user is one of roles
- `isSuperAdmin()` - Check if user is super admin
- `isAdmin()` - Check if user is admin or super admin
- `isManager()` - Check if user is manager or above

## Best Practices

### 1. Use Descriptive Permission Names
```tsx
// Good
checkPermission('edit_products')

// Bad
checkPermission('edit')
```

### 2. Protect Routes at Multiple Levels
```tsx
// Route level
<RoleBasedRoute permissions={['view_products']}>
  <Products />
</RoleBasedRoute>

// Component level
<PermissionGate permissions={['edit_products']}>
  <EditButton />
</PermissionGate>
```

### 3. Provide Feedback
```tsx
// Show unauthorized message instead of hiding
<PermissionGate 
  permissions={['admin_access']}
  showUnauthorized
>
  <AdminPanel />
</PermissionGate>
```

### 4. Use Role-Based Access for Major Features
```tsx
// Use roles for entire sections
<RoleBasedRoute roles={['super_admin', 'admin']}>
  <AdminDashboard />
</RoleBasedRoute>

// Use permissions for specific actions
<PermissionGate permissions={['delete_products']}>
  <DeleteButton />
</PermissionGate>
```

### 5. Handle Edge Cases
```tsx
const { checkPermission, userRole } = usePermissions()

// Always check permission before action
const handleDelete = (id) => {
  if (!checkPermission('delete_products')) {
    showError('You do not have permission to delete products')
    return
  }
  // Proceed with deletion
  deleteProduct(id)
}
```

### 6. Test Different Roles
```tsx
// Test your components with different roles
const mockUser = {
  ...user,
  userType: 'staff' // Test as staff
}
```

## Testing

### Unit Testing Permissions
```tsx
import { renderHook } from '@testing-library/react-hooks'
import { usePermissions } from './usePermissions'

test('admin can edit products', () => {
  const { result } = renderHook(() => usePermissions(), {
    wrapper: ({ children }) => (
      <MockAuthProvider role="admin">
        {children}
      </MockAuthProvider>
    )
  })
  
  expect(result.current.checkPermission('edit_products')).toBe(true)
})
```

## Configuration

### Adding New Permissions

1. Add to `rbac.types.ts`:
```tsx
export type Permission = 
  | 'existing_permission'
  | 'new_permission' // Add here
```

2. Add to role configuration in `rbac.config.ts`:
```tsx
admin: {
  role: 'admin',
  permissions: [
    'existing_permission',
    'new_permission' // Add to appropriate roles
  ]
}
```

### Adding New Roles

1. Add to `rbac.types.ts`:
```tsx
export type UserRole = 
  | 'existing_role' 
  | 'new_role'
```

2. Add configuration in `rbac.config.ts`:
```tsx
new_role: {
  role: 'new_role',
  level: 60,
  description: 'Role description',
  permissions: [/* permissions */]
}
```

## Security Considerations

1. **Always validate on backend** - Frontend permissions are for UX only
2. **Use HTTPS** - Protect authentication tokens
3. **Implement token refresh** - Prevent session hijacking
4. **Log permission denials** - Monitor suspicious activity
5. **Regular audits** - Review permission assignments
6. **Principle of least privilege** - Give minimum required permissions

## Migration Guide

### From No RBAC to RBAC

1. Identify current user types
2. Map to new roles
3. Wrap protected routes with `RoleBasedRoute`
4. Add `PermissionGate` to sensitive UI elements
5. Test with each role
6. Update backend API to check permissions

## Troubleshooting

### User Can't Access Page
1. Check user's role in Redux store
2. Verify role has required permissions
3. Check route configuration
4. Look for typos in permission names

### Permission Not Working
1. Verify permission exists in types
2. Check role configuration
3. Ensure user state is loaded
4. Check for custom permissions override

---

For more information, see the source code documentation and examples in the codebase.
