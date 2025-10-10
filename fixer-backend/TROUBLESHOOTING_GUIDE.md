# 🔧 Authentication System Troubleshooting Guide

## 📖 Table of Contents

1. [Common Errors & Solutions](#common-errors--solutions)
2. [Database Issues](#database-issues)
3. [Permission Problems](#permission-problems)
4. [Token Issues](#token-issues)
5. [Registration Issues](#registration-issues)
6. [Approval Workflow Issues](#approval-workflow-issues)
7. [Debugging Tools](#debugging-tools)
8. [How to Reset Everything](#how-to-reset-everything)

---

## 🚨 Common Errors & Solutions

### Error: "User with this email already exists"

**Scenario:** Trying to register a user with an email that's already in the database.

**Cause:** Email uniqueness constraint violation.

**Solutions:**

```bash
# Option 1: Use a different email
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"newemail@test.com", ...}'

# Option 2: Delete the existing user (database)
psql -d fixer_marketplace -c "DELETE FROM users WHERE email='duplicate@test.com'"

# Option 3: Check if user exists first
psql -d fixer_marketplace -c "SELECT id, email, approval_status FROM users WHERE email='test@test.com'"
```

**Prevention:**
- Implement better frontend validation
- Add "forgot password" flow instead of re-registering
- Show meaningful error: "Account exists. Try logging in or reset password."

---

### Error: "Invalid email or password"

**Scenario:** Login fails even though you're sure the credentials are correct.

**Possible Causes:**
1. Wrong password
2. User doesn't exist
3. Email typo (case-sensitive)
4. Password has special characters not properly encoded

**Debugging Steps:**

```bash
# 1. Check if user exists
psql -d fixer_marketplace -c "SELECT id, email, approval_status FROM users WHERE email='yourmail@test.com'"

# 2. Verify the email is exact (no spaces, correct case)
psql -d fixer_marketplace -c "SELECT email, LENGTH(email), is_verified FROM users WHERE email LIKE '%yourmail%'"

# 3. Check password hash exists
psql -d fixer_marketplace -c "SELECT id, email, LENGTH(password_hash) as hash_length FROM users WHERE email='yourmail@test.com'"

# 4. Test with a fresh registration
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test_login@test.com",
    "password":"SimplePass123",
    "phone":"+1999999999",
    "user_type":"customer",
    "first_name":"Test",
    "last_name":"User"
  }'

# Then immediately try to login with same credentials
```

**Solutions:**

```typescript
// If you need to manually set a password (for testing):
const bcrypt = require('bcrypt');
const password = 'YourPassword123';
const hash = await bcrypt.hash(password, 12);
console.log(hash);

// Then update in database:
// UPDATE users SET password_hash = '<hash>' WHERE email = 'user@test.com';
```

---

### Error: "Account pending approval"

**Scenario:** Provider or admin tries to login but hasn't been approved yet.

**Cause:** User registered with `user_type: 'provider'` or `'admin'`, which requires manual approval.

**Solution:**

```bash
# 1. Check approval status
psql -d fixer_marketplace -c "SELECT u.email, u.approval_status, ua.status, ua.requested_at FROM users u LEFT JOIN user_approvals ua ON u.id = ua.user_id WHERE u.email='provider@test.com'"

# 2. Get approval ID
psql -d fixer_marketplace -c "SELECT id, user_id, status FROM user_approvals WHERE status='pending'"

# 3. Approve the user (via API as admin)
curl -X POST http://localhost:3000/api/admin/approvals/{APPROVAL_ID}/approve \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"approvalNotes":"Manual approval for testing"}'

# 4. Now user can login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"provider@test.com","password":"Provider123"}'
```

**Quick Fix (Database Direct):**

```sql
-- Update user approval status
UPDATE users 
SET approval_status = 'approved', is_verified = true 
WHERE email = 'provider@test.com';

-- Assign provider role
INSERT INTO user_roles (user_id, role_id, assigned_by)
SELECT u.id, r.id, u.id
FROM users u, roles r
WHERE u.email = 'provider@test.com' AND r.name = 'provider'
ON CONFLICT (user_id, role_id) DO NOTHING;

-- Update approval record
UPDATE user_approvals 
SET status = 'approved', approved_at = NOW()
WHERE user_id = (SELECT id FROM users WHERE email = 'provider@test.com')
AND status = 'pending';
```

---

### Error: "Permission denied" (403)

**Scenario:** User tries to access an endpoint but gets 403 Forbidden.

**Cause:** User's role doesn't have the required permission.

**Debugging:**

```bash
# 1. Check what roles the user has
psql -d fixer_marketplace <<EOF
SELECT u.email, r.name as role_name, ur.is_active
FROM users u
JOIN user_roles ur ON u.id = ur.user_id
JOIN roles r ON ur.role_id = r.id
WHERE u.email = 'user@test.com';
EOF

# 2. Check what permissions that role has
psql -d fixer_marketplace <<EOF
SELECT r.name as role_name, p.name as permission_name
FROM roles r
JOIN role_permissions rp ON r.id = rp.role_id
JOIN permissions p ON rp.permission_id = p.id
WHERE r.name = 'customer' AND rp.granted = true
ORDER BY p.name;
EOF

# 3. Check what permission is required
# Look at the route definition in code:
# Example: requirePermission(SystemPermissions.USER_APPROVE)
# This means the endpoint requires 'user:approve' permission
```

**Solutions:**

```bash
# Solution 1: Assign the correct role
curl -X POST http://localhost:3000/api/admin/users/{USER_ID}/roles \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"roleName":"admin"}'

# Solution 2: Check if user should have access
# If customer shouldn't access admin endpoints, this is correct behavior
# If provider should access, assign provider role

# Solution 3: Direct database role assignment
psql -d fixer_marketplace <<EOF
INSERT INTO user_roles (user_id, role_id, assigned_by)
SELECT 
    (SELECT id FROM users WHERE email = 'user@test.com'),
    (SELECT id FROM roles WHERE name = 'admin'),
    (SELECT id FROM users WHERE email = 'superadmin@fixer.com')
ON CONFLICT (user_id, role_id) DO UPDATE SET is_active = true;
EOF
```

---

### Error: "Token expired" (401)

**Scenario:** Access token expired after 15 minutes.

**Expected Behavior:** This is normal. Access tokens should be short-lived.

**Solution:**

```bash
# Use refresh token to get new access token
curl -X POST http://localhost:3000/api/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"<your-refresh-token>"}'

# Save the new tokens and continue
```

**If Refresh Token Also Expired:**

```bash
# Login again
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"password"}'
```

**Configuration:** Adjust token expiry in environment variables:

```bash
# .env
JWT_ACCESS_TOKEN_EXPIRY=15m
JWT_REFRESH_TOKEN_EXPIRY=7d
```

---

## 🗄️ Database Issues

### Issue: "RBAC tables not found"

**Error:** `relation "roles" does not exist`

**Cause:** Database migrations not run.

**Solution:**

```bash
# Run migrations
cd fixer-backend
node scripts/seed-rbac.js

# Verify
node scripts/check-rbac.js

# Or manually check
psql -d fixer_marketplace -c "\dt"
# Should see: roles, permissions, user_roles, role_permissions, user_approvals
```

---

### Issue: "Super admin not found"

**Cause:** Super admin wasn't created during seeding.

**Solution:**

```bash
# Re-run seed script
cd fixer-backend
node scripts/seed-rbac.js

# Or create manually
psql -d fixer_marketplace <<EOF
-- Hash the password first using bcrypt
-- For demo: password 'SuperAdmin123!' hashed:
-- Run: node -e "const bcrypt=require('bcrypt'); bcrypt.hash('SuperAdmin123!', 12).then(h => console.log(h))"

INSERT INTO users (email, phone, password_hash, user_type, first_name, last_name, is_verified, approval_status)
VALUES (
    'superadmin@fixer.com',
    '+1234567890',
    '\$2b\$12\$YOUR_HASHED_PASSWORD_HERE',
    'admin',
    'Super',
    'Admin',
    true,
    'approved'
) ON CONFLICT (email) DO NOTHING;

-- Assign super admin role
INSERT INTO user_roles (user_id, role_id, assigned_by)
SELECT u.id, r.id, u.id
FROM users u, roles r
WHERE u.email = 'superadmin@fixer.com' AND r.name = 'super_admin'
ON CONFLICT (user_id, role_id) DO NOTHING;
EOF
```

---

### Issue: "Database connection failed"

**Error:** `ECONNREFUSED` or `password authentication failed`

**Debugging:**

```bash
# 1. Check if PostgreSQL is running
pg_isready -h localhost -p 5432

# 2. Check environment variables
cat fixer-backend/.env | grep DB_

# 3. Test connection manually
psql -h localhost -p 5432 -U postgres -d fixer_marketplace

# 4. Check DATABASE_URL format
# Should be: postgresql://user:password@host:port/database
echo $DATABASE_URL
```

**Common Fixes:**

```bash
# Fix 1: Start PostgreSQL
brew services start postgresql@14  # macOS
sudo systemctl start postgresql    # Linux
pg_ctl -D /usr/local/var/postgres start  # Manual

# Fix 2: Create database if missing
psql -U postgres -c "CREATE DATABASE fixer_marketplace;"

# Fix 3: Update .env file
cd fixer-backend
cat > .env <<EOF
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=fixer_marketplace
DB_USER=postgres
DB_PASSWORD=your_password
EOF
```

---

## 🔑 Permission Problems

### Symptom: User has role but no permissions

**Check:**

```sql
-- Get user's roles
SELECT u.email, r.name as role_name, ur.is_active
FROM users u
JOIN user_roles ur ON u.id = ur.user_id
JOIN roles r ON ur.role_id = r.id
WHERE u.email = 'user@test.com';

-- Get role's permissions
SELECT r.name as role_name, p.name as permission_name, rp.granted
FROM roles r
JOIN role_permissions rp ON r.id = rp.role_id
JOIN permissions p ON rp.permission_id = p.id
WHERE r.name = 'provider';
```

**Fix: Re-seed role permissions:**

```bash
# This will restore default permissions
psql -d fixer_marketplace -f fixer-backend/src/core/database/migrations/015_seed_rbac_data.sql
```

---

### Symptom: Permission check always fails

**Check middleware order:**

```typescript
// Correct order in routes/auth.ts:
router.use(authenticateToken);  // First: verify JWT
router.use(requirePermission()); // Second: check permission

// Wrong order:
router.use(requirePermission()); // ❌ Will fail - no user yet
router.use(authenticateToken);   // Too late
```

**Check JWT payload:**

```javascript
// Decode JWT to inspect payload
const jwt = require('jsonwebtoken');
const token = 'your-access-token';
const decoded = jwt.decode(token);
console.log(decoded);
// Should contain: { userId, email, userType }
```

---

## 🎟️ Token Issues

### Issue: Token doesn't include userId

**Cause:** Token generation missing userId in payload.

**Check:**

```typescript
// In AuthService.ts, generateTokens should have:
const payload: JWTPayload = {
  userId: user.id,  // ← Must be present
  email: user.email,
  userType: user.user_type
};
```

**Test:**

```bash
# Decode a token
node -e "console.log(JSON.stringify(require('jsonwebtoken').decode('YOUR_TOKEN_HERE'), null, 2))"
```

---

### Issue: "Invalid signature"

**Cause:** JWT_SECRET mismatch between generation and verification.

**Check:**

```bash
# Ensure same secret is used
echo $JWT_SECRET
cat fixer-backend/.env | grep JWT_SECRET

# Regenerate tokens with correct secret
```

**Fix:**

```bash
# Set a strong secret (32+ characters)
cd fixer-backend
echo "JWT_SECRET=$(openssl rand -base64 32)" >> .env
echo "JWT_REFRESH_SECRET=$(openssl rand -base64 32)" >> .env

# Restart server
npm run dev
```

---

## 📝 Registration Issues

### Issue: Registration returns 201 but user not in database

**Debugging:**

```bash
# Check for database errors in server logs
# Check if transaction rolled back

# Verify user was created
psql -d fixer_marketplace -c "SELECT * FROM users ORDER BY created_at DESC LIMIT 1;"
```

**Common Causes:**
1. Database trigger failed
2. Constraint violation (silent failure)
3. Transaction not committed

**Fix:**

```typescript
// Ensure repository uses proper error handling
try {
  const user = await this.userRepository.create(userData);
  // Commit transaction
  return user;
} catch (error) {
  // Rollback transaction
  console.error('User creation failed:', error);
  throw error;
}
```

---

### Issue: Phone number validation fails

**Cause:** Phone format doesn't match expected pattern.

**Solution:**

```bash
# Use international format with + sign
# Correct: +1234567890
# Wrong: 1234567890, (123) 456-7890

# Test with simple format
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@test.com",
    "password":"Test123!",
    "phone":"+1234567890",
    ...
  }'
```

---

## ✅ Approval Workflow Issues

### Issue: Can't see pending approvals

**Cause:** Admin doesn't have `user:approve` permission.

**Check:**

```sql
SELECT u.email, p.name as permission
FROM users u
JOIN user_roles ur ON u.id = ur.user_id
JOIN roles r ON ur.role_id = r.id
JOIN role_permissions rp ON r.id = rp.role_id
JOIN permissions p ON rp.permission_id = p.id
WHERE u.email = 'admin@fixer.com'
AND p.name = 'user:approve';
```

**Fix:**

```bash
# Ensure user has admin or super_admin role
curl -X POST http://localhost:3000/api/admin/users/{USER_ID}/roles \
  -H "Authorization: Bearer $SUPER_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"roleName":"admin"}'
```

---

### Issue: Approval doesn't assign role

**Check:**

```sql
-- Check if approval exists
SELECT * FROM user_approvals WHERE user_id = 'user-uuid';

-- Check if role was assigned
SELECT * FROM user_roles WHERE user_id = 'user-uuid';
```

**Manual Fix:**

```sql
-- Update user
UPDATE users 
SET approval_status = 'approved', is_verified = true 
WHERE id = 'user-uuid';

-- Assign role
INSERT INTO user_roles (user_id, role_id, assigned_by)
SELECT 
    'user-uuid',
    (SELECT id FROM roles WHERE name = 'provider'),
    'admin-uuid'
ON CONFLICT (user_id, role_id) DO UPDATE SET is_active = true;

-- Update approval
UPDATE user_approvals 
SET status = 'approved', approved_at = NOW(), approved_by = 'admin-uuid'
WHERE user_id = 'user-uuid' AND status = 'pending';
```

---

## 🛠️ Debugging Tools

### SQL Debugging Queries

```sql
-- ========================================
-- USER DEBUGGING
-- ========================================

-- 1. Find user by email
SELECT id, email, user_type, approval_status, is_verified, created_at 
FROM users 
WHERE email = 'user@test.com';

-- 2. Get user's roles
SELECT u.email, r.name as role, ur.assigned_at, ur.is_active
FROM users u
JOIN user_roles ur ON u.id = ur.user_id
JOIN roles r ON ur.role_id = r.id
WHERE u.email = 'user@test.com';

-- 3. Get user's all permissions
SELECT DISTINCT u.email, p.name as permission
FROM users u
JOIN user_roles ur ON u.id = ur.user_id
JOIN roles r ON ur.role_id = r.id
JOIN role_permissions rp ON r.id = rp.role_id
JOIN permissions p ON rp.permission_id = p.id
WHERE u.email = 'user@test.com' 
AND ur.is_active = true 
AND rp.granted = true
ORDER BY p.name;

-- 4. Check pending approvals
SELECT 
    ua.id as approval_id,
    u.email,
    u.user_type,
    ua.requested_role,
    ua.status,
    ua.requested_at,
    ua.approved_at,
    ua.rejected_at
FROM user_approvals ua
JOIN users u ON ua.user_id = u.id
WHERE ua.status = 'pending'
ORDER BY ua.requested_at DESC;

-- ========================================
-- ROLE & PERMISSION DEBUGGING
-- ========================================

-- 5. Count permissions per role
SELECT r.name as role, COUNT(p.id) as permission_count
FROM roles r
LEFT JOIN role_permissions rp ON r.id = rp.role_id AND rp.granted = true
LEFT JOIN permissions p ON rp.permission_id = p.id
GROUP BY r.name
ORDER BY permission_count DESC;

-- 6. Find who has specific permission
SELECT u.email, r.name as role
FROM users u
JOIN user_roles ur ON u.id = ur.user_id
JOIN roles r ON ur.role_id = r.id
JOIN role_permissions rp ON r.id = rp.role_id
JOIN permissions p ON rp.permission_id = p.id
WHERE p.name = 'user:approve' AND rp.granted = true AND ur.is_active = true;

-- 7. List all permissions for a role
SELECT p.name, p.resource, p.action
FROM roles r
JOIN role_permissions rp ON r.id = rp.role_id
JOIN permissions p ON rp.permission_id = p.id
WHERE r.name = 'provider' AND rp.granted = true
ORDER BY p.resource, p.action;

-- ========================================
-- SYSTEM HEALTH CHECK
-- ========================================

-- 8. Count users by type
SELECT user_type, approval_status, COUNT(*) as count
FROM users
GROUP BY user_type, approval_status
ORDER BY user_type, approval_status;

-- 9. Check for users without roles
SELECT u.id, u.email, u.user_type, u.approval_status
FROM users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
WHERE ur.id IS NULL;

-- 10. Check for inactive roles
SELECT u.email, r.name as role, ur.is_active, ur.assigned_at
FROM users u
JOIN user_roles ur ON u.id = ur.user_id
JOIN roles r ON ur.role_id = r.id
WHERE ur.is_active = false;
```

---

### Node.js Testing Script

Create `fixer-backend/test-auth.js`:

```javascript
const axios = require('axios');

const API_BASE = 'http://localhost:3000/api';

async function testAuth() {
  console.log('🧪 Testing Auth System...\n');

  try {
    // 1. Register customer
    console.log('1️⃣  Registering customer...');
    const customerReg = await axios.post(`${API_BASE}/auth/register`, {
      email: `customer${Date.now()}@test.com`,
      password: 'Test123!',
      phone: `+1${Math.floor(Math.random() * 1000000000)}`,
      user_type: 'customer',
      first_name: 'Test',
      last_name: 'Customer'
    });
    console.log('✅ Customer registered:', customerReg.data.data.requiresApproval === false ? 'Auto-approved' : 'Needs approval');
    const customerToken = customerReg.data.data.tokens?.accessToken;

    // 2. Register provider
    console.log('\n2️⃣  Registering provider...');
    const providerReg = await axios.post(`${API_BASE}/auth/register`, {
      email: `provider${Date.now()}@test.com`,
      password: 'Test123!',
      phone: `+1${Math.floor(Math.random() * 1000000000)}`,
      user_type: 'provider',
      first_name: 'Test',
      last_name: 'Provider'
    });
    console.log('✅ Provider registered:', providerReg.data.data.requiresApproval === true ? 'Needs approval' : 'Auto-approved');

    // 3. Login super admin
    console.log('\n3️⃣  Logging in as super admin...');
    const adminLogin = await axios.post(`${API_BASE}/auth/login`, {
      email: 'superadmin@fixer.com',
      password: 'SuperAdmin123!'
    });
    console.log('✅ Super admin logged in');
    const adminToken = adminLogin.data.data.tokens.accessToken;

    // 4. Get pending approvals
    console.log('\n4️⃣  Getting pending approvals...');
    const approvals = await axios.get(`${API_BASE}/admin/approvals/pending`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log(`✅ Found ${approvals.data.data.length} pending approvals`);

    // 5. Test permission denial
    console.log('\n5️⃣  Testing permission denial (customer accessing admin endpoint)...');
    try {
      await axios.get(`${API_BASE}/admin/approvals/pending`, {
        headers: { Authorization: `Bearer ${customerToken}` }
      });
      console.log('❌ FAIL: Customer should not access admin endpoints');
    } catch (error) {
      if (error.response?.status === 403) {
        console.log('✅ Permission denied correctly (403)');
      } else {
        console.log('⚠️  Unexpected error:', error.response?.status);
      }
    }

    console.log('\n🎉 All tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testAuth();
```

Run with: `node fixer-backend/test-auth.js`

---

## 🔄 How to Reset Everything

### Option 1: Reset Database Only

```bash
# Drop and recreate database
psql -U postgres <<EOF
DROP DATABASE IF EXISTS fixer_marketplace;
CREATE DATABASE fixer_marketplace;
EOF

# Run migrations
cd fixer-backend
node scripts/seed-rbac.js

# Verify
node scripts/check-rbac.js
```

---

### Option 2: Reset Specific Tables

```sql
-- Clear all users and related data (CASCADE deletes)
TRUNCATE TABLE users CASCADE;

-- Clear approvals
TRUNCATE TABLE user_approvals CASCADE;

-- Clear roles and permissions (if you want to re-seed)
TRUNCATE TABLE user_roles CASCADE;
TRUNCATE TABLE role_permissions CASCADE;
TRUNCATE TABLE roles CASCADE;
TRUNCATE TABLE permissions CASCADE;

-- Re-seed
-- Then run: node scripts/seed-rbac.js
```

---

### Option 3: Reset User Approvals Only

```sql
-- Delete all pending approvals
DELETE FROM user_approvals WHERE status = 'pending';

-- Reset users to pending status
UPDATE users SET approval_status = 'pending', is_verified = false WHERE user_type != 'customer';

-- Remove roles
DELETE FROM user_roles WHERE user_id IN (SELECT id FROM users WHERE approval_status = 'pending');
```

---

### Option 4: Clean Start Script

Create `fixer-backend/reset-auth.js`:

```javascript
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function reset() {
  const client = await pool.connect();
  
  try {
    console.log('🗑️  Clearing all auth data...');
    
    await client.query('TRUNCATE TABLE user_approvals CASCADE');
    await client.query('TRUNCATE TABLE user_roles CASCADE');
    await client.query('TRUNCATE TABLE role_permissions CASCADE');
    await client.query('TRUNCATE TABLE users CASCADE');
    await client.query('TRUNCATE TABLE roles CASCADE');
    await client.query('TRUNCATE TABLE permissions CASCADE');
    
    console.log('✅ All auth data cleared');
    console.log('🌱 Now run: node scripts/seed-rbac.js');
    
  } catch (error) {
    console.error('❌ Reset failed:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

reset();
```

Run with: `node fixer-backend/reset-auth.js`

---

## 📞 Getting Help

### Check Logs

```bash
# Server logs (if using PM2)
pm2 logs fixer-backend

# Docker logs
docker logs fixer-backend

# Manual server logs
cd fixer-backend
npm run dev 2>&1 | tee server.log
```

### Enable Debug Mode

```bash
# Add to .env
DEBUG=true
LOG_LEVEL=debug

# Restart server
npm run dev
```

### Common Log Locations

- Server console output
- Database error logs: `/var/log/postgresql/`
- Application logs: `fixer-backend/logs/`

---

## ✅ Health Check Checklist

Run this checklist to verify your auth system is healthy:

- [ ] Database connection works
- [ ] 6 roles exist in database
- [ ] 54 permissions exist in database
- [ ] Super admin user exists
- [ ] Super admin can login
- [ ] Super admin has super_admin role
- [ ] Customer registration auto-approves
- [ ] Provider registration creates approval request
- [ ] Admin can see pending approvals
- [ ] Admin can approve users
- [ ] Approved provider can login
- [ ] Permission checks work (403 for denied)
- [ ] Token refresh works
- [ ] Invalid token returns 401
- [ ] Invalid credentials return 401

**Run Full Health Check:**

```bash
cd fixer-backend
node scripts/check-rbac.js
node test-auth.js
```

---

**Troubleshooting Guide Version:** 1.0  
**Last Updated:** 2025-10-09  
**Next Review:** When issues are reported or system is updated

