import { api } from './base'

// Types
export interface Category {
  id: number
  name: string
  description: string
  slug: string
  image?: string
  parent_id?: number
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface CreateCategoryRequest {
  name: string
  description: string
  slug: string
  image?: string
  parent_id?: number
  is_active?: boolean
  sort_order?: number
}

export interface UpdateCategoryRequest extends Partial<CreateCategoryRequest> {
  id: number
}

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
  static async getCategory(id: number) {
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
  static async updateCategory(id: number, category: Partial<CreateCategoryRequest>) {
    return api.put<Category>(`/categories/${id}`, category, {
      loadingMessage: 'Updating category...',
      successMessage: 'Category updated successfully!',
      errorMessage: 'Failed to update category.',
    })
  }

  /**
   * Delete category
   */
  static async deleteCategory(id: number) {
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

    return api.uploadFile<{ url: string }>('/categories/upload-image', formData, {
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
   * Get categories tree (with parent-child relationships)
   */
  static async getCategoriesTree() {
    return api.get<Category[]>('/categories/tree', {
      loadingMessage: 'Loading categories tree...',
      showSuccessToast: false,
    })
  }
}
