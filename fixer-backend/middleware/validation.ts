import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

/**
 * Validation middleware factory
 */
export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorDetails = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errorDetails,
      });
    }

    req.body = value;
    next();
  };
};

/**
 * Validation schemas
 */
export const validationSchemas = {
  // User registration
  userRegistration: Joi.object({
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).required(),
    password: Joi.string().min(8).required(),
    user_type: Joi.string().valid('customer', 'provider').required(),
    first_name: Joi.string().min(2).max(50).required(),
    last_name: Joi.string().min(2).max(50).required(),
  }),

  // User login
  userLogin: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  // Service request creation
  serviceRequest: Joi.object({
    service_type: Joi.string().required(),
    title: Joi.string().min(5).max(255).required(),
    description: Joi.string().min(10).required(),
    location: Joi.object({
      address: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      zip_code: Joi.string().required(),
      coordinates: Joi.object({
        lat: Joi.number().min(-90).max(90).required(),
        lng: Joi.number().min(-180).max(180).required(),
      }).required(),
    }).required(),
    urgency: Joi.string().valid('low', 'medium', 'high', 'emergency').default('medium'),
    budget_min: Joi.number().min(0).optional(),
    budget_max: Joi.number().min(0).optional(),
    preferred_date: Joi.date().min('now').optional(),
    images: Joi.array().items(Joi.string()).optional(),
  }),

  // Provider profile
  providerProfile: Joi.object({
    business_name: Joi.string().min(2).max(255).required(),
    business_license: Joi.string().optional(),
    services_offered: Joi.array().items(Joi.string()).min(1).required(),
    service_areas: Joi.array().items(Joi.string()).min(1).required(),
    years_experience: Joi.number().min(0).required(),
    bio: Joi.string().max(1000).optional(),
  }),

  // Quote submission
  quote: Joi.object({
    amount: Joi.number().min(0).required(),
    notes: Joi.string().max(1000).optional(),
    valid_until: Joi.date().min('now').required(),
  }),

  // Booking creation
  booking: Joi.object({
    scheduled_time: Joi.date().min('now').required(),
    notes: Joi.string().max(1000).optional(),
  }),
};
