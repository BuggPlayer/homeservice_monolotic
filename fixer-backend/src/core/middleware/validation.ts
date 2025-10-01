import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ApiResponse } from '@/types';

// Validation schemas
export const validationSchemas = {
  // User registration
  register: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required',
    }),
    phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).required().messages({
      'string.pattern.base': 'Please provide a valid phone number',
      'any.required': 'Phone number is required',
    }),
    password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/).required().messages({
      'string.min': 'Password must be at least 8 characters long',
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      'any.required': 'Password is required',
    }),
    user_type: Joi.string().valid('customer', 'provider').required().messages({
      'any.only': 'User type must be either customer or provider',
      'any.required': 'User type is required',
    }),
    first_name: Joi.string().min(2).max(50).required().messages({
      'string.min': 'First name must be at least 2 characters long',
      'string.max': 'First name must not exceed 50 characters',
      'any.required': 'First name is required',
    }),
    last_name: Joi.string().min(2).max(50).required().messages({
      'string.min': 'Last name must be at least 2 characters long',
      'string.max': 'Last name must not exceed 50 characters',
      'any.required': 'Last name is required',
    }),
  }),

  // User login
  login: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required',
    }),
    password: Joi.string().required().messages({
      'any.required': 'Password is required',
    }),
  }),

  // Refresh token
  refreshToken: Joi.object({
    refreshToken: Joi.string().required().messages({
      'any.required': 'Refresh token is required',
    }),
  }),

  // Update profile
  updateProfile: Joi.object({
    first_name: Joi.string().min(2).max(50).optional(),
    last_name: Joi.string().min(2).max(50).optional(),
    phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).optional().messages({
      'string.pattern.base': 'Please provide a valid phone number',
    }),
    profile_picture: Joi.string().uri().optional().messages({
      'string.uri': 'Profile picture must be a valid URL',
    }),
  }),

  // Change password
  changePassword: Joi.object({
    currentPassword: Joi.string().required().messages({
      'any.required': 'Current password is required',
    }),
    newPassword: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/).required().messages({
      'string.min': 'New password must be at least 8 characters long',
      'string.pattern.base': 'New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      'any.required': 'New password is required',
    }),
  }),

  // Service provider registration
  serviceProviderRegistration: Joi.object({
    business_name: Joi.string().min(2).max(100).required().messages({
      'string.min': 'Business name must be at least 2 characters long',
      'string.max': 'Business name must not exceed 100 characters',
      'any.required': 'Business name is required',
    }),
    business_license: Joi.string().optional(),
    services_offered: Joi.array().items(Joi.string()).min(1).required().messages({
      'array.min': 'At least one service must be offered',
      'any.required': 'Services offered is required',
    }),
    service_areas: Joi.array().items(Joi.string()).min(1).required().messages({
      'array.min': 'At least one service area must be specified',
      'any.required': 'Service areas is required',
    }),
    years_experience: Joi.number().integer().min(0).max(50).optional().messages({
      'number.min': 'Years of experience cannot be negative',
      'number.max': 'Years of experience cannot exceed 50',
    }),
    bio: Joi.string().max(500).optional().messages({
      'string.max': 'Bio must not exceed 500 characters',
    }),
  }),

  // Service request creation
  serviceRequest: Joi.object({
    service_type: Joi.string().min(2).max(50).required().messages({
      'string.min': 'Service type must be at least 2 characters long',
      'string.max': 'Service type must not exceed 50 characters',
      'any.required': 'Service type is required',
    }),
    title: Joi.string().min(5).max(200).required().messages({
      'string.min': 'Title must be at least 5 characters long',
      'string.max': 'Title must not exceed 200 characters',
      'any.required': 'Title is required',
    }),
    description: Joi.string().min(20).max(1000).required().messages({
      'string.min': 'Description must be at least 20 characters long',
      'string.max': 'Description must not exceed 1000 characters',
      'any.required': 'Description is required',
    }),
    location: Joi.object({
      address: Joi.string().min(10).max(200).required().messages({
        'string.min': 'Address must be at least 10 characters long',
        'string.max': 'Address must not exceed 200 characters',
        'any.required': 'Address is required',
      }),
      city: Joi.string().min(2).max(50).required().messages({
        'string.min': 'City must be at least 2 characters long',
        'string.max': 'City must not exceed 50 characters',
        'any.required': 'City is required',
      }),
      state: Joi.string().min(2).max(50).required().messages({
        'string.min': 'State must be at least 2 characters long',
        'string.max': 'State must not exceed 50 characters',
        'any.required': 'State is required',
      }),
      zip_code: Joi.string().pattern(/^\d{5}(-\d{4})?$/).required().messages({
        'string.pattern.base': 'Please provide a valid ZIP code',
        'any.required': 'ZIP code is required',
      }),
      coordinates: Joi.object({
        lat: Joi.number().min(-90).max(90).required().messages({
          'number.min': 'Latitude must be between -90 and 90',
          'number.max': 'Latitude must be between -90 and 90',
          'any.required': 'Latitude is required',
        }),
        lng: Joi.number().min(-180).max(180).required().messages({
          'number.min': 'Longitude must be between -180 and 180',
          'number.max': 'Longitude must be between -180 and 180',
          'any.required': 'Longitude is required',
        }),
      }).required().messages({
        'any.required': 'Coordinates are required',
      }),
    }).required().messages({
      'any.required': 'Location is required',
    }),
    urgency: Joi.string().valid('low', 'medium', 'high', 'emergency').optional().messages({
      'any.only': 'Urgency must be low, medium, high, or emergency',
    }),
    budget_min: Joi.number().min(0).optional().messages({
      'number.min': 'Minimum budget cannot be negative',
    }),
    budget_max: Joi.number().min(0).optional().messages({
      'number.min': 'Maximum budget cannot be negative',
    }),
    preferred_date: Joi.date().min('now').optional().messages({
      'date.min': 'Preferred date cannot be in the past',
    }),
    images: Joi.array().items(Joi.string().uri()).max(5).optional().messages({
      'array.max': 'Maximum 5 images allowed',
      'string.uri': 'Image must be a valid URL',
    }),
  }),

  // Quote creation
  quote: Joi.object({
    service_request_id: Joi.string().uuid().required().messages({
      'string.guid': 'Service request ID must be a valid UUID',
      'any.required': 'Service request ID is required',
    }),
    amount: Joi.number().min(0.01).max(100000).required().messages({
      'number.min': 'Amount must be at least $0.01',
      'number.max': 'Amount cannot exceed $100,000',
      'any.required': 'Amount is required',
    }),
    notes: Joi.string().max(500).optional().messages({
      'string.max': 'Notes must not exceed 500 characters',
    }),
    valid_until: Joi.date().min('now').required().messages({
      'date.min': 'Valid until date cannot be in the past',
      'any.required': 'Valid until date is required',
    }),
  }),

  // Booking creation
  booking: Joi.object({
    quote_id: Joi.string().uuid().required().messages({
      'string.guid': 'Quote ID must be a valid UUID',
      'any.required': 'Quote ID is required',
    }),
    scheduled_time: Joi.date().min('now').required().messages({
      'date.min': 'Scheduled time cannot be in the past',
      'any.required': 'Scheduled time is required',
    }),
    notes: Joi.string().max(500).optional().messages({
      'string.max': 'Notes must not exceed 500 characters',
    }),
  }),

  // Call initiation
  call: Joi.object({
    provider_id: Joi.string().uuid().required().messages({
      'string.guid': 'Provider ID must be a valid UUID',
      'any.required': 'Provider ID is required',
    }),
    service_request_id: Joi.string().uuid().optional().messages({
      'string.guid': 'Service request ID must be a valid UUID',
    }),
  }),

  // Pagination
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
  }),

  // Status updates
  statusUpdate: Joi.object({
    status: Joi.string().required().messages({
      'any.required': 'Status is required',
    }),
  }),

  // ID parameter
  idParam: Joi.object({
    id: Joi.string().uuid().required().messages({
      'string.guid': 'ID must be a valid UUID',
      'any.required': 'ID is required',
    }),
  }),

  // Product creation
  product: Joi.object({
    category_id: Joi.string().uuid().required().messages({
      'string.guid': 'Category ID must be a valid UUID',
      'any.required': 'Category ID is required',
    }),
    name: Joi.string().min(2).max(255).required().messages({
      'string.min': 'Product name must be at least 2 characters long',
      'string.max': 'Product name must not exceed 255 characters',
      'any.required': 'Product name is required',
    }),
    description: Joi.string().min(10).max(2000).required().messages({
      'string.min': 'Description must be at least 10 characters long',
      'string.max': 'Description must not exceed 2000 characters',
      'any.required': 'Description is required',
    }),
    price: Joi.number().min(0.01).max(100000).required().messages({
      'number.min': 'Price must be at least $0.01',
      'number.max': 'Price cannot exceed $100,000',
      'any.required': 'Price is required',
    }),
    original_price: Joi.number().min(0.01).max(100000).optional().messages({
      'number.min': 'Original price must be at least $0.01',
      'number.max': 'Original price cannot exceed $100,000',
    }),
    sku: Joi.string().min(3).max(100).required().messages({
      'string.min': 'SKU must be at least 3 characters long',
      'string.max': 'SKU must not exceed 100 characters',
      'any.required': 'SKU is required',
    }),
    stock_quantity: Joi.number().integer().min(0).max(10000).required().messages({
      'number.min': 'Stock quantity cannot be negative',
      'number.max': 'Stock quantity cannot exceed 10,000',
      'any.required': 'Stock quantity is required',
    }),
    images: Joi.array().items(Joi.string().uri()).max(10).optional().messages({
      'array.max': 'Maximum 10 images allowed',
      'string.uri': 'Image must be a valid URL',
    }),
    specifications: Joi.object().optional(),
    is_active: Joi.boolean().optional(),
    is_featured: Joi.boolean().optional(),
    weight: Joi.number().min(0).max(1000).optional().messages({
      'number.min': 'Weight cannot be negative',
      'number.max': 'Weight cannot exceed 1000 kg',
    }),
    dimensions: Joi.object({
      length: Joi.number().min(0).max(1000).required(),
      width: Joi.number().min(0).max(1000).required(),
      height: Joi.number().min(0).max(1000).required(),
    }).optional(),
    tags: Joi.array().items(Joi.string().min(1).max(50)).max(20).optional().messages({
      'array.max': 'Maximum 20 tags allowed',
      'string.min': 'Tag must be at least 1 character long',
      'string.max': 'Tag must not exceed 50 characters',
    }),
  }),

  // Category creation
  category: Joi.object({
    name: Joi.string().min(2).max(100).required().messages({
      'string.min': 'Category name must be at least 2 characters long',
      'string.max': 'Category name must not exceed 100 characters',
      'any.required': 'Category name is required',
    }),
    description: Joi.string().max(500).optional().messages({
      'string.max': 'Description must not exceed 500 characters',
    }),
    parent_id: Joi.string().uuid().optional().messages({
      'string.guid': 'Parent ID must be a valid UUID',
    }),
    image: Joi.string().uri().optional().messages({
      'string.uri': 'Image must be a valid URL',
    }),
    is_active: Joi.boolean().optional(),
    sort_order: Joi.number().integer().min(0).optional().messages({
      'number.min': 'Sort order cannot be negative',
    }),
  }),

  // Stock update
  stockUpdate: Joi.object({
    quantity: Joi.number().integer().min(0).max(10000).required().messages({
      'number.min': 'Quantity cannot be negative',
      'number.max': 'Quantity cannot exceed 10,000',
      'any.required': 'Quantity is required',
    }),
  }),

  // Sort order update
  sortOrderUpdate: Joi.object({
    sort_order: Joi.number().integer().min(0).required().messages({
      'number.min': 'Sort order cannot be negative',
      'any.required': 'Sort order is required',
    }),
  }),
};

// Validation middleware factory
export const validate = (schema: Joi.ObjectSchema, property: 'body' | 'query' | 'params' = 'body') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const data = req[property];
    const { error, value } = schema.validate(data, { 
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Validation failed',
        error: error.details.map(detail => detail.message).join(', '),
      };

      return res.status(400).json(response);
    }

    // Replace the original data with validated and sanitized data
    req[property] = value;
    next();
  };
};

// Common validation middleware
export const validateRegister = validate(validationSchemas.register);
export const validateLogin = validate(validationSchemas.login);
export const validateRefreshToken = validate(validationSchemas.refreshToken);
export const validateUpdateProfile = validate(validationSchemas.updateProfile);
export const validateChangePassword = validate(validationSchemas.changePassword);
export const validateServiceProviderRegistration = validate(validationSchemas.serviceProviderRegistration);
export const validateServiceRequest = validate(validationSchemas.serviceRequest);
export const validateQuote = validate(validationSchemas.quote);
export const validateBooking = validate(validationSchemas.booking);
export const validateCall = validate(validationSchemas.call);
export const validatePagination = validate(validationSchemas.pagination, 'query');
export const validateStatusUpdate = validate(validationSchemas.statusUpdate);
export const validateIdParam = validate(validationSchemas.idParam, 'params');

// E-commerce validation middleware
export const validateProduct = validate(validationSchemas.product);
export const validateCategory = validate(validationSchemas.category);
export const validateStockUpdate = validate(validationSchemas.stockUpdate);
export const validateSortOrderUpdate = validate(validationSchemas.sortOrderUpdate);

// Custom validation for specific endpoints
export const validateQuoteStatusUpdate = validate(
  Joi.object({
    status: Joi.string().valid('accepted', 'rejected').required().messages({
      'any.only': 'Status must be either accepted or rejected',
      'any.required': 'Status is required',
    }),
  })
);

export const validateBookingStatusUpdate = validate(
  Joi.object({
    status: Joi.string().valid('scheduled', 'in_progress', 'completed', 'cancelled').required().messages({
      'any.only': 'Status must be scheduled, in_progress, completed, or cancelled',
      'any.required': 'Status is required',
    }),
  })
);

export const validateCallStatusUpdate = validate(
  Joi.object({
    status: Joi.string().valid('initiated', 'ringing', 'in_progress', 'completed', 'failed', 'cancelled').required().messages({
      'any.only': 'Status must be initiated, ringing, in_progress, completed, failed, or cancelled',
      'any.required': 'Status is required',
    }),
    call_duration: Joi.number().integer().min(0).optional(),
    recording_url: Joi.string().uri().optional().messages({
      'string.uri': 'Recording URL must be a valid URL',
    }),
  })
);