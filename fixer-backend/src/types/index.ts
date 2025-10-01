// Database table interfaces
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

// E-commerce Types
export interface Product {
  id: string;
  provider_id: string;
  category_id: string;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  sku: string;
  stock_quantity: number;
  images: string[];
  specifications?: { [key: string]: any };
  is_active: boolean;
  is_featured: boolean;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  tags: string[];
  created_at: Date;
  updated_at: Date;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  parent_id?: string;
  image?: string;
  is_active: boolean;
  sort_order: number;
  created_at: Date;
  updated_at: Date;
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: Date;
  updated_at: Date;
}

export interface Order {
  id: string;
  user_id: string;
  provider_id: string;
  order_number: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  total_amount: number;
  shipping_amount: number;
  tax_amount: number;
  discount_amount: number;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_method: string;
  payment_id?: string;
  shipping_address: {
    first_name: string;
    last_name: string;
    address: string;
    city: string;
    state: string;
    zip_code: string;
    country: string;
    phone: string;
  };
  billing_address?: {
    first_name: string;
    last_name: string;
    address: string;
    city: string;
    state: string;
    zip_code: string;
    country: string;
    phone: string;
  };
  notes?: string;
  tracking_number?: string;
  shipped_at?: Date;
  delivered_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  total: number;
  created_at: Date;
  updated_at: Date;
}

export interface Review {
  id: string;
  user_id: string;
  product_id: string;
  order_id?: string;
  rating: number;
  title?: string;
  comment?: string;
  images?: string[];
  is_verified: boolean;
  helpful_count: number;
  created_at: Date;
  updated_at: Date;
}

export interface Wishlist {
  id: string;
  user_id: string;
  product_id: string;
  created_at: Date;
}

// Common types
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

// Socket.IO Types
export interface SocketUser {
  userId: string;
  userType: 'customer' | 'provider' | 'admin';
  socketId: string;
}

export interface SocketMessage {
  id: string;
  from: string;
  to: string;
  message: string;
  type: 'text' | 'image' | 'file' | 'quote' | 'booking';
  metadata?: any;
  timestamp: Date;
}

export interface SocketNotification {
  type: 'quote_received' | 'quote_accepted' | 'booking_confirmed' | 'message_received' | 'order_placed' | 'order_updated';
  title: string;
  message: string;
  data?: any;
  userId: string;
  timestamp: Date;
}
