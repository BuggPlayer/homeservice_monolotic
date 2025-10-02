# 📁 File Purpose Documentation

This document explains the purpose and functionality of every file in the Fixer Marketplace backend project.

## 🏗️ Root Directory Files

| File | Purpose | Description |
|------|---------|-------------|
| `server.ts` | **Application Entry Point** | Main server file that starts the HTTP server and connects to the Express app |
| `package.json` | **Dependencies & Scripts** | Defines project metadata, dependencies, and available npm scripts |
| `tsconfig.json` | **TypeScript Configuration** | Configures TypeScript compiler options and module resolution |
| `jest.config.js` | **Test Configuration** | Configures Jest testing framework settings |
| `docker-compose.yml` | **Docker Services** | Defines multi-container Docker application services |
| `Dockerfile` | **Docker Image** | Instructions for building the application Docker image |
| `nginx.conf` | **Nginx Configuration** | Reverse proxy and load balancer configuration |
| `.env.example` | **Environment Template** | Template file showing required environment variables |
| `README.md` | **Project Documentation** | Main project documentation and setup instructions |

## 📁 Source Code Structure (`src/`)

### 📁 Configuration (`src/config/`)

| File | Purpose | Description |
|------|---------|-------------|
| `index.ts` | **Config Exports** | Centralized export of all configuration modules |
| `database.ts` | **Database Configuration** | PostgreSQL connection settings, pool configuration, and database options |
| `redis.ts` | **Redis Configuration** | Redis client setup, connection options, and caching configuration |
| `environment.ts` | **Environment Variables** | Centralized environment variable management with validation and defaults |

**Key Functions:**
- `database.ts`: Manages PostgreSQL connection pool, handles database configuration
- `redis.ts`: Configures Redis client, sets up caching strategies
- `environment.ts`: Validates and provides environment variables with type safety

### 📁 Core Functionality (`src/core/`)

#### 📁 Database Layer (`src/core/database/`)

| File/Directory | Purpose | Description |
|----------------|---------|-------------|
| `migrate.ts` | **Migration Runner** | Executes database migrations in order |
| `seed.ts` | **Database Seeder** | Populates database with initial/sample data |
| `migrations/` | **SQL Migration Files** | Contains SQL files for database schema changes |
| `seeds/` | **Sample Data Files** | Contains data seeding scripts for development |

**Migration Files:**
- `001_create_users_table.sql`: Creates users table with authentication fields
- `002_create_service_providers_table.sql`: Creates service providers table
- `003_create_service_requests_table.sql`: Creates service requests table
- `004_create_quotes_table.sql`: Creates quotes table
- `005_create_bookings_table.sql`: Creates bookings table
- `006_create_payments_table.sql`: Creates payments table
- `007_create_reviews_table.sql`: Creates reviews table
- `008_create_products_table.sql`: Creates products table
- `009_create_categories_table.sql`: Creates categories table
- `010_create_audit_logs_table.sql`: Creates audit logging table

**Seed Files:**
- `comprehensiveSeed.ts`: Comprehensive database seeding with realistic data
- `basicSeed.ts`: Basic seeding for development
- `testSeed.ts`: Test data for automated testing

#### 📁 Repositories (`src/core/database/repositories/`)

| File | Purpose | Description |
|------|---------|-------------|
| `index.ts` | **Repository Exports** | Exports all repository classes |
| `BaseRepository.ts` | **Base Repository Class** | Abstract base class with common CRUD operations |
| `UserRepository.ts` | **User Data Access** | User-specific database operations and queries |
| `ServiceProviderRepository.ts` | **Provider Data Access** | Service provider database operations |
| `ServiceRequestRepository.ts` | **Service Request Data Access** | Service request database operations |
| `QuoteRepository.ts` | **Quote Data Access** | Quote database operations and queries |
| `BookingRepository.ts` | **Booking Data Access** | Booking database operations |
| `CallRepository.ts` | **Call Data Access** | Video/voice call database operations |
| `ProductRepository.ts` | **Product Data Access** | Product catalog database operations |
| `CategoryRepository.ts` | **Category Data Access** | Category database operations |

**Repository Pattern Benefits:**
- **Data Abstraction**: Separates data access logic from business logic
- **Reusability**: Common operations defined in BaseRepository
- **Type Safety**: TypeScript interfaces ensure data consistency
- **Testability**: Easy to mock for unit testing

#### 📁 Middleware (`src/core/middleware/`)

| File | Purpose | Description |
|------|---------|-------------|
| `index.ts` | **Middleware Exports** | Exports all middleware functions |
| `auth.ts` | **Authentication Middleware** | JWT token validation and user authentication |
| `validation.ts` | **Input Validation** | Request validation using Joi schemas |
| `errorHandler.ts` | **Error Handling** | Global error handling and response formatting |
| `rateLimiter.ts` | **Rate Limiting** | API rate limiting implementation |

**Middleware Functions:**
- `authenticateToken`: Validates JWT tokens and attaches user to request
- `validateUserRegistration`: Validates user registration data
- `validateServiceRequest`: Validates service request data
- `handleError`: Centralized error handling and logging
- `rateLimit`: Implements rate limiting per IP/user

#### 📁 Utilities (`src/core/utils/`)

| File | Purpose | Description |
|------|---------|-------------|
| `index.ts` | **Utility Exports** | Exports all utility functions |
| `auth.ts` | **JWT Utilities** | Token generation, validation, and refresh logic |
| `bcrypt.ts` | **Password Hashing** | Password hashing and verification using bcrypt |
| `logger.ts` | **Logging Utilities** | Structured logging with Winston |

**Utility Functions:**
- `generateAccessToken`: Creates JWT access tokens
- `generateRefreshToken`: Creates JWT refresh tokens
- `verifyToken`: Validates JWT tokens
- `hashPassword`: Hashes passwords with bcrypt
- `comparePassword`: Compares passwords with hashes
- `createLogger`: Creates Winston logger instance

#### 📁 RBAC (`src/core/rbac/`)

| File | Purpose | Description |
|------|---------|-------------|
| `RBACService.ts` | **RBAC Implementation** | Role and permission management service |
| `middleware.ts` | **RBAC Middleware** | Permission checking middleware |
| `types.ts` | **RBAC Types** | TypeScript definitions for RBAC system |

**RBAC Features:**
- **Role Management**: Create, update, delete roles
- **Permission Management**: Define and manage permissions
- **User Assignment**: Assign roles to users
- **Permission Checking**: Middleware to check user permissions

#### 📁 Types (`src/core/types/`)

| File | Purpose | Description |
|------|---------|-------------|
| `index.ts` | **Core Type Definitions** | TypeScript interfaces and types for core functionality |

**Key Types:**
- `User`: User account interface
- `ServiceProvider`: Service provider profile interface
- `ServiceRequest`: Service request interface
- `Quote`: Quote interface
- `Booking`: Booking interface
- `Payment`: Payment interface
- `JWTPayload`: JWT token payload interface

### 📁 Feature Modules (`src/modules/`)

Each module follows the same structure with controllers, services, routes, and types.

#### 📁 Authentication Module (`src/modules/auth/`)

| File | Purpose | Description |
|------|---------|-------------|
| `controllers/AuthController.ts` | **Auth Endpoints** | Handles login, register, refresh token endpoints |
| `services/AuthService.ts` | **Auth Business Logic** | User authentication, token management logic |
| `routes/auth.ts` | **Auth Routes** | Defines authentication API routes |
| `types.ts` | **Auth Types** | Authentication-specific TypeScript interfaces |

**Key Functions:**
- `register`: User registration with validation
- `login`: User authentication with JWT tokens
- `refreshToken`: Token refresh functionality
- `logout`: Token invalidation
- `forgotPassword`: Password reset request
- `resetPassword`: Password reset with token

#### 📁 User Management (`src/modules/users/`)

| File | Purpose | Description |
|------|---------|-------------|
| `controllers/UserController.ts` | **User Endpoints** | CRUD operations for user management |
| `services/UserService.ts` | **User Business Logic** | User management, profile updates logic |
| `routes/users.ts` | **User Routes** | User-related API route definitions |
| `types.ts` | **User Types** | User-specific TypeScript interfaces |

**Key Functions:**
- `getUsers`: Retrieve users with pagination and filtering
- `getUserById`: Get user by ID
- `updateUser`: Update user information
- `deleteUser`: Soft delete user account
- `getProfile`: Get current user profile
- `updateProfile`: Update user profile

#### 📁 Service Requests (`src/modules/services/`)

| File | Purpose | Description |
|------|---------|-------------|
| `controllers/ServiceRequestController.ts` | **Service Request Endpoints** | Service request CRUD operations |
| `services/ServiceRequestService.ts` | **Service Request Logic** | Business logic for service requests |
| `routes/serviceRequests.ts` | **Service Request Routes** | Service request API routes |
| `types.ts` | **Service Request Types** | Service request TypeScript interfaces |

**Key Functions:**
- `createServiceRequest`: Create new service request
- `getServiceRequests`: Retrieve service requests with filtering
- `getServiceRequestById`: Get specific service request
- `updateServiceRequest`: Update service request details
- `updateStatus`: Update service request status
- `getAnalytics`: Get service request analytics

#### 📁 Service Providers (`src/modules/providers/`)

| File | Purpose | Description |
|------|---------|-------------|
| `controllers/ServiceProviderController.ts` | **Provider Endpoints** | Service provider management endpoints |
| `services/ServiceProviderService.ts` | **Provider Business Logic** | Provider verification, management logic |
| `routes/serviceProviders.ts` | **Provider Routes** | Service provider API routes |
| `types.ts` | **Provider Types** | Service provider TypeScript interfaces |

**Key Functions:**
- `createProvider`: Create service provider profile
- `getProviders`: Retrieve providers with filtering
- `getProviderById`: Get specific provider
- `updateProvider`: Update provider information
- `verifyProvider`: Verify provider documents
- `getProviderStats`: Get provider statistics

#### 📁 Quotes (`src/modules/quotes/`)

| File | Purpose | Description |
|------|---------|-------------|
| `controllers/QuoteController.ts` | **Quote Endpoints** | Quote management endpoints |
| `services/QuoteService.ts` | **Quote Business Logic** | Quote generation and management logic |
| `routes/quotes.ts` | **Quote Routes** | Quote API route definitions |
| `types.ts` | **Quote Types** | Quote TypeScript interfaces |

**Key Functions:**
- `createQuote`: Create quote for service request
- `getQuotes`: Retrieve quotes with filtering
- `getQuoteById`: Get specific quote
- `acceptQuote`: Accept quote and create booking
- `rejectQuote`: Reject quote
- `getQuoteAnalytics`: Get quote statistics

#### 📁 Bookings (`src/modules/bookings/`)

| File | Purpose | Description |
|------|---------|-------------|
| `controllers/BookingController.ts` | **Booking Endpoints** | Booking management endpoints |
| `services/BookingService.ts` | **Booking Business Logic** | Booking scheduling and management logic |
| `routes/bookings.ts` | **Booking Routes** | Booking API route definitions |
| `types.ts` | **Booking Types** | Booking TypeScript interfaces |

**Key Functions:**
- `createBooking`: Create booking from accepted quote
- `getBookings`: Retrieve bookings with filtering
- `getBookingById`: Get specific booking
- `updateBooking`: Update booking details
- `updateStatus`: Update booking status
- `getBookingAnalytics`: Get booking statistics

#### 📁 Payments (`src/modules/payments/`)

| File | Purpose | Description |
|------|---------|-------------|
| `controllers/PaymentController.ts` | **Payment Endpoints** | Payment processing endpoints |
| `services/PaymentService.ts` | **Payment Business Logic** | Stripe, Razorpay integration logic |
| `routes/payments.ts` | **Payment Routes** | Payment API route definitions |
| `types.ts` | **Payment Types** | Payment TypeScript interfaces |

**Key Functions:**
- `createPaymentIntent`: Create Stripe payment intent
- `confirmPayment`: Confirm payment completion
- `processRefund`: Process payment refund
- `getPaymentHistory`: Get payment history
- `handleWebhook`: Handle payment webhooks

#### 📁 Communications (`src/modules/communications/`)

| File | Purpose | Description |
|------|---------|-------------|
| `controllers/CommunicationController.ts` | **Communication Endpoints** | Messaging and notification endpoints |
| `services/CommunicationService.ts` | **Communication Logic** | Chat, email, SMS service logic |
| `routes/communications.ts` | **Communication Routes** | Communication API routes |
| `types.ts` | **Communication Types** | Communication TypeScript interfaces |

**Key Functions:**
- `sendMessage`: Send real-time message
- `getMessages`: Retrieve message history
- `sendEmail`: Send email notification
- `sendSMS`: Send SMS notification
- `getNotifications`: Get user notifications

#### 📁 Products (`src/modules/products/`)

| File | Purpose | Description |
|------|---------|-------------|
| `controllers/ProductController.ts` | **Product Endpoints** | Product catalog management endpoints |
| `services/ProductService.ts` | **Product Business Logic** | Product management and inventory logic |
| `routes/products.ts` | **Product Routes** | Product API route definitions |
| `types.ts` | **Product Types** | Product TypeScript interfaces |

**Key Functions:**
- `createProduct`: Create new product
- `getProducts`: Retrieve products with filtering
- `getProductById`: Get specific product
- `updateProduct`: Update product information
- `updateStock`: Update product stock
- `getProductStats`: Get product statistics

### 📁 Global Types (`src/types/`)

| File | Purpose | Description |
|------|---------|-------------|
| `index.ts` | **Global Type Definitions** | All TypeScript interfaces and types used across the application |

**Key Type Categories:**
- **User Types**: User, ServiceProvider, Admin interfaces
- **Service Types**: ServiceRequest, Quote, Booking interfaces
- **Payment Types**: Payment, Transaction interfaces
- **Communication Types**: Message, Notification interfaces
- **Product Types**: Product, Category interfaces
- **API Types**: Request, Response, Error interfaces

### 📁 External Services (`src/services/`)

| File/Directory | Purpose | Description |
|----------------|---------|-------------|
| `api/` | **API Integrations** | Third-party service integrations and API clients |

**External Service Files:**
- `stripe.ts`: Stripe payment integration
- `razorpay.ts`: Razorpay payment integration
- `twilio.ts`: Twilio SMS integration
- `email.ts`: Email service integration
- `cloudinary.ts`: Cloudinary file upload integration

### 📁 State Management (`src/store/`)

| File | Purpose | Description |
|------|---------|-------------|
| `index.ts` | **Store Configuration** | Redux store setup and configuration |
| `hooks.ts` | **Store Hooks** | Custom hooks for state management |
| `slices/` | **Redux Slices** | Feature-based state management slices |

## 📁 Test Structure (`tests/`)

| File/Directory | Purpose | Description |
|----------------|---------|-------------|
| `unit/` | **Unit Tests** | Individual function and class tests |
| `integration/` | **Integration Tests** | API endpoint and service integration tests |
| `e2e/` | **End-to-End Tests** | Complete user workflow tests |
| `fixtures/` | **Test Data** | Sample data for testing |
| `helpers/` | **Test Utilities** | Test helper functions and utilities |

## 📁 Documentation (`docs/`)

| File | Purpose | Description |
|------|---------|-------------|
| `PROJECT_STRUCTURE.md` | **Project Structure** | Detailed project structure documentation |
| `DATABASE_SCHEMA.md` | **Database Schema** | Database schema and relationships documentation |
| `API_DOCUMENTATION.md` | **API Documentation** | Complete API endpoint documentation |
| `DEPLOYMENT.md` | **Deployment Guide** | Production deployment instructions |
| `ENVIRONMENT_CONFIG.md` | **Environment Config** | Environment variable configuration guide |
| `FILE_PURPOSE.md` | **File Purpose** | This file - explains every file's purpose |

## 🔧 Configuration Files

### Build & Development

| File | Purpose | Description |
|------|---------|-------------|
| `tsconfig.json` | **TypeScript Config** | TypeScript compiler options and module resolution |
| `jest.config.js` | **Jest Config** | Testing framework configuration |
| `nodemon.json` | **Nodemon Config** | Development server auto-restart configuration |
| `eslint.config.js` | **ESLint Config** | Code linting and formatting rules |

### Deployment

| File | Purpose | Description |
|------|---------|-------------|
| `Dockerfile` | **Docker Image** | Instructions for building application Docker image |
| `docker-compose.yml` | **Docker Services** | Multi-container application definition |
| `nginx.conf` | **Nginx Config** | Reverse proxy and load balancer configuration |
| `ecosystem.config.js` | **PM2 Config** | Process manager configuration for production |

## 📊 File Statistics

### Code Distribution

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
| **Total** | **97** | **~10,000** | **Medium** |

### File Types

| Type | Count | Purpose |
|------|-------|---------|
| TypeScript | 85 | Main application code |
| SQL | 10 | Database migrations |
| JSON | 5 | Configuration files |
| Markdown | 8 | Documentation |
| YAML | 2 | Docker configuration |
| JavaScript | 3 | Build scripts |

## 🎯 Design Patterns

### 1. Repository Pattern
- **Location**: `src/core/database/repositories/`
- **Purpose**: Abstracts data access logic
- **Benefits**: Testability, maintainability, separation of concerns

### 2. Service Layer Pattern
- **Location**: `src/modules/*/services/`
- **Purpose**: Contains business logic
- **Benefits**: Reusability, testability, separation of concerns

### 3. Controller Pattern
- **Location**: `src/modules/*/controllers/`
- **Purpose**: Handles HTTP requests and responses
- **Benefits**: Clean API, request validation, response formatting

### 4. Middleware Pattern
- **Location**: `src/core/middleware/`
- **Purpose**: Cross-cutting concerns
- **Benefits**: Reusability, modularity, separation of concerns

### 5. Factory Pattern
- **Location**: `src/core/database/`
- **Purpose**: Database connection management
- **Benefits**: Singleton pattern, resource management

This file purpose documentation provides a comprehensive understanding of every file in the Fixer Marketplace backend project, making it easy for developers to navigate and understand the codebase structure.
