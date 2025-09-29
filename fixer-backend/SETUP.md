# Fixer API Setup Guide

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set up Environment Variables**
   ```bash
   cp env.example .env
   # Edit .env with your database credentials and API keys
   ```

3. **Set up Database**
   ```bash
   # Create PostgreSQL database
   createdb fixer_marketplace
   
   # Run migrations
   npm run migrate
   ```

4. **Test Setup**
   ```bash
   npm run test-setup
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

## Database Setup

### PostgreSQL Installation

**macOS (using Homebrew):**
```bash
brew install postgresql
brew services start postgresql
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**Windows:**
Download and install from [postgresql.org](https://www.postgresql.org/download/windows/)

### Create Database
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE fixer_marketplace;

# Create user (optional)
CREATE USER fixer_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE fixer_marketplace TO fixer_user;

# Exit
\q
```

## Redis Setup

**macOS (using Homebrew):**
```bash
brew install redis
brew services start redis
```

**Ubuntu/Debian:**
```bash
sudo apt install redis-server
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

**Windows:**
Download from [redis.io](https://redis.io/download) or use Docker

## Environment Variables

Copy `env.example` to `.env` and configure:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fixer_marketplace
DB_USER=postgres
DB_PASSWORD=your_password

# JWT Secrets (generate strong secrets)
JWT_SECRET=your_super_secret_jwt_key_here
JWT_REFRESH_SECRET=your_super_secret_refresh_key_here

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# External APIs (get these from respective services)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
STRIPE_SECRET_KEY=your_stripe_secret
# ... other API keys
```

## API Testing

Once the server is running, test the API:

```bash
# Health check
curl http://localhost:3000/health

# Register a customer
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@example.com",
    "phone": "+1234567890",
    "password": "password123",
    "user_type": "customer",
    "first_name": "John",
    "last_name": "Doe"
  }'

# Register a provider
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "provider@example.com",
    "phone": "+1234567891",
    "password": "password123",
    "user_type": "provider",
    "first_name": "Jane",
    "last_name": "Smith"
  }'
```

## Project Structure

```
src/
├── config/          # Database and Redis configuration
├── controllers/     # Route controllers
├── database/        # Migrations and seeds
│   └── migrations/  # SQL migration files
├── middleware/      # Custom middleware
│   ├── auth.ts      # Authentication middleware
│   ├── validation.ts # Request validation
│   ├── rateLimiter.ts # Rate limiting
│   └── errorHandler.ts # Error handling
├── models/          # Database models
├── routes/          # API routes
├── services/        # Business logic
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
└── server.ts        # Main server file
```

## Next Steps

1. **Complete External Integrations:**
   - Set up Twilio for calls
   - Configure WhatsApp Business API
   - Set up Stripe for payments
   - Configure AWS S3 for file uploads

2. **Add More Features:**
   - Quote system implementation
   - Booking system
   - Real-time messaging
   - AI-powered provider matching

3. **Testing:**
   - Add unit tests
   - Add integration tests
   - Set up CI/CD pipeline

4. **Deployment:**
   - Set up production database
   - Configure environment variables
   - Deploy to cloud platform (AWS, Heroku, etc.)

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check database credentials
- Verify database exists

### Redis Connection Issues
- Ensure Redis is running
- Check Redis configuration
- Verify Redis port is available

### TypeScript Compilation Issues
- Run `npm install` to install dependencies
- Check TypeScript configuration
- Ensure all type definitions are installed

### Port Already in Use
- Change PORT in .env file
- Kill process using the port: `lsof -ti:3000 | xargs kill -9`

## Support

For issues and questions:
1. Check the logs for error messages
2. Verify all environment variables are set
3. Ensure all services (PostgreSQL, Redis) are running
4. Check the API documentation in README.md
