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
  customer?: User;
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
  service_request?: ServiceRequest;
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
  customer?: User;
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
  customer?: User;
}

// Message Types
export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  type: 'text' | 'image' | 'file';
  created_at: string;
  is_read: boolean;
  sender?: User;
  receiver?: User;
}

// Review Types
export interface Review {
  id: string;
  booking_id: string;
  customer_id: string;
  provider_id: string;
  rating: number;
  comment: string;
  created_at: string;
  customer?: User;
}

// Payment Types
export interface Payment {
  id: string;
  booking_id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_method: string;
  transaction_id?: string;
  created_at: string;
  updated_at: string;
}

// Analytics Types
export interface Analytics {
  total_earnings: number;
  monthly_earnings: number;
  completed_jobs: number;
  pending_quotes: number;
  average_rating: number;
  total_reviews: number;
  response_time: number;
  completion_rate: number;
}

export interface EarningsData {
  date: string;
  amount: number;
  jobs: number;
}

export interface PerformanceData {
  month: string;
  earnings: number;
  jobs: number;
  rating: number;
}

// Dashboard State Types
export interface DashboardState {
  isLoading: boolean;
  error: string | null;
  analytics: Analytics | null;
  earningsData: EarningsData[];
  performanceData: PerformanceData[];
  recentBookings: Booking[];
  upcomingBookings: Booking[];
  pendingQuotes: Quote[];
  recentMessages: Message[];
}

// Provider State Types
export interface ProviderState {
  profile: ServiceProvider | null;
  serviceRequests: ServiceRequest[];
  quotes: Quote[];
  bookings: Booking[];
  customers: User[];
  reviews: Review[];
  isLoading: boolean;
  error: string | null;
}

// UI State Types
export interface UIState {
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark';
  notifications: Notification[];
  modals: {
    [key: string]: boolean;
  };
}

// Notification Types
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  isRead: boolean;
}

// Form Types
export interface ProviderProfileForm {
  business_name: string;
  business_license?: string;
  services_offered: string[];
  service_areas: string[];
  years_experience: number;
  bio?: string;
}

export interface QuoteForm {
  amount: number;
  notes: string;
  valid_until: string;
}

export interface AvailabilityForm {
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
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

// Calendar Types
export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource?: any;
  color?: string;
}

// Table Types
export interface TableColumn {
  key: string;
  title: string;
  dataIndex: string;
  sorter?: boolean;
  filterable?: boolean;
  render?: (value: any, record: any) => React.ReactNode;
}

// Chart Types
export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

// Filter Types
export interface FilterOptions {
  status?: string;
  dateRange?: [string, string];
  serviceType?: string;
  urgency?: string;
  rating?: number;
}

// Search Types
export interface SearchParams {
  query?: string;
  filters?: FilterOptions;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}
