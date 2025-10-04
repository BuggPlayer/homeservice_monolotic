#!/usr/bin/env node

/**
 * Supabase Setup Script
 * This script helps you set up your Supabase connection step by step
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setupSupabase() {
  console.log('🚀 Supabase Setup Wizard\n');
  console.log('This wizard will help you configure your Supabase connection.\n');
  
  console.log('📋 First, get your Supabase credentials:');
  console.log('1. Go to https://supabase.com/dashboard');
  console.log('2. Select your project');
  console.log('3. Go to Settings → Database');
  console.log('4. Copy the connection details\n');
  
  const host = await question('Enter your Supabase host (e.g., db.xxxxxxxxxxxxx.supabase.co): ');
  const database = await question('Enter database name (usually "postgres"): ') || 'postgres';
  const user = await question('Enter username (usually "postgres"): ') || 'postgres';
  const password = await question('Enter your database password: ');
  const port = await question('Enter port (usually 5432): ') || '5432';
  
  console.log('\n📝 Creating .env file with Supabase configuration...');
  
  const envContent = `NODE_ENV=development
PORT=8000

# Supabase Database Configuration
DB_USER=${user}
DB_HOST=${host}
DB_DATABASE=${database}
DB_PASSWORD=${password}
DB_PORT=${port}

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT Secret
JWT_SECRET=supersecretjwtkey
JWT_ACCESS_TOKEN_EXPIRATION=1h
JWT_REFRESH_TOKEN_EXPIRATION=7d

# Twilio Configuration
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+15017122661

# WhatsApp Business API Configuration
WHATSAPP_BUSINESS_TOKEN=your_whatsapp_token
WHATSAPP_BUSINESS_PHONE_ID=your_whatsapp_phone_id

# Stripe/Razorpay Configuration
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxx

# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=your_aws_region
AWS_S3_BUCKET_NAME=your_s3_bucket_name

# Cloudinary Configuration (Alternative to S3)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=uploads/

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS Configuration
CORS_ORIGIN=http://localhost:3000,http://localhost:3001

# Socket.IO Configuration
SOCKET_IO_CORS_ORIGIN=http://localhost:3000
`;

  // Backup existing .env file
  if (fs.existsSync('.env')) {
    fs.copyFileSync('.env', '.env.backup');
    console.log('✅ Backed up existing .env file to .env.backup');
  }
  
  // Write new .env file
  fs.writeFileSync('.env', envContent);
  console.log('✅ Created new .env file with Supabase configuration');
  
  console.log('\n🧪 Testing connection...');
  
  // Test the connection
  const { Pool } = require('pg');
  require('dotenv').config();
  
  const pool = new Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  });
  
  try {
    const client = await pool.connect();
    console.log('✅ Connection successful!');
    
    const result = await client.query('SELECT current_database(), current_user;');
    console.log(`   Database: ${result.rows[0].current_database}`);
    console.log(`   User: ${result.rows[0].current_user}`);
    
    client.release();
    await pool.end();
    
    console.log('\n🎉 Supabase setup completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Run migrations: npm run migrate');
    console.log('2. Run seeds: npm run seed');
    console.log('3. Start your server: npm run dev');
    
  } catch (error) {
    console.error('\n❌ Connection test failed:');
    console.error(`   Error: ${error.message}`);
    console.error('\n🔧 Please check your credentials and try again.');
    console.error('   You can run this script again to reconfigure.');
  }
  
  rl.close();
}

setupSupabase();
