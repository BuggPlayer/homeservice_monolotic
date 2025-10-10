# 🚀 Quick Test Reference - Copy & Paste Commands

## 🌱 Initial Setup

### 1. Seed Database (First Time Only)
```bash
cd fixer-backend
node scripts/seed-rbac.js
```

### 2. Check Setup
```bash
node scripts/check-rbac.js
```

---

## 🔐 Login Super Admin

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "superadmin@fixer.com",
    "password": "SuperAdmin123!"
  }'
```

**Save the accessToken from response as `$ADMIN_TOKEN`**

---

## 👤 Test Customer Flow (Auto-Approved)

### Register Customer
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer1@test.com",
    "password": "Test123!@#",
    "phone": "+1234567001",
    "user_type": "customer",
    "first_name": "John",
    "last_name": "Doe"
  }'
```

**✅ Expected:** Immediate JWT tokens, no approval needed

### Login Customer
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer1@test.com",
    "password": "Test123!@#"
  }'
```

**Save the accessToken as `$CUSTOMER_TOKEN`**

### Get Customer Profile
```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer $CUSTOMER_TOKEN"
```

---

## 🔧 Test Provider Flow (Requires Approval)

### Register Provider
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "provider1@test.com",
    "password": "Provider123!@#",
    "phone": "+1234567002",
    "user_type": "provider",
    "first_name": "Mike",
    "last_name": "Smith"
  }'
```

**⏳ Expected:** `requiresApproval: true`, `tokens: null`

### Try Login (Should Fail - Not Approved Yet)
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "provider1@test.com",
    "password": "Provider123!@#"
  }'
```

**❌ Expected:** 401 Error

### Admin: Get Pending Approvals
```bash
curl -X GET http://localhost:3000/api/admin/approvals/pending \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

**Copy the `id` field from the response (approval ID)**

### Admin: Approve Provider
```bash
# Replace {APPROVAL_ID} with the ID from previous step
curl -X POST http://localhost:3000/api/admin/approvals/{APPROVAL_ID}/approve \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "approvalNotes": "Verified credentials"
  }'
```

**✅ Expected:** Provider approved

### Provider: Login After Approval
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "provider1@test.com",
    "password": "Provider123!@#"
  }'
```

**✅ Expected:** JWT tokens received
**Save the accessToken as `$PROVIDER_TOKEN`**

---

## 🛡️ Test Admin Creation (Super Admin Only)

### Super Admin: Create New Admin
```bash
curl -X POST http://localhost:3000/api/auth/register/admin \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin2@fixer.com",
    "password": "Admin123!@#",
    "phone": "+1234567003",
    "user_type": "admin",
    "first_name": "Sarah",
    "last_name": "Johnson"
  }'
```

**⏳ Expected:** `requiresApproval: true`

### Get Pending Approvals Again
```bash
curl -X GET http://localhost:3000/api/admin/approvals/pending \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

### Approve New Admin
```bash
# Replace {APPROVAL_ID} with the new admin's approval ID
curl -X POST http://localhost:3000/api/admin/approvals/{APPROVAL_ID}/approve \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "approvalNotes": "Approved by Super Admin"
  }'
```

---

## 🔍 Test Permission Checks

### Customer Tries to Access Admin Endpoint (Should Fail)
```bash
curl -X GET http://localhost:3000/api/admin/approvals/pending \
  -H "Authorization: Bearer $CUSTOMER_TOKEN"
```

**❌ Expected:** 403 Permission Denied

### Provider Tries to Approve Users (Should Fail)
```bash
curl -X POST http://localhost:3000/api/admin/approvals/{APPROVAL_ID}/approve \
  -H "Authorization: Bearer $PROVIDER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "approvalNotes": "Test"
  }'
```

**❌ Expected:** 403 Permission Denied

---

## 📋 View System Data

### Get All Roles
```bash
curl -X GET http://localhost:3000/api/admin/roles \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

**Expected:** 6 roles (super_admin, admin, moderator, provider, customer, guest)

### Get All Permissions
```bash
curl -X GET http://localhost:3000/api/admin/permissions \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

**Expected:** 54 permissions

---

## 🔄 Token Management

### Refresh Access Token
```bash
# Replace {REFRESH_TOKEN} with the refreshToken from login
curl -X POST http://localhost:3000/api/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "{REFRESH_TOKEN}"
  }'
```

### Logout
```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer $CUSTOMER_TOKEN"
```

---

## 🔴 Test Failure Scenarios

### Invalid Credentials
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "wrong@test.com",
    "password": "WrongPassword"
  }'
```

**❌ Expected:** 401 Invalid email or password

### Duplicate Registration
```bash
# Try registering the same customer again
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer1@test.com",
    "password": "Test123!@#",
    "phone": "+1234567099",
    "user_type": "customer",
    "first_name": "Jane",
    "last_name": "Doe"
  }'
```

**❌ Expected:** 400 User with this email already exists

### Invalid Token
```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer invalid-token-here"
```

**❌ Expected:** 401 Invalid token

---

## 🎯 Quick Test Checklist

- [ ] Super admin can login
- [ ] Customer registration auto-approves
- [ ] Customer can login immediately
- [ ] Provider registration requires approval
- [ ] Provider cannot login before approval
- [ ] Admin can see pending approvals
- [ ] Admin can approve provider
- [ ] Provider can login after approval
- [ ] Customer cannot access admin endpoints
- [ ] Provider cannot approve users
- [ ] Super admin can create admins
- [ ] Tokens can be refreshed
- [ ] Invalid credentials are rejected
- [ ] Duplicate registration is rejected

---

## 🔍 Debugging Commands

### Check User in Database
```sql
-- Run in PostgreSQL
SELECT id, email, user_type, approval_status, is_verified 
FROM users 
WHERE email = 'provider1@test.com';
```

### Check User Roles
```sql
SELECT u.email, r.name as role_name, ur.is_active
FROM users u
JOIN user_roles ur ON u.id = ur.user_id
JOIN roles r ON ur.role_id = r.id
WHERE u.email = 'provider1@test.com';
```

### Check Pending Approvals
```sql
SELECT ua.id, u.email, ua.requested_role, ua.status, ua.requested_at
FROM user_approvals ua
JOIN users u ON ua.user_id = u.id
WHERE ua.status = 'pending'
ORDER BY ua.requested_at DESC;
```

### Check User Permissions
```sql
SELECT DISTINCT p.name as permission
FROM users u
JOIN user_roles ur ON u.id = ur.user_id
JOIN roles r ON ur.role_id = r.id
JOIN role_permissions rp ON r.id = rp.role_id
JOIN permissions p ON rp.permission_id = p.id
WHERE u.email = 'provider1@test.com' AND ur.is_active = true AND rp.granted = true;
```

---

## 📱 Postman Tips

### Setup Environment Variables

1. Create a Postman environment
2. Add these variables:
   - `base_url`: `http://localhost:3000/api`
   - `admin_token`: (set after super admin login)
   - `customer_token`: (set after customer login)
   - `provider_token`: (set after provider login)
   - `approval_id`: (set when checking pending approvals)

3. Use in requests:
   - URL: `{{base_url}}/auth/login`
   - Header: `Authorization: Bearer {{admin_token}}`

### Auto-Save Tokens

Add this to the "Tests" tab in Postman for login requests:

```javascript
if (pm.response.code === 200) {
    var jsonData = pm.response.json();
    if (jsonData.data.tokens) {
        pm.environment.set("admin_token", jsonData.data.tokens.accessToken);
        pm.environment.set("refresh_token", jsonData.data.tokens.refreshToken);
    }
}
```

---

## 🎉 Complete Test Flow (5 Minutes)

### Run this sequence to test everything:

```bash
# 1. Setup
cd fixer-backend
node scripts/seed-rbac.js

# 2. Login Super Admin
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"superadmin@fixer.com","password":"SuperAdmin123!"}'
# Save token as $ADMIN_TOKEN

# 3. Register Customer (auto-approved)
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"customer@test.com","password":"Test123!","phone":"+1111111111","user_type":"customer","first_name":"John","last_name":"Doe"}'
# Should get tokens immediately

# 4. Register Provider (needs approval)
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"provider@test.com","password":"Test123!","phone":"+2222222222","user_type":"provider","first_name":"Jane","last_name":"Smith"}'
# Should get requiresApproval: true

# 5. Get Pending Approvals
curl -X GET http://localhost:3000/api/admin/approvals/pending \
  -H "Authorization: Bearer $ADMIN_TOKEN"
# Copy approval ID

# 6. Approve Provider
curl -X POST http://localhost:3000/api/admin/approvals/{ID}/approve \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"approvalNotes":"Approved"}'

# 7. Provider Login (now works)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"provider@test.com","password":"Test123!"}'
# Should get tokens

# 8. Test Permission Denial
curl -X GET http://localhost:3000/api/admin/approvals/pending \
  -H "Authorization: Bearer $CUSTOMER_TOKEN"
# Should get 403 Forbidden
```

**✅ If all 8 steps work, your auth system is fully functional!**

---

**Quick Reference Version:** 1.0  
**Last Updated:** 2025-10-09

