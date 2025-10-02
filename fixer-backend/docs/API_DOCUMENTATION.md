# 🔌 API Documentation

This document provides comprehensive API documentation for the Fixer Marketplace backend, including all endpoints, request/response formats, and usage examples.

## 📋 Base Information

- **Base URL**: `https://api.fixer.com` (Production)
- **Base URL**: `http://localhost:3000` (Development)
- **API Version**: v1
- **Content Type**: `application/json`
- **Authentication**: Bearer Token (JWT)

## 🔐 Authentication

### Token Format
```
Authorization: Bearer <jwt_token>
```

### Token Types
- **Access Token**: Short-lived (1 hour), used for API requests
- **Refresh Token**: Long-lived (7 days), used to get new access tokens

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": { ... }
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## 🔑 Authentication Endpoints

### POST /api/auth/register

Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "phone": "+1234567890",
  "firstName": "John",
  "lastName": "Doe",
  "userType": "customer"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "userType": "customer",
      "isVerified": false
    },
    "tokens": {
      "accessToken": "jwt_token",
      "refreshToken": "refresh_token"
    }
  }
}
```

### POST /api/auth/login

Authenticate user and get tokens.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "tokens": {
      "accessToken": "jwt_token",
      "refreshToken": "refresh_token"
    }
  }
}
```

### POST /api/auth/refresh

Get new access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "refresh_token"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "new_jwt_token"
  }
}
```

### POST /api/auth/logout

Logout user and invalidate tokens.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### POST /api/auth/forgot-password

Request password reset.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

### POST /api/auth/reset-password

Reset password with token.

**Request Body:**
```json
{
  "token": "reset_token",
  "newPassword": "newpassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

## 👥 User Management Endpoints

### GET /api/users

Get all users (Admin only).

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `userType` (optional): Filter by user type
- `search` (optional): Search by name or email

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "uuid",
        "email": "user@example.com",
        "firstName": "John",
        "lastName": "Doe",
        "userType": "customer",
        "isVerified": true,
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPages": 10
    }
  }
}
```

### GET /api/users/:id

Get user by ID.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "userType": "customer",
    "isVerified": true,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### PUT /api/users/:id

Update user information.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "phone": "+1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Smith",
    "phone": "+1234567890",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

### GET /api/users/profile

Get current user profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "userType": "customer",
    "isVerified": true,
    "profilePicture": "https://example.com/avatar.jpg",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

## 🛠️ Service Requests Endpoints

### GET /api/service-requests

Get service requests.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `status` (optional): Filter by status
- `serviceType` (optional): Filter by service type
- `customerId` (optional): Filter by customer (Admin only)

**Response:**
```json
{
  "success": true,
  "data": {
    "serviceRequests": [
      {
        "id": "uuid",
        "title": "Fix leaky faucet",
        "description": "Kitchen faucet is leaking",
        "serviceType": "plumbing",
        "status": "open",
        "urgency": "medium",
        "budgetMin": 50.00,
        "budgetMax": 100.00,
        "location": {
          "address": "123 Main St",
          "city": "New York",
          "state": "NY",
          "zipCode": "10001"
        },
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": { ... }
  }
}
```

### POST /api/service-requests

Create new service request.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Fix leaky faucet",
  "description": "Kitchen faucet is leaking and needs repair",
  "serviceType": "plumbing",
  "urgency": "medium",
  "budgetMin": 50.00,
  "budgetMax": 100.00,
  "preferredDate": "2024-01-20",
  "preferredTime": "14:00",
  "location": {
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "coordinates": {
      "lat": 40.7128,
      "lng": -74.0060
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Fix leaky faucet",
    "status": "open",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### GET /api/service-requests/:id

Get service request by ID.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Fix leaky faucet",
    "description": "Kitchen faucet is leaking",
    "serviceType": "plumbing",
    "status": "open",
    "urgency": "medium",
    "budgetMin": 50.00,
    "budgetMax": 100.00,
    "location": { ... },
    "quotes": [
      {
        "id": "uuid",
        "providerId": "uuid",
        "amount": 75.00,
        "description": "Will fix the leak and replace washer",
        "status": "pending",
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### PUT /api/service-requests/:id

Update service request.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Fix leaky faucet - Updated",
  "description": "Kitchen faucet is leaking and needs repair. Also check for other leaks.",
  "urgency": "high"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Fix leaky faucet - Updated",
    "urgency": "high",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

## 🏢 Service Providers Endpoints

### GET /api/providers

Get service providers.

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `serviceType` (optional): Filter by service type
- `verificationStatus` (optional): Filter by verification status
- `minRating` (optional): Minimum rating filter
- `location` (optional): Filter by location

**Response:**
```json
{
  "success": true,
  "data": {
    "providers": [
      {
        "id": "uuid",
        "businessName": "ABC Plumbing",
        "servicesOffered": ["plumbing", "repair"],
        "serviceAreas": ["New York", "Brooklyn"],
        "verificationStatus": "verified",
        "rating": 4.5,
        "totalReviews": 25,
        "yearsExperience": 10,
        "bio": "Professional plumbing services",
        "user": {
          "firstName": "John",
          "lastName": "Smith",
          "profilePicture": "https://example.com/avatar.jpg"
        }
      }
    ],
    "pagination": { ... }
  }
}
```

### POST /api/providers

Create service provider profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "businessName": "ABC Plumbing",
  "businessLicense": "LIC123456",
  "servicesOffered": ["plumbing", "repair"],
  "serviceAreas": ["New York", "Brooklyn"],
  "yearsExperience": 10,
  "bio": "Professional plumbing services with 10 years experience"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "businessName": "ABC Plumbing",
    "verificationStatus": "pending",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### GET /api/providers/:id

Get provider by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "businessName": "ABC Plumbing",
    "servicesOffered": ["plumbing", "repair"],
    "serviceAreas": ["New York", "Brooklyn"],
    "verificationStatus": "verified",
    "rating": 4.5,
    "totalReviews": 25,
    "yearsExperience": 10,
    "bio": "Professional plumbing services",
    "reviews": [
      {
        "id": "uuid",
        "rating": 5,
        "comment": "Excellent service!",
        "customer": {
          "firstName": "Jane",
          "lastName": "Doe"
        },
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

## 💰 Quotes Endpoints

### GET /api/quotes

Get quotes.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `status` (optional): Filter by status
- `serviceRequestId` (optional): Filter by service request
- `providerId` (optional): Filter by provider

**Response:**
```json
{
  "success": true,
  "data": {
    "quotes": [
      {
        "id": "uuid",
        "serviceRequestId": "uuid",
        "providerId": "uuid",
        "amount": 75.00,
        "description": "Will fix the leak and replace washer",
        "estimatedDuration": 60,
        "status": "pending",
        "validUntil": "2024-01-22T10:30:00Z",
        "provider": {
          "businessName": "ABC Plumbing",
          "rating": 4.5
        },
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": { ... }
  }
}
```

### POST /api/quotes

Create quote for service request.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "serviceRequestId": "uuid",
  "amount": 75.00,
  "description": "Will fix the leak and replace washer",
  "estimatedDuration": 60,
  "validUntil": "2024-01-22T10:30:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "serviceRequestId": "uuid",
    "amount": 75.00,
    "status": "pending",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### PUT /api/quotes/:id/accept

Accept a quote.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "accepted",
    "bookingId": "uuid",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

## 📅 Bookings Endpoints

### GET /api/bookings

Get bookings.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `status` (optional): Filter by status
- `customerId` (optional): Filter by customer
- `providerId` (optional): Filter by provider

**Response:**
```json
{
  "success": true,
  "data": {
    "bookings": [
      {
        "id": "uuid",
        "serviceRequestId": "uuid",
        "customerId": "uuid",
        "providerId": "uuid",
        "scheduledDate": "2024-01-20",
        "scheduledTime": "14:00",
        "duration": 60,
        "totalAmount": 75.00,
        "status": "scheduled",
        "serviceRequest": {
          "title": "Fix leaky faucet",
          "serviceType": "plumbing"
        },
        "provider": {
          "businessName": "ABC Plumbing"
        },
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": { ... }
  }
}
```

### GET /api/bookings/:id

Get booking by ID.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "scheduledDate": "2024-01-20",
    "scheduledTime": "14:00",
    "duration": 60,
    "totalAmount": 75.00,
    "status": "scheduled",
    "notes": "Please ring doorbell twice",
    "serviceRequest": {
      "id": "uuid",
      "title": "Fix leaky faucet",
      "description": "Kitchen faucet is leaking",
      "serviceType": "plumbing",
      "location": { ... }
    },
    "provider": {
      "id": "uuid",
      "businessName": "ABC Plumbing",
      "rating": 4.5,
      "user": {
        "firstName": "John",
        "lastName": "Smith",
        "phone": "+1234567890"
      }
    },
    "customer": {
      "id": "uuid",
      "firstName": "Jane",
      "lastName": "Doe",
      "phone": "+1234567890"
    }
  }
}
```

### PUT /api/bookings/:id/status

Update booking status.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "completed",
  "notes": "Service completed successfully"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "completed",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

## 💳 Payment Endpoints

### POST /api/payments/create-intent

Create payment intent.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "bookingId": "uuid",
  "amount": 75.00,
  "currency": "USD",
  "paymentMethod": "card"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "clientSecret": "pi_xxx_secret_xxx",
    "paymentIntentId": "pi_xxx"
  }
}
```

### POST /api/payments/confirm

Confirm payment.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "paymentIntentId": "pi_xxx",
  "bookingId": "uuid"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "completed",
    "amount": 75.00,
    "transactionId": "txn_xxx"
  }
}
```

## 📦 Product Endpoints

### GET /api/products

Get products.

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `categoryId` (optional): Filter by category
- `providerId` (optional): Filter by provider
- `search` (optional): Search term
- `isFeatured` (optional): Filter featured products

**Response:**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "uuid",
        "name": "Professional Wrench Set",
        "description": "Complete wrench set for plumbing",
        "sku": "WRENCH-001",
        "price": 49.99,
        "stockQuantity": 10,
        "status": "active",
        "isFeatured": true,
        "images": ["https://example.com/wrench1.jpg"],
        "category": {
          "id": "uuid",
          "name": "Tools"
        },
        "provider": {
          "businessName": "ABC Plumbing"
        }
      }
    ],
    "pagination": { ... }
  }
}
```

### POST /api/products

Create product.

**Headers:**
```
Authorization: Bearer <provider_token>
```

**Request Body:**
```json
{
  "name": "Professional Wrench Set",
  "description": "Complete wrench set for plumbing",
  "sku": "WRENCH-001",
  "categoryId": "uuid",
  "price": 49.99,
  "stockQuantity": 10,
  "isFeatured": false,
  "images": ["https://example.com/wrench1.jpg"],
  "specifications": {
    "material": "Steel",
    "weight": "2.5 lbs",
    "warranty": "1 year"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Professional Wrench Set",
    "sku": "WRENCH-001",
    "price": 49.99,
    "status": "active",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

## 🏷️ Category Endpoints

### GET /api/categories

Get categories.

**Query Parameters:**
- `parentId` (optional): Filter by parent category
- `status` (optional): Filter by status

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Plumbing",
      "description": "Plumbing tools and supplies",
      "parentId": null,
      "status": "active",
      "subcategories": [
        {
          "id": "uuid",
          "name": "Wrenches",
          "description": "Various types of wrenches",
          "parentId": "uuid",
          "status": "active"
        }
      ]
    }
  ]
}
```

## 📊 Analytics Endpoints

### GET /api/analytics/dashboard

Get dashboard analytics (Admin only).

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalUsers": 1250,
      "totalProviders": 150,
      "totalServiceRequests": 5000,
      "totalBookings": 3500,
      "totalRevenue": 125000.00
    },
    "recentActivity": [
      {
        "type": "new_booking",
        "description": "New booking created",
        "timestamp": "2024-01-15T10:30:00Z"
      }
    ],
    "serviceStats": [
      {
        "serviceType": "plumbing",
        "totalRequests": 500,
        "completedRequests": 450,
        "averageRating": 4.5
      }
    ]
  }
}
```

## 🔍 Search Endpoints

### GET /api/search

Global search across all entities.

**Query Parameters:**
- `q` (required): Search query
- `type` (optional): Entity type (users, providers, services, products)
- `page` (optional): Page number
- `limit` (optional): Items per page

**Response:**
```json
{
  "success": true,
  "data": {
    "results": [
      {
        "type": "provider",
        "id": "uuid",
        "title": "ABC Plumbing",
        "description": "Professional plumbing services",
        "rating": 4.5
      }
    ],
    "pagination": { ... }
  }
}
```

## 🚨 Error Codes

| Code | Description | HTTP Status |
|------|-------------|-------------|
| `VALIDATION_ERROR` | Input validation failed | 400 |
| `UNAUTHORIZED` | Authentication required | 401 |
| `FORBIDDEN` | Insufficient permissions | 403 |
| `NOT_FOUND` | Resource not found | 404 |
| `CONFLICT` | Resource already exists | 409 |
| `RATE_LIMITED` | Too many requests | 429 |
| `INTERNAL_ERROR` | Server error | 500 |

## 📈 Rate Limiting

- **General API**: 100 requests per 15 minutes
- **Authentication**: 5 requests per 15 minutes
- **File Upload**: 10 requests per 15 minutes
- **Search**: 50 requests per 15 minutes

## 🔒 Security Headers

All responses include security headers:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security: max-age=31536000`

This API documentation provides comprehensive coverage of all available endpoints and their usage patterns for the Fixer Marketplace platform.
