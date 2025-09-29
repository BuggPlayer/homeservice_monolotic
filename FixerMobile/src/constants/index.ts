import { ServiceCategory } from '../types';

// API Configuration
export const API_BASE_URL = __DEV__ 
  ? 'http://10.0.2.2:3000/api' // Android emulator
  : 'https://your-api-domain.com/api';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH_TOKEN: '/auth/refresh-token',
    PROFILE: '/auth/profile',
    LOGOUT: '/auth/logout',
  },
  SERVICE_REQUESTS: {
    CREATE: '/service-requests',
    LIST: '/service-requests',
    DETAILS: (id: string) => `/service-requests/${id}`,
    UPDATE: (id: string) => `/service-requests/${id}`,
    UPDATE_STATUS: (id: string) => `/service-requests/${id}/status`,
  },
  PROVIDERS: {
    PROFILE: '/providers/profile',
    LIST: '/providers',
    DETAILS: (id: string) => `/providers/${id}`,
    BY_SERVICE_AND_LOCATION: (serviceType: string, city: string) => 
      `/providers/service/${serviceType}/location/${city}`,
  },
  QUOTES: {
    CREATE: (requestId: string) => `/service-requests/${requestId}/quotes`,
    ACCEPT: (quoteId: string) => `/quotes/${quoteId}/accept`,
  },
  BOOKINGS: {
    LIST: '/bookings',
    DETAILS: (id: string) => `/bookings/${id}`,
  },
  CALLS: {
    INITIATE: '/calls/initiate',
    WEBHOOK: '/calls/webhook/status',
  },
  WHATSAPP: {
    WEBHOOK: '/whatsapp/webhook',
    QUICK_BOOKING: '/whatsapp/quick-booking',
  },
};

// Service Categories
export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: 'ac_repair',
    name: 'AC Repair',
    icon: 'air-conditioner',
    description: 'Air conditioning repair and maintenance',
    color: '#4CAF50',
  },
  {
    id: 'plumbing',
    name: 'Plumbing',
    icon: 'pipe-wrench',
    description: 'Plumbing repairs and installations',
    color: '#2196F3',
  },
  {
    id: 'electrical',
    name: 'Electrical',
    icon: 'lightning-bolt',
    description: 'Electrical repairs and installations',
    color: '#FF9800',
  },
  {
    id: 'carpentry',
    name: 'Carpentry',
    icon: 'hammer',
    description: 'Woodwork and furniture repairs',
    color: '#795548',
  },
  {
    id: 'painting',
    name: 'Painting',
    icon: 'format-paint',
    description: 'Interior and exterior painting',
    color: '#E91E63',
  },
  {
    id: 'cleaning',
    name: 'Cleaning',
    icon: 'broom',
    description: 'House and office cleaning',
    color: '#9C27B0',
  },
  {
    id: 'appliance_repair',
    name: 'Appliance Repair',
    icon: 'washing-machine',
    description: 'Home appliance repairs',
    color: '#607D8B',
  },
  {
    id: 'pest_control',
    name: 'Pest Control',
    icon: 'bug',
    description: 'Pest control and extermination',
    color: '#8BC34A',
  },
];

// Urgency Levels
export const URGENCY_LEVELS = [
  { value: 'low', label: 'Low', color: '#4CAF50', description: 'Can wait a few days' },
  { value: 'medium', label: 'Medium', color: '#FF9800', description: 'Within 24 hours' },
  { value: 'high', label: 'High', color: '#FF5722', description: 'Within a few hours' },
  { value: 'emergency', label: 'Emergency', color: '#F44336', description: 'Immediate attention' },
];

// Booking Status
export const BOOKING_STATUS = {
  SCHEDULED: 'scheduled',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

// Service Request Status
export const SERVICE_REQUEST_STATUS = {
  OPEN: 'open',
  QUOTED: 'quoted',
  BOOKED: 'booked',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

// Quote Status
export const QUOTE_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  EXPIRED: 'expired',
} as const;

// Provider Verification Status
export const VERIFICATION_STATUS = {
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
} as const;

// Colors
export const COLORS = {
  PRIMARY: '#2196F3',
  PRIMARY_DARK: '#1976D2',
  SECONDARY: '#FF9800',
  SUCCESS: '#4CAF50',
  WARNING: '#FF9800',
  ERROR: '#F44336',
  INFO: '#2196F3',
  LIGHT_GRAY: '#F5F5F5',
  GRAY: '#9E9E9E',
  DARK_GRAY: '#616161',
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  TRANSPARENT: 'transparent',
};

// Typography
export const FONT_SIZES = {
  XS: 12,
  SM: 14,
  MD: 16,
  LG: 18,
  XL: 20,
  XXL: 24,
  XXXL: 32,
};

export const FONT_WEIGHTS = {
  LIGHT: '300',
  REGULAR: '400',
  MEDIUM: '500',
  SEMIBOLD: '600',
  BOLD: '700',
  EXTRABOLD: '800',
};

// Spacing
export const SPACING = {
  XS: 4,
  SM: 8,
  MD: 16,
  LG: 24,
  XL: 32,
  XXL: 48,
  XXXL: 64,
};

// Border Radius
export const BORDER_RADIUS = {
  XS: 4,
  SM: 8,
  MD: 12,
  LG: 16,
  XL: 20,
  ROUND: 50,
};

// Screen Dimensions
export const SCREEN_PADDING = 16;

// Animation Durations
export const ANIMATION_DURATION = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
};

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  NOTIFICATION_SETTINGS: 'notification_settings',
  LOCATION_PERMISSION: 'location_permission',
};

// Validation Rules
export const VALIDATION_RULES = {
  PHONE: /^\+?[1-9]\d{1,14}$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  DESCRIPTION_MIN_LENGTH: 10,
  DESCRIPTION_MAX_LENGTH: 500,
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  INVALID_CREDENTIALS: 'Invalid phone number or password.',
  PHONE_ALREADY_EXISTS: 'Phone number already registered.',
  INVALID_PHONE: 'Please enter a valid phone number.',
  INVALID_OTP: 'Invalid OTP. Please try again.',
  OTP_EXPIRED: 'OTP has expired. Please request a new one.',
  REQUIRED_FIELD: 'This field is required.',
  PASSWORD_TOO_SHORT: 'Password must be at least 8 characters.',
  PASSWORDS_DONT_MATCH: 'Passwords do not match.',
  LOCATION_REQUIRED: 'Location permission is required.',
  CAMERA_REQUIRED: 'Camera permission is required.',
  STORAGE_REQUIRED: 'Storage permission is required.',
  GENERIC_ERROR: 'Something went wrong. Please try again.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  REGISTER_SUCCESS: 'Registration successful!',
  OTP_SENT: 'OTP sent to your phone number.',
  OTP_VERIFIED: 'Phone number verified successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  SERVICE_REQUEST_CREATED: 'Service request created successfully!',
  QUOTE_SUBMITTED: 'Quote submitted successfully!',
  BOOKING_CREATED: 'Booking created successfully!',
  MESSAGE_SENT: 'Message sent successfully!',
  CALL_INITIATED: 'Call initiated successfully!',
};

// WhatsApp Integration
export const WHATSAPP_CONFIG = {
  BUSINESS_PHONE: '+1234567890', // Replace with your WhatsApp Business number
  QUICK_BOOKING_TEMPLATE: 'quick_booking',
  BOOKING_CONFIRMATION_TEMPLATE: 'booking_confirmation',
  STATUS_UPDATE_TEMPLATE: 'status_update',
};

// Twilio Configuration
export const TWILIO_CONFIG = {
  ACCOUNT_SID: 'your_twilio_account_sid',
  AUTH_TOKEN: 'your_twilio_auth_token',
  PHONE_NUMBER: '+1234567890',
};

// Firebase Configuration
export const FIREBASE_CONFIG = {
  // Add your Firebase config here
  apiKey: 'your_api_key',
  authDomain: 'your_project.firebaseapp.com',
  projectId: 'your_project_id',
  storageBucket: 'your_project.appspot.com',
  messagingSenderId: 'your_sender_id',
  appId: 'your_app_id',
};

// Map Configuration
export const MAP_CONFIG = {
  DEFAULT_REGION: {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  },
  ZOOM_LEVEL: 15,
  ANIMATION_DURATION: 1000,
};

// Image Configuration
export const IMAGE_CONFIG = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  QUALITY: 0.8,
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/jpg'],
  MAX_IMAGES: 5,
};

// Notification Types
export const NOTIFICATION_TYPES = {
  BOOKING_CREATED: 'booking_created',
  BOOKING_UPDATED: 'booking_updated',
  QUOTE_RECEIVED: 'quote_received',
  QUOTE_ACCEPTED: 'quote_accepted',
  MESSAGE_RECEIVED: 'message_received',
  CALL_INCOMING: 'call_incoming',
  SERVICE_COMPLETED: 'service_completed',
  PAYMENT_RECEIVED: 'payment_received',
} as const;
