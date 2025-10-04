import { api } from './base'
import type {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  CategoriesQuery,
  FileUploadResponse,
} from '../../types'

/**
 * Categories Service
 * Handles all category-related API calls
 */
export class CategoriesService {
  /**
   * Get all categories
   */
  static async getCategories() {
    return api.get<Category[]>('/categories', {
      loadingMessage: 'Loading categories...',
      showSuccessToast: false,
    })
  }

  /**
   * Get single category by ID
   */
  static async getCategory(id: string) {
    return api.get<Category>(`/categories/${id}`, {
      loadingMessage: 'Loading category...',
      showSuccessToast: false,
    })
  }

  /**
   * Create new category
   */
  static async createCategory(category: CreateCategoryRequest) {
    return api.post<Category>('/categories', category, {
      loadingMessage: 'Creating category...',
      successMessage: 'Category created successfully!',
      errorMessage: 'Failed to create category.',
    })
  }

  /**
   * Update existing category
   */
  static async updateCategory(id: string, category: UpdateCategoryRequest) {
    return api.put<Category>(`/categories/${id}`, category, {
      loadingMessage: 'Updating category...',
      successMessage: 'Category updated successfully!',
      errorMessage: 'Failed to update category.',
    })
  }

  /**
   * Delete category
   */
  static async deleteCategory(id: string) {
    return api.delete(`/categories/${id}`, {
      loadingMessage: 'Deleting category...',
      successMessage: 'Category deleted successfully!',
      errorMessage: 'Failed to delete category.',
    })
  }

  /**
   * Upload category image
   */
  static async uploadCategoryImage(file: File) {
    const formData = new FormData()
    formData.append('image', file)

    return api.uploadFile<FileUploadResponse>('/categories/upload-image', formData, {
      loadingMessage: 'Uploading image...',
      successMessage: 'Image uploaded successfully!',
      errorMessage: 'Failed to upload image.',
    })
  }

  /**
   * Get active categories only
   */
  static async getActiveCategories() {
    return api.get<Category[]>('/categories/active', {
      loadingMessage: 'Loading active categories...',
      showSuccessToast: false,
    })
  }

  /**
   * Get categories with filters
   */
  static async getCategoriesWithFilters(query: CategoriesQuery = {}) {
    const params = new URLSearchParams()
    
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString())
      }
    })

    const endpoint = `/categories${params.toString() ? `?${params.toString()}` : ''}`
    
    return api.get<Category[]>(endpoint, {
      loadingMessage: 'Loading categories...',
      showSuccessToast: false,
    })
  }

  /**
   * Get categories tree (with parent-child relationships)
   */
  static async getCategoriesTree() {
    return api.get<Category[]>('/categories/tree', {
      loadingMessage: 'Loading categories tree...',
      showSuccessToast: false,
    })
  }
}
