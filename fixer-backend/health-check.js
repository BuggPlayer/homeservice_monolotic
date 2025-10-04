#!/usr/bin/env node

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_DATABASE || 'fixer_marketplace',
  user: process.env.DB_USER || 'faizan',
  password: process.env.DB_PASSWORD || '',
});

async function healthCheck() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW() as current_time, current_database() as database_name, current_user as user_name;');
    client.release();
    
    console.log('✅ Database Health Check: PASSED');
    console.log(`   Database: ${result.rows[0].database_name}`);
    console.log(`   User: ${result.rows[0].user_name}`);
    console.log(`   Time: ${result.rows[0].current_time}`);
    
    process.exit(0);
  } catch (error) {
    console.log('❌ Database Health Check: FAILED');
    console.log(`   Error: ${error.message}`);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

healthCheck();
