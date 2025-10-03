export interface User {
  id: number
  email: string
  phone: string
  first_name: string
  last_name: string
  profile_picture: string
  is_verified: boolean
  user_type: 'admin' | 'provider' | 'customer'
  created_at?: string
  updated_at?: string
}

export interface Category {
  id: number
  name: string
  description: string
  parent_id: number | null
  image: string
  is_active: boolean
  sort_order: number
  subcategories?: Category[]
}

export interface Product {
  id: number
  name: string
  description: string
  price: number
  original_price: number
  sku: string
  stock_quantity: number
  images: string[]
  specifications: Record<string, any>
  is_active: boolean
  is_featured: boolean
  weight: number
  dimensions: {
    length: number
    width: number
    height: number
  }
  tags: string[]
  category_id: number
  provider_id: number
  rating: number
  review_count: number
  created_at?: string
  updated_at?: string
}

export interface ServiceProvider {
  id: number
  business_name: string
  business_license: string
  services_offered: string[]
  service_areas: string[]
  verification_status: 'verified' | 'pending' | 'rejected'
  rating: number
  total_reviews: number
  years_experience: number
  bio: string
  user: User
  created_at?: string
  updated_at?: string
}

export interface ServiceType {
  id: number
  name: string
  description: string
  category: string
  icon: string
  is_active: boolean
  average_price: number
  service_count: number
}

export interface ServiceRequest {
  id: number
  customer_id: number
  service_type: string
  title: string
  description: string
  location: {
    address: string
    city: string
    state: string
    zip_code: string
    coordinates: {
      lat: number
      lng: number
    }
  }
  urgency: 'low' | 'medium' | 'high' | 'emergency'
  status: 'open' | 'quoted' | 'booked' | 'in_progress' | 'completed' | 'cancelled'
  budget_min: number
  budget_max: number
  preferred_date: string
  images: string[]
  created_at: string
  quotes_count: number
}

export interface Quote {
  id: number
  service_request_id: number
  provider_id: number
  amount: number
  notes: string
  status: 'pending' | 'accepted' | 'rejected' | 'expired'
  valid_until: string
  created_at: string
}

export interface Booking {
  id: number
  service_request_id: number
  quote_id: number
  provider_id: number
  customer_id: number
  scheduled_time: string
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  total_amount: number
  notes: string
  created_at: string
}

export interface Review {
  id: number
  user_id: number
  product_id: number
  rating: number
  title: string
  comment: string
  is_verified: boolean
  helpful_count: number
  created_at: string
}

export interface Analytics {
  totalProducts: number
  totalCategories: number
  totalServiceProviders: number
  totalServiceRequests: number
  totalQuotes: number
  totalBookings: number
  totalUsers: number
  totalRevenue: number
  averageOrderValue: number
  topSellingCategories: Array<{
    name: string
    count: number
    revenue: number
  }>
  recentActivity: Array<{
    type: string
    message: string
    timestamp: string
  }>
}

export interface StaticData {
  categories: Category[]
  products: Product[]
  serviceTypes: ServiceType[]
  serviceProviders: ServiceProvider[]
  serviceRequests: ServiceRequest[]
  quotes: Quote[]
  bookings: Booking[]
  reviews: Review[]
  analytics: Analytics
}

export interface Order {
  id: number
  order_id: string
  customer: {
    id: number
    name: string
    email: string
    avatar: string
    type: 'Pro Customer' | 'Regular Customer' | 'VIP Customer'
  }
  product: {
    id: number
    name: string
    image: string
    type: string
  }
  amount: number
  payment_method: string
  status: 'pending' | 'accepted' | 'completed' | 'rejected' | 'cancelled'
  order_date: string
  created_at: string
  updated_at: string
}

export interface OrderStats {
  total_orders: number
  new_orders: number
  completed_orders: number
  cancelled_orders: number
  total_revenue: number
  average_order_value: number
  period: string
}

export type OrderStatus = 'pending' | 'accepted' | 'completed' | 'rejected' | 'cancelled'
export type Status = 'open' | 'quoted' | 'booked' | 'in_progress' | 'completed' | 'cancelled'
export type Urgency = 'low' | 'medium' | 'high' | 'emergency'
export type UserType = 'admin' | 'provider' | 'customer'
export type VerificationStatus = 'verified' | 'pending' | 'rejected'
