# ⚙️ Environment Configuration Guide

This document provides detailed information about environment variables, configuration options, and setup procedures for the Fixer Marketplace backend.

## 📋 Table of Contents

- [Environment Variables](#environment-variables)
- [Configuration Files](#configuration-files)
- [Development Setup](#development-setup)
- [Production Setup](#production-setup)
- [Security Configuration](#security-configuration)
- [External Services](#external-services)
- [Troubleshooting](#troubleshooting)

## 🔧 Environment Variables

### Core Application Variables

| Variable | Description | Default | Required | Example |
|----------|-------------|---------|----------|---------|
| `NODE_ENV` | Application environment | `development` | Yes | `production` |
| `PORT` | Server port | `3000` | Yes | `3000` |
| `API_VERSION` | API version | `v1` | No | `v1` |
| `CORS_ORIGIN` | CORS allowed origins | `*` | Yes | `https://app.fixer.com` |

### Database Configuration

| Variable | Description | Default | Required | Example |
|----------|-------------|---------|----------|---------|
| `DB_HOST` | PostgreSQL host | `localhost` | Yes | `db.fixer.com` |
| `DB_PORT` | PostgreSQL port | `5432` | Yes | `5432` |
| `DB_NAME` | Database name | `fixer_marketplace` | Yes | `fixer_marketplace` |
| `DB_USER` | Database username | `postgres` | Yes | `fixer_user` |
| `DB_PASSWORD` | Database password | - | Yes | `secure_password` |
| `DB_SSL` | Enable SSL connection | `false` | No | `true` |
| `DB_POOL_MIN` | Min connections | `2` | No | `5` |
| `DB_POOL_MAX` | Max connections | `10` | No | `20` |

### Redis Configuration

| Variable | Description | Default | Required | Example |
|----------|-------------|---------|----------|---------|
| `REDIS_HOST` | Redis host | `localhost` | Yes | `redis.fixer.com` |
| `REDIS_PORT` | Redis port | `6379` | Yes | `6379` |
| `REDIS_PASSWORD` | Redis password | - | No | `redis_password` |
| `REDIS_DB` | Redis database number | `0` | No | `0` |
| `REDIS_TTL` | Default TTL (seconds) | `3600` | No | `3600` |

### JWT Configuration

| Variable | Description | Default | Required | Example |
|----------|-------------|---------|----------|---------|
| `JWT_SECRET` | JWT signing secret | - | Yes | `super-secret-jwt-key` |
| `JWT_REFRESH_SECRET` | Refresh token secret | - | Yes | `super-secret-refresh-key` |
| `JWT_ACCESS_TOKEN_EXPIRATION` | Access token expiry | `1h` | No | `1h` |
| `JWT_REFRESH_TOKEN_EXPIRATION` | Refresh token expiry | `7d` | No | `7d` |

### Email Configuration

| Variable | Description | Default | Required | Example |
|----------|-------------|---------|----------|---------|
| `SMTP_HOST` | SMTP server host | - | Yes | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP server port | `587` | Yes | `587` |
| `SMTP_USER` | SMTP username | - | Yes | `noreply@fixer.com` |
| `SMTP_PASS` | SMTP password | - | Yes | `app_password` |
| `SMTP_SECURE` | Use TLS | `true` | No | `true` |
| `FROM_EMAIL` | From email address | - | Yes | `noreply@fixer.com` |
| `FROM_NAME` | From name | `Fixer Marketplace` | No | `Fixer Team` |

### SMS Configuration (Twilio)

| Variable | Description | Default | Required | Example |
|----------|-------------|---------|----------|---------|
| `TWILIO_ACCOUNT_SID` | Twilio Account SID | - | Yes | `ACxxxxxxxxxxxxxxxx` |
| `TWILIO_AUTH_TOKEN` | Twilio Auth Token | - | Yes | `xxxxxxxxxxxxxxxx` |
| `TWILIO_PHONE_NUMBER` | Twilio phone number | - | Yes | `+1234567890` |

### Payment Configuration

#### Stripe

| Variable | Description | Default | Required | Example |
|----------|-------------|---------|----------|---------|
| `STRIPE_SECRET_KEY` | Stripe secret key | - | Yes | `sk_test_...` |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | - | Yes | `pk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | - | No | `whsec_...` |

#### Razorpay

| Variable | Description | Default | Required | Example |
|----------|-------------|---------|----------|---------|
| `RAZORPAY_KEY_ID` | Razorpay Key ID | - | Yes | `rzp_test_...` |
| `RAZORPAY_KEY_SECRET` | Razorpay Key Secret | - | Yes | `xxxxxxxxxxxxxxxx` |

### File Upload Configuration

| Variable | Description | Default | Required | Example |
|----------|-------------|---------|----------|---------|
| `MAX_FILE_SIZE` | Max file size (bytes) | `10485760` | No | `10485760` |
| `UPLOAD_PATH` | Upload directory | `uploads/` | No | `uploads/` |
| `ALLOWED_FILE_TYPES` | Allowed file types | `image/*` | No | `image/*,application/pdf` |

#### Cloudinary

| Variable | Description | Default | Required | Example |
|----------|-------------|---------|----------|---------|
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | - | No | `your_cloud_name` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | - | No | `123456789012345` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | - | No | `xxxxxxxxxxxxxxxx` |

### Security Configuration

| Variable | Description | Default | Required | Example |
|----------|-------------|---------|----------|---------|
| `BCRYPT_ROUNDS` | Bcrypt salt rounds | `12` | No | `12` |
| `SESSION_SECRET` | Session secret | - | Yes | `session_secret_key` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | `900000` | No | `900000` |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `100` | No | `100` |

### Monitoring Configuration

| Variable | Description | Default | Required | Example |
|----------|-------------|---------|----------|---------|
| `SENTRY_DSN` | Sentry DSN | - | No | `https://...@sentry.io/...` |
| `LOG_LEVEL` | Log level | `info` | No | `debug` |
| `LOG_FILE` | Log file path | `logs/app.log` | No | `logs/app.log` |

## 📁 Configuration Files

### 1. Environment File (.env)

Create a `.env` file in the root directory:

```bash
# Copy example file
cp .env.example .env

# Edit with your values
nano .env
```

**Example .env file:**

```env
# Application
NODE_ENV=development
PORT=3000
API_VERSION=v1
CORS_ORIGIN=http://localhost:3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fixer_marketplace
DB_USER=postgres
DB_PASSWORD=your_password
DB_SSL=false
DB_POOL_MIN=2
DB_POOL_MAX=10

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
REDIS_TTL=3600

# JWT
JWT_SECRET=super-secret-jwt-key-for-development-only-change-in-production
JWT_REFRESH_SECRET=super-secret-refresh-key-for-development-only-change-in-production
JWT_ACCESS_TOKEN_EXPIRATION=1h
JWT_REFRESH_TOKEN_EXPIRATION=7d

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@fixer.com
SMTP_PASS=your_app_password
SMTP_SECURE=true
FROM_EMAIL=noreply@fixer.com
FROM_NAME=Fixer Marketplace

# SMS (Twilio)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=+1234567890

# Payments - Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Payments - Razorpay
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=uploads/
ALLOWED_FILE_TYPES=image/*,application/pdf

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Security
BCRYPT_ROUNDS=12
SESSION_SECRET=your_session_secret
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Monitoring
SENTRY_DSN=your_sentry_dsn
LOG_LEVEL=info
LOG_FILE=logs/app.log
```

### 2. Environment-specific Files

#### Development (.env.development)

```env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
REDIS_HOST=localhost
LOG_LEVEL=debug
```

#### Staging (.env.staging)

```env
NODE_ENV=staging
PORT=3000
DB_HOST=staging-db.fixer.com
REDIS_HOST=staging-redis.fixer.com
LOG_LEVEL=info
```

#### Production (.env.production)

```env
NODE_ENV=production
PORT=3000
DB_HOST=prod-db.fixer.com
REDIS_HOST=prod-redis.fixer.com
LOG_LEVEL=warn
```

## 🚀 Development Setup

### 1. Prerequisites

```bash
# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Install Redis
sudo apt install redis-server -y

# Install Git
sudo apt install git -y
```

### 2. Database Setup

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE fixer_marketplace;
CREATE USER fixer_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE fixer_marketplace TO fixer_user;
\q

# Test connection
psql -h localhost -U fixer_user -d fixer_marketplace
```

### 3. Application Setup

```bash
# Clone repository
git clone https://github.com/your-org/fixer-backend.git
cd fixer-backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit environment variables
nano .env

# Run database migrations
npm run migrate

# Seed database
npm run seed:comprehensive

# Start development server
npm run dev
```

### 4. Verify Setup

```bash
# Check if server is running
curl http://localhost:3000/health

# Check database connection
npm run test:db

# Run tests
npm test
```

## 🏭 Production Setup

### 1. Environment Variables

```bash
# Set production environment
export NODE_ENV=production

# Set secure JWT secrets
export JWT_SECRET=$(openssl rand -base64 64)
export JWT_REFRESH_SECRET=$(openssl rand -base64 64)

# Set database credentials
export DB_PASSWORD=$(openssl rand -base64 32)

# Set session secret
export SESSION_SECRET=$(openssl rand -base64 64)
```

### 2. Security Configuration

```bash
# Generate secure passwords
openssl rand -base64 32

# Set file permissions
chmod 600 .env
chmod 700 uploads/
chmod 700 logs/

# Configure firewall
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

### 3. SSL Configuration

```bash
# Install Certbot
sudo apt install certbot -y

# Obtain SSL certificate
sudo certbot certonly --standalone -d your-domain.com

# Configure auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 🔒 Security Configuration

### 1. JWT Security

```javascript
// Generate secure secrets
const crypto = require('crypto');
const jwtSecret = crypto.randomBytes(64).toString('hex');
const refreshSecret = crypto.randomBytes(64).toString('hex');

console.log('JWT_SECRET=' + jwtSecret);
console.log('JWT_REFRESH_SECRET=' + refreshSecret);
```

### 2. Database Security

```sql
-- Create read-only user
CREATE USER fixer_readonly WITH PASSWORD 'readonly_password';
GRANT SELECT ON ALL TABLES IN SCHEMA public TO fixer_readonly;

-- Create application user with limited privileges
CREATE USER fixer_app WITH PASSWORD 'app_password';
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO fixer_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO fixer_app;
```

### 3. Redis Security

```bash
# Set Redis password
redis-cli
CONFIG SET requirepass "your_redis_password"
CONFIG REWRITE
```

### 4. File Upload Security

```javascript
// Configure multer for security
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Generate secure filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    const allowedTypes = process.env.ALLOWED_FILE_TYPES?.split(',') || ['image/*'];
    const isAllowed = allowedTypes.some(type => {
      if (type.endsWith('/*')) {
        return file.mimetype.startsWith(type.slice(0, -1));
      }
      return file.mimetype === type;
    });
    
    if (isAllowed) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  }
});
```

## 🌐 External Services

### 1. Email Service Setup

#### Gmail SMTP

```bash
# Enable 2-factor authentication
# Generate app password
# Use app password in SMTP_PASS
```

#### AWS SES

```bash
# Configure AWS credentials
aws configure

# Verify email addresses
aws ses verify-email-identity --email-address noreply@fixer.com

# Set up SMTP credentials
aws ses create-smtp-credentials --user-name fixer-smtp
```

### 2. SMS Service Setup

#### Twilio

```bash
# Sign up for Twilio account
# Get Account SID and Auth Token
# Purchase phone number
# Configure webhook URLs
```

### 3. Payment Service Setup

#### Stripe

```bash
# Create Stripe account
# Get API keys from dashboard
# Set up webhook endpoints
# Configure payment methods
```

#### Razorpay

```bash
# Create Razorpay account
# Get API keys from dashboard
# Set up webhook URLs
# Configure payment methods
```

### 4. File Storage Setup

#### AWS S3

```bash
# Create S3 bucket
aws s3 mb s3://fixer-uploads

# Configure CORS
aws s3api put-bucket-cors --bucket fixer-uploads --cors-configuration file://cors.json

# Set up IAM user with S3 permissions
```

#### Cloudinary

```bash
# Sign up for Cloudinary account
# Get cloud name, API key, and secret
# Configure upload presets
# Set up transformations
```

## 🔧 Troubleshooting

### Common Issues

#### 1. Environment Variables Not Loading

```bash
# Check if .env file exists
ls -la .env

# Check file permissions
ls -la .env

# Verify variable names (no spaces around =)
grep -v '^#' .env | grep '='

# Test loading
node -e "require('dotenv').config(); console.log(process.env.NODE_ENV);"
```

#### 2. Database Connection Issues

```bash
# Test database connection
psql -h $DB_HOST -U $DB_USER -d $DB_NAME

# Check PostgreSQL status
sudo systemctl status postgresql

# Check connection logs
sudo tail -f /var/log/postgresql/postgresql-*.log
```

#### 3. Redis Connection Issues

```bash
# Test Redis connection
redis-cli -h $REDIS_HOST -p $REDIS_PORT ping

# Check Redis status
sudo systemctl status redis

# Check Redis logs
sudo tail -f /var/log/redis/redis-server.log
```

#### 4. JWT Token Issues

```bash
# Verify JWT secrets are set
echo $JWT_SECRET
echo $JWT_REFRESH_SECRET

# Test JWT generation
node -e "
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;
if (!secret) {
  console.log('JWT_SECRET not set');
  process.exit(1);
}
const token = jwt.sign({test: 'data'}, secret);
console.log('JWT generated successfully');
"
```

### Configuration Validation

```bash
# Validate all environment variables
npm run validate-config

# Check database schema
npm run db:check

# Test external services
npm run test:services
```

### Debug Mode

```bash
# Enable debug logging
export LOG_LEVEL=debug
export DEBUG=fixer:*

# Start application with debug
npm run dev:debug
```

This environment configuration guide provides comprehensive instructions for setting up and managing the Fixer Marketplace backend in various environments with proper security and monitoring.
