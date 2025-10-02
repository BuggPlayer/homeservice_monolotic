# 🧪 API Testing Guide

This document provides comprehensive testing strategies, examples, and best practices for the Fixer Marketplace backend API.

## 📋 Table of Contents

- [Testing Overview](#testing-overview)
- [Test Setup](#test-setup)
- [Unit Testing](#unit-testing)
- [Integration Testing](#integration-testing)
- [End-to-End Testing](#end-to-end-testing)
- [API Testing Examples](#api-testing-examples)
- [Performance Testing](#performance-testing)
- [Security Testing](#security-testing)
- [Test Automation](#test-automation)

## 🎯 Testing Overview

### Testing Pyramid

```
    /\
   /  \
  / E2E \     - End-to-End Tests (Few, Slow, Expensive)
 /______\
/        \
/Integration\ - Integration Tests (Some, Medium Speed)
/____________\
/              \
/   Unit Tests   \ - Unit Tests (Many, Fast, Cheap)
/________________\
```

### Test Types

1. **Unit Tests**: Test individual functions and classes
2. **Integration Tests**: Test API endpoints and database interactions
3. **End-to-End Tests**: Test complete user workflows
4. **Performance Tests**: Test API response times and load handling
5. **Security Tests**: Test authentication, authorization, and input validation

## 🔧 Test Setup

### Prerequisites

```bash
# Install testing dependencies
npm install --save-dev jest supertest @types/jest @types/supertest

# Install additional testing tools
npm install --save-dev nock faker
```

### Test Configuration

#### Jest Configuration (`jest.config.js`)

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: [
    '**/__tests__/**/*.ts',
    '**/?(*.)+(spec|test).ts'
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/*.test.ts',
    '!src/**/*.spec.ts'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  testTimeout: 10000,
  verbose: true
};
```

#### Test Setup File (`tests/setup.ts`)

```typescript
import { config } from 'dotenv';
import { Pool } from 'pg';

// Load test environment variables
config({ path: '.env.test' });

// Global test setup
beforeAll(async () => {
  // Setup test database
  const pool = new Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  // Run migrations
  await pool.query('BEGIN');
  // Add test data setup here
});

afterAll(async () => {
  // Cleanup test database
  const pool = new Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  // Clean up test data
  await pool.query('ROLLBACK');
  await pool.end();
});

// Global test utilities
global.testUtils = {
  generateUser: () => ({
    email: `test-${Date.now()}@example.com`,
    password: 'password123',
    firstName: 'Test',
    lastName: 'User',
    phone: '+1234567890'
  }),
  
  generateServiceRequest: () => ({
    title: 'Test Service Request',
    description: 'Test description',
    serviceType: 'plumbing',
    urgency: 'medium',
    location: {
      address: '123 Test St',
      city: 'Test City',
      state: 'TS',
      zipCode: '12345'
    }
  })
};
```

## 🔬 Unit Testing

### Testing Utilities

#### Test Utilities (`tests/helpers/testUtils.ts`)

```typescript
import { faker } from '@faker-js/faker';
import { User, ServiceRequest, Quote, Booking } from '../../src/types';

export class TestUtils {
  static generateUser(overrides: Partial<User> = {}): Partial<User> {
    return {
      email: faker.internet.email(),
      password: 'password123',
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      phone: faker.phone.number(),
      userType: 'customer',
      ...overrides
    };
  }

  static generateServiceRequest(overrides: Partial<ServiceRequest> = {}): Partial<ServiceRequest> {
    return {
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      serviceType: faker.helpers.arrayElement(['plumbing', 'electrical', 'hvac']),
      urgency: faker.helpers.arrayElement(['low', 'medium', 'high']),
      location: {
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        zipCode: faker.location.zipCode()
      },
      ...overrides
    };
  }

  static generateQuote(overrides: Partial<Quote> = {}): Partial<Quote> {
    return {
      amount: faker.number.float({ min: 50, max: 500, fractionDigits: 2 }),
      description: faker.lorem.paragraph(),
      estimatedDuration: faker.number.int({ min: 30, max: 240 }),
      status: 'pending',
      ...overrides
    };
  }

  static async createTestUser(pool: any, userData: Partial<User> = {}): Promise<User> {
    const user = this.generateUser(userData);
    const hashedPassword = await bcrypt.hash(user.password!, 12);
    
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, first_name, last_name, phone, user_type) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [user.email, hashedPassword, user.firstName, user.lastName, user.phone, user.userType]
    );
    
    return result.rows[0];
  }
}
```

### Authentication Tests

#### Auth Service Tests (`tests/unit/auth/AuthService.test.ts`)

```typescript
import { AuthService } from '../../../src/modules/auth/services/AuthService';
import { UserRepository } from '../../../src/core/database/repositories/UserRepository';
import { TestUtils } from '../../helpers/testUtils';

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: UserRepository;
  let mockUser: any;

  beforeEach(() => {
    userRepository = new UserRepository();
    authService = new AuthService(userRepository);
    mockUser = TestUtils.generateUser();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      // Mock repository methods
      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(null);
      jest.spyOn(userRepository, 'create').mockResolvedValue(mockUser as any);

      const result = await authService.register(mockUser);

      expect(result.success).toBe(true);
      expect(result.data.user.email).toBe(mockUser.email);
      expect(result.data.tokens).toHaveProperty('accessToken');
      expect(result.data.tokens).toHaveProperty('refreshToken');
    });

    it('should fail if user already exists', async () => {
      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(mockUser as any);

      await expect(authService.register(mockUser)).rejects.toThrow('User already exists');
    });

    it('should validate email format', async () => {
      const invalidUser = { ...mockUser, email: 'invalid-email' };

      await expect(authService.register(invalidUser)).rejects.toThrow('Invalid email format');
    });
  });

  describe('login', () => {
    it('should login user with valid credentials', async () => {
      const hashedPassword = await bcrypt.hash('password123', 12);
      const userWithPassword = { ...mockUser, password_hash: hashedPassword };

      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(userWithPassword as any);

      const result = await authService.login({
        email: mockUser.email,
        password: 'password123'
      });

      expect(result.success).toBe(true);
      expect(result.data.tokens).toHaveProperty('accessToken');
    });

    it('should fail with invalid credentials', async () => {
      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(null);

      await expect(authService.login({
        email: mockUser.email,
        password: 'wrongpassword'
      })).rejects.toThrow('Invalid credentials');
    });
  });
});
```

### Repository Tests

#### User Repository Tests (`tests/unit/repositories/UserRepository.test.ts`)

```typescript
import { UserRepository } from '../../../src/core/database/repositories/UserRepository';
import { TestUtils } from '../../helpers/testUtils';

describe('UserRepository', () => {
  let userRepository: UserRepository;
  let testUser: any;

  beforeEach(async () => {
    userRepository = new UserRepository();
    testUser = await TestUtils.createTestUser(userRepository.pool);
  });

  afterEach(async () => {
    await userRepository.pool.query('DELETE FROM users WHERE id = $1', [testUser.id]);
  });

  describe('findByEmail', () => {
    it('should find user by email', async () => {
      const user = await userRepository.findByEmail(testUser.email);
      
      expect(user).toBeDefined();
      expect(user?.email).toBe(testUser.email);
    });

    it('should return null if user not found', async () => {
      const user = await userRepository.findByEmail('nonexistent@example.com');
      
      expect(user).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const newUser = TestUtils.generateUser();
      const hashedPassword = await bcrypt.hash(newUser.password!, 12);

      const user = await userRepository.create({
        ...newUser,
        password_hash: hashedPassword
      } as any);

      expect(user).toBeDefined();
      expect(user.email).toBe(newUser.email);
      expect(user.first_name).toBe(newUser.firstName);
    });
  });

  describe('update', () => {
    it('should update user information', async () => {
      const updateData = {
        first_name: 'Updated Name',
        last_name: 'Updated Last Name'
      };

      const updatedUser = await userRepository.update(testUser.id, updateData);

      expect(updatedUser?.first_name).toBe('Updated Name');
      expect(updatedUser?.last_name).toBe('Updated Last Name');
    });
  });
});
```

## 🔗 Integration Testing

### API Endpoint Tests

#### Authentication Endpoints (`tests/integration/auth.test.ts`)

```typescript
import request from 'supertest';
import app from '../../src/app';
import { TestUtils } from '../helpers/testUtils';

describe('Authentication Endpoints', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const userData = TestUtils.generateUser();

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data.tokens).toHaveProperty('accessToken');
    });

    it('should fail with invalid data', async () => {
      const invalidData = {
        email: 'invalid-email',
        password: '123' // Too short
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain('validation');
    });

    it('should fail if user already exists', async () => {
      const userData = TestUtils.generateUser();
      
      // Register user first time
      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      // Try to register same user again
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain('already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    let testUser: any;
    let userData: any;

    beforeEach(async () => {
      userData = TestUtils.generateUser();
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send(userData);
      testUser = registerResponse.body.data.user;
    });

    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: userData.password
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.tokens).toHaveProperty('accessToken');
    });

    it('should fail with invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: 'wrongpassword'
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain('Invalid credentials');
    });
  });
});
```

#### Service Request Endpoints (`tests/integration/serviceRequests.test.ts`)

```typescript
import request from 'supertest';
import app from '../../src/app';
import { TestUtils } from '../helpers/testUtils';

describe('Service Request Endpoints', () => {
  let authToken: string;
  let testUser: any;

  beforeEach(async () => {
    // Create test user and get auth token
    const userData = TestUtils.generateUser();
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send(userData);
    
    testUser = registerResponse.body.data.user;
    authToken = registerResponse.body.data.tokens.accessToken;
  });

  describe('POST /api/service-requests', () => {
    it('should create a new service request', async () => {
      const serviceRequestData = TestUtils.generateServiceRequest();

      const response = await request(app)
        .post('/api/service-requests')
        .set('Authorization', `Bearer ${authToken}`)
        .send(serviceRequestData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(serviceRequestData.title);
      expect(response.body.data.status).toBe('open');
    });

    it('should fail without authentication', async () => {
      const serviceRequestData = TestUtils.generateServiceRequest();

      const response = await request(app)
        .post('/api/service-requests')
        .send(serviceRequestData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain('Authentication required');
    });

    it('should validate required fields', async () => {
      const invalidData = {
        title: '', // Empty title
        description: 'Test description'
        // Missing required fields
      };

      const response = await request(app)
        .post('/api/service-requests')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain('validation');
    });
  });

  describe('GET /api/service-requests', () => {
    it('should get service requests for authenticated user', async () => {
      // Create a service request first
      const serviceRequestData = TestUtils.generateServiceRequest();
      await request(app)
        .post('/api/service-requests')
        .set('Authorization', `Bearer ${authToken}`)
        .send(serviceRequestData);

      const response = await request(app)
        .get('/api/service-requests')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.serviceRequests).toBeInstanceOf(Array);
      expect(response.body.data.serviceRequests.length).toBeGreaterThan(0);
    });

    it('should support pagination', async () => {
      const response = await request(app)
        .get('/api/service-requests?page=1&limit=5')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data.pagination).toBeDefined();
      expect(response.body.data.pagination.page).toBe(1);
      expect(response.body.data.pagination.limit).toBe(5);
    });
  });
});
```

## 🎭 End-to-End Testing

### Complete User Workflows

#### Customer Journey Test (`tests/e2e/customerJourney.test.ts`)

```typescript
import request from 'supertest';
import app from '../../src/app';
import { TestUtils } from '../helpers/testUtils';

describe('Customer Journey E2E', () => {
  let customerToken: string;
  let providerToken: string;
  let serviceRequestId: string;
  let quoteId: string;
  let bookingId: string;

  it('should complete full customer journey', async () => {
    // Step 1: Customer registration
    const customerData = TestUtils.generateUser({ userType: 'customer' });
    const customerResponse = await request(app)
      .post('/api/auth/register')
      .send(customerData)
      .expect(201);
    
    customerToken = customerResponse.body.data.tokens.accessToken;

    // Step 2: Provider registration
    const providerData = TestUtils.generateUser({ userType: 'provider' });
    const providerResponse = await request(app)
      .post('/api/auth/register')
      .send(providerData)
      .expect(201);
    
    providerToken = providerResponse.body.data.tokens.accessToken;

    // Step 3: Create service provider profile
    const providerProfile = {
      businessName: 'Test Plumbing Co',
      servicesOffered: ['plumbing'],
      serviceAreas: ['Test City'],
      yearsExperience: 5,
      bio: 'Professional plumbing services'
    };

    await request(app)
      .post('/api/providers')
      .set('Authorization', `Bearer ${providerToken}`)
      .send(providerProfile)
      .expect(201);

    // Step 4: Customer creates service request
    const serviceRequestData = TestUtils.generateServiceRequest();
    const serviceRequestResponse = await request(app)
      .post('/api/service-requests')
      .set('Authorization', `Bearer ${customerToken}`)
      .send(serviceRequestData)
      .expect(201);
    
    serviceRequestId = serviceRequestResponse.body.data.id;

    // Step 5: Provider creates quote
    const quoteData = TestUtils.generateQuote({
      serviceRequestId,
      amount: 150.00,
      description: 'Will fix the plumbing issue'
    });

    const quoteResponse = await request(app)
      .post('/api/quotes')
      .set('Authorization', `Bearer ${providerToken}`)
      .send(quoteData)
      .expect(201);
    
    quoteId = quoteResponse.body.data.id;

    // Step 6: Customer accepts quote
    const acceptQuoteResponse = await request(app)
      .put(`/api/quotes/${quoteId}/accept`)
      .set('Authorization', `Bearer ${customerToken}`)
      .expect(200);
    
    bookingId = acceptQuoteResponse.body.data.bookingId;

    // Step 7: Verify booking was created
    const bookingResponse = await request(app)
      .get(`/api/bookings/${bookingId}`)
      .set('Authorization', `Bearer ${customerToken}`)
      .expect(200);
    
    expect(bookingResponse.body.data.status).toBe('scheduled');

    // Step 8: Provider updates booking status
    await request(app)
      .put(`/api/bookings/${bookingId}/status`)
      .set('Authorization', `Bearer ${providerToken}`)
      .send({ status: 'completed' })
      .expect(200);

    // Step 9: Customer leaves review
    const reviewData = {
      rating: 5,
      comment: 'Excellent service!'
    };

    await request(app)
      .post('/api/reviews')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        ...reviewData,
        bookingId
      })
      .expect(201);

    // Step 10: Verify review was created
    const reviewsResponse = await request(app)
      .get(`/api/providers/${providerResponse.body.data.user.id}/reviews`)
      .expect(200);
    
    expect(reviewsResponse.body.data.reviews.length).toBe(1);
    expect(reviewsResponse.body.data.reviews[0].rating).toBe(5);
  });
});
```

## 📊 Performance Testing

### Load Testing with Artillery

#### Artillery Configuration (`artillery.yml`)

```yaml
config:
  target: 'http://localhost:3000'
  phases:
    - duration: 60
      arrivalRate: 10
    - duration: 120
      arrivalRate: 20
    - duration: 60
      arrivalRate: 10
  variables:
    baseUrl: 'http://localhost:3000'

scenarios:
  - name: "User Registration and Login"
    weight: 30
    flow:
      - post:
          url: "/api/auth/register"
          json:
            email: "{{ $randomString() }}@example.com"
            password: "password123"
            firstName: "{{ $randomString() }}"
            lastName: "{{ $randomString() }}"
            phone: "+1234567890"
            userType: "customer"
      - post:
          url: "/api/auth/login"
          json:
            email: "{{ $randomString() }}@example.com"
            password: "password123"

  - name: "Service Request Creation"
    weight: 40
    flow:
      - post:
          url: "/api/auth/login"
          json:
            email: "test@example.com"
            password: "password123"
      - post:
          url: "/api/service-requests"
          json:
            title: "Test Service Request"
            description: "Test description"
            serviceType: "plumbing"
            urgency: "medium"
            location:
              address: "123 Test St"
              city: "Test City"
              state: "TS"
              zipCode: "12345"

  - name: "Get Service Requests"
    weight: 30
    flow:
      - post:
          url: "/api/auth/login"
          json:
            email: "test@example.com"
            password: "password123"
      - get:
          url: "/api/service-requests"
```

#### Run Performance Tests

```bash
# Install Artillery
npm install -g artillery

# Run load test
artillery run artillery.yml

# Run with detailed reporting
artillery run artillery.yml --output report.json
artillery report report.json
```

### API Response Time Testing

#### Response Time Tests (`tests/performance/responseTime.test.ts`)

```typescript
import request from 'supertest';
import app from '../../src/app';

describe('API Response Time Tests', () => {
  const maxResponseTime = 1000; // 1 second

  it('should respond to health check within 100ms', async () => {
    const start = Date.now();
    
    await request(app)
      .get('/health')
      .expect(200);
    
    const responseTime = Date.now() - start;
    expect(responseTime).toBeLessThan(100);
  });

  it('should respond to user registration within 500ms', async () => {
    const userData = {
      email: `test-${Date.now()}@example.com`,
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
      phone: '+1234567890',
      userType: 'customer'
    };

    const start = Date.now();
    
    await request(app)
      .post('/api/auth/register')
      .send(userData)
      .expect(201);
    
    const responseTime = Date.now() - start;
    expect(responseTime).toBeLessThan(500);
  });

  it('should handle concurrent requests efficiently', async () => {
    const concurrentRequests = 10;
    const promises = [];

    for (let i = 0; i < concurrentRequests; i++) {
      promises.push(
        request(app)
          .get('/health')
          .expect(200)
      );
    }

    const start = Date.now();
    await Promise.all(promises);
    const totalTime = Date.now() - start;

    // All requests should complete within 2 seconds
    expect(totalTime).toBeLessThan(2000);
  });
});
```

## 🔒 Security Testing

### Authentication Security Tests

#### Security Tests (`tests/security/authSecurity.test.ts`)

```typescript
import request from 'supertest';
import app from '../../src/app';

describe('Authentication Security Tests', () => {
  describe('JWT Token Security', () => {
    it('should reject invalid JWT tokens', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain('Invalid token');
    });

    it('should reject expired JWT tokens', async () => {
      // Create an expired token (this would need to be mocked)
      const expiredToken = 'expired-jwt-token';

      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain('expired');
    });

    it('should require authentication for protected routes', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain('Authentication required');
    });
  });

  describe('Input Validation Security', () => {
    it('should prevent SQL injection in email field', async () => {
      const maliciousInput = "'; DROP TABLE users; --";

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: maliciousInput,
          password: 'password123'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should prevent XSS attacks in text fields', async () => {
      const xssPayload = '<script>alert("XSS")</script>';

      const response = await request(app)
        .post('/api/service-requests')
        .set('Authorization', 'Bearer valid-token')
        .send({
          title: xssPayload,
          description: 'Test description',
          serviceType: 'plumbing',
          location: {
            address: '123 Test St',
            city: 'Test City',
            state: 'TS',
            zipCode: '12345'
          }
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('Rate Limiting', () => {
    it('should enforce rate limiting on login endpoint', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      // Make multiple requests quickly
      const promises = Array(10).fill(0).map(() =>
        request(app)
          .post('/api/auth/login')
          .send(userData)
      );

      const responses = await Promise.all(promises);
      
      // Some requests should be rate limited
      const rateLimitedResponses = responses.filter(r => r.status === 429);
      expect(rateLimitedResponses.length).toBeGreaterThan(0);
    });
  });
});
```

## 🤖 Test Automation

### GitHub Actions CI/CD

#### Workflow File (`.github/workflows/test.yml`)

```yaml
name: Test Suite

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: fixer_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379

    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Run database migrations
      run: npm run migrate
      env:
        DB_HOST: localhost
        DB_PORT: 5432
        DB_NAME: fixer_test
        DB_USER: postgres
        DB_PASSWORD: postgres

    - name: Run tests
      run: npm test
      env:
        NODE_ENV: test
        DB_HOST: localhost
        DB_PORT: 5432
        DB_NAME: fixer_test
        DB_USER: postgres
        DB_PASSWORD: postgres
        REDIS_HOST: localhost
        REDIS_PORT: 6379

    - name: Run coverage
      run: npm run test:coverage

    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/lcov.info
```

### Test Scripts

#### Package.json Scripts

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:unit": "jest --testPathPattern=unit",
    "test:integration": "jest --testPathPattern=integration",
    "test:e2e": "jest --testPathPattern=e2e",
    "test:performance": "artillery run artillery.yml",
    "test:security": "jest --testPathPattern=security"
  }
}
```

### Test Data Management

#### Test Data Factory (`tests/factories/UserFactory.ts`)

```typescript
import { faker } from '@faker-js/faker';
import { User } from '../../src/types';

export class UserFactory {
  static create(overrides: Partial<User> = {}): Partial<User> {
    return {
      email: faker.internet.email(),
      password: 'password123',
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      phone: faker.phone.number(),
      userType: 'customer',
      ...overrides
    };
  }

  static createCustomer(overrides: Partial<User> = {}): Partial<User> {
    return this.create({ ...overrides, userType: 'customer' });
  }

  static createProvider(overrides: Partial<User> = {}): Partial<User> {
    return this.create({ ...overrides, userType: 'provider' });
  }

  static createAdmin(overrides: Partial<User> = {}): Partial<User> {
    return this.create({ ...overrides, userType: 'admin' });
  }
}
```

This comprehensive API testing guide provides everything needed to implement robust testing for the Fixer Marketplace backend, ensuring reliability, security, and performance.
