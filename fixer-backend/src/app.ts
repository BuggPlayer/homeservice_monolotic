import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { config } from './config';
import { errorHandler, notFoundHandler } from './core/middleware';
import { RateLimiter } from './core/middleware/rateLimiter';

// Import routes
import { authRoutes } from './modules/auth';
import { userRoutes } from './modules/users';
import { serviceRequestRoutes } from './modules/services';
import { serviceProviderRoutes } from './modules/providers';
import { quoteRoutes } from './modules/quotes';
import { bookingRoutes } from './modules/bookings';
import { communicationRoutes } from './modules/communications';
import { paymentRoutes } from './modules/payments';
import { productRoutes } from './modules/products';
import adminRoutes from './modules/admin/routes/admin';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: config.CORS.ORIGIN,
  credentials: true,
}));

// Compression middleware
app.use(compression());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
app.use(RateLimiter.moderate);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

app.use('/api/users', userRoutes);
app.use('/api/service-requests', serviceRequestRoutes);
app.use('/api/providers', serviceProviderRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/communications', communicationRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/products', productRoutes);

// 404 handler
app.use(notFoundHandler);

// Error handler
app.use(errorHandler);

export default app;
