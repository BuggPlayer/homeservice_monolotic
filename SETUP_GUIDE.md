# 🚀 Fixer Marketplace - Complete Setup Guide

This guide will walk you through setting up the Fixer Marketplace platform from scratch, including all dependencies, configurations, and initial setup steps.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [System Requirements](#system-requirements)
- [Installation Steps](#installation-steps)
- [Environment Configuration](#environment-configuration)
- [Database Setup](#database-setup)
- [Development Setup](#development-setup)
- [Production Setup](#production-setup)
- [Verification](#verification)
- [Troubleshooting](#troubleshooting)

## 🔧 Prerequisites

### Required Software

1. **Node.js 18+**
   ```bash
   # Check version
   node --version
   npm --version
   
   # Install Node.js 18+ from https://nodejs.org/
   ```

2. **PostgreSQL 14+**
   ```bash
   # Ubuntu/Debian
   sudo apt update
   sudo apt install postgresql postgresql-contrib
   
   # macOS (using Homebrew)
   brew install postgresql
   
   # Windows: Download from https://www.postgresql.org/download/windows/
   ```

3. **Redis 7+**
   ```bash
   # Ubuntu/Debian
   sudo apt install redis-server
   
   # macOS (using Homebrew)
   brew install redis
   
   # Windows: Download from https://github.com/microsoftarchive/redis/releases
   ```

4. **Git**
   ```bash
   # Ubuntu/Debian
   sudo apt install git
   
   # macOS (using Homebrew)
   brew install git
   
   # Windows: Download from https://git-scm.com/download/win
   ```

### Optional Software

- **Docker & Docker Compose** (for containerized deployment)
- **PM2** (for production process management)
- **Nginx** (for production reverse proxy)

## 💻 System Requirements

### Minimum Requirements
- **RAM**: 4GB
- **Storage**: 10GB free space
- **CPU**: 2 cores
- **OS**: Windows 10+, macOS 10.15+, Ubuntu 18.04+

### Recommended Requirements
- **RAM**: 8GB+
- **Storage**: 20GB+ free space
- **CPU**: 4+ cores
- **OS**: Latest versions

## 📦 Installation Steps

### 1. Clone the Repository

```bash
# Clone the repository
git clone <repository-url>
cd Homeservice

# Verify the structure
ls -la
# Should show: fixer-admin/ and fixer-backend/
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd fixer-backend

# Install dependencies
npm install

# Verify installation
npm list --depth=0
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd fixer-admin

# Install dependencies
npm install

# Verify installation
npm list --depth=0
```

## ⚙️ Environment Configuration

### Backend Environment Setup

```bash
# Navigate to backend directory
cd fixer-backend

# Copy environment template
cp env.example .env

# Edit the .env file with your configuration
nano .env  # or use your preferred editor
```

#### Required Environment Variables

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/fixer_db
REDIS_URL=redis://localhost:6379

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
JWT_REFRESH_SECRET=your_super_secret_refresh_key_here_make_it_long_and_random
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Server Configuration
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

# Payment Gateways (Optional for development)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
RAZORPAY_KEY_ID=rzp_test_your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# File Storage (Optional for development)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Email Configuration (Optional for development)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# SMS Configuration (Optional for development)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend Environment Setup

```bash
# Navigate to frontend directory
cd fixer-admin

# Create environment file
touch .env

# Edit the .env file
nano .env  # or use your preferred editor
```

#### Frontend Environment Variables

```env
# API Configuration
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_WS_URL=ws://localhost:5000

# Payment Gateways (Optional for development)
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
REACT_APP_RAZORPAY_KEY_ID=rzp_test_your_razorpay_key_id

# App Configuration
REACT_APP_APP_NAME=Fixer Marketplace
REACT_APP_APP_VERSION=1.0.0
REACT_APP_DEBUG=true
```

## 🗄️ Database Setup

### 1. PostgreSQL Setup

```bash
# Start PostgreSQL service
sudo systemctl start postgresql  # Linux
brew services start postgresql   # macOS

# Create database and user
sudo -u postgres psql

# In PostgreSQL shell:
CREATE DATABASE fixer_db;
CREATE USER fixer_user WITH PASSWORD 'fixer_password';
GRANT ALL PRIVILEGES ON DATABASE fixer_db TO fixer_user;
ALTER USER fixer_user CREATEDB;
\q
```

### 2. Redis Setup

```bash
# Start Redis service
sudo systemctl start redis-server  # Linux
brew services start redis          # macOS

# Test Redis connection
redis-cli ping
# Should return: PONG
```

### 3. Database Migration and Seeding

```bash
# Navigate to backend directory
cd fixer-backend

# Run database migrations
npm run migrate

# Seed the database with initial data
npm run seed:comprehensive

# Verify database setup
npm run test-setup
```

## 🛠️ Development Setup

### 1. Start Backend Server

```bash
# Navigate to backend directory
cd fixer-backend

# Start development server
npm run dev

# Server should start on http://localhost:5000
# You should see: "Server running on port 5000"
```

### 2. Start Frontend Server

```bash
# Open new terminal and navigate to frontend directory
cd fixer-admin

# Start development server
npm start

# Frontend should start on http://localhost:3000
# Browser should open automatically
```

### 3. Verify Setup

1. **Backend Health Check**:
   ```bash
   curl http://localhost:5000/health
   # Should return: {"status":"OK","timestamp":"...","uptime":...}
   ```

2. **Frontend Access**:
   - Open browser to http://localhost:3000
   - You should see the login page

3. **Test Login**:
   - Use test credentials:
     - Admin: `admin@fixer.com` / `admin123`
     - Customer: `john.doe@example.com` / `password123`
     - Provider: `electrician@fixer.com` / `password123`

## 🚀 Production Setup

### 1. Build Applications

```bash
# Build backend
cd fixer-backend
npm run build

# Build frontend
cd fixer-admin
npm run build
```

### 2. Environment Configuration

Update production environment variables:

```env
# Backend .env (Production)
NODE_ENV=production
PORT=5000
CORS_ORIGIN=https://your-domain.com

# Use production database URLs
DATABASE_URL=postgresql://user:pass@prod-db:5432/fixer_db
REDIS_URL=redis://prod-redis:6379

# Use production payment keys
STRIPE_SECRET_KEY=sk_live_your_live_stripe_key
RAZORPAY_KEY_ID=rzp_live_your_live_razorpay_key
```

### 3. Process Management (PM2)

```bash
# Install PM2 globally
npm install -g pm2

# Create PM2 ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [
    {
      name: 'fixer-backend',
      script: './dist/server.js',
      cwd: './fixer-backend',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      }
    }
  ]
};
EOF

# Start application with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 4. Nginx Configuration

```nginx
# /etc/nginx/sites-available/fixer
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /path/to/fixer-admin/build;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket support
    location /socket.io {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## ✅ Verification

### 1. Backend Verification

```bash
# Test API endpoints
curl -X GET http://localhost:5000/health
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@fixer.com","password":"admin123"}'
```

### 2. Frontend Verification

1. Open http://localhost:3000
2. Login with test credentials
3. Navigate through different pages
4. Test form submissions
5. Verify API calls in browser network tab

### 3. Database Verification

```bash
# Connect to database
psql -h localhost -U fixer_user -d fixer_db

# Check tables
\dt

# Check sample data
SELECT * FROM users LIMIT 5;
SELECT * FROM service_requests LIMIT 5;
```

### 4. Redis Verification

```bash
# Connect to Redis
redis-cli

# Check keys
KEYS *

# Test set/get
SET test "Hello World"
GET test
```

## 🔧 Troubleshooting

### Common Issues and Solutions

#### 1. Port Already in Use

**Error**: `EADDRINUSE: address already in use :::5000`

**Solution**:
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or use different port
PORT=5001 npm run dev
```

#### 2. Database Connection Failed

**Error**: `ECONNREFUSED` or `database does not exist`

**Solution**:
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Start PostgreSQL
sudo systemctl start postgresql

# Verify database exists
sudo -u postgres psql -l

# Create database if missing
sudo -u postgres createdb fixer_db
```

#### 3. Redis Connection Failed

**Error**: `ECONNREFUSED 127.0.0.1:6379`

**Solution**:
```bash
# Check Redis status
sudo systemctl status redis-server

# Start Redis
sudo systemctl start redis-server

# Test connection
redis-cli ping
```

#### 4. Frontend Build Errors

**Error**: `Module not found` or build failures

**Solution**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear npm cache
npm cache clean --force

# Try different Node.js version
nvm use 18  # if using nvm
```

#### 5. Environment Variables Not Loading

**Error**: `undefined` environment variables

**Solution**:
```bash
# Check .env file exists and has correct format
ls -la .env
cat .env

# Restart development server
# Environment variables are loaded on startup
```

#### 6. CORS Issues

**Error**: `CORS policy` errors in browser

**Solution**:
```bash
# Check CORS_ORIGIN in backend .env
CORS_ORIGIN=http://localhost:3000

# Restart backend server
npm run dev
```

### Debug Mode

Enable debug mode for detailed logging:

```bash
# Backend debug mode
DEBUG=fixer:* npm run dev

# Frontend debug mode
REACT_APP_DEBUG=true npm start
```

### Log Files

Check these locations for logs:

- **Backend**: Console output or log files
- **Frontend**: Browser console (F12)
- **PostgreSQL**: `/var/log/postgresql/`
- **Redis**: `/var/log/redis/`
- **Nginx**: `/var/log/nginx/`

### Performance Issues

#### Database Performance
```bash
# Check database connections
psql -c "SELECT * FROM pg_stat_activity;"

# Check slow queries
psql -c "SELECT * FROM pg_stat_statements ORDER BY total_time DESC LIMIT 10;"
```

#### Memory Usage
```bash
# Check Node.js memory usage
ps aux | grep node

# Check system resources
htop
```

## 📞 Getting Help

If you encounter issues not covered in this guide:

1. **Check the logs** for error messages
2. **Search existing issues** in the repository
3. **Create a new issue** with detailed information:
   - Operating system and version
   - Node.js version
   - Error messages and logs
   - Steps to reproduce

## 🎉 Next Steps

After successful setup:

1. **Read the API Documentation** to understand available endpoints
2. **Explore the codebase** to understand the architecture
3. **Run the test suite** to ensure everything works
4. **Start developing** new features or fixing bugs
5. **Deploy to production** when ready

---

**Setup completed successfully!** 🎉

You now have a fully functional Fixer Marketplace development environment. Happy coding!
