import request from 'supertest';
import app from '../src/server';
import { pool } from './setup';

describe('Authentication API', () => {
  beforeEach(async () => {
    // Clean up test data
    const client = await pool.connect();
    try {
      await client.query('DELETE FROM users');
    } finally {
      client.release();
    }
  });

  describe('POST /api/auth/register', () => {
    it('should register a new customer successfully', async () => {
      const userData = {
        email: 'test@example.com',
        phone: '+1234567890',
        password: 'Password123!',
        user_type: 'customer',
        first_name: 'John',
        last_name: 'Doe',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data.user.user_type).toBe('customer');
      expect(response.body.data.tokens).toHaveProperty('accessToken');
      expect(response.body.data.tokens).toHaveProperty('refreshToken');
    });

    it('should register a new provider successfully', async () => {
      const userData = {
        email: 'provider@example.com',
        phone: '+1234567891',
        password: 'Password123!',
        user_type: 'provider',
        first_name: 'Jane',
        last_name: 'Provider',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.user_type).toBe('provider');
    });

    it('should fail with invalid email', async () => {
      const userData = {
        email: 'invalid-email',
        phone: '+1234567890',
        password: 'Password123!',
        user_type: 'customer',
        first_name: 'John',
        last_name: 'Doe',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('email');
    });

    it('should fail with weak password', async () => {
      const userData = {
        email: 'test@example.com',
        phone: '+1234567890',
        password: '123',
        user_type: 'customer',
        first_name: 'John',
        last_name: 'Doe',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('password');
    });

    it('should fail with duplicate email', async () => {
      const userData = {
        email: 'test@example.com',
        phone: '+1234567890',
        password: 'Password123!',
        user_type: 'customer',
        first_name: 'John',
        last_name: 'Doe',
      };

      // Register first user
      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      // Try to register with same email
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('already registered');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create a test user
      const userData = {
        email: 'test@example.com',
        phone: '+1234567890',
        password: 'Password123!',
        user_type: 'customer',
        first_name: 'John',
        last_name: 'Doe',
      };

      await request(app)
        .post('/api/auth/register')
        .send(userData);
    });

    it('should login with valid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'Password123!',
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(loginData.email);
      expect(response.body.data.tokens).toHaveProperty('accessToken');
      expect(response.body.data.tokens).toHaveProperty('refreshToken');
    });

    it('should fail with invalid email', async () => {
      const loginData = {
        email: 'wrong@example.com',
        password: 'Password123!',
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Invalid credentials');
    });

    it('should fail with invalid password', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'WrongPassword123!',
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Invalid credentials');
    });
  });

  describe('GET /api/auth/profile', () => {
    let authToken: string;

    beforeEach(async () => {
      // Create and login a test user
      const userData = {
        email: 'test@example.com',
        phone: '+1234567890',
        password: 'Password123!',
        user_type: 'customer',
        first_name: 'John',
        last_name: 'Doe',
      };

      await request(app)
        .post('/api/auth/register')
        .send(userData);

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: userData.password,
        });

      authToken = loginResponse.body.data.tokens.accessToken;
    });

    it('should get user profile with valid token', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe('test@example.com');
      expect(response.body.data.user.first_name).toBe('John');
    });

    it('should fail without token', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Authentication failed');
    });

    it('should fail with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Authentication failed');
    });
  });
});
