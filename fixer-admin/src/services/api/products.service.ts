import { api } from './base'
import type {
  Product,
  CreateProductRequest,
  UpdateProductRequest,
  ProductsResponse,
  ProductsQuery,
  FileUploadResponse,
} from '../../types'

// Legacy interface for backward compatibility
export interface BulkDeleteRequest {
  ids: string[]
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
  static async getProduct(id: string) {
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
   * Create product draft
   */
  static async createProductDraft(product: CreateProductRequest) {
    // Mock product draft creation for development
    if (process.env.NODE_ENV === 'development') {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock successful product draft creation
      const mockProduct: Product = {
        id: Date.now(),
        name: product.name || 'Draft Product',
        description: product.description || '',
        price: product.price || 0,
        original_price: product.original_price,
        sku: product.sku || `DRAFT-${Date.now()}`,
        stock_quantity: product.stock_quantity || 0,
        images: product.images || [],
        specifications: product.specifications || {},
        is_active: false, // Drafts are inactive
        is_featured: false, // Drafts are never featured
        weight: product.weight,
        dimensions: product.dimensions,
        tags: product.tags || [],
        category_id: product.category_id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      return {
        success: true,
        data: mockProduct,
        message: 'Product draft saved successfully!'
      }
    }
    
    return api.post<Product>('/products/draft', product, {
      loadingMessage: 'Saving draft...',
      successMessage: 'Product draft saved successfully!',
      errorMessage: 'Failed to save product draft.',
    })
  }

  /**
   * Update existing product
   */
  static async updateProduct(id: string, product: UpdateProductRequest) {
    return api.put<Product>(`/products/${id}`, product, {
      loadingMessage: 'Updating product...',
      successMessage: 'Product updated successfully!',
      errorMessage: 'Failed to update product.',
    })
  }

  /**
   * Delete product
   */
  static async deleteProduct(id: string) {
    return api.delete(`/products/${id}`, {
      loadingMessage: 'Deleting product...',
      successMessage: 'Product deleted successfully!',
      errorMessage: 'Failed to delete product.',
    })
  }

  /**
   * Bulk delete products
   */
  static async bulkDeleteProducts(ids: string[]) {
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

    return api.uploadFile<FileUploadResponse>('/products/upload-image', formData, {
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
  static async getProductsByCategory(categoryId: string, query: Omit<ProductsQuery, 'category_id'> = {}) {
    return this.getProducts({
      ...query,
      category_id: categoryId,
    })
  }
}
