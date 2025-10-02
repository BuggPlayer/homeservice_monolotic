import { api } from './base'

// Types
export interface Product {
  id: number
  name: string
  description: string
  price: number
  original_price: number
  sku: string
  category_id: number
  stock_quantity: number
  is_featured: boolean
  rating: number
  review_count: number
  images: string[]
  created_at: string
  updated_at: string
}

export interface CreateProductRequest {
  name: string
  description: string
  price: number
  original_price?: number
  sku: string
  category_id: number
  stock_quantity: number
  is_featured?: boolean
  images: string[]
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  id: number
}

export interface ProductsResponse {
  products: Product[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ProductsQuery {
  page?: number
  limit?: number
  search?: string
  category_id?: number
  is_featured?: boolean
  sort_by?: 'name' | 'price' | 'created_at' | 'rating'
  sort_order?: 'asc' | 'desc'
}

export interface BulkDeleteRequest {
  ids: number[]
}

/**
 * Products Service
 * Handles all product-related API calls
 */
export class ProductsService {
  /**
   * Get products with pagination and filters
   */
  static async getProducts(query: ProductsQuery = {}) {
    const params = new URLSearchParams()
    
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString())
      }
    })

    const endpoint = `/products${params.toString() ? `?${params.toString()}` : ''}`
    
    return api.get<ProductsResponse>(endpoint, {
      loadingMessage: 'Loading products...',
      showSuccessToast: false,
    })
  }

  /**
   * Get single product by ID
   */
  static async getProduct(id: number) {
    return api.get<Product>(`/products/${id}`, {
      loadingMessage: 'Loading product...',
      showSuccessToast: false,
    })
  }

  /**
   * Create new product
   */
  static async createProduct(product: CreateProductRequest) {
    return api.post<Product>('/products', product, {
      loadingMessage: 'Creating product...',
      successMessage: 'Product created successfully!',
      errorMessage: 'Failed to create product.',
    })
  }

  /**
   * Update existing product
   */
  static async updateProduct(id: number, product: Partial<CreateProductRequest>) {
    return api.put<Product>(`/products/${id}`, product, {
      loadingMessage: 'Updating product...',
      successMessage: 'Product updated successfully!',
      errorMessage: 'Failed to update product.',
    })
  }

  /**
   * Delete product
   */
  static async deleteProduct(id: number) {
    return api.delete(`/products/${id}`, {
      loadingMessage: 'Deleting product...',
      successMessage: 'Product deleted successfully!',
      errorMessage: 'Failed to delete product.',
    })
  }

  /**
   * Bulk delete products
   */
  static async bulkDeleteProducts(ids: number[]) {
    return api.post('/products/bulk-delete', { ids }, {
      loadingMessage: 'Deleting products...',
      successMessage: `${ids.length} products deleted successfully!`,
      errorMessage: 'Failed to delete products.',
    })
  }

  /**
   * Upload product image
   */
  static async uploadProductImage(file: File) {
    const formData = new FormData()
    formData.append('image', file)

    return api.uploadFile<{ url: string }>('/products/upload-image', formData, {
      loadingMessage: 'Uploading image...',
      successMessage: 'Image uploaded successfully!',
      errorMessage: 'Failed to upload image.',
    })
  }

  /**
   * Get featured products
   */
  static async getFeaturedProducts() {
    return api.get<Product[]>('/products/featured', {
      loadingMessage: 'Loading featured products...',
      showSuccessToast: false,
    })
  }

  /**
   * Search products
   */
  static async searchProducts(searchTerm: string, filters: Omit<ProductsQuery, 'search'> = {}) {
    return this.getProducts({
      ...filters,
      search: searchTerm,
    })
  }

  /**
   * Get products by category
   */
  static async getProductsByCategory(categoryId: number, query: Omit<ProductsQuery, 'category_id'> = {}) {
    return this.getProducts({
      ...query,
      category_id: categoryId,
    })
  }
}
