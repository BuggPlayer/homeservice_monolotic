import { Request, Response, NextFunction } from 'express';
import { redisClient } from '../../config/redis';
import { config } from '../../config';
import { ApiResponse } from '@/types';

export interface RateLimitOptions {
  windowMs: number;
  maxRequests: number;
  message?: string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
  keyGenerator?: (req: Request) => string;
}

export class RateLimiter {
  private static defaultOptions: RateLimitOptions = {
    windowMs: config.RATE_LIMIT.WINDOW_MS,
    maxRequests: config.RATE_LIMIT.MAX_REQUESTS,
    message: 'Too many requests, please try again later.',
    skipSuccessfulRequests: false,
    skipFailedRequests: false,
    keyGenerator: (req: Request) => {
      // Use IP address as default key
      return req.ip || req.connection.remoteAddress || 'unknown';
    }
  };

  static create(options: Partial<RateLimitOptions> = {}) {
    const opts = { ...this.defaultOptions, ...options };

    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const key = opts.keyGenerator!(req);
        const windowKey = `rate_limit:${key}:${Math.floor(Date.now() / opts.windowMs)}`;
        
        // Get current request count
        const currentCount = await redisClient.get(windowKey);
        const count = currentCount ? parseInt(currentCount) : 0;

        if (count >= opts.maxRequests) {
          const response: ApiResponse = {
            success: false,
            message: opts.message!,
            error: 'Rate limit exceeded'
          };

          return res.status(429).json(response);
        }

        // Increment counter
        await redisClient.setEx(windowKey, Math.ceil(opts.windowMs / 1000), (count + 1).toString());

        // Add rate limit headers
        res.set({
          'X-RateLimit-Limit': opts.maxRequests.toString(),
          'X-RateLimit-Remaining': Math.max(0, opts.maxRequests - count - 1).toString(),
          'X-RateLimit-Reset': new Date(Date.now() + opts.windowMs).toISOString()
        });

        next();
      } catch (error) {
        // If Redis is down, allow the request to proceed
        console.error('Rate limiter error:', error);
        next();
      }
    };
  }

  // Predefined rate limiters for different use cases
  static strict = this.create({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 10,
    message: 'Too many requests, please try again in 15 minutes.'
  });

  static moderate = this.create({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
    message: 'Too many requests, please try again later.'
  });

  static lenient = this.create({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 1000,
    message: 'Too many requests, please try again later.'
  });

  // Auth-specific rate limiter
  static auth = this.create({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5,
    message: 'Too many authentication attempts, please try again in 15 minutes.',
    keyGenerator: (req: Request) => {
      // Use email or IP for auth rate limiting
      const email = req.body?.email;
      const ip = req.ip || req.connection.remoteAddress || 'unknown';
      return email ? `auth:${email}` : `auth:${ip}`;
    }
  });

  // API-specific rate limiter
  static api = this.create({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
    message: 'API rate limit exceeded, please try again later.',
    keyGenerator: (req: Request) => {
      // Use user ID if authenticated, otherwise IP
      const userId = (req as any).user?.userId;
      const ip = req.ip || req.connection.remoteAddress || 'unknown';
      return userId ? `api:${userId}` : `api:${ip}`;
    }
  });
}