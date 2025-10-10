# 🎨 Authentication System Visual Flow Diagrams

## 📊 Complete System Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         FIXER AUTH SYSTEM ARCHITECTURE                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                         USER TYPES & ROLES                            │  │
│  ├──────────────────────────────────────────────────────────────────────┤  │
│  │                                                                        │  │
│  │   👑 SUPER ADMIN (54 perms)  ←──── Database Seeded                   │  │
│  │          │                                                             │  │
│  │          ├─→ 🛡️  ADMIN (52 perms)  ←──── Approved by Super Admin    │  │
│  │          │                                                             │  │
│  │          ├─→ 📋 MODERATOR (22 perms) ←── Approved by Admin           │  │
│  │          │                                                             │  │
│  │          ├─→ 🔧 PROVIDER (25 perms)  ←── Approved by Admin           │  │
│  │          │                                                             │  │
│  │          └─→ 🛒 CUSTOMER (19 perms)  ←── Auto-Approved               │  │
│  │                                                                        │  │
│  │              👁️  GUEST (4 perms)     ←── No Auth Required            │  │
│  │                                                                        │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                               │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                     REQUEST FLOW WITH MIDDLEWARE                      │  │
│  ├──────────────────────────────────────────────────────────────────────┤  │
│  │                                                                        │  │
│  │   HTTP Request                                                         │  │
│  │        │                                                               │  │
│  │        ▼                                                               │  │
│  │   [Rate Limiter] ──❌─→ 429 Too Many Requests                        │  │
│  │        │                                                               │  │
│  │        ▼                                                               │  │
│  │   [Input Validation] ──❌─→ 400 Bad Request                          │  │
│  │        │                                                               │  │
│  │        ▼                                                               │  │
│  │   [JWT Authentication] ──❌─→ 401 Unauthorized                        │  │
│  │        │                                                               │  │
│  │        ▼                                                               │  │
│  │   [RBAC Permission Check] ──❌─→ 403 Forbidden                        │  │
│  │        │                                                               │  │
│  │        ▼                                                               │  │
│  │   [Controller] → [Service] → [Repository] → [Database]                │  │
│  │        │                                                               │  │
│  │        ▼                                                               │  │
│  │   200 OK / 201 Created                                                 │  │
│  │                                                                        │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🚦 User Registration & Approval Flows

### Flow 1: Customer Registration (Auto-Approved) ✅

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    CUSTOMER REGISTRATION FLOW                            │
└─────────────────────────────────────────────────────────────────────────┘

   User                    API                     Database              Output
    │                       │                          │                    │
    │                       │                          │                    │
    │  POST /auth/register  │                          │                    │
    ├──────────────────────>│                          │                    │
    │  {user_type:customer} │                          │                    │
    │                       │                          │                    │
    │                       │  Check Email Exists      │                    │
    │                       ├─────────────────────────>│                    │
    │                       │<─────────────────────────┤                    │
    │                       │  ✅ Not Found            │                    │
    │                       │                          │                    │
    │                       │  Hash Password           │                    │
    │                       │  (bcrypt, 12 rounds)     │                    │
    │                       │                          │                    │
    │                       │  Create User             │                    │
    │                       │  approval_status='approved'                   │
    │                       ├─────────────────────────>│                    │
    │                       │<─────────────────────────┤                    │
    │                       │  ✅ User Created         │                    │
    │                       │                          │                    │
    │                       │  Assign "customer" Role  │                    │
    │                       ├─────────────────────────>│                    │
    │                       │<─────────────────────────┤                    │
    │                       │  ✅ Role Assigned        │                    │
    │                       │                          │                    │
    │                       │  Generate JWT Tokens     │                    │
    │                       │  (access + refresh)      │                    │
    │                       │                          │                    │
    │  201 Created          │                          │                    │
    │  + User Data          │                          │                    │
    │  + JWT Tokens         │                          │                    │
    │<──────────────────────┤                          │                    │
    │                       │                          │                    │
    │                       │                          │                    │
    ▼                       ▼                          ▼                    ▼
 ✅ Can login           ✅ Approved               ✅ Role in DB        ✅ Success
 immediately            instantly                 user_roles table     requiresApproval=false
```

---

### Flow 2: Provider Registration (Requires Approval) ⏳

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    PROVIDER REGISTRATION FLOW                            │
└─────────────────────────────────────────────────────────────────────────┘

   Provider                API                     Database              Admin
    │                       │                          │                    │
    │                       │                          │                    │
    │  POST /auth/register  │                          │                    │
    ├──────────────────────>│                          │                    │
    │  {user_type:provider} │                          │                    │
    │                       │                          │                    │
    │                       │  Check Email/Phone       │                    │
    │                       ├─────────────────────────>│                    │
    │                       │<─────────────────────────┤                    │
    │                       │  ✅ Not Found            │                    │
    │                       │                          │                    │
    │                       │  Hash Password           │                    │
    │                       │                          │                    │
    │                       │  Create User             │                    │
    │                       │  approval_status='pending'                    │
    │                       │  is_verified=false       │                    │
    │                       ├─────────────────────────>│                    │
    │                       │<─────────────────────────┤                    │
    │                       │  ✅ User Created         │                    │
    │                       │                          │                    │
    │                       │  Create Approval Request │                    │
    │                       │  status='pending'        │                    │
    │                       ├─────────────────────────>│                    │
    │                       │<─────────────────────────┤                    │
    │                       │  ✅ Approval Created     │                    │
    │                       │                          │                    │
    │                       │  🚫 NO JWT Generated     │                    │
    │                       │  🚫 NO Role Assigned     │                    │
    │                       │                          │                    │
    │  201 Created          │                          │                    │
    │  requiresApproval=true│                          │    📧 Notify       │
    │  tokens=null          │                          │    (future)        │
    │<──────────────────────┤                          ├───────────────────>│
    │                       │                          │                    │
    │                       │                          │                    │
    │  ⏳ Wait for approval │                          │                    │
    │                       │                          │                    │
    │  ❌ Cannot login yet  │                          │  Admin reviews     │
    │                       │                          │                    │
    │                       │  GET /admin/approvals/   │                    │
    │                       │  pending                 │                    │
    │                       │<─────────────────────────┼────────────────────┤
    │                       │  [list of pending users] │                    │
    │                       ├─────────────────────────>│                    │
    │                       │                          │                    │
    │                       │  POST /admin/approvals/  │                    │
    │                       │  {id}/approve            │                    │
    │                       │<─────────────────────────┼────────────────────┤
    │                       │                          │                    │
    │                       │  Update User:            │                    │
    │                       │  approval_status='approved'                   │
    │                       │  is_verified=true        │                    │
    │                       ├─────────────────────────>│                    │
    │                       │                          │                    │
    │                       │  Assign "provider" Role  │                    │
    │                       ├─────────────────────────>│                    │
    │                       │                          │                    │
    │                       │  Update Approval:        │                    │
    │                       │  status='approved'       │                    │
    │                       ├─────────────────────────>│                    │
    │                       │                          │                    │
    │  📧 Email Notification│                          │                    │
    │  "You're approved!"   │                          │                    │
    │<──────────────────────┤                          │                    │
    │                       │                          │                    │
    │                       │                          │                    │
    │  Now POST /auth/login │                          │                    │
    ├──────────────────────>│                          │                    │
    │                       │  ✅ Generate JWT         │                    │
    │  200 OK + tokens      │                          │                    │
    │<──────────────────────┤                          │                    │
    │                       │                          │                    │
    ▼                       ▼                          ▼                    ▼
 ✅ Can now login      ✅ Approved              ✅ Role assigned    ✅ Provider
 and use platform      after review            in database         onboarded
```

---

## 🔐 Login Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         LOGIN AUTHENTICATION FLOW                        │
└─────────────────────────────────────────────────────────────────────────┘

   User                    API                     Database              Output
    │                       │                          │                    │
    │                       │                          │                    │
    │  POST /auth/login     │                          │                    │
    ├──────────────────────>│                          │                    │
    │  {email, password}    │                          │                    │
    │                       │                          │                    │
    │                       │  Find User by Email      │                    │
    │                       ├─────────────────────────>│                    │
    │                       │<─────────────────────────┤                    │
    │                       │  User Record             │                    │
    │                       │                          │                    │
    │                       │  Compare Password        │                    │
    │                       │  bcrypt.compare()        │                    │
    │                       │  ✅ Match                │                    │
    │                       │                          │                    │
    │                       │  Check approval_status   │                    │
    │                       ├─────────────────────────>│                    │
    │                       │<─────────────────────────┤                    │
    │                       │  approval_status='approved' ✅                │
    │                       │                          │                    │
    │                       │  Generate JWT Tokens:    │                    │
    │                       │  - Access Token (15m)    │                    │
    │                       │  - Refresh Token (7d)    │                    │
    │                       │                          │                    │
    │                       │  Payload: {              │                    │
    │                       │    userId,               │                    │
    │                       │    email,                │                    │
    │                       │    userType              │                    │
    │                       │  }                       │                    │
    │                       │                          │                    │
    │  200 OK               │                          │                    │
    │  {                    │                          │                    │
    │    user: {...},       │                          │                    │
    │    tokens: {          │                          │                    │
    │      accessToken,     │                          │                    │
    │      refreshToken     │                          │                    │
    │    }                  │                          │                    │
    │  }                    │                          │                    │
    │<──────────────────────┤                          │                    │
    │                       │                          │                    │
    │                       │                          │                    │
    ▼                       ▼                          ▼                    ▼
 ✅ Store tokens        ✅ Session started       ✅ Auth complete     ✅ Success
 in secure storage      (stateless JWT)         user authenticated   200 OK


┌─────────────────────────────────────────────────────────────────────────┐
│                    FAILED LOGIN SCENARIOS                                │
└─────────────────────────────────────────────────────────────────────────┘

   Scenario                     Reason                         Response
   ────────────────────────────────────────────────────────────────────────

   ❌ User not found            Email doesn't exist            401 Invalid email or password
   
   ❌ Wrong password            Password mismatch              401 Invalid email or password
   
   ❌ Not approved yet          approval_status='pending'      401 Account pending approval
   
   ❌ Account rejected          approval_status='rejected'     401 Account application rejected
   
   ❌ Rate limit exceeded       Too many login attempts        429 Too many requests
```

---

## 🔑 Permission Check Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│              RBAC PERMISSION CHECK MIDDLEWARE FLOW                       │
└─────────────────────────────────────────────────────────────────────────┘

   Request                 Middleware              Database              Response
    │                       │                          │                    │
    │  GET /admin/approvals │                          │                    │
    │  Authorization: Bearer│                          │                    │
    │  <JWT>                │                          │                    │
    ├──────────────────────>│                          │                    │
    │                       │                          │                    │
    │                       │  [authenticateToken]     │                    │
    │                       │  1. Extract JWT          │                    │
    │                       │  2. Verify signature     │                    │
    │                       │  3. Check expiration     │                    │
    │                       │  ✅ Valid                │                    │
    │                       │  Extract userId          │                    │
    │                       │                          │                    │
    │                       │  [requirePermission]     │                    │
    │                       │  Required: user:approve  │                    │
    │                       │                          │                    │
    │                       │  Query user_roles        │                    │
    │                       ├─────────────────────────>│                    │
    │                       │<─────────────────────────┤                    │
    │                       │  user has role_id: X     │                    │
    │                       │                          │                    │
    │                       │  Query role_permissions  │                    │
    │                       ├─────────────────────────>│                    │
    │                       │<─────────────────────────┤                    │
    │                       │  role X has permissions: │                    │
    │                       │  [user:create,           │                    │
    │                       │   user:read,             │                    │
    │                       │   user:approve, ...]     │                    │
    │                       │                          │                    │
    │                       │  Check if user:approve   │                    │
    │                       │  in permissions list     │                    │
    │                       │  ✅ FOUND                │                    │
    │                       │                          │                    │
    │                       │  ✅ Allow request        │                    │
    │                       │  Pass to controller      │                    │
    │                       │                          │                    │
    │  200 OK               │                          │                    │
    │  [pending approvals]  │                          │                    │
    │<──────────────────────┤                          │                    │
    │                       │                          │                    │
    ▼                       ▼                          ▼                    ▼


┌─────────────────────────────────────────────────────────────────────────┐
│                    PERMISSION DENIED SCENARIO                            │
└─────────────────────────────────────────────────────────────────────────┘

   Customer                Middleware              Database              Response
    │                       │                          │                    │
    │  GET /admin/approvals │                          │                    │
    │  Authorization: Bearer│                          │                    │
    │  <CUSTOMER_JWT>       │                          │                    │
    ├──────────────────────>│                          │                    │
    │                       │                          │                    │
    │                       │  [authenticateToken]     │                    │
    │                       │  ✅ Valid JWT            │                    │
    │                       │  userId extracted        │                    │
    │                       │                          │                    │
    │                       │  [requirePermission]     │                    │
    │                       │  Required: user:approve  │                    │
    │                       │                          │                    │
    │                       │  Query user roles        │                    │
    │                       ├─────────────────────────>│                    │
    │                       │<─────────────────────────┤                    │
    │                       │  role: "customer"        │                    │
    │                       │                          │                    │
    │                       │  Query customer perms    │                    │
    │                       ├─────────────────────────>│                    │
    │                       │<─────────────────────────┤                    │
    │                       │  permissions: [          │                    │
    │                       │   service_request:create,│                    │
    │                       │   quote:read,            │                    │
    │                       │   booking:create, ...    │                    │
    │                       │  ]                       │                    │
    │                       │                          │                    │
    │                       │  Check if user:approve   │                    │
    │                       │  in permissions list     │                    │
    │                       │  ❌ NOT FOUND            │                    │
    │                       │                          │                    │
    │  403 Forbidden        │                          │                    │
    │  {                    │                          │                    │
    │    success: false,    │                          │                    │
    │    message: "Permission denied"                  │                    │
    │  }                    │                          │                    │
    │<──────────────────────┤                          │                    │
    │                       │                          │                    │
    ▼                       ▼                          ▼                    ▼
 ❌ Access Denied       ❌ Permission missing    ❌ Authorization      ❌ Forbidden
 Cannot approve users   customer role lacks     failed                403 Error
                        user:approve
```

---

## 🔄 Token Refresh Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     JWT TOKEN REFRESH FLOW                               │
└─────────────────────────────────────────────────────────────────────────┘

   Client                  API                     Database              Output
    │                       │                          │                    │
    │  Access Token Expired │                          │                    │
    │  ❌ 401 Unauthorized  │                          │                    │
    │                       │                          │                    │
    │  POST /auth/refresh   │                          │                    │
    ├──────────────────────>│                          │                    │
    │  {refreshToken}       │                          │                    │
    │                       │                          │                    │
    │                       │  Verify Refresh Token    │                    │
    │                       │  - Signature valid?      │                    │
    │                       │  - Not expired?          │                    │
    │                       │  ✅ Valid                │                    │
    │                       │                          │                    │
    │                       │  Extract userId          │                    │
    │                       │                          │                    │
    │                       │  Get User                │                    │
    │                       ├─────────────────────────>│                    │
    │                       │<─────────────────────────┤                    │
    │                       │  User still exists ✅    │                    │
    │                       │                          │                    │
    │                       │  Generate NEW Tokens:    │                    │
    │                       │  - New Access Token      │                    │
    │                       │  - New Refresh Token     │                    │
    │                       │                          │                    │
    │  200 OK               │                          │                    │
    │  {                    │                          │                    │
    │    tokens: {          │                          │                    │
    │      accessToken,     │                          │                    │
    │      refreshToken     │                          │                    │
    │    }                  │                          │                    │
    │  }                    │                          │                    │
    │<──────────────────────┤                          │                    │
    │                       │                          │                    │
    │  Store new tokens     │                          │                    │
    │  Continue using API   │                          │                    │
    │                       │                          │                    │
    ▼                       ▼                          ▼                    ▼
 ✅ New tokens          ✅ Session extended     ✅ User verified      ✅ Success
 replaced old ones      without re-login       still active          seamless
```

---

## 🏗️ Database Relationships

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      RBAC DATABASE SCHEMA                                │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────────┐
│     users        │
├──────────────────┤
│ id (PK)          │◄────────┐
│ email            │         │
│ password_hash    │         │
│ user_type        │         │
│ approval_status  │         │
│ is_verified      │         │
└──────────────────┘         │
         │                    │
         │                    │
         │                    │
         ▼                    │
┌──────────────────┐         │
│   user_roles     │         │
├──────────────────┤         │
│ id (PK)          │         │
│ user_id (FK) ────┼─────────┘
│ role_id (FK) ────┼─────────┐
│ assigned_by      │         │
│ is_active        │         │
│ expires_at       │         │
└──────────────────┘         │
                              │
                              ▼
                    ┌──────────────────┐
                    │      roles       │
                    ├──────────────────┤
                    │ id (PK)          │◄────────┐
                    │ name             │         │
                    │ description      │         │
                    │ is_active        │         │
                    └──────────────────┘         │
                              │                   │
                              │                   │
                              ▼                   │
                    ┌──────────────────┐         │
                    │ role_permissions │         │
                    ├──────────────────┤         │
                    │ id (PK)          │         │
                    │ role_id (FK) ────┼─────────┘
                    │ permission_id (FK)──┐
                    │ granted          │  │
                    │ conditions       │  │
                    └──────────────────┘  │
                                           │
                                           ▼
                                 ┌──────────────────┐
                                 │   permissions    │
                                 ├──────────────────┤
                                 │ id (PK)          │
                                 │ name             │
                                 │ resource         │
                                 │ action           │
                                 │ is_active        │
                                 └──────────────────┘

┌──────────────────┐
│ user_approvals   │
├──────────────────┤
│ id (PK)          │
│ user_id (FK) ────┼────► users.id
│ requested_role   │
│ status           │  (pending | approved | rejected)
│ requested_by     │
│ approved_by      │
│ rejected_by      │
│ approval_notes   │
│ rejection_reason │
└──────────────────┘


┌─────────────────────────────────────────────────────────────────────────┐
│                      PERMISSION RESOLUTION                               │
└─────────────────────────────────────────────────────────────────────────┘

User wants to perform action "user:approve"
    │
    ├─► Get user_id from JWT token
    │
    ├─► Query user_roles WHERE user_id = ? AND is_active = true
    │   └─► role_ids: [role_1, role_2, ...]
    │
    ├─► Query role_permissions WHERE role_id IN (role_1, role_2, ...) 
    │                              AND granted = true
    │   └─► permission_ids: [perm_1, perm_2, ...]
    │
    ├─► Query permissions WHERE id IN (perm_1, perm_2, ...) 
    │                         AND is_active = true
    │   └─► permission_names: ['user:read', 'user:approve', ...]
    │
    └─► Check if 'user:approve' in permission_names
        ├─► YES ✅ → Allow request
        └─► NO  ❌ → 403 Forbidden
```

---

## 🎯 Complete User Journey Map

```
┌─────────────────────────────────────────────────────────────────────────┐
│               COMPLETE USER LIFECYCLE                                    │
└─────────────────────────────────────────────────────────────────────────┘

SUPER ADMIN (Bootstrap)
    ↓
    │ Created via: node scripts/seed-rbac.js
    │ Status: Approved
    │ Role: super_admin
    │ Can Login: ✅ Yes
    │
    ├─► Can approve: ✅ Admins, Providers, Moderators
    ├─► Can create: ✅ Any resource
    ├─► Can delete: ✅ Any resource
    └─► Can config: ✅ System settings


ADMIN (Requires Super Admin Approval)
    ↓
    │ Created via: POST /api/auth/register/admin (by Super Admin)
    │ Status: Pending → Approved (by Super Admin)
    │ Role: admin (after approval)
    │ Can Login: ❌ No → ✅ Yes (after approval)
    │
    ├─► Can approve: ✅ Providers, Moderators
    ├─► Can create: ✅ Most resources (not system config)
    ├─► Can delete: ✅ Users, Products, etc.
    └─► Can view: ✅ Analytics, Reports


MODERATOR (Requires Admin Approval)
    ↓
    │ Created via: POST /api/auth/register
    │ Status: Pending → Approved (by Admin)
    │ Role: moderator (after approval)
    │ Can Login: ❌ No → ✅ Yes (after approval)
    │
    ├─► Can approve: ❌ No users
    ├─► Can verify: ✅ Providers, Users
    ├─► Can update: ✅ Status fields only
    └─► Can view: ✅ Analytics


PROVIDER (Requires Admin Approval)
    ↓
    │ Created via: POST /api/auth/register
    │ Status: Pending → Approved (by Admin)
    │ Role: provider (after approval)
    │ Can Login: ❌ No → ✅ Yes (after approval)
    │
    ├─► Can create: ✅ Quotes, Products
    ├─► Can manage: ✅ Own bookings
    ├─► Can view: ✅ Service requests
    └─► Can process: ❌ Payments (view only)


CUSTOMER (Auto-Approved)
    ↓
    │ Created via: POST /api/auth/register
    │ Status: Approved (immediately)
    │ Role: customer (immediately)
    │ Can Login: ✅ Yes (immediately)
    │
    ├─► Can create: ✅ Service requests, Bookings
    ├─► Can accept: ✅ Quotes
    ├─► Can pay: ✅ Process payments
    └─► Can view: ✅ Public products/services


GUEST (No Account)
    ↓
    │ No registration needed
    │ Status: N/A
    │ Role: guest (implicit)
    │ Can Login: ❌ No account
    │
    ├─► Can view: ✅ Products (read-only)
    ├─► Can view: ✅ Categories (read-only)
    └─► Can create: ❌ Nothing


┌─────────────────────────────────────────────────────────────────────────┐
│                    APPROVAL WORKFLOW STATES                              │
└─────────────────────────────────────────────────────────────────────────┘

[User Registers]
        │
        ▼
    user_type?
        │
    ┌───┴─────────────────┬──────────────────┐
    │                      │                   │
Customer                Provider            Admin
    │                      │                   │
    ▼                      ▼                   ▼
approval_status       approval_status     approval_status
= 'approved'          = 'pending'         = 'pending'
    │                      │                   │
    ▼                      ▼                   ▼
✅ Role assigned       ⏳ No role yet       ⏳ No role yet
✅ JWT tokens          ❌ No tokens         ❌ No tokens
✅ Can login           ❌ Cannot login      ❌ Cannot login
    │                      │                   │
    │                      ▼                   ▼
    │              [Admin Reviews]     [Super Admin Reviews]
    │                      │                   │
    │                      ▼                   ▼
    │              Approve/Reject       Approve/Reject
    │                      │                   │
    │              ┌───────┴───────┐   ┌───────┴───────┐
    │              │               │   │               │
    │          Approved        Rejected  Approved   Rejected
    │              │               │   │               │
    │              ▼               ▼   ▼               ▼
    │          ✅ Role        ❌ No    ✅ Role     ❌ No
    │          assigned       access  assigned    access
    │          ✅ Can login   ❌ Login ✅ Can      ❌ Login
    │                         denied  login       denied
    │
    └──► [All Can Use Platform According to Role Permissions]
```

---

**Diagram Version:** 1.0  
**Last Updated:** 2025-10-09  
**Note:** These diagrams are best viewed in a monospace font or markdown viewer

