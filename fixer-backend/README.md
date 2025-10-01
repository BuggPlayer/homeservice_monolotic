# Fixer Backend API

A comprehensive backend API for the Fixer home services marketplace platform built with Node.js, Express, TypeScript, and PostgreSQL.

## 🚀 Features

- **User Management**: Registration, authentication, profile management
- **Service Providers**: Provider registration, verification, profile management
- **Service Requests**: Create, manage, and track service requests
- **Quotes & Bookings**: Quote submission, acceptance, and booking management
- **Real-time Communication**: Voice calls between customers and providers
- **Payment Processing**: Stripe and Razorpay integration
- **File Upload**: Image upload with S3/Cloudinary support
- **Notifications**: Email, SMS, and push notifications
- **Security**: JWT authentication, rate limiting, input validation
- **Database**: PostgreSQL with migrations and seeding

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- Redis (v6 or higher)
- AWS S3 account (for file storage)
- Twilio account (for SMS and voice calls)
- Stripe/Razorpay account (for payments)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fixer-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   NODE_ENV=development
   PORT=3000
   
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=fixer_marketplace
   DB_USER=your_username
   DB_PASSWORD=your_password
   
   # Redis Configuration
   REDIS_HOST=localhost
   REDIS_PORT=6379
   REDIS_PASSWORD=
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key
   JWT_REFRESH_SECRET=your-super-secret-refresh-key
   
   # Twilio Configuration
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_PHONE_NUMBER=your_twilio_phone_number
   
   # Payment Configuration
   STRIPE_SECRET_KEY=your_stripe_secret_key
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   
   # AWS S3 Configuration
   AWS_ACCESS_KEY_ID=your_aws_access_key_id
   AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
   AWS_REGION=your_aws_region
   AWS_S3_BUCKET_NAME=your_s3_bucket_name
   
   # Email Configuration
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password
   ```

4. **Database Setup**
   ```bash
   # Create database
   createdb fixer_marketplace
   
   # Run migrations
   npm run migrate
   
   # Seed database with sample data
   npm run seed
   ```

5. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm run build
   npm start
   ```

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication
All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Endpoints

#### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/refresh` - Refresh access token
- `GET /auth/profile` - Get user profile
- `PUT /auth/profile` - Update user profile
- `POST /auth/change-password` - Change password

#### Service Providers
- `POST /providers/register` - Register as service provider
- `GET /providers` - Get providers with filters
- `GET /providers/search` - Search providers
- `GET /providers/:id` - Get provider details
- `PUT /providers/profile` - Update provider profile
- `GET /providers/statistics` - Get provider statistics

#### Service Requests
- `POST /service-requests` - Create service request
- `GET /service-requests` - Get service requests with filters
- `GET /service-requests/:id` - Get service request details
- `PUT /service-requests/:id` - Update service request
- `DELETE /service-requests/:id` - Delete service request

#### Quotes
- `POST /quotes` - Submit quote
- `GET /quotes/service-request/:id` - Get quotes for service request
- `GET /quotes/provider` - Get provider's quotes
- `GET /quotes/:id` - Get quote details
- `PUT /quotes/:id` - Update quote
- `PATCH /quotes/:id/status` - Accept/reject quote
- `DELETE /quotes/:id` - Delete quote

#### Bookings
- `POST /bookings` - Create booking
- `GET /bookings/customer` - Get customer's bookings
- `GET /bookings/provider` - Get provider's bookings
- `GET /bookings/upcoming` - Get upcoming bookings
- `GET /bookings/:id` - Get booking details
- `PATCH /bookings/:id/status` - Update booking status
- `PUT /bookings/:id` - Update booking

#### Calls
- `POST /calls` - Initiate call
- `GET /calls/customer` - Get customer's calls
- `GET /calls/provider` - Get provider's calls
- `GET /calls/recent` - Get recent calls
- `GET /calls/statistics` - Get call statistics
- `GET /calls/:id` - Get call details
- `PATCH /calls/:id/end` - End call

### Response Format

All API responses follow this format:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "error": "Error message (if any)"
}
```

### Error Codes

- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `429` - Too Many Requests
- `500` - Internal Server Error

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- --testPathPattern=auth.test.ts
```

## 📦 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run migrate` - Run database migrations
- `npm run seed` - Seed database with sample data
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors

## 🏗️ Project Structure

```
fixer-backend/
├── config/                 # Configuration files
│   ├── database.ts        # Database configuration
│   └── redis.ts           # Redis configuration
├── controllers/           # Route controllers
│   ├── AuthController.ts
│   ├── ServiceProviderController.ts
│   ├── ServiceRequestController.ts
│   ├── QuoteController.ts
│   ├── BookingController.ts
│   └── CallController.ts
├── database/             # Database related files
│   ├── migrate.ts        # Migration runner
│   ├── seed.ts           # Database seeder
│   └── migrations/       # SQL migration files
├── middleware/           # Express middleware
│   ├── auth.ts          # Authentication middleware
│   ├── errorHandler.ts  # Error handling
│   ├── rateLimiter.ts   # Rate limiting
│   └── validation.ts    # Input validation
├── models/              # Database models
│   ├── User.ts
│   ├── ServiceProvider.ts
│   ├── ServiceRequest.ts
│   ├── Quote.ts
│   ├── Booking.ts
│   └── Call.ts
├── routes/              # API routes
│   ├── auth.ts
│   ├── serviceProviders.ts
│   ├── serviceRequests.ts
│   ├── quotes.ts
│   ├── bookings.ts
│   └── calls.ts
├── services/            # Business logic services
│   ├── UserService.ts
│   ├── ServiceProviderService.ts
│   ├── ServiceRequestService.ts
│   ├── NotificationService.ts
│   ├── FileUploadService.ts
│   └── PaymentService.ts
├── tests/               # Test files
│   └── setup.ts
├── types/               # TypeScript type definitions
│   └── index.ts
├── utils/               # Utility functions
│   └── auth.ts
├── server.ts            # Main server file
├── package.json
├── tsconfig.json
└── README.md
```

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting to prevent abuse
- Input validation and sanitization
- CORS configuration
- Helmet for security headers
- SQL injection prevention with parameterized queries

## 🚀 Deployment

### Docker Deployment

1. **Create Dockerfile**
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY . .
   RUN npm run build
   EXPOSE 3000
   CMD ["npm", "start"]
   ```

2. **Build and run**
   ```bash
   docker build -t fixer-backend .
   docker run -p 3000:3000 fixer-backend
   ```

### Environment Variables for Production

Ensure all environment variables are properly set in your production environment:

- Database connection details
- Redis connection details
- JWT secrets
- Third-party service credentials
- CORS origins
- File upload settings

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@fixer.com or create an issue in the repository.

## 🔄 Changelog

### v1.0.0
- Initial release
- User authentication and management
- Service provider registration and management
- Service request creation and management
- Quote and booking system
- Real-time communication
- Payment processing
- File upload functionality
- Notification system


Homeservice/
├── fixer-backend/     # Backend API
├── fixer-dashboard/   # React Dashboard
└── FixerMobile/       # React Native App




src/
├── config/
│   ├── database.ts
│   ├── redis.ts
│   ├── environment.ts
│   └── index.ts
├── core/
│   ├── database/
│   │   ├── migrations/
│   │   ├── repositories/
│   │   │   ├── UserRepository.ts
│   │   │   ├── ServiceProviderRepository.ts
│   │   │   ├── ServiceRequestRepository.ts
│   │   │   ├── QuoteRepository.ts
│   │   │   ├── BookingRepository.ts
│   │   │   └── CallRepository.ts
│   │   └── index.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── validation.ts
│   │   ├── errorHandler.ts
│   │   └── index.ts
│   ├── utils/
│   │   ├── jwt.ts
│   │   ├── bcrypt.ts
│   │   ├── logger.ts
│   │   └── index.ts
│   └── types/
│       ├── database.ts   # Interfaces for database tables
│       └── index.ts
├── modules/
│   ├── auth/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── types.ts
│   │   └── index.ts
│   ├── users/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── types.ts
│   │   └── index.ts
│   ├── services/          # Service requests module
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── types.ts
│   │   └── index.ts
│   ├── providers/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── types.ts
│   │   �w── index.ts
│   ├── quotes/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── types.ts
│   │   └── index.ts
│   ├── bookings/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── types.ts
│   │   └── index.ts
│   ├── communications/    # Calls, WhatsApp, notifications
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── types.ts
│   │   └── index.ts
│   ├── payments/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── types.ts
│   │   └── index.ts
│   └── products/          # E-commerce for service-related products
│       ├── controllers/
│       ├── services/
│       ├── routes/
│       ├── types.ts
│       └── index.ts
├── app.ts
└── server.ts