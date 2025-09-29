# Fixer - Home Services Marketplace

A comprehensive home services marketplace platform built with Node.js, Express.js, TypeScript, and PostgreSQL.

## Features

- **Multi-role Authentication**: Customers, Service Providers, and Admins
- **Service Request Management**: Create, manage, and track service requests
- **Provider Profiles**: Detailed provider profiles with ratings and reviews
- **Quote System**: Providers can submit quotes for service requests
- **Booking System**: Schedule and manage service appointments
- **Real-time Communication**: Direct calls between customers and providers
- **WhatsApp Integration**: Quick booking via WhatsApp Business API
- **Payment Processing**: Stripe integration for secure payments
- **AI-powered Matching**: Smart provider matching based on service type and location

## Tech Stack

- **Backend**: Node.js + Express.js + TypeScript
- **Database**: PostgreSQL + Redis
- **Authentication**: JWT + bcrypt
- **File Storage**: AWS S3
- **External APIs**: Twilio, WhatsApp Business API, Stripe, Google Maps

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v13 or higher)
- Redis (v6 or higher)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Homeservice
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=fixer_marketplace
   DB_USER=postgres
   DB_PASSWORD=your_password

   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key_here
   JWT_REFRESH_SECRET=your_jwt_refresh_secret_here

   # Redis Configuration
   REDIS_HOST=localhost
   REDIS_PORT=6379

   # External APIs
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   STRIPE_SECRET_KEY=your_stripe_secret_key
   # ... other API keys
   ```

4. **Set up the database**
   ```bash
   # Create PostgreSQL database
   createdb fixer_marketplace

   # Run migrations
   npm run migrate
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh-token` - Refresh access token
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Service Requests
- `POST /api/service-requests` - Create service request
- `GET /api/service-requests` - Get service requests with filters
- `GET /api/service-requests/:id` - Get single service request
- `PUT /api/service-requests/:id` - Update service request
- `PUT /api/service-requests/:id/status` - Update request status (admin)

### Service Providers
- `POST /api/providers/profile` - Create/update provider profile
- `GET /api/providers/profile` - Get provider profile
- `GET /api/providers` - Get providers with filters
- `GET /api/providers/:id` - Get single provider
- `PUT /api/providers/:id/verification-status` - Update verification status (admin)

## Database Schema

### Core Tables
- **users**: User accounts (customers, providers, admins)
- **service_providers**: Provider profiles and business information
- **service_requests**: Customer service requests
- **quotes**: Provider quotes for service requests
- **bookings**: Scheduled service appointments
- **calls**: Call tracking and recordings

## Development

### Available Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run migrate` - Run database migrations
- `npm test` - Run tests

### Project Structure
```
src/
├── config/          # Database and Redis configuration
├── controllers/     # Route controllers
├── database/        # Migrations and seeds
├── middleware/      # Custom middleware
├── models/          # Database models
├── routes/          # API routes
├── services/        # Business logic
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
└── server.ts        # Main server file
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | No (default: 3000) |
| `NODE_ENV` | Environment | No (default: development) |
| `DB_HOST` | PostgreSQL host | Yes |
| `DB_PORT` | PostgreSQL port | No (default: 5432) |
| `DB_NAME` | Database name | Yes |
| `DB_USER` | Database user | Yes |
| `DB_PASSWORD` | Database password | Yes |
| `JWT_SECRET` | JWT secret key | Yes |
| `JWT_REFRESH_SECRET` | JWT refresh secret | Yes |
| `REDIS_HOST` | Redis host | Yes |
| `REDIS_PORT` | Redis port | No (default: 6379) |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support and questions, please contact the development team or create an issue in the repository.
