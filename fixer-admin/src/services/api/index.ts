// Export all services
export { api } from './base'
export { AuthService } from './auth.service'
export { ProductsService } from './products.service'
export { CategoriesService } from './categories.service'
export { ServiceRequestsService } from './service-requests.service'
export { ProvidersService } from './providers.service'
export { QuotesService } from './quotes.service'
export { BookingsService } from './bookings.service'
export { PaymentsService } from './payments.service'
export { AnalyticsService } from './analytics.service'
export { SearchService } from './search.service'
export { ErrorHandler } from './error-handler'

// Export types from base
export type { RequestConfig, ApiResponse, ApiError } from './base'

// Export auth types
export type { 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest, 
  ChangePasswordRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest 
} from './auth.service'

// Export product types
export type { 
  BulkDeleteRequest 
} from './products.service'

// Export all types from types directory
export type * from '../../types'
