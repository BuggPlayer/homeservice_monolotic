import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Server Configuration
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3000'),
  
  // Database Configuration
  DATABASE: {
    HOST: process.env.DB_HOST || 'localhost',
    PORT: parseInt(process.env.DB_PORT || '5432'),
    NAME: process.env.DB_NAME || 'fixer_marketplace',
    USER: process.env.DB_USER || 'postgres',
    PASSWORD: process.env.DB_PASSWORD || '',
  },
  
  // Redis Configuration
  REDIS: {
    HOST: process.env.REDIS_HOST || 'localhost',
    PORT: parseInt(process.env.REDIS_PORT || '6379'),
    PASSWORD: process.env.REDIS_PASSWORD || undefined,
  },
  
  // JWT Configuration
  JWT: {
    SECRET: process.env.JWT_SECRET || 'your-secret-key',
    REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
    ACCESS_TOKEN_EXPIRATION: process.env.JWT_ACCESS_TOKEN_EXPIRATION || '1h',
    REFRESH_TOKEN_EXPIRATION: process.env.JWT_REFRESH_TOKEN_EXPIRATION || '7d',
  },
  
  // Twilio Configuration
  TWILIO: {
    ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID || '',
    AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN || '',
    PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER || '',
  },
  
  // Payment Configuration
  PAYMENTS: {
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || '',
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || '',
    RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || '',
    RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || '',
  },
  
  // AWS Configuration
  AWS: {
    ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || '',
    SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || '',
    REGION: process.env.AWS_REGION || '',
    S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME || '',
  },
  
  // Email Configuration
  EMAIL: {
    SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
    SMTP_PORT: parseInt(process.env.SMTP_PORT || '587'),
    SMTP_USER: process.env.SMTP_USER || '',
    SMTP_PASS: process.env.SMTP_PASS || '',
  },
  
  // File Upload Configuration
  UPLOAD: {
    MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '5242880'), // 5MB
    UPLOAD_PATH: process.env.UPLOAD_PATH || 'uploads/',
  },
  
  // Rate Limiting
  RATE_LIMIT: {
    WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
    MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  },
  
  // CORS Configuration
  CORS: {
    ORIGIN: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000', 'http://localhost:3001'],
  },
  
  // Socket.IO Configuration
  SOCKET_IO: {
    CORS_ORIGIN: process.env.SOCKET_IO_CORS_ORIGIN || 'http://localhost:3000',
  },
};

export default config;
