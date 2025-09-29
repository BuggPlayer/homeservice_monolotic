export interface User {
  id: string;
  email: string;
  phone: string;
  password_hash: string;
  user_type: 'customer' | 'provider' | 'admin';
  first_name: string;
  last_name: string;
  profile_picture?: string;
  is_verified: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface ServiceProvider {
  id: string;
  user_id: string;
  business_name: string;
  business_license?: string;
  services_offered: string[];
  service_areas: string[];
  verification_status: 'pending' | 'verified' | 'rejected';
  rating: number;
  total_reviews: number;
  years_experience: number;
  bio?: string;
  created_at: Date;
  updated_at: Date;
}

export interface ServiceRequest {
  id: string;
  customer_id: string;
  service_type: string;
  title: string;
  description: string;
  location: {
    address: string;
    city: string;
    state: string;
    zip_code: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  urgency: 'low' | 'medium' | 'high' | 'emergency';
  status: 'open' | 'quoted' | 'booked' | 'in_progress' | 'completed' | 'cancelled';
  budget_min?: number;
  budget_max?: number;
  preferred_date?: Date;
  images?: string[];
  created_at: Date;
  updated_at: Date;
}

export interface Quote {
  id: string;
  service_request_id: string;
  provider_id: string;
  amount: number;
  notes: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  valid_until: Date;
  created_at: Date;
  updated_at: Date;
}

export interface Booking {
  id: string;
  service_request_id: string;
  quote_id: string;
  provider_id: string;
  customer_id: string;
  scheduled_time: Date;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  total_amount: number;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Call {
  id: string;
  customer_id: string;
  provider_id: string;
  call_duration?: number;
  status: 'initiated' | 'ringing' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  recording_url?: string;
  twilio_call_sid?: string;
  created_at: Date;
  updated_at: Date;
}

export interface JWTPayload {
  userId: string;
  email: string;
  userType: 'customer' | 'provider' | 'admin';
  iat?: number;
  exp?: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
