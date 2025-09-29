// User Types
export interface User {
  id: string;
  email: string;
  phone: string;
  user_type: 'customer' | 'provider' | 'admin';
  first_name: string;
  last_name: string;
  profile_picture?: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

// Service Provider Types
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
  created_at: string;
  updated_at: string;
  user?: User;
}

// Service Request Types
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
  preferred_date?: string;
  images?: string[];
  created_at: string;
  updated_at: string;
}

// Quote Types
export interface Quote {
  id: string;
  service_request_id: string;
  provider_id: string;
  amount: number;
  notes: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  valid_until: string;
  created_at: string;
  updated_at: string;
  provider?: ServiceProvider;
}

// Booking Types
export interface Booking {
  id: string;
  service_request_id: string;
  quote_id: string;
  provider_id: string;
  customer_id: string;
  scheduled_time: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  total_amount: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  provider?: ServiceProvider;
  service_request?: ServiceRequest;
}

// Call Types
export interface Call {
  id: string;
  customer_id: string;
  provider_id: string;
  call_duration?: number;
  status: 'initiated' | 'ringing' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  recording_url?: string;
  twilio_call_sid?: string;
  created_at: string;
  updated_at: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
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

// Navigation Types
export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  Main: undefined;
  ServiceRequest: { serviceType?: string };
  ServiceRequestDetails: { requestId: string };
  ProviderProfile: { providerId: string };
  BookingDetails: { bookingId: string };
  Chat: { providerId: string; requestId?: string };
  Profile: undefined;
  Settings: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  OTPVerification: { phone: string };
  ProfileSetup: { userData: Partial<User> };
};

export type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  Bookings: undefined;
  Messages: undefined;
  Profile: undefined;
};

// Redux State Types
export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface ServiceState {
  serviceRequests: ServiceRequest[];
  providers: ServiceProvider[];
  bookings: Booking[];
  quotes: Quote[];
  isLoading: boolean;
  error: string | null;
}

export interface AppState {
  auth: AuthState;
  service: ServiceState;
}

// Form Types
export interface LoginForm {
  phone: string;
  password: string;
}

export interface RegisterForm {
  phone: string;
  password: string;
  confirmPassword: string;
  user_type: 'customer' | 'provider';
  first_name: string;
  last_name: string;
}

export interface ServiceRequestForm {
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
  budget_min?: number;
  budget_max?: number;
  preferred_date?: string;
  images?: string[];
}

export interface ProviderProfileForm {
  business_name: string;
  business_license?: string;
  services_offered: string[];
  service_areas: string[];
  years_experience: number;
  bio?: string;
}

// Service Categories
export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
}

// Location Types
export interface LocationData {
  address: string;
  city: string;
  state: string;
  zip_code: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

// Notification Types
export interface NotificationData {
  id: string;
  title: string;
  body: string;
  type: 'booking' | 'quote' | 'message' | 'call' | 'general';
  data?: any;
  created_at: string;
  is_read: boolean;
}

// Chat Types
export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  type: 'text' | 'image' | 'file';
  created_at: string;
  is_read: boolean;
}

// Payment Types
export interface PaymentMethod {
  id: string;
  type: 'card' | 'upi' | 'wallet';
  last_four?: string;
  brand?: string;
  is_default: boolean;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'requires_payment_method' | 'requires_confirmation' | 'requires_action' | 'processing' | 'succeeded' | 'canceled';
  client_secret: string;
}
