# 🗄️ Database Usage Guide

This document provides comprehensive guidance on how to use the Fixer Marketplace database, including common queries, best practices, and maintenance procedures.

## 📋 Table of Contents

- [Database Overview](#database-overview)
- [Common Queries](#common-queries)
- [Data Relationships](#data-relationships)
- [Performance Optimization](#performance-optimization)
- [Maintenance Procedures](#maintenance-procedures)
- [Backup & Recovery](#backup--recovery)
- [Troubleshooting](#troubleshooting)

## 🏗️ Database Overview

### Database Information
- **Type**: PostgreSQL 14+
- **Encoding**: UTF-8
- **Timezone**: UTC
- **Extensions**: uuid-ossp, pgcrypto
- **Connection Pool**: 20 max connections

### Core Tables
1. **users** - User accounts and authentication
2. **service_providers** - Service provider profiles
3. **service_requests** - Customer service requests
4. **quotes** - Provider quotes for service requests
5. **bookings** - Scheduled service appointments
6. **payments** - Payment transactions
7. **reviews** - Customer reviews and ratings
8. **products** - Product catalog
9. **categories** - Product/service categories
10. **audit_logs** - System audit trail

## 🔍 Common Queries

### User Management

#### Get All Users with Pagination
```sql
SELECT 
    u.id,
    u.email,
    u.first_name,
    u.last_name,
    u.user_type,
    u.is_verified,
    u.created_at
FROM users u
ORDER BY u.created_at DESC
LIMIT 10 OFFSET 0;
```

#### Get User by Email
```sql
SELECT * FROM users 
WHERE email = 'user@example.com';
```

#### Get Users by Type
```sql
SELECT * FROM users 
WHERE user_type = 'customer'
AND is_verified = true;
```

#### Update User Profile
```sql
UPDATE users 
SET 
    first_name = 'John',
    last_name = 'Smith',
    updated_at = NOW()
WHERE id = 'user-uuid';
```

### Service Providers

#### Get Verified Providers
```sql
SELECT 
    sp.id,
    sp.business_name,
    sp.services_offered,
    sp.rating,
    sp.total_reviews,
    u.first_name,
    u.last_name
FROM service_providers sp
JOIN users u ON sp.user_id = u.id
WHERE sp.verification_status = 'verified'
ORDER BY sp.rating DESC;
```

#### Get Providers by Service Type
```sql
SELECT 
    sp.id,
    sp.business_name,
    sp.services_offered,
    sp.rating
FROM service_providers sp
WHERE 'plumbing' = ANY(sp.services_offered)
AND sp.verification_status = 'verified';
```

#### Get Provider Statistics
```sql
SELECT 
    sp.business_name,
    COUNT(sr.id) as total_requests,
    COUNT(q.id) as total_quotes,
    COUNT(b.id) as total_bookings,
    AVG(r.rating) as avg_rating
FROM service_providers sp
LEFT JOIN quotes q ON sp.id = q.provider_id
LEFT JOIN bookings b ON q.id = b.quote_id
LEFT JOIN service_requests sr ON q.service_request_id = sr.id
LEFT JOIN reviews r ON b.id = r.booking_id
WHERE sp.id = 'provider-uuid'
GROUP BY sp.id, sp.business_name;
```

### Service Requests

#### Get Service Requests by Status
```sql
SELECT 
    sr.id,
    sr.title,
    sr.service_type,
    sr.status,
    sr.urgency,
    sr.created_at,
    u.first_name || ' ' || u.last_name as customer_name
FROM service_requests sr
JOIN users u ON sr.customer_id = u.id
WHERE sr.status = 'open'
ORDER BY sr.created_at DESC;
```

#### Get Service Requests by Location
```sql
SELECT 
    sr.id,
    sr.title,
    sr.service_type,
    sr.location->>'city' as city,
    sr.location->>'state' as state
FROM service_requests sr
WHERE sr.location->>'city' = 'New York'
AND sr.status = 'open';
```

#### Get Service Request with Quotes
```sql
SELECT 
    sr.id,
    sr.title,
    sr.description,
    sr.status,
    q.id as quote_id,
    q.amount,
    q.description as quote_description,
    sp.business_name,
    sp.rating
FROM service_requests sr
LEFT JOIN quotes q ON sr.id = q.service_request_id
LEFT JOIN service_providers sp ON q.provider_id = sp.id
WHERE sr.id = 'request-uuid';
```

### Quotes and Bookings

#### Get Quotes by Provider
```sql
SELECT 
    q.id,
    q.amount,
    q.status,
    q.created_at,
    sr.title as service_title,
    u.first_name || ' ' || u.last_name as customer_name
FROM quotes q
JOIN service_requests sr ON q.service_request_id = sr.id
JOIN users u ON sr.customer_id = u.id
WHERE q.provider_id = 'provider-uuid'
ORDER BY q.created_at DESC;
```

#### Get Bookings by Date Range
```sql
SELECT 
    b.id,
    b.scheduled_date,
    b.scheduled_time,
    b.status,
    b.total_amount,
    sr.title as service_title,
    sp.business_name,
    u.first_name || ' ' || u.last_name as customer_name
FROM bookings b
JOIN service_requests sr ON b.service_request_id = sr.id
JOIN service_providers sp ON b.provider_id = sp.id
JOIN users u ON b.customer_id = u.id
WHERE b.scheduled_date BETWEEN '2024-01-01' AND '2024-01-31'
ORDER BY b.scheduled_date, b.scheduled_time;
```

#### Get Booking Statistics
```sql
SELECT 
    DATE(b.scheduled_date) as booking_date,
    COUNT(*) as total_bookings,
    SUM(b.total_amount) as total_revenue,
    AVG(b.total_amount) as avg_booking_value
FROM bookings b
WHERE b.scheduled_date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(b.scheduled_date)
ORDER BY booking_date;
```

### Payments

#### Get Payment History
```sql
SELECT 
    p.id,
    p.amount,
    p.currency,
    p.payment_method,
    p.status,
    p.created_at,
    b.scheduled_date,
    sp.business_name,
    u.first_name || ' ' || u.last_name as customer_name
FROM payments p
JOIN bookings b ON p.booking_id = b.id
JOIN service_providers sp ON p.provider_id = sp.id
JOIN users u ON p.customer_id = u.id
ORDER BY p.created_at DESC;
```

#### Get Revenue by Provider
```sql
SELECT 
    sp.business_name,
    COUNT(p.id) as total_payments,
    SUM(p.amount) as total_revenue,
    AVG(p.amount) as avg_payment
FROM payments p
JOIN service_providers sp ON p.provider_id = sp.id
WHERE p.status = 'completed'
AND p.created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY sp.id, sp.business_name
ORDER BY total_revenue DESC;
```

### Reviews and Ratings

#### Get Reviews by Provider
```sql
SELECT 
    r.id,
    r.rating,
    r.comment,
    r.created_at,
    u.first_name || ' ' || u.last_name as customer_name,
    sr.title as service_title
FROM reviews r
JOIN users u ON r.customer_id = u.id
JOIN bookings b ON r.booking_id = b.id
JOIN service_requests sr ON b.service_request_id = sr.id
WHERE r.provider_id = 'provider-uuid'
ORDER BY r.created_at DESC;
```

#### Get Average Rating by Provider
```sql
SELECT 
    sp.business_name,
    AVG(r.rating) as avg_rating,
    COUNT(r.id) as total_reviews,
    COUNT(CASE WHEN r.rating >= 4 THEN 1 END) as positive_reviews
FROM service_providers sp
LEFT JOIN reviews r ON sp.id = r.provider_id
GROUP BY sp.id, sp.business_name
HAVING COUNT(r.id) > 0
ORDER BY avg_rating DESC;
```

### Products and Categories

#### Get Products by Category
```sql
SELECT 
    p.id,
    p.name,
    p.price,
    p.stock_quantity,
    p.status,
    c.name as category_name,
    sp.business_name
FROM products p
JOIN categories c ON p.category_id = c.id
JOIN service_providers sp ON p.provider_id = sp.id
WHERE c.id = 'category-uuid'
AND p.status = 'active'
ORDER BY p.name;
```

#### Get Featured Products
```sql
SELECT 
    p.id,
    p.name,
    p.price,
    p.images,
    c.name as category_name,
    sp.business_name
FROM products p
JOIN categories c ON p.category_id = c.id
JOIN service_providers sp ON p.provider_id = sp.id
WHERE p.is_featured = true
AND p.status = 'active'
ORDER BY p.created_at DESC;
```

#### Get Category Hierarchy
```sql
WITH RECURSIVE category_tree AS (
    SELECT 
        id,
        name,
        description,
        parent_id,
        status,
        1 as level
    FROM categories
    WHERE parent_id IS NULL
    
    UNION ALL
    
    SELECT 
        c.id,
        c.name,
        c.description,
        c.parent_id,
        c.status,
        ct.level + 1
    FROM categories c
    JOIN category_tree ct ON c.parent_id = ct.id
)
SELECT 
    id,
    name,
    description,
    parent_id,
    status,
    level
FROM category_tree
ORDER BY level, name;
```

## 🔗 Data Relationships

### Key Relationships

1. **Users → Service Providers**: One-to-one (users.id = service_providers.user_id)
2. **Users → Service Requests**: One-to-many (users.id = service_requests.customer_id)
3. **Service Requests → Quotes**: One-to-many (service_requests.id = quotes.service_request_id)
4. **Quotes → Bookings**: One-to-one (quotes.id = bookings.quote_id)
5. **Bookings → Payments**: One-to-many (bookings.id = payments.booking_id)
6. **Bookings → Reviews**: One-to-many (bookings.id = reviews.booking_id)
7. **Categories → Products**: One-to-many (categories.id = products.category_id)
8. **Service Providers → Products**: One-to-many (service_providers.id = products.provider_id)

### Complex Queries

#### Get Complete Service Request Flow
```sql
SELECT 
    sr.id as request_id,
    sr.title,
    sr.status as request_status,
    q.id as quote_id,
    q.amount,
    q.status as quote_status,
    b.id as booking_id,
    b.scheduled_date,
    b.status as booking_status,
    p.id as payment_id,
    p.amount as payment_amount,
    p.status as payment_status,
    r.rating,
    r.comment
FROM service_requests sr
LEFT JOIN quotes q ON sr.id = q.service_request_id
LEFT JOIN bookings b ON q.id = b.quote_id
LEFT JOIN payments p ON b.id = p.booking_id
LEFT JOIN reviews r ON b.id = r.booking_id
WHERE sr.id = 'request-uuid';
```

#### Get Provider Dashboard Data
```sql
SELECT 
    sp.business_name,
    sp.rating,
    sp.total_reviews,
    COUNT(DISTINCT q.id) as total_quotes,
    COUNT(DISTINCT b.id) as total_bookings,
    COUNT(DISTINCT p.id) as total_payments,
    COALESCE(SUM(p.amount), 0) as total_revenue,
    COUNT(DISTINCT r.id) as total_reviews_received,
    AVG(r.rating) as avg_rating_received
FROM service_providers sp
LEFT JOIN quotes q ON sp.id = q.provider_id
LEFT JOIN bookings b ON q.id = b.quote_id
LEFT JOIN payments p ON b.id = p.booking_id AND p.status = 'completed'
LEFT JOIN reviews r ON b.id = r.booking_id
WHERE sp.id = 'provider-uuid'
GROUP BY sp.id, sp.business_name, sp.rating, sp.total_reviews;
```

## ⚡ Performance Optimization

### Indexing Strategy

#### Primary Indexes
```sql
-- Users table
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_user_type ON users(user_type);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Service providers table
CREATE INDEX idx_service_providers_user_id ON service_providers(user_id);
CREATE INDEX idx_service_providers_verification_status ON service_providers(verification_status);
CREATE INDEX idx_service_providers_rating ON service_providers(rating);
CREATE INDEX idx_service_providers_services ON service_providers USING GIN(services_offered);

-- Service requests table
CREATE INDEX idx_service_requests_customer_id ON service_requests(customer_id);
CREATE INDEX idx_service_requests_service_type ON service_requests(service_type);
CREATE INDEX idx_service_requests_status ON service_requests(status);
CREATE INDEX idx_service_requests_urgency ON service_requests(urgency);
CREATE INDEX idx_service_requests_created_at ON service_requests(created_at);
CREATE INDEX idx_service_requests_location ON service_requests USING GIN(location);

-- Quotes table
CREATE INDEX idx_quotes_service_request_id ON quotes(service_request_id);
CREATE INDEX idx_quotes_provider_id ON quotes(provider_id);
CREATE INDEX idx_quotes_status ON quotes(status);
CREATE INDEX idx_quotes_amount ON quotes(amount);
CREATE INDEX idx_quotes_created_at ON quotes(created_at);

-- Bookings table
CREATE INDEX idx_bookings_customer_id ON bookings(customer_id);
CREATE INDEX idx_bookings_provider_id ON bookings(provider_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_scheduled_date ON bookings(scheduled_date);
CREATE INDEX idx_bookings_created_at ON bookings(created_at);

-- Payments table
CREATE INDEX idx_payments_booking_id ON payments(booking_id);
CREATE INDEX idx_payments_customer_id ON payments(customer_id);
CREATE INDEX idx_payments_provider_id ON payments(provider_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_created_at ON payments(created_at);

-- Reviews table
CREATE INDEX idx_reviews_booking_id ON reviews(booking_id);
CREATE INDEX idx_reviews_customer_id ON reviews(customer_id);
CREATE INDEX idx_reviews_provider_id ON reviews(provider_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);

-- Products table
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_provider_id ON products(provider_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_featured ON products(is_featured) WHERE is_featured = true;

-- Categories table
CREATE INDEX idx_categories_parent_id ON categories(parent_id);
CREATE INDEX idx_categories_status ON categories(status);
CREATE INDEX idx_categories_name ON categories(name);
```

#### Composite Indexes
```sql
-- For common query patterns
CREATE INDEX idx_quotes_provider_status ON quotes(provider_id, status);
CREATE INDEX idx_bookings_provider_date ON bookings(provider_id, scheduled_date);
CREATE INDEX idx_payments_provider_status ON payments(provider_id, status);
CREATE INDEX idx_reviews_provider_rating ON reviews(provider_id, rating);
```

### Query Optimization

#### Use EXPLAIN ANALYZE
```sql
EXPLAIN ANALYZE 
SELECT * FROM service_requests 
WHERE status = 'open' 
AND created_at >= '2024-01-01';
```

#### Optimize Common Queries
```sql
-- Instead of multiple queries, use JOINs
SELECT 
    sr.id,
    sr.title,
    u.first_name,
    u.last_name,
    COUNT(q.id) as quote_count
FROM service_requests sr
JOIN users u ON sr.customer_id = u.id
LEFT JOIN quotes q ON sr.id = q.service_request_id
WHERE sr.status = 'open'
GROUP BY sr.id, sr.title, u.first_name, u.last_name;
```

#### Use Partial Indexes
```sql
-- Index only active records
CREATE INDEX idx_products_active ON products(category_id, price) 
WHERE status = 'active';

-- Index only verified providers
CREATE INDEX idx_providers_verified ON service_providers(rating, total_reviews) 
WHERE verification_status = 'verified';
```

## 🔧 Maintenance Procedures

### Daily Maintenance

#### Check Database Health
```sql
-- Check database size
SELECT 
    pg_database.datname,
    pg_size_pretty(pg_database_size(pg_database.datname)) AS size
FROM pg_database;

-- Check table sizes
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

#### Monitor Active Connections
```sql
-- Check active connections
SELECT 
    count(*) as total_connections,
    count(*) FILTER (WHERE state = 'active') as active_connections,
    count(*) FILTER (WHERE state = 'idle') as idle_connections
FROM pg_stat_activity;
```

### Weekly Maintenance

#### Update Table Statistics
```sql
-- Update statistics for all tables
ANALYZE;

-- Update statistics for specific table
ANALYZE service_requests;
```

#### Check for Unused Indexes
```sql
-- Find unused indexes
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes
WHERE idx_tup_read = 0
AND idx_tup_fetch = 0;
```

### Monthly Maintenance

#### Clean Up Old Data
```sql
-- Clean up old audit logs (older than 1 year)
DELETE FROM audit_logs 
WHERE created_at < NOW() - INTERVAL '1 year';

-- Clean up old sessions (older than 30 days)
DELETE FROM user_sessions 
WHERE expires_at < NOW();
```

#### Vacuum and Reindex
```sql
-- Vacuum all tables
VACUUM ANALYZE;

-- Reindex specific tables
REINDEX TABLE service_requests;
REINDEX TABLE quotes;
REINDEX TABLE bookings;
```

## 💾 Backup & Recovery

### Backup Procedures

#### Full Database Backup
```bash
#!/bin/bash
# full-backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/postgres"
DB_NAME="fixer_marketplace"

# Create backup directory
mkdir -p $BACKUP_DIR

# Create full backup
pg_dump -h localhost -U fixer_user -d $DB_NAME \
    --verbose --clean --no-acl --no-owner \
    --format=custom --file=$BACKUP_DIR/full_backup_$DATE.dump

# Compress backup
gzip $BACKUP_DIR/full_backup_$DATE.dump

echo "Full backup completed: full_backup_$DATE.dump.gz"
```

#### Incremental Backup
```bash
#!/bin/bash
# incremental-backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/postgres"
DB_NAME="fixer_marketplace"

# Create incremental backup
pg_dump -h localhost -U fixer_user -d $DB_NAME \
    --verbose --clean --no-acl --no-owner \
    --format=custom --file=$BACKUP_DIR/incremental_backup_$DATE.dump

# Compress backup
gzip $BACKUP_DIR/incremental_backup_$DATE.dump

echo "Incremental backup completed: incremental_backup_$DATE.dump.gz"
```

### Recovery Procedures

#### Restore Full Backup
```bash
# Restore from full backup
gunzip full_backup_20240115_020000.dump.gz
pg_restore -h localhost -U fixer_user -d fixer_marketplace \
    --verbose --clean --no-acl --no-owner \
    full_backup_20240115_020000.dump
```

#### Point-in-Time Recovery
```bash
# Create base backup
pg_basebackup -h localhost -U fixer_user -D /backup/base -Ft -z -P

# Restore to specific point in time
pg_restore -h localhost -U fixer_user -d fixer_marketplace \
    --verbose --clean --no-acl --no-owner \
    --stop-before="2024-01-15 10:30:00" \
    full_backup_20240115_020000.dump
```

## 🔍 Troubleshooting

### Common Issues

#### Slow Queries
```sql
-- Find slow queries
SELECT 
    query,
    calls,
    total_time,
    mean_time,
    rows
FROM pg_stat_statements
ORDER BY total_time DESC
LIMIT 10;
```

#### Lock Issues
```sql
-- Check for locks
SELECT 
    pid,
    usename,
    application_name,
    client_addr,
    backend_start,
    state,
    query
FROM pg_stat_activity
WHERE state = 'active';
```

#### Connection Issues
```sql
-- Check connection limits
SELECT 
    setting as max_connections
FROM pg_settings
WHERE name = 'max_connections';

-- Check current connections
SELECT count(*) as current_connections
FROM pg_stat_activity;
```

### Performance Monitoring

#### Database Performance Metrics
```sql
-- Cache hit ratio
SELECT 
    round(100.0 * sum(blks_hit) / (sum(blks_hit) + sum(blks_read)), 2) as cache_hit_ratio
FROM pg_stat_database;

-- Table access statistics
SELECT 
    schemaname,
    tablename,
    seq_scan,
    seq_tup_read,
    idx_scan,
    idx_tup_fetch
FROM pg_stat_user_tables
ORDER BY seq_scan DESC;
```

#### Query Performance
```sql
-- Enable query logging
ALTER SYSTEM SET log_statement = 'all';
ALTER SYSTEM SET log_min_duration_statement = 1000; -- Log queries > 1 second
SELECT pg_reload_conf();
```

This database usage guide provides comprehensive information for effectively using and maintaining the Fixer Marketplace database system.
