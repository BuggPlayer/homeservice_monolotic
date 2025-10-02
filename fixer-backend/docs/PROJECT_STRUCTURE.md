# 📁 Project Structure Documentation

This document provides a detailed explanation of the Fixer Marketplace backend project structure, including the purpose of each file and directory.

## 🏗️ Root Directory

```
fixer-backend/
├── 📁 src/                    # Source code directory
├── 📁 tests/                  # Test files
├── 📁 docs/                   # Documentation
├── 📁 logs/                   # Application logs
├── 📁 uploads/                # File uploads
├── server.ts                  # Application entry point
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
├── jest.config.js             # Jest testing configuration
├── .env.example               # Environment variables template
├── docker-compose.yml         # Docker configuration
├── Dockerfile                 # Docker image configuration
├── nginx.conf                 # Nginx configuration
└── README.md                  # Main documentation
```

## 📁 Source Code Structure (`src/`)

### 📁 Configuration (`src/config/`)

| File | Purpose | Description |
|------|---------|-------------|
| `database.ts` | PostgreSQL configuration | Database connection settings, pool configuration |
| `redis.ts` | Redis configuration | Redis client setup, connection options |
| `environment.ts` | Environment variables | Centralized environment variable management |
| `index.ts` | Config exports | Exports all configuration modules |

**Usage Example:**
```typescript
import { config } from './src/config';
const port = config.PORT; // 3000
const dbHost = config.DATABASE.HOST; // localhost
```

### 📁 Core Functionality (`src/core/`)

#### 📁 Database Layer (`src/core/database/`)

| File/Directory | Purpose | Description |
|----------------|---------|-------------|
| `repositories/` | Data access layer | Repository pattern implementation |
| `migrations/` | Database migrations | SQL migration files |
| `seeds/` | Database seeds | Sample data for development |
| `migrate.ts` | Migration runner | Executes database migrations |
| `seed.ts` | Seeding runner | Populates database with sample data |

**Repository Pattern:**
```typescript
// BaseRepository.ts - Abstract base class
export abstract class BaseRepository<T> {
  protected tableName: string;
  protected pool: Pool;
  
  async findById(id: string): Promise<T | null>
  async findAll(): Promise<T[]>
  async create(data: Partial<T>): Promise<T>
  async update(id: string, data: Partial<T>): Promise<T | null>
  async delete(id: string): Promise<boolean>
}

// UserRepository.ts - Concrete implementation
export class UserRepository extends BaseRepository<User> {
  constructor() {
    super('users');
  }
  
  async findByEmail(email: string): Promise<User | null>
  async findByPhone(phone: string): Promise<User | null>
}
```

#### 📁 Middleware (`src/core/middleware/`)

| File | Purpose | Description |
|------|---------|-------------|
| `auth.ts` | Authentication middleware | JWT token validation, user authentication |
| `validation.ts` | Input validation | Request validation using Joi schemas |
| `errorHandler.ts` | Error handling | Global error handling middleware |
| `rateLimiter.ts` | Rate limiting | API rate limiting implementation |
| `index.ts` | Middleware exports | Exports all middleware functions |

**Middleware Usage:**
```typescript
// Authentication middleware
app.use('/api/protected', authenticateToken);

// Validation middleware
app.post('/api/users', validateUserRegistration, createUser);

// Error handling
app.use(errorHandler);
```

#### 📁 Utilities (`src/core/utils/`)

| File | Purpose | Description |
|------|---------|-------------|
| `auth.ts` | JWT utilities | Token generation, validation, refresh |
| `bcrypt.ts` | Password hashing | Password hashing and verification |
| `logger.ts` | Logging utilities | Structured logging with Winston |
| `index.ts` | Utility exports | Exports all utility functions |

#### 📁 RBAC (`src/core/rbac/`)

| File | Purpose | Description |
|------|---------|-------------|
| `RBACService.ts` | RBAC implementation | Role and permission management |
| `middleware.ts` | RBAC middleware | Permission checking middleware |
| `types.ts` | RBAC types | TypeScript definitions for RBAC |

### 📁 Feature Modules (`src/modules/`)

Each module follows the same structure:

```
module-name/
├── 📁 controllers/     # Request handlers
├── 📁 services/        # Business logic
├── 📁 routes/          # Route definitions
├── types.ts            # Module-specific types
└── index.ts            # Module exports
```

#### 📁 Authentication Module (`src/modules/auth/`)

| File | Purpose | Description |
|------|---------|-------------|
| `controllers/AuthController.ts` | Auth endpoints | Login, register, refresh token handlers |
| `services/AuthService.ts` | Auth business logic | User authentication, token management |
| `routes/auth.ts` | Auth routes | Authentication route definitions |
| `types.ts` | Auth types | Login, register, token interfaces |

**Example Usage:**
```typescript
// POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

// Response
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

#### 📁 User Management (`src/modules/users/`)

| File | Purpose | Description |
|------|---------|-------------|
| `controllers/UserController.ts` | User endpoints | CRUD operations for users |
| `services/UserService.ts` | User business logic | User management, profile updates |
| `routes/users.ts` | User routes | User-related route definitions |
| `types.ts` | User types | User interfaces and DTOs |

#### 📁 Service Requests (`src/modules/services/`)

| File | Purpose | Description |
|------|---------|-------------|
| `controllers/ServiceRequestController.ts` | Service request endpoints | Create, update, manage service requests |
| `services/ServiceRequestService.ts` | Service request logic | Business logic for service requests |
| `routes/serviceRequests.ts` | Service request routes | Route definitions for service requests |
| `types.ts` | Service request types | Interfaces for service requests |

#### 📁 Service Providers (`src/modules/providers/`)

| File | Purpose | Description |
|------|---------|-------------|
| `controllers/ServiceProviderController.ts` | Provider endpoints | Provider management endpoints |
| `services/ServiceProviderService.ts` | Provider business logic | Provider verification, management |
| `routes/serviceProviders.ts` | Provider routes | Provider-related routes |
| `types.ts` | Provider types | Service provider interfaces |

#### 📁 Quotes (`src/modules/quotes/`)

| File | Purpose | Description |
|------|---------|-------------|
| `controllers/QuoteController.ts` | Quote endpoints | Quote creation, management |
| `services/QuoteService.ts` | Quote business logic | Quote generation, pricing logic |
| `routes/quotes.ts` | Quote routes | Quote-related routes |
| `types.ts` | Quote types | Quote interfaces and DTOs |

#### 📁 Bookings (`src/modules/bookings/`)

| File | Purpose | Description |
|------|---------|-------------|
| `controllers/BookingController.ts` | Booking endpoints | Booking creation, management |
| `services/BookingService.ts` | Booking business logic | Scheduling, booking management |
| `routes/bookings.ts` | Booking routes | Booking-related routes |
| `types.ts` | Booking types | Booking interfaces |

#### 📁 Payments (`src/modules/payments/`)

| File | Purpose | Description |
|------|---------|-------------|
| `controllers/PaymentController.ts` | Payment endpoints | Payment processing endpoints |
| `services/PaymentService.ts` | Payment business logic | Stripe, Razorpay integration |
| `routes/payments.ts` | Payment routes | Payment-related routes |
| `types.ts` | Payment types | Payment interfaces |

#### 📁 Communications (`src/modules/communications/`)

| File | Purpose | Description |
|------|---------|-------------|
| `controllers/CommunicationController.ts` | Communication endpoints | Messaging, notifications |
| `services/CommunicationService.ts` | Communication logic | Chat, email, SMS services |
| `routes/communications.ts` | Communication routes | Communication routes |
| `types.ts` | Communication types | Message, notification interfaces |

#### 📁 Products (`src/modules/products/`)

| File | Purpose | Description |
|------|---------|-------------|
| `controllers/ProductController.ts` | Product endpoints | Product catalog management |
| `services/ProductService.ts` | Product business logic | Product management, inventory |
| `routes/products.ts` | Product routes | Product-related routes |
| `types.ts` | Product types | Product, category interfaces |

### 📁 Global Types (`src/types/`)

| File | Purpose | Description |
|------|---------|-------------|
| `index.ts` | Global type definitions | All TypeScript interfaces and types |

**Key Types:**
```typescript
export interface User {
  id: string;
  email: string;
  phone: string;
  user_type: 'customer' | 'provider' | 'admin' | 'super_admin';
  // ... other properties
}

export interface ServiceRequest {
  id: string;
  customer_id: string;
  service_type: string;
  title: string;
  description: string;
  // ... other properties
}
```

### 📁 External Services (`src/services/`)

| File | Purpose | Description |
|------|---------|-------------|
| `api/` | External API integrations | Third-party service integrations |

### 📁 State Management (`src/store/`)

| File | Purpose | Description |
|------|---------|-------------|
| `index.ts` | Store configuration | Redux store setup |
| `hooks.ts` | Store hooks | Custom hooks for state management |
| `slices/` | Redux slices | Feature-based state slices |

## 📁 Test Structure (`tests/`)

```
tests/
├── 📁 unit/                    # Unit tests
├── 📁 integration/             # Integration tests
├── 📁 e2e/                     # End-to-end tests
├── 📁 fixtures/                # Test data
└── 📁 helpers/                 # Test utilities
```

## 📁 Documentation (`docs/`)

```
docs/
├── PROJECT_STRUCTURE.md        # This file
├── API_DOCUMENTATION.md        # API endpoint documentation
├── DATABASE_SCHEMA.md          # Database schema documentation
├── DEPLOYMENT.md               # Deployment guide
└── CONTRIBUTING.md             # Contribution guidelines
```

## 🔧 Configuration Files

### `package.json`
- **Dependencies**: Production and development dependencies
- **Scripts**: Available npm commands
- **Metadata**: Project information, author, license

### `tsconfig.json`
- **TypeScript Configuration**: Compiler options, module resolution
- **Path Mapping**: Alias configuration for imports
- **Target**: ES2020, CommonJS modules

### `jest.config.js`
- **Test Configuration**: Jest testing setup
- **Coverage**: Coverage reporting configuration
- **Environment**: Test environment setup

### `docker-compose.yml`
- **Services**: PostgreSQL, Redis, Application
- **Networks**: Service communication
- **Volumes**: Data persistence

### `Dockerfile`
- **Base Image**: Node.js 18 Alpine
- **Dependencies**: Package installation
- **Build Process**: TypeScript compilation
- **Runtime**: Production server setup

## 🚀 Entry Points

### `server.ts` - Application Entry Point
```typescript
import { createServer } from 'http';
import app from './src/app';
import { config } from './src/config';

const server = createServer(app);
const PORT = config.PORT;

server.listen(PORT, () => {
  console.log(`🚀 Fixer API server running on port ${PORT}`);
});
```

### `src/app.ts` - Express Application
```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
// ... other routes

export default app;
```

## 📊 File Size and Complexity

| Module | Files | Lines of Code | Complexity |
|--------|-------|---------------|------------|
| Core | 15 | ~2,000 | Medium |
| Auth | 8 | ~800 | Low |
| Users | 8 | ~600 | Low |
| Services | 8 | ~1,200 | High |
| Providers | 8 | ~1,000 | Medium |
| Quotes | 8 | ~800 | Medium |
| Bookings | 8 | ~1,000 | High |
| Payments | 8 | ~1,200 | High |
| Communications | 8 | ~1,000 | Medium |
| Products | 8 | ~1,400 | Medium |

## 🔍 Code Organization Principles

1. **Separation of Concerns**: Each module handles one specific domain
2. **Repository Pattern**: Data access abstraction
3. **Service Layer**: Business logic separation
4. **Controller Layer**: Request/response handling
5. **Type Safety**: Comprehensive TypeScript usage
6. **Error Handling**: Centralized error management
7. **Validation**: Input validation at controller level
8. **Security**: Authentication and authorization middleware

This structure ensures maintainability, scalability, and ease of development for the Fixer Marketplace backend.
