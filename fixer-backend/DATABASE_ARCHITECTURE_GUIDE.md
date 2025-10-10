# 🗄️ Database Architecture Guide for Freshers

## 📁 **Folder Structure Overview**

```
/Users/faizan/Desktop/Homeservice/fixer-backend/src/core/database/
├── index.ts                    # Main export file
├── migrate.ts                  # Migration runner
├── seed.ts                     # Database seeding
├── migrations/                 # SQL migration files
│   ├── 001_create_users_table.sql
│   ├── 002_create_service_providers_table.sql
│   └── ... (16 total files)
├── repositories/               # Data access layer
│   ├── BaseRepository.ts       # Base class for all repositories
│   ├── UserRepository.ts       # User-specific operations
│   ├── ProductRepository.ts    # Product-specific operations
│   └── ... (10 total files)
└── seeds/                      # Sample data files
    ├── users.ts               # User sample data
    ├── products.ts            # Product sample data
    └── ... (6 total files)
```

---

## 🎯 **Purpose of Each Component**

### **1. 📊 Migrations (`migrations/` folder)**

**What is it?**
- SQL files that define database schema changes
- Version-controlled database structure
- Ensures consistent database across environments

**When is it used?**
- When you need to create/modify database tables
- When deploying to new environments
- When adding new features that require database changes

**How is it used?**
```bash
# Run all pending migrations
node src/core/database/migrate.ts
```

**Example Migration File:**
```sql
-- 001_create_users_table.sql
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('customer', 'provider', 'admin')),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    profile_picture TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
```

**Why this approach?**
- ✅ **Version Control**: Track all database changes
- ✅ **Rollback**: Can revert changes if needed
- ✅ **Team Sync**: Everyone has same database structure
- ✅ **Production Safe**: Tested changes before deployment

---

### **2. 🏗️ Repositories (`repositories/` folder)**

**What is it?**
- Data Access Layer (DAL) - separates database logic from business logic
- Each repository handles one entity/table
- Provides clean interface for database operations

**When is it used?**
- Every time you need to interact with database
- In services, controllers, and other business logic
- For CRUD operations and complex queries

**How is it used?**
```typescript
// In a service file
import { UserRepository } from '../core/database/repositories';

class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async login(email: string, password: string) {
    // Use repository to find user
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }
    // ... rest of login logic
  }
}
```

**BaseRepository Pattern:**
```typescript
// BaseRepository.ts - Common functionality for all repositories
export abstract class BaseRepository<T> {
  protected tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  // Common CRUD operations
  async findById(id: string): Promise<T | null> {
    const result = await this.query(
      `SELECT * FROM ${this.tableName} WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  async create(data: Partial<T>): Promise<T> {
    const fields = Object.keys(data);
    const values = Object.values(data);
    const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
    
    const result = await this.query(
      `INSERT INTO ${this.tableName} (${fields.join(', ')}) 
       VALUES (${placeholders}) RETURNING *`,
      values
    );
    return result.rows[0];
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    const fields = Object.keys(data);
    const values = Object.values(data);
    const setClause = fields.map((field, i) => `${field} = $${i + 2}`).join(', ');
    
    const result = await this.query(
      `UPDATE ${this.tableName} SET ${setClause} WHERE id = $1 RETURNING *`,
      [id, ...values]
    );
    return result.rows[0] || null;
  }
}
```

**Specific Repository Example:**
```typescript
// UserRepository.ts - User-specific operations
export class UserRepository extends BaseRepository<User> {
  constructor() {
    super('users'); // Table name
  }

  // Custom methods specific to users
  async findByEmail(email: string): Promise<User | null> {
    const result = await this.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0] || null;
  }

  async findByUserType(userType: string, page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;
    
    const countResult = await this.query(
      'SELECT COUNT(*) as count FROM users WHERE user_type = $1',
      [userType]
    );
    const total = parseInt((countResult.rows[0] as any).count);

    const result = await this.query(
      'SELECT * FROM users WHERE user_type = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
      [userType, limit, offset]
    );

    return {
      data: result.rows,
      total,
    };
  }
}
```

**Why Repository Pattern?**
- ✅ **Separation of Concerns**: Database logic separate from business logic
- ✅ **Testability**: Easy to mock repositories for testing
- ✅ **Reusability**: Same repository used across multiple services
- ✅ **Maintainability**: Changes to database structure only affect repository

---

### **3. 🌱 Seeds (`seeds/` folder)**

**What is it?**
- Sample data for development and testing
- Predefined data to populate database
- Helps with development and demo purposes

**When is it used?**
- During development setup
- For testing with realistic data
- For demos and presentations
- After clearing database

**How is it used?**
```bash
# Run seeding
node src/core/database/seed.ts
```

**Example Seed File:**
```typescript
// seeds/users.ts
export const usersData = [
  {
    email: 'john.doe@example.com',
    phone: '+1234567890',
    user_type: 'customer',
    first_name: 'John',
    last_name: 'Doe',
    profile_picture: 'https://example.com/john.jpg',
    is_verified: true
  },
  {
    email: 'jane.smith@example.com',
    phone: '+1234567891',
    user_type: 'provider',
    first_name: 'Jane',
    last_name: 'Smith',
    profile_picture: 'https://example.com/jane.jpg',
    is_verified: true
  }
];

export const defaultPassword = 'password123';
```

**Comprehensive Seeding:**
```typescript
// seed.ts - Main seeding file
async function seedDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('Starting database seeding...');
    
    // Clear existing data (in correct order due to foreign keys)
    await client.query('DELETE FROM calls');
    await client.query('DELETE FROM bookings');
    await client.query('DELETE FROM quotes');
    await client.query('DELETE FROM service_requests');
    await client.query('DELETE FROM service_providers');
    await client.query('DELETE FROM users');

    // Create admin user
    const adminPasswordHash = await bcrypt.hash('admin123', 12);
    const adminUser = await client.query(`
      INSERT INTO users (email, phone, password_hash, user_type, first_name, last_name, is_verified)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `, [
      'admin@fixer.com',
      '+1234567890',
      adminPasswordHash,
      'admin',
      'Admin',
      'User',
      true
    ]);

    // Create sample customers
    const customerPasswordHash = await bcrypt.hash('password123', 12);
    const customers = await Promise.all([
      client.query(`
        INSERT INTO users (email, phone, password_hash, user_type, first_name, last_name, is_verified)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id
      `, [
        'customer1@example.com',
        '+1234567891',
        customerPasswordHash,
        'customer',
        'John',
        'Doe',
        true
      ])
    ]);

    console.log('Database seeded successfully!');
    
  } catch (error) {
    console.error('Seeding failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}
```

**Why Seeding?**
- ✅ **Development**: Quick setup with realistic data
- ✅ **Testing**: Consistent test data
- ✅ **Demo**: Show application with sample data
- ✅ **Onboarding**: New developers can start quickly

---

## 🔄 **Complete Workflow Example**

Let's trace through a complete example of how these components work together:

### **Scenario: Adding a new "Reviews" feature**

**Step 1: Create Migration**
```sql
-- 012_create_reviews_table.sql
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    service_provider_id UUID NOT NULL REFERENCES service_providers(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_service_provider_id ON reviews(service_provider_id);
```

**Step 2: Create Repository**
```typescript
// repositories/ReviewRepository.ts
export class ReviewRepository extends BaseRepository<Review> {
  constructor() {
    super('reviews');
  }

  async findByServiceProvider(serviceProviderId: string): Promise<Review[]> {
    const result = await this.query(
      'SELECT * FROM reviews WHERE service_provider_id = $1 ORDER BY created_at DESC',
      [serviceProviderId]
    );
    return result.rows;
  }

  async getAverageRating(serviceProviderId: string): Promise<number> {
    const result = await this.query(
      'SELECT AVG(rating) as average FROM reviews WHERE service_provider_id = $1',
      [serviceProviderId]
    );
    return parseFloat(result.rows[0].average) || 0;
  }
}
```

**Step 3: Add to Seeds**
```typescript
// seeds/reviews.ts
export const reviewsData = [
  {
    user_id: 'user-uuid-1',
    service_provider_id: 'provider-uuid-1',
    rating: 5,
    comment: 'Excellent service!'
  },
  {
    user_id: 'user-uuid-2',
    service_provider_id: 'provider-uuid-1',
    rating: 4,
    comment: 'Good work, would recommend.'
  }
];
```

**Step 4: Use in Service**
```typescript
// services/ReviewService.ts
import { ReviewRepository } from '../core/database/repositories';

export class ReviewService {
  private reviewRepository: ReviewRepository;

  constructor() {
    this.reviewRepository = new ReviewRepository();
  }

  async createReview(reviewData: CreateReviewRequest): Promise<Review> {
    return await this.reviewRepository.create(reviewData);
  }

  async getServiceProviderReviews(serviceProviderId: string): Promise<Review[]> {
    return await this.reviewRepository.findByServiceProvider(serviceProviderId);
  }

  async getServiceProviderRating(serviceProviderId: string): Promise<number> {
    return await this.reviewRepository.getAverageRating(serviceProviderId);
  }
}
```

**Step 5: Run Migration and Seed**
```bash
# Apply the new migration
node src/core/database/migrate.ts

# Add sample data
node src/core/database/seed.ts
```

---

## 🎯 **Best Practices for Freshers**

### **1. Migration Best Practices**
- ✅ **Always backup** before running migrations in production
- ✅ **Test migrations** on development database first
- ✅ **Use descriptive names** for migration files
- ✅ **Never modify** existing migration files (create new ones)
- ✅ **Include rollback** instructions in comments

### **2. Repository Best Practices**
- ✅ **One repository per entity** (UserRepository for users, ProductRepository for products)
- ✅ **Extend BaseRepository** to get common CRUD operations
- ✅ **Use parameterized queries** to prevent SQL injection
- ✅ **Handle errors gracefully** with try-catch blocks
- ✅ **Return consistent data types**

### **3. Seeding Best Practices**
- ✅ **Use realistic data** that represents production scenarios
- ✅ **Include edge cases** (empty strings, null values, etc.)
- ✅ **Maintain referential integrity** (foreign key relationships)
- ✅ **Clear existing data** before seeding
- ✅ **Use environment variables** for sensitive data

---

## 🚀 **Common Commands**

```bash
# Run all pending migrations
node src/core/database/migrate.ts

# Seed database with sample data
node src/core/database/seed.ts

# Check migration status
psql -d your_database -c "SELECT * FROM migrations ORDER BY applied_at;"

# Reset database (development only!)
npm run db:reset  # If you have this script
```

---

## 🔍 **Troubleshooting Tips**

### **Migration Issues**
- **"relation already exists"**: Migration already applied, check migrations table
- **"column does not exist"**: Check if migration ran in correct order
- **"foreign key constraint"**: Ensure referenced tables exist first

### **Repository Issues**
- **"connection timeout"**: Check database connection settings
- **"permission denied"**: Verify database user has proper permissions
- **"syntax error"**: Check SQL syntax in repository methods

### **Seeding Issues**
- **"duplicate key"**: Data already exists, clear tables first
- **"foreign key violation"**: Ensure parent records exist before child records
- **"data type mismatch"**: Check data types match table schema

---

## 📚 **Learning Path for Freshers**

1. **Week 1**: Understand the folder structure and purpose of each component
2. **Week 2**: Practice writing simple migrations (create table, add column)
3. **Week 3**: Learn BaseRepository pattern and create your first repository
4. **Week 4**: Write comprehensive seed data and understand relationships
5. **Week 5**: Build a complete feature using all three components together

Remember: **Database architecture is the foundation of your application**. Take time to understand these concepts well, and you'll be a much stronger developer! 🚀
