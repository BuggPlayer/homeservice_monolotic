# 📚 Fixer Marketplace - Complete API Documentation

This document provides comprehensive documentation for all API endpoints in the Fixer Marketplace platform.

## 📋 Table of Contents

- [Base URL and Authentication](#base-url-and-authentication)
- [Response Format](#response-format)
- [Error Handling](#error-handling)
- [Authentication Endpoints](#authentication-endpoints)
- [User Management Endpoints](#user-management-endpoints)
- [Service Request Endpoints](#service-request-endpoints)
- [Service Provider Endpoints](#service-provider-endpoints)
- [Booking Endpoints](#booking-endpoints)
- [Quote Endpoints](#quote-endpoints)
- [Product Endpoints](#product-endpoints)
- [Payment Endpoints](#payment-endpoints)
- [Communication Endpoints](#communication-endpoints)
- [WebSocket Events](#websocket-events)
- [Rate Limiting](#rate-limiting)
- [Testing Examples](#testing-examples)

## 🌐 Base URL and Authentication

### Base URL
```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

### Authentication
Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```http
Authorization: Bearer <access_token>
```

### Token Types
- **Access Token**: Short-lived (15 minutes) for API requests
- **Refresh Token**: Long-lived (7 days) for token renewal

## 📄 Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data here
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

### Paginated Response
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": {
    "items": [
      // Array of items
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "pages": 10,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

## ❌ Error Handling

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `429` - Rate Limited
- `500` - Internal Server Error

### Common Error Messages
```json
{
  "success": false,
  "message": "Validation failed",
  "error": "Email is required"
}
```

## 🔐 Authentication Endpoints

### POST /api/auth/register
Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "role": "customer",
  "phone": "+1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "customer",
      "isVerified": false
    },
    "accessToken": "jwt_access_token",
    "refreshToken": "jwt_refresh_token"
  }
}
```

### POST /api/auth/login
Login with email and password.

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
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "customer",
      "isVerified": true
    },
    "accessToken": "jwt_access_token",
    "refreshToken": "jwt_refresh_token"
  }
}
```

### POST /api/auth/refresh-token
Refresh access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "jwt_refresh_token"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "new_jwt_access_token",
    "refreshToken": "new_jwt_refresh_token"
  }
}
```

### GET /api/auth/profile
Get current user profile.

**Headers:**
```http
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "customer",
    "phone": "+1234567890",
    "avatarUrl": "https://example.com/avatar.jpg",
    "isVerified": true,
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### PUT /api/auth/profile
Update user profile.

**Headers:**
```http
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "name": "John Smith",
  "phone": "+1234567891",
  "avatarUrl": "https://example.com/new-avatar.jpg"
}
```

### PUT /api/auth/change-password
Change user password.

**Headers:**
```http
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123"
}
```

### POST /api/auth/logout
Logout user (client-side token removal).

**Headers:**
```http
Authorization: Bearer <access_token>
```

## 👥 User Management Endpoints

### GET /api/users
Get all users (admin only).

**Headers:**
```http
Authorization: Bearer <admin_access_token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `role` (optional): Filter by role
- `search` (optional): Search term

**Response:**
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": {
    "items": [
      {
        "id": "uuid",
        "email": "user@example.com",
        "name": "John Doe",
        "role": "customer",
        "isVerified": true,
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "pages": 5
    }
  }
}
```

### GET /api/users/:id
Get user by ID.

**Headers:**
```http
Authorization: Bearer <access_token>
```

### PUT /api/users/:id
Update user (admin or own profile).

**Headers:**
```http
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "name": "Updated Name",
  "role": "provider",
  "isActive": true
}
```

## 🛠️ Service Request Endpoints

### POST /api/service-requests
Create a new service request.

**Headers:**
```http
Authorization: Bearer <customer_access_token>
```

**Request Body:**
```json
{
  "title": "Fix leaky faucet",
  "description": "Kitchen faucet is leaking and needs repair",
  "serviceType": "plumbing",
  "urgency": "medium",
  "preferredDate": "2024-01-15",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "coordinates": {
      "lat": 40.7128,
      "lng": -74.0060
    }
  },
  "estimatedBudget": 150.00,
  "images": ["https://example.com/image1.jpg"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Service request created successfully",
  "data": {
    "id": "uuid",
    "title": "Fix leaky faucet",
    "description": "Kitchen faucet is leaking and needs repair",
    "serviceType": "plumbing",
    "status": "pending",
    "urgency": "medium",
    "customer": {
      "id": "uuid",
      "name": "John Doe"
    },
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### GET /api/service-requests
Get service requests with filtering and pagination.

**Headers:**
```http
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by status (pending, in_progress, completed, cancelled)
- `serviceType` (optional): Filter by service type
- `urgency` (optional): Filter by urgency (low, medium, high)
- `city` (optional): Filter by city
- `state` (optional): Filter by state
- `search` (optional): Search term

**Response:**
```json
{
  "success": true,
  "message": "Service requests retrieved successfully",
  "data": {
    "items": [
      {
        "id": "uuid",
        "title": "Fix leaky faucet",
        "description": "Kitchen faucet is leaking",
        "serviceType": "plumbing",
        "status": "pending",
        "urgency": "medium",
        "customer": {
          "id": "uuid",
          "name": "John Doe"
        },
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "pages": 3
    }
  }
}
```

### GET /api/service-requests/:id
Get service request by ID.

**Headers:**
```http
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Service request retrieved successfully",
  "data": {
    "id": "uuid",
    "title": "Fix leaky faucet",
    "description": "Kitchen faucet is leaking and needs repair",
    "serviceType": "plumbing",
    "status": "pending",
    "urgency": "medium",
    "preferredDate": "2024-01-15",
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001"
    },
    "estimatedBudget": 150.00,
    "customer": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890"
    },
    "quotes": [
      {
        "id": "uuid",
        "provider": {
          "id": "uuid",
          "name": "ABC Plumbing"
        },
        "amount": 120.00,
        "status": "pending"
      }
    ],
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

### PUT /api/service-requests/:id
Update service request.

**Headers:**
```http
Authorization: Bearer <customer_access_token>
```

**Request Body:**
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "urgency": "high"
}
```

### PATCH /api/service-requests/:id/status
Update service request status.

**Headers:**
```http
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "status": "in_progress",
  "notes": "Work started"
}
```

## 👨‍🔧 Service Provider Endpoints

### POST /api/providers
Create service provider profile.

**Headers:**
```http
Authorization: Bearer <provider_access_token>
```

**Request Body:**
```json
{
  "businessName": "ABC Plumbing Services",
  "description": "Professional plumbing services",
  "serviceTypes": ["plumbing", "repair"],
  "licenseNumber": "PL123456",
  "insuranceInfo": {
    "provider": "ABC Insurance",
    "policyNumber": "POL123456",
    "expiryDate": "2024-12-31"
  },
  "address": {
    "street": "456 Service St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10002"
  },
  "phone": "+1234567890",
  "website": "https://abcplumbing.com",
  "hourlyRate": 75.00,
  "availability": {
    "monday": { "start": "09:00", "end": "17:00" },
    "tuesday": { "start": "09:00", "end": "17:00" },
    "wednesday": { "start": "09:00", "end": "17:00" },
    "thursday": { "start": "09:00", "end": "17:00" },
    "friday": { "start": "09:00", "end": "17:00" }
  }
}
```

### GET /api/providers
Get service providers with filtering.

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `verificationStatus` (optional): Filter by verification status
- `serviceType` (optional): Filter by service type
- `location` (optional): Filter by location
- `search` (optional): Search term

**Response:**
```json
{
  "success": true,
  "message": "Service providers retrieved successfully",
  "data": {
    "items": [
      {
        "id": "uuid",
        "businessName": "ABC Plumbing Services",
        "description": "Professional plumbing services",
        "serviceTypes": ["plumbing", "repair"],
        "verificationStatus": "verified",
        "rating": 4.8,
        "reviewCount": 25,
        "hourlyRate": 75.00,
        "location": "New York, NY"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 15,
      "pages": 2
    }
  }
}
```

### GET /api/providers/:id
Get service provider by ID.

**Response:**
```json
{
  "success": true,
  "message": "Service provider retrieved successfully",
  "data": {
    "id": "uuid",
    "businessName": "ABC Plumbing Services",
    "description": "Professional plumbing services",
    "serviceTypes": ["plumbing", "repair"],
    "licenseNumber": "PL123456",
    "verificationStatus": "verified",
    "rating": 4.8,
    "reviewCount": 25,
    "hourlyRate": 75.00,
    "address": {
      "street": "456 Service St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10002"
    },
    "phone": "+1234567890",
    "website": "https://abcplumbing.com",
    "availability": {
      "monday": { "start": "09:00", "end": "17:00" }
    },
    "reviews": [
      {
        "id": "uuid",
        "customer": {
          "name": "John Doe"
        },
        "rating": 5,
        "comment": "Excellent service!",
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
```

## 📅 Booking Endpoints

### POST /api/bookings
Create a new booking.

**Headers:**
```http
Authorization: Bearer <customer_access_token>
```

**Request Body:**
```json
{
  "serviceRequestId": "uuid",
  "providerId": "uuid",
  "scheduledDate": "2024-01-15T10:00:00Z",
  "duration": 120,
  "notes": "Please bring extra tools"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "id": "uuid",
    "serviceRequest": {
      "id": "uuid",
      "title": "Fix leaky faucet"
    },
    "provider": {
      "id": "uuid",
      "businessName": "ABC Plumbing Services"
    },
    "scheduledDate": "2024-01-15T10:00:00Z",
    "duration": 120,
    "status": "scheduled",
    "notes": "Please bring extra tools",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### GET /api/bookings
Get bookings with filtering.

**Headers:**
```http
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `status` (optional): Filter by status
- `customerId` (optional): Filter by customer ID
- `providerId` (optional): Filter by provider ID
- `startDate` (optional): Filter by start date
- `endDate` (optional): Filter by end date

### GET /api/bookings/:id
Get booking by ID.

### PUT /api/bookings/:id
Update booking.

### PATCH /api/bookings/:id/status
Update booking status.

**Request Body:**
```json
{
  "status": "completed",
  "notes": "Work completed successfully"
}
```

## 💰 Quote Endpoints

### POST /api/quotes
Create a new quote.

**Headers:**
```http
Authorization: Bearer <provider_access_token>
```

**Request Body:**
```json
{
  "serviceRequestId": "uuid",
  "amount": 120.00,
  "description": "Replace faucet and fix leak",
  "estimatedDuration": 90,
  "materials": [
    {
      "name": "New faucet",
      "cost": 50.00
    },
    {
      "name": "Pipe fittings",
      "cost": 20.00
    }
  ],
  "laborCost": 50.00,
  "validUntil": "2024-01-20T00:00:00Z"
}
```

### GET /api/quotes
Get quotes with filtering.

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `status` (optional): Filter by status
- `serviceRequestId` (optional): Filter by service request
- `providerId` (optional): Filter by provider

### GET /api/quotes/:id
Get quote by ID.

### PUT /api/quotes/:id
Update quote.

### PATCH /api/quotes/:id/status
Update quote status (accept/reject).

**Request Body:**
```json
{
  "status": "accepted",
  "notes": "Quote accepted by customer"
}
```

## 🛍️ Product Endpoints

### GET /api/products
Get all products with filtering.

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `category` (optional): Filter by category
- `search` (optional): Search term
- `sortBy` (optional): Sort field (name, price, createdAt)
- `sortOrder` (optional): Sort direction (asc, desc)

**Response:**
```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": {
    "items": [
      {
        "id": "uuid",
        "name": "Professional Plumbing Kit",
        "description": "Complete plumbing repair kit",
        "price": 99.99,
        "category": {
          "id": "uuid",
          "name": "Tools"
        },
        "stock": 50,
        "images": ["https://example.com/image1.jpg"],
        "provider": {
          "id": "uuid",
          "businessName": "ABC Plumbing Services"
        },
        "rating": 4.5,
        "reviewCount": 12,
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "pages": 10
    }
  }
}
```

### POST /api/products
Create a new product (provider only).

**Headers:**
```http
Authorization: Bearer <provider_access_token>
```

**Request Body:**
```json
{
  "name": "Professional Plumbing Kit",
  "description": "Complete plumbing repair kit with all essential tools",
  "price": 99.99,
  "categoryId": "uuid",
  "stock": 50,
  "images": ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
  "specifications": {
    "weight": "2.5 kg",
    "dimensions": "30x20x10 cm",
    "material": "Steel",
    "warranty": "1 year"
  },
  "tags": ["plumbing", "tools", "repair"]
}
```

### GET /api/products/:id
Get product by ID.

### PUT /api/products/:id
Update product (provider only, own products).

### PATCH /api/products/:id/stock
Update product stock.

**Request Body:**
```json
{
  "stock": 45
}
```

### DELETE /api/products/:id
Delete product (provider only, own products).

### GET /api/products/categories
Get all product categories.

**Response:**
```json
{
  "success": true,
  "message": "Categories retrieved successfully",
  "data": [
    {
      "id": "uuid",
      "name": "Tools",
      "description": "Professional tools",
      "parentId": null,
      "children": [
        {
          "id": "uuid",
          "name": "Plumbing Tools",
          "description": "Tools for plumbing work"
        }
      ]
    }
  ]
}
```

## 💳 Payment Endpoints

### POST /api/payments/create-intent
Create payment intent (Stripe).

**Headers:**
```http
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "amount": 120.00,
  "currency": "usd",
  "bookingId": "uuid",
  "description": "Payment for plumbing service"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment intent created successfully",
  "data": {
    "clientSecret": "pi_xxx_secret_xxx",
    "paymentIntentId": "pi_xxx"
  }
}
```

### POST /api/payments/confirm
Confirm payment.

**Request Body:**
```json
{
  "paymentIntentId": "pi_xxx",
  "bookingId": "uuid"
}
```

### POST /api/payments/razorpay/create-order
Create Razorpay order.

**Request Body:**
```json
{
  "amount": 12000,
  "currency": "INR",
  "bookingId": "uuid"
}
```

### POST /api/payments/razorpay/verify
Verify Razorpay payment.

**Request Body:**
```json
{
  "razorpayOrderId": "order_xxx",
  "razorpayPaymentId": "pay_xxx",
  "razorpaySignature": "signature_xxx",
  "bookingId": "uuid"
}
```

### GET /api/payments
Get payment history.

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `status` (optional): Filter by status
- `bookingId` (optional): Filter by booking

## 💬 Communication Endpoints

### GET /api/communications/messages
Get chat messages.

**Query Parameters:**
- `bookingId` (required): Booking ID
- `page` (optional): Page number
- `limit` (optional): Items per page

**Response:**
```json
{
  "success": true,
  "message": "Messages retrieved successfully",
  "data": {
    "items": [
      {
        "id": "uuid",
        "sender": {
          "id": "uuid",
          "name": "John Doe",
          "role": "customer"
        },
        "message": "Hello, when will you arrive?",
        "timestamp": "2024-01-01T10:00:00Z",
        "type": "text"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 5,
      "pages": 1
    }
  }
}
```

### POST /api/communications/messages
Send a message.

**Request Body:**
```json
{
  "bookingId": "uuid",
  "message": "I'll be there in 30 minutes",
  "type": "text"
}
```

### GET /api/communications/calls
Get call history.

### POST /api/communications/calls/initiate
Initiate a call.

**Request Body:**
```json
{
  "bookingId": "uuid",
  "type": "voice"
}
```

## 🔌 WebSocket Events

### Connection
```javascript
const socket = io('ws://localhost:5000', {
  auth: {
    token: 'your_jwt_token'
  }
});
```

### Events

#### Client to Server
- `join_booking` - Join booking room
- `send_message` - Send chat message
- `typing_start` - Start typing indicator
- `typing_stop` - Stop typing indicator

#### Server to Client
- `message_received` - New message received
- `user_typing` - User typing indicator
- `booking_updated` - Booking status updated
- `quote_received` - New quote received
- `payment_confirmed` - Payment confirmed

### Example Usage
```javascript
// Join booking room
socket.emit('join_booking', { bookingId: 'uuid' });

// Send message
socket.emit('send_message', {
  bookingId: 'uuid',
  message: 'Hello!',
  type: 'text'
});

// Listen for messages
socket.on('message_received', (data) => {
  console.log('New message:', data);
});
```

## ⚡ Rate Limiting

### Limits
- **Authentication endpoints**: 5 requests per minute
- **General API endpoints**: 100 requests per 15 minutes
- **File upload endpoints**: 10 requests per minute

### Headers
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

### Rate Limit Exceeded Response
```json
{
  "success": false,
  "message": "Rate limit exceeded",
  "error": "Too many requests, please try again later"
}
```

## 🧪 Testing Examples

### Using cURL

#### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@fixer.com",
    "password": "admin123"
  }'
```

#### Create Service Request
```bash
curl -X POST http://localhost:5000/api/service-requests \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "title": "Fix leaky faucet",
    "description": "Kitchen faucet is leaking",
    "serviceType": "plumbing",
    "urgency": "medium",
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001"
    }
  }'
```

### Using JavaScript/Fetch

```javascript
// Login
const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'admin@fixer.com',
    password: 'admin123'
  })
});

const loginData = await loginResponse.json();
const accessToken = loginData.data.accessToken;

// Get service requests
const requestsResponse = await fetch('http://localhost:5000/api/service-requests', {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});

const requestsData = await requestsResponse.json();
console.log(requestsData);
```

### Using Postman Collection

Import the following collection for testing:

```json
{
  "info": {
    "name": "Fixer Marketplace API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Authentication",
      "item": [
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"admin@fixer.com\",\n  \"password\": \"admin123\"\n}"
            },
            "url": {
              "raw": "{{base_url}}/api/auth/login",
              "host": ["{{base_url}}"],
              "path": ["api", "auth", "login"]
            }
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:5000"
    }
  ]
}
```

## 📝 Notes

- All timestamps are in ISO 8601 format (UTC)
- File uploads are handled via multipart/form-data
- WebSocket connections require valid JWT tokens
- Rate limiting is applied per IP address
- All endpoints return consistent response formats
- Error messages are user-friendly and descriptive

---

**Last Updated**: January 2024  
**API Version**: 1.0.0  
**Base URL**: http://localhost:5000/api
