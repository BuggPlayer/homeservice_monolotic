// Base types
export interface PaginationResponse {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface Location {
  address: string
  city: string
  state: string
  zipCode: string
  coordinates?: {
    lat: number
    lng: number
  }
}

// User types
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  userType: 'customer' | 'provider' | 'admin'
  isVerified: boolean
  profilePicture?: string
  createdAt: string
  updatedAt?: string
}

// Service Request types
export interface ServiceRequest {
  id: string
  title: string
  description: string
  serviceType: string
  status: 'open' | 'in_progress' | 'completed' | 'cancelled'
  urgency: 'low' | 'medium' | 'high'
  budgetMin?: number
  budgetMax?: number
  preferredDate?: string
  preferredTime?: string
  location: Location
  customerId: string
  providerId?: string
  quotes?: Quote[]
  createdAt: string
  updatedAt?: string
}

export interface CreateServiceRequestRequest {
  title: string
  description: string
  serviceType: string
  urgency: 'low' | 'medium' | 'high'
  budgetMin?: number
  budgetMax?: number
  preferredDate?: string
  preferredTime?: string
  location: Location
}

export interface UpdateServiceRequestRequest {
  title?: string
  description?: string
  urgency?: 'low' | 'medium' | 'high'
  budgetMin?: number
  budgetMax?: number
  preferredDate?: string
  preferredTime?: string
}

export interface ServiceRequestsResponse {
  serviceRequests: ServiceRequest[]
  pagination: PaginationResponse
}

export interface ServiceRequestsQuery {
  page?: number
  limit?: number
  status?: string
  serviceType?: string
  customerId?: string
  urgency?: string
}

// Provider types
export interface Provider {
  id: string
  businessName: string
  businessLicense?: string
  servicesOffered: string[]
  serviceAreas: string[]
  verificationStatus: 'pending' | 'verified' | 'rejected'
  rating: number
  totalReviews: number
  yearsExperience: number
  bio?: string
  user: User
  reviews?: Review[]
  createdAt: string
  updatedAt?: string
}

export interface CreateProviderRequest {
  businessName: string
  businessLicense?: string
  servicesOffered: string[]
  serviceAreas: string[]
  yearsExperience: number
  bio?: string
}

export interface UpdateProviderRequest {
  businessName?: string
  businessLicense?: string
  servicesOffered?: string[]
  serviceAreas?: string[]
  yearsExperience?: number
  bio?: string
}

export interface ProvidersResponse {
  providers: Provider[]
  pagination: PaginationResponse
}

export interface ProvidersQuery {
  page?: number
  limit?: number
  serviceType?: string
  verificationStatus?: string
  minRating?: number
  location?: string
}

export interface Review {
  id: string
  rating: number
  comment: string
  customer: {
    firstName: string
    lastName: string
  }
  createdAt: string
}

// Quote types
export interface Quote {
  id: string
  serviceRequestId: string
  providerId: string
  amount: number
  description: string
  estimatedDuration?: number
  status: 'pending' | 'accepted' | 'rejected' | 'expired'
  validUntil?: string
  provider: {
    businessName: string
    rating: number
  }
  createdAt: string
  updatedAt?: string
}

export interface CreateQuoteRequest {
  serviceRequestId: string
  amount: number
  description: string
  estimatedDuration?: number
  validUntil?: string
}

export interface QuotesResponse {
  quotes: Quote[]
  pagination: PaginationResponse
}

export interface QuotesQuery {
  page?: number
  limit?: number
  status?: string
  serviceRequestId?: string
  providerId?: string
}

// Booking types
export interface Booking {
  id: string
  serviceRequestId: string
  customerId: string
  providerId: string
  scheduledDate: string
  scheduledTime: string
  duration: number
  totalAmount: number
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  notes?: string
  serviceRequest: {
    title: string
    serviceType: string
    location: Location
  }
  provider: {
    businessName: string
    rating: number
    user: {
      firstName: string
      lastName: string
      phone: string
    }
  }
  customer: {
    firstName: string
    lastName: string
    phone: string
  }
  createdAt: string
  updatedAt?: string
}

export interface UpdateBookingStatusRequest {
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  notes?: string
}

export interface BookingsResponse {
  bookings: Booking[]
  pagination: PaginationResponse
}

export interface BookingsQuery {
  page?: number
  limit?: number
  status?: string
  customerId?: string
  providerId?: string
}

// Payment types
export interface Payment {
  id: string
  bookingId: string
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  paymentMethod: string
  transactionId?: string
  createdAt: string
  updatedAt?: string
}

export interface CreatePaymentIntentRequest {
  bookingId: string
  amount: number
  currency: string
  paymentMethod: string
}

export interface ConfirmPaymentRequest {
  paymentIntentId: string
  bookingId: string
}

export interface PaymentIntentResponse {
  clientSecret: string
  paymentIntentId: string
}

// Product types (existing but enhanced)
export interface Product {
  id: string
  name: string
  description: string
  sku: string
  price: number
  stockQuantity: number
  status: 'active' | 'inactive' | 'discontinued'
  isFeatured: boolean
  images: string[]
  specifications?: Record<string, any>
  category?: {
    id: string
    name: string
  }
  provider?: {
    businessName: string
  }
  createdAt: string
  updatedAt?: string
}

export interface CreateProductRequest {
  name: string
  description: string
  sku: string
  categoryId: string
  price: number
  stockQuantity: number
  isFeatured?: boolean
  images: string[]
  specifications?: Record<string, any>
}

export interface UpdateProductRequest {
  name?: string
  description?: string
  sku?: string
  categoryId?: string
  price?: number
  stockQuantity?: number
  isFeatured?: boolean
  images?: string[]
  specifications?: Record<string, any>
}

export interface ProductsResponse {
  products: Product[]
  pagination: PaginationResponse
}

export interface ProductsQuery {
  page?: number
  limit?: number
  categoryId?: string
  providerId?: string
  search?: string
  isFeatured?: boolean
  status?: string
}

// Category types (existing but enhanced)
export interface Category {
  id: string
  name: string
  description: string
  parentId?: string
  status: 'active' | 'inactive'
  subcategories?: Category[]
  createdAt: string
  updatedAt?: string
}

export interface CreateCategoryRequest {
  name: string
  description: string
  parentId?: string
  status?: 'active' | 'inactive'
}

export interface UpdateCategoryRequest {
  name?: string
  description?: string
  parentId?: string
  status?: 'active' | 'inactive'
}

export interface CategoriesQuery {
  parentId?: string
  status?: string
}

// Analytics types
export interface DashboardAnalytics {
  overview: {
    totalUsers: number
    totalProviders: number
    totalServiceRequests: number
    totalBookings: number
    totalRevenue: number
  }
  recentActivity: Array<{
    type: string
    description: string
    timestamp: string
  }>
  serviceStats: Array<{
    serviceType: string
    totalRequests: number
    completedRequests: number
    averageRating: number
  }>
}

// Search types
export interface SearchResult {
  type: 'user' | 'provider' | 'service' | 'product'
  id: string
  title: string
  description: string
  rating?: number
  metadata?: Record<string, any>
}

export interface SearchResponse {
  results: SearchResult[]
  pagination: PaginationResponse
}

export interface SearchQuery {
  q: string
  type?: 'users' | 'providers' | 'services' | 'products'
  page?: number
  limit?: number
}

// Common query interfaces
export interface BaseQuery {
  page?: number
  limit?: number
}

export interface SortOptions {
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// File upload types
export interface FileUploadResponse {
  url: string
  filename: string
  size: number
  mimeType: string
}