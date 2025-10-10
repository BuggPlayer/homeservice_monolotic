# Fixer Backend - Modular Architecture

## 📁 Project Structure

```
fixer-backend/
├── src/
│   ├── config/                    # Configuration files
│   │   ├── database.ts           # Database configuration
│   │   ├── redis.ts              # Redis configuration
│   │   ├── environment.ts        # Environment variables
│   │   └── index.ts              # Config exports
│   ├── core/                     # Core functionality
│   │   ├── database/             # Database layer
│   │   │   ├── repositories/     # Data access layer
│   │   │   │   ├── BaseRepository.ts
│   │   │   │   ├── UserRepository.ts
│   │   │   │   ├── ServiceProviderRepository.ts
│   │   │   │   ├── ServiceRequestRepository.ts
│   │   │   │   ├── QuoteRepository.ts
│   │   │   │   ├── BookingRepository.ts
│   │   │   │   ├── CallRepository.ts
│   │   │   │   └── index.ts
│   │   │   ├── migrations/       # Database migrations
│   │   │   ├── seeds/            # Database seeds
│   │   │   ├── migrate.ts        # Migration runner
│   │   │   └── seed.ts           # Seeding runner
│   │   ├── middleware/           # Middleware functions
│   │   │   ├── auth.ts           # Authentication middleware
│   │   │   ├── validation.ts     # Input validation
│   │   │   ├── errorHandler.ts   # Error handling
│   │   │   ├── rateLimiter.ts    # Rate limiting
│   │   │   └── index.ts
│   │   ├── utils/                # Utility functions
│   │   │   ├── auth.ts           # JWT utilities
│   │   │   ├── bcrypt.ts         # Password hashing
│   │   │   ├── logger.ts         # Logging utilities
│   │   │   └── index.ts
│   │   ├── types/                # TypeScript type definitions
│   │   │   └── index.ts
│   │   └── index.ts              # Core exports
│   ├── modules/                  # Feature modules
│   │   ├── auth/                 # Authentication module
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── routes/
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   ├── users/                # User management module
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── routes/
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   ├── services/             # Service requests module
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── routes/
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   ├── providers/            # Service providers module
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── routes/
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   ├── quotes/               # Quotes module
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── routes/
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   ├── bookings/             # Bookings module
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── routes/
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   ├── communications/       # Calls, messages module
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── routes/
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   ├── payments/             # Payment processing module
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── routes/
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   └── products/             # E-commerce module
│   │       ├── controllers/
│   │       ├── services/
│   │       ├── routes/
│   │       ├── types.ts
│   │       └── index.ts
│   ├── services/                 # Shared services
│   │   ├── SocketService.ts      # Socket.IO service
│   │   ├── NotificationService.ts # Notification service
│   │   ├── PaymentService.ts     # Payment processing
│   │   ├── FileUploadService.ts  # File upload handling
│   │   └── UserService.ts        # User management
│   ├── app.ts                    # Express app configuration
│   └── server.ts                 # Server entry point
├── tests/                        # Test files
├── dist/                         # Compiled JavaScript
├── package.json
├── tsconfig.json
├── docker-compose.yml
├── Dockerfile
└── README.md
```

## 🏗️ Architecture Principles

### 1. **Modular Design**
- Each feature is organized into its own module
- Modules are self-contained with their own controllers, services, routes, and types
- Clear separation of concerns between modules

### 2. **Layered Architecture**
- **Controllers**: Handle HTTP requests and responses
- **Services**: Business logic and data processing
- **Repositories**: Data access layer
- **Models**: Data structure definitions

### 3. **Dependency Injection**
- Services are injected into controllers
- Repositories are injected into services
- Easy to test and mock dependencies

### 4. **Type Safety**
- Comprehensive TypeScript interfaces
- Type-safe API contracts
- Compile-time error checking

## 🔧 Core Components

### **Configuration (`src/config/`)**
- Centralized configuration management
- Environment-specific settings
- Database and Redis connections

### **Database Layer (`src/core/database/`)**
- Repository pattern for data access
- Base repository with common CRUD operations
- Specialized repositories for each entity
- Migration and seeding support

### **Middleware (`src/core/middleware/`)**
- Authentication and authorization
- Input validation with Joi
- Error handling and logging
- Rate limiting and security

### **Utilities (`src/core/utils/`)**
- JWT token management
- Password hashing
- Logging utilities
- Common helper functions

## 📦 Module Structure

Each module follows the same structure:

```
module-name/
├── controllers/          # HTTP request handlers
├── services/            # Business logic
├── routes/              # Route definitions
├── types.ts            # Module-specific types
└── index.ts            # Module exports
```

### **Example: Auth Module**

```typescript
// types.ts - Define request/response interfaces
export interface LoginRequest {
  email: string;
  password: string;
}

// services/AuthService.ts - Business logic
export class AuthService {
  async login(data: LoginRequest): Promise<LoginResponse> {
    // Implementation
  }
}

// controllers/AuthController.ts - HTTP handlers
export class AuthController {
  login = async (req: Request, res: Response) => {
    // Implementation
  }
}

// routes/auth.ts - Route definitions
router.post('/login', validateLogin, authController.login);
```

## 🚀 Getting Started

### **1. Install Dependencies**
```bash
npm install
```

### **2. Environment Setup**
```bash
cp env.example .env
# Edit .env with your configuration
```

### **3. Database Setup**
```bash
# Run migrations
npm run migrate

# Seed database
npm run seed
```

### **4. Start Development Server**
```bash
npm run dev
```

## 🔌 API Endpoints

### **Authentication**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password

### **Users**
- `GET /api/users` - Get all users (admin)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (admin)
- `GET /api/users/stats` - Get user statistics (admin)

### **Service Requests**
- `GET /api/service-requests` - Get service requests
- `POST /api/service-requests` - Create service request
- `GET /api/service-requests/:id` - Get service request by ID
- `PUT /api/service-requests/:id` - Update service request
- `DELETE /api/service-requests/:id` - Delete service request
- `GET /api/service-requests/my-requests` - Get customer's requests

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for password security
- **Rate Limiting**: Prevent abuse and DDoS attacks
- **Input Validation**: Comprehensive data validation
- **CORS Protection**: Cross-origin request security
- **Helmet**: Security headers
- **Role-based Access Control**: Granular permissions

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- auth.test.ts
```

## 📊 Monitoring & Logging

- **Structured Logging**: JSON-formatted logs
- **Error Tracking**: Comprehensive error handling
- **Health Checks**: `/health` endpoint
- **Performance Monitoring**: Request timing and metrics

## 🚀 Deployment

### **Docker**
```bash
# Build image
docker build -t fixer-backend .

# Run container
docker run -p 3000:3000 fixer-backend
```

### **Docker Compose**
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f
```

## 🔧 Development

### **Code Style**
- ESLint for code quality
- Prettier for formatting
- TypeScript strict mode
- Consistent naming conventions

### **Git Workflow**
- Feature branches
- Pull request reviews
- Automated testing
- Continuous integration

## 📈 Performance

- **Database Indexing**: Optimized queries
- **Connection Pooling**: Efficient database connections
- **Caching**: Redis for session and data caching
- **Compression**: Gzip compression
- **Rate Limiting**: Prevent resource abuse

## 🔍 Troubleshooting

### **Common Issues**

1. **Database Connection Errors**
   - Check database credentials
   - Ensure database is running
   - Verify connection string

2. **Authentication Issues**
   - Check JWT secret configuration
   - Verify token expiration
   - Ensure proper middleware order

3. **Validation Errors**
   - Check request body format
   - Verify required fields
   - Review validation schemas

### **Debug Mode**
```bash
# Enable debug logging
DEBUG=* npm run dev
```

## 📚 Additional Resources

- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [JWT.io](https://jwt.io/) - JWT token debugging
- [Redis Documentation](https://redis.io/documentation)

---

This modular architecture provides a scalable, maintainable, and production-ready backend for the Fixer marketplace platform.
