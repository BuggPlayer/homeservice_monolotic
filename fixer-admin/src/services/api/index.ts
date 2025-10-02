// Export all services
export { api } from './base'
export { AuthService } from './auth.service'
export { ProductsService } from './products.service'
export { CategoriesService } from './categories.service'

// Export types
export type { RequestConfig, ApiResponse, ApiError } from './base'
export type { 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest, 
  ChangePasswordRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest 
} from './auth.service'
export type { 
  Product, 
  CreateProductRequest, 
  UpdateProductRequest, 
  ProductsResponse, 
  ProductsQuery,
  BulkDeleteRequest 
} from './products.service'
export type { 
  Category, 
  CreateCategoryRequest, 
  UpdateCategoryRequest 
} from './categories.service'
