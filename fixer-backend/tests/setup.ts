import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'fixer_marketplace_test',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
});

// Global test setup
beforeAll(async () => {
  // Create test database if it doesn't exist
  const adminPool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: 'postgres',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
  });

  try {
    await adminPool.query(`CREATE DATABASE ${process.env.DB_NAME || 'fixer_marketplace_test'}`);
  } catch (error) {
    // Database might already exist, ignore error
  } finally {
    await adminPool.end();
  }

  // Run migrations
  const { exec } = require('child_process');
  await new Promise((resolve, reject) => {
    exec('npm run migrate', (error: any, stdout: any, stderr: any) => {
      if (error) {
        console.error('Migration failed:', error);
        reject(error);
      } else {
        console.log('Migrations completed');
        resolve(stdout);
      }
    });
  });
});

// Clean up after each test
afterEach(async () => {
  const client = await pool.connect();
  try {
    // Clear all test data
    await client.query('DELETE FROM calls');
    await client.query('DELETE FROM bookings');
    await client.query('DELETE FROM quotes');
    await client.query('DELETE FROM service_requests');
    await client.query('DELETE FROM service_providers');
    await client.query('DELETE FROM users');
  } finally {
    client.release();
  }
});

// Clean up after all tests
afterAll(async () => {
  await pool.end();
});

export { pool };
