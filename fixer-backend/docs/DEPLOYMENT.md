# 🚀 Deployment Guide

This document provides comprehensive deployment instructions for the Fixer Marketplace backend in various environments.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Docker Deployment](#docker-deployment)
- [AWS Deployment](#aws-deployment)
- [Production Checklist](#production-checklist)
- [Monitoring & Logging](#monitoring--logging)
- [Backup & Recovery](#backup--recovery)
- [Troubleshooting](#troubleshooting)

## 🔧 Prerequisites

### System Requirements

**Minimum Requirements:**
- CPU: 2 cores
- RAM: 4GB
- Storage: 20GB SSD
- OS: Ubuntu 20.04+ / CentOS 8+ / Amazon Linux 2

**Recommended Requirements:**
- CPU: 4+ cores
- RAM: 8GB+
- Storage: 50GB+ SSD
- OS: Ubuntu 22.04 LTS

### Software Dependencies

- **Node.js**: 18.x or higher
- **PostgreSQL**: 14.x or higher
- **Redis**: 7.x or higher
- **Docker**: 20.x or higher (for containerized deployment)
- **Nginx**: 1.18+ (for reverse proxy)

### External Services

- **Email Service**: AWS SES, SendGrid, or similar
- **SMS Service**: Twilio
- **Payment Processing**: Stripe, Razorpay
- **File Storage**: AWS S3, Cloudinary
- **Monitoring**: Sentry, New Relic, or similar

## 🌍 Environment Setup

### 1. Development Environment

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

# Start development server
npm run dev
```

### 2. Staging Environment

```bash
# Set environment
export NODE_ENV=staging

# Install production dependencies
npm ci --only=production

# Build application
npm run build

# Run migrations
npm run migrate

# Seed database
npm run seed:comprehensive

# Start application
npm start
```

### 3. Production Environment

```bash
# Set environment
export NODE_ENV=production

# Install production dependencies
npm ci --only=production

# Build application
npm run build

# Run migrations
npm run migrate

# Start application with PM2
pm2 start ecosystem.config.js
```

## 🐳 Docker Deployment

### 1. Docker Compose Setup

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DB_HOST=postgres
      - REDIS_HOST=redis
    depends_on:
      - postgres
      - redis
    volumes:
      - ./uploads:/app/uploads
      - ./logs:/app/logs
    restart: unless-stopped

  postgres:
    image: postgres:14-alpine
    environment:
      - POSTGRES_DB=fixer_marketplace
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=your_secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    command: redis-server --requirepass your_redis_password
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

### 2. Dockerfile

```dockerfile
# Use Node.js 18 Alpine as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache \
    postgresql-client \
    python3 \
    make \
    g++

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Build application
RUN npm run build

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Change ownership
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Start application
CMD ["npm", "start"]
```

### 3. Deploy with Docker

```bash
# Build and start services
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Scale application
docker-compose -f docker-compose.prod.yml up -d --scale app=3

# Stop services
docker-compose -f docker-compose.prod.yml down
```

## ☁️ AWS Deployment

### 1. EC2 Instance Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Install Redis
sudo apt install redis-server -y

# Install Nginx
sudo apt install nginx -y

# Install PM2
sudo npm install -g pm2
```

### 2. Database Setup

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE fixer_marketplace;
CREATE USER fixer_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE fixer_marketplace TO fixer_user;
\q

# Configure PostgreSQL
sudo nano /etc/postgresql/14/main/postgresql.conf
# Set listen_addresses = 'localhost'

sudo nano /etc/postgresql/14/main/pg_hba.conf
# Add: local   all             fixer_user                    md5
```

### 3. Application Deployment

```bash
# Clone repository
git clone https://github.com/your-org/fixer-backend.git
cd fixer-backend

# Install dependencies
npm ci --only=production

# Build application
npm run build

# Create PM2 ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'fixer-backend',
    script: 'dist/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
EOF

# Start application
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 4. Nginx Configuration

```nginx
# /etc/nginx/sites-available/fixer-backend
server {
    listen 80;
    server_name your-domain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    # SSL Configuration
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req zone=api burst=20 nodelay;

    # Proxy to application
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    # Static files
    location /uploads {
        alias /app/fixer-backend/uploads;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Health check
    location /health {
        access_log off;
        proxy_pass http://localhost:3000/health;
    }
}
```

### 5. SSL Certificate Setup

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## ✅ Production Checklist

### Pre-Deployment

- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] SSL certificates installed
- [ ] Firewall rules configured
- [ ] Monitoring tools set up
- [ ] Backup strategy implemented
- [ ] Load testing completed
- [ ] Security audit performed

### Post-Deployment

- [ ] Health checks passing
- [ ] All endpoints responding
- [ ] Database connections stable
- [ ] Redis connections stable
- [ ] File uploads working
- [ ] Email notifications working
- [ ] Payment processing working
- [ ] Monitoring alerts configured

### Security Checklist

- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] Input validation implemented
- [ ] SQL injection prevention
- [ ] XSS protection enabled
- [ ] CSRF protection enabled
- [ ] Regular security updates

## 📊 Monitoring & Logging

### 1. Application Monitoring

```javascript
// monitoring.js
const Sentry = require('@sentry/node');
const { ProfilingIntegration } = require('@sentry/profiling-node');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    new ProfilingIntegration(),
  ],
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
});

// Performance monitoring
const newrelic = require('newrelic');
```

### 2. Logging Configuration

```javascript
// logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'fixer-backend' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
```

### 3. Health Check Endpoint

```javascript
// health.js
app.get('/health', async (req, res) => {
  const health = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    database: 'unknown',
    redis: 'unknown'
  };

  try {
    // Check database
    await db.query('SELECT 1');
    health.database = 'connected';
  } catch (error) {
    health.database = 'disconnected';
    health.status = 'ERROR';
  }

  try {
    // Check Redis
    await redis.ping();
    health.redis = 'connected';
  } catch (error) {
    health.redis = 'disconnected';
    health.status = 'ERROR';
  }

  const statusCode = health.status === 'OK' ? 200 : 503;
  res.status(statusCode).json(health);
});
```

## 💾 Backup & Recovery

### 1. Database Backup

```bash
#!/bin/bash
# backup-db.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/postgres"
DB_NAME="fixer_marketplace"

# Create backup directory
mkdir -p $BACKUP_DIR

# Create database backup
pg_dump -h localhost -U fixer_user -d $DB_NAME > $BACKUP_DIR/backup_$DATE.sql

# Compress backup
gzip $BACKUP_DIR/backup_$DATE.sql

# Remove backups older than 30 days
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -delete

echo "Backup completed: backup_$DATE.sql.gz"
```

### 2. Automated Backup

```bash
# Add to crontab
crontab -e

# Daily backup at 2 AM
0 2 * * * /path/to/backup-db.sh

# Weekly full backup
0 1 * * 0 /path/to/full-backup.sh
```

### 3. Recovery Process

```bash
# Restore database
gunzip backup_20240115_020000.sql.gz
psql -h localhost -U fixer_user -d fixer_marketplace < backup_20240115_020000.sql

# Verify restoration
psql -h localhost -U fixer_user -d fixer_marketplace -c "SELECT COUNT(*) FROM users;"
```

## 🔧 Troubleshooting

### Common Issues

#### 1. Application Won't Start

```bash
# Check logs
pm2 logs fixer-backend

# Check environment variables
pm2 show fixer-backend

# Restart application
pm2 restart fixer-backend
```

#### 2. Database Connection Issues

```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Check connection
psql -h localhost -U fixer_user -d fixer_marketplace

# Check logs
sudo tail -f /var/log/postgresql/postgresql-14-main.log
```

#### 3. Redis Connection Issues

```bash
# Check Redis status
sudo systemctl status redis

# Test connection
redis-cli ping

# Check logs
sudo tail -f /var/log/redis/redis-server.log
```

#### 4. High Memory Usage

```bash
# Check memory usage
pm2 monit

# Restart application
pm2 restart fixer-backend

# Check for memory leaks
node --inspect dist/server.js
```

### Performance Optimization

#### 1. Database Optimization

```sql
-- Analyze query performance
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'user@example.com';

-- Create missing indexes
CREATE INDEX CONCURRENTLY idx_users_email ON users(email);

-- Update table statistics
ANALYZE users;
```

#### 2. Application Optimization

```javascript
// Enable compression
app.use(compression());

// Set cache headers
app.use('/static', express.static('public', {
  maxAge: '1y',
  etag: false
}));

// Connection pooling
const pool = new Pool({
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

### Monitoring Commands

```bash
# Check application status
pm2 status

# Monitor resources
pm2 monit

# View logs
pm2 logs fixer-backend --lines 100

# Check database connections
psql -h localhost -U fixer_user -d fixer_marketplace -c "SELECT * FROM pg_stat_activity;"

# Check Redis memory
redis-cli info memory

# Check disk usage
df -h

# Check memory usage
free -h
```

This deployment guide provides comprehensive instructions for deploying the Fixer Marketplace backend in various environments with proper monitoring, security, and maintenance procedures.
