const { Pool } = require('pg');
require('dotenv').config();

async function testDatabaseConnection() {
  const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'fixer_marketplace',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
  });

  try {
    console.log('Testing database connection...');
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    console.log('✅ Database connection successful!');
    console.log('Current time:', result.rows[0].now);
    client.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('\nPlease check your database configuration:');
    console.log('- Make sure PostgreSQL is running');
    console.log('- Verify database credentials in .env file');
    console.log('- Create the database: createdb fixer_marketplace');
  } finally {
    await pool.end();
  }
}

async function testEnvironmentVariables() {
  console.log('\nTesting environment variables...');
  
  const requiredVars = [
    'DB_HOST',
    'DB_NAME', 
    'DB_USER',
    'DB_PASSWORD',
    'JWT_SECRET',
    'JWT_REFRESH_SECRET'
  ];

  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length === 0) {
    console.log('✅ All required environment variables are set');
  } else {
    console.log('❌ Missing environment variables:', missing.join(', '));
    console.log('Please copy env.example to .env and fill in the values');
  }
}

async function main() {
  console.log('🚀 Fixer API Setup Test\n');
  
  await testEnvironmentVariables();
  await testDatabaseConnection();
  
  console.log('\n📋 Next steps:');
  console.log('1. Run: npm run migrate (to create database tables)');
  console.log('2. Run: npm run dev (to start the development server)');
  console.log('3. Test the API at: http://localhost:3000/health');
}

main().catch(console.error);
