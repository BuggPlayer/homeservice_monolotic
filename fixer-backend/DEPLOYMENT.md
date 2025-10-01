# Production Deployment Guide

This guide covers deploying the Fixer Backend API to production environments.

## 🚀 Deployment Options

### 1. Docker Deployment (Recommended)

#### Prerequisites
- Docker and Docker Compose installed
- Domain name configured
- SSL certificates (Let's Encrypt recommended)

#### Steps

1. **Clone and configure**
   ```bash
   git clone <repository-url>
   cd fixer-backend
   cp .env.example .env.production
   ```

2. **Update environment variables**
   Edit `.env.production` with your production values:
   ```env
   NODE_ENV=production
   DB_HOST=your-production-db-host
   DB_PASSWORD=your-secure-password
   JWT_SECRET=your-super-secure-jwt-secret
   # ... other production values
   ```

3. **Deploy with Docker Compose**
   ```bash
   docker-compose -f docker-compose.yml up -d
   ```

4. **Run database migrations**
   ```bash
   docker-compose exec backend npm run migrate
   ```

5. **Seed initial data (optional)**
   ```bash
   docker-compose exec backend npm run seed
   ```

### 2. Manual Server Deployment

#### Prerequisites
- Ubuntu 20.04+ or CentOS 8+
- Node.js 18+
- PostgreSQL 12+
- Redis 6+
- Nginx
- PM2 (for process management)

#### Steps

1. **Server setup**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PostgreSQL
   sudo apt install postgresql postgresql-contrib
   
   # Install Redis
   sudo apt install redis-server
   
   # Install Nginx
   sudo apt install nginx
   
   # Install PM2
   sudo npm install -g pm2
   ```

2. **Database setup**
   ```bash
   sudo -u postgres psql
   CREATE DATABASE fixer_marketplace_prod;
   CREATE USER fixer_user WITH PASSWORD 'secure_password';
   GRANT ALL PRIVILEGES ON DATABASE fixer_marketplace_prod TO fixer_user;
   \q
   ```

3. **Application deployment**
   ```bash
   # Clone repository
   git clone <repository-url>
   cd fixer-backend
   
   # Install dependencies
   npm ci --production
   
   # Build application
   npm run build
   
   # Configure environment
   cp .env.example .env
   # Edit .env with production values
   
   # Run migrations
   npm run migrate
   
   # Start with PM2
   pm2 start dist/server.js --name "fixer-backend"
   pm2 save
   pm2 startup
   ```

4. **Nginx configuration**
   ```bash
   sudo nano /etc/nginx/sites-available/fixer-backend
   ```
   
   Add the following configuration:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
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
       }
   }
   ```
   
   Enable the site:
   ```bash
   sudo ln -s /etc/nginx/sites-available/fixer-backend /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

### 3. Cloud Platform Deployment

#### AWS Deployment

1. **EC2 Instance Setup**
   - Launch Ubuntu 20.04 LTS instance
   - Configure security groups (ports 22, 80, 443, 3000)
   - Install Docker and Docker Compose

2. **RDS Database**
   - Create PostgreSQL RDS instance
   - Configure security groups
   - Update connection strings

3. **ElastiCache Redis**
   - Create Redis cluster
   - Configure security groups
   - Update Redis connection strings

4. **S3 Bucket**
   - Create S3 bucket for file uploads
   - Configure IAM user with S3 permissions
   - Update AWS credentials

5. **Application Load Balancer**
   - Create ALB
   - Configure target groups
   - Set up SSL certificates

#### Google Cloud Platform

1. **Compute Engine**
   - Create VM instance
   - Install Docker
   - Deploy application

2. **Cloud SQL**
   - Create PostgreSQL instance
   - Configure private IP
   - Set up connection

3. **Cloud Storage**
   - Create bucket for file uploads
   - Configure permissions

#### Heroku Deployment

1. **Prepare for Heroku**
   ```bash
   # Add Heroku Postgres
   heroku addons:create heroku-postgresql:hobby-dev
   
   # Add Heroku Redis
   heroku addons:create heroku-redis:hobby-dev
   
   # Set environment variables
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=your-secret
   # ... other environment variables
   ```

2. **Deploy**
   ```bash
   git push heroku main
   heroku run npm run migrate
   ```

## 🔒 Security Configuration

### SSL/TLS Setup

1. **Let's Encrypt (Free)**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

2. **Custom SSL Certificate**
   - Upload certificate files to `/etc/nginx/ssl/`
   - Update Nginx configuration

### Firewall Configuration

```bash
# UFW (Ubuntu)
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable

# iptables (CentOS)
sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT
```

### Environment Security

1. **Use strong passwords**
2. **Enable database SSL**
3. **Use environment variables for secrets**
4. **Regular security updates**
5. **Monitor logs and access**

## 📊 Monitoring and Logging

### Application Monitoring

1. **PM2 Monitoring**
   ```bash
   pm2 monit
   pm2 logs
   ```

2. **Health Checks**
   - Endpoint: `GET /health`
   - Monitor response time and status

3. **Log Management**
   ```bash
   # Log rotation
   sudo nano /etc/logrotate.d/fixer-backend
   ```

### Database Monitoring

1. **PostgreSQL Monitoring**
   ```sql
   -- Check connections
   SELECT count(*) FROM pg_stat_activity;
   
   -- Check slow queries
   SELECT query, mean_time, calls 
   FROM pg_stat_statements 
   ORDER BY mean_time DESC;
   ```

2. **Redis Monitoring**
   ```bash
   redis-cli info
   redis-cli monitor
   ```

## 🔄 Backup and Recovery

### Database Backup

1. **Automated Backups**
   ```bash
   # Create backup script
   sudo nano /usr/local/bin/backup-db.sh
   ```

   ```bash
   #!/bin/bash
   BACKUP_DIR="/var/backups/postgresql"
   DATE=$(date +%Y%m%d_%H%M%S)
   DB_NAME="fixer_marketplace_prod"
   
   mkdir -p $BACKUP_DIR
   pg_dump $DB_NAME > $BACKUP_DIR/backup_$DATE.sql
   
   # Keep only last 7 days
   find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete
   ```

2. **Schedule Backups**
   ```bash
   sudo crontab -e
   # Add: 0 2 * * * /usr/local/bin/backup-db.sh
   ```

### File Backup

1. **S3 Backup**
   ```bash
   aws s3 sync /app/uploads s3://your-backup-bucket/uploads
   ```

2. **Local Backup**
   ```bash
   tar -czf backup_$(date +%Y%m%d).tar.gz /app/uploads
   ```

## 🚀 Scaling

### Horizontal Scaling

1. **Load Balancer Configuration**
   - Multiple backend instances
   - Health checks
   - Session persistence (if needed)

2. **Database Scaling**
   - Read replicas
   - Connection pooling
   - Query optimization

3. **Caching Strategy**
   - Redis clustering
   - CDN for static files
   - Application-level caching

### Vertical Scaling

1. **Resource Monitoring**
   - CPU usage
   - Memory usage
   - Disk I/O
   - Network I/O

2. **Performance Optimization**
   - Database indexing
   - Query optimization
   - Code profiling

## 🔧 Maintenance

### Regular Tasks

1. **Security Updates**
   ```bash
   sudo apt update && sudo apt upgrade
   npm audit fix
   ```

2. **Database Maintenance**
   ```sql
   -- Vacuum and analyze
   VACUUM ANALYZE;
   
   -- Update statistics
   ANALYZE;
   ```

3. **Log Rotation**
   ```bash
   sudo logrotate -f /etc/logrotate.conf
   ```

### Troubleshooting

1. **Common Issues**
   - Database connection errors
   - Memory leaks
   - Disk space issues
   - Network connectivity

2. **Debug Commands**
   ```bash
   # Check application status
   pm2 status
   
   # Check logs
   pm2 logs fixer-backend
   
   # Check database
   sudo -u postgres psql -c "SELECT * FROM pg_stat_activity;"
   
   # Check Redis
   redis-cli ping
   ```

## 📈 Performance Optimization

### Application Level

1. **Code Optimization**
   - Use connection pooling
   - Implement caching
   - Optimize database queries
   - Use compression

2. **Resource Management**
   - Monitor memory usage
   - Optimize garbage collection
   - Use streaming for large files

### Infrastructure Level

1. **Database Optimization**
   - Proper indexing
   - Query optimization
   - Connection pooling
   - Read replicas

2. **Caching Strategy**
   - Redis for session storage
   - CDN for static assets
   - Application-level caching

This deployment guide provides comprehensive instructions for deploying the Fixer Backend API to production environments with proper security, monitoring, and scaling considerations.
