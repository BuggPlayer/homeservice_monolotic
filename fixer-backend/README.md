# 🏠 Fixer Marketplace - Backend API

A comprehensive home services marketplace backend built with Node.js, TypeScript, Express, and PostgreSQL. This API enables customers to find and book home service providers for various repair, maintenance, and improvement tasks.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Documentation](#documentation)
- [Installation & Setup](#installation--setup)
- [Development](#development)
- [Production Deployment](#production-deployment)
- [Testing](#testing)
- [Security](#security)
- [Contributing](#contributing)

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/your-org/fixer-backend.git
cd fixer-backend

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Setup database
   npm run migrate
npm run seed:comprehensive

# Start development server
   npm run dev
```

## 📚 Documentation

- **[Project Structure](docs/PROJECT_STRUCTURE.md)** - Detailed project structure and file organization
- **[Database Schema](docs/DATABASE_SCHEMA.md)** - Complete database schema and relationships
- **[Database Usage](docs/DATABASE_USAGE.md)** - Database queries, optimization, and maintenance
- **[API Documentation](docs/API_DOCUMENTATION.md)** - Comprehensive API endpoint documentation
- **[API Testing](docs/API_TESTING.md)** - Testing strategies, examples, and best practices
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Production deployment instructions
- **[Environment Configuration](docs/ENVIRONMENT_CONFIG.md)** - Environment variables and configuration
- **[File Purpose Guide](docs/FILE_PURPOSE.md)** - Purpose and functionality of every file

## 🎯 Overview

Fixer Marketplace is a comprehensive home services platform that connects customers with verified service providers. The backend API handles user authentication, service requests, bookings, payments, real-time communication, and more.

### Key Capabilities:
- **User Management**: Customer and service provider registration/authentication
- **Service Requests**: Create, manage, and track service requests
- **Booking System**: Schedule and manage service appointments
- **Payment Processing**: Integrated with Stripe and Razorpay
- **Real-time Communication**: WebSocket-based chat and notifications
- **Rating & Reviews**: Service provider rating system
- **File Management**: Image and document uploads
- **Admin Dashboard**: Comprehensive admin controls

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based authentication with refresh tokens
- Role-based access control (RBAC)
- Password hashing with bcrypt
- Email verification
- Password reset functionality

### 👥 User Management
- Customer and service provider profiles
- Profile verification system
- Document upload and verification
- User preferences and settings

### 🛠️ Service Management
- Service request creation and management
- Quote generation and management
- Service categorization
- Provider matching algorithm

### 📅 Booking System
- Appointment scheduling
- Calendar integration
- Booking status tracking
- Automated reminders

### 💳 Payment Processing
- Stripe integration
- Razorpay integration
- Multiple payment methods
- Refund management
- Invoice generation

### 💬 Communication
- Real-time chat (WebSocket)
- Push notifications
- Email notifications
- SMS notifications (Twilio)

### 📊 Analytics & Reporting
- Service statistics
- Revenue tracking
- User analytics
- Performance metrics

## 🛠️ Tech Stack

### Core Technologies
- **Runtime**: Node.js 18+
- **Language**: TypeScript 5.3+
- **Framework**: Express.js 4.18+
- **Database**: PostgreSQL 14+
- **Cache**: Redis 7+
- **ORM**: Custom Repository Pattern

### Key Dependencies
- **Authentication**: jsonwebtoken, bcrypt
- **Validation**: Joi, express-validator
- **Security**: helmet, cors, express-rate-limit
- **File Upload**: multer, express-fileupload, sharp
- **Email**: nodemailer
- **SMS**: twilio
- **Payments**: stripe, razorpay
- **Real-time**: socket.io
- **Logging**: morgan, winston
- **Testing**: jest, supertest


Test Credentials:
Admin: admin@fixer.com / admin123
Customer: john.doe@example.com / password123
Provider: electrician@fixer.com / password123