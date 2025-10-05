import { api } from './base'
import type {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  CategoriesQuery,
} from '../../types'

// Enhanced category types for better type safety
export interface CategoriesResponse {
  categories: Category[]
  pagination: PaginationResponse
}

export interface CategoryStats {
  totalCategories: number
  activeCategories: number
  inactiveCategories: number
  categoriesWithProducts: number
  topLevelCategories: number
  subcategories: number
}

export interface CategoryTreeItem extends Category {
  children?: CategoryTreeItem[]
  level: number
  hasChildren: boolean
  productCount?: number
}

export interface CategoryWithStats extends Category {
  productCount: number
  subcategoryCount: number
  isExpanded?: boolean
}

/**
 * Categories Service
 * Comprehensive category management with CRUD operations, tree structure, and advanced features
 */
export class CategoriesService {
  /**
   * Get categories with pagination and filtering
   */
  static async getCategories(query: CategoriesQuery = {}) {
    const params = new URLSearchParams()
    
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          params.append(key, value.join(','))
        } else {
          params.append(key, value.toString())
        }
      }
    })

    const endpoint = `/products/categories${params.toString() ? `?${params.toString()}` : ''}`
    
    return api.get<CategoriesResponse>(endpoint, {
      loadingMessage: 'Loading categories...',
      showSuccessToast: false,
    })
  }

  /**
   * Get category tree structure
   */
  static async getCategoryTree() {
    return api.get<CategoryTreeItem[]>('/products/categories/tree', {
      loadingMessage: 'Loading category tree...',
      showSuccessToast: false,
    })
  }

  /**
   * Get categories with product counts
   */
  static async getCategoriesWithStats() {
    return api.get<CategoryWithStats[]>('/products/categories/with-counts', {
      loadingMessage: 'Loading category statistics...',
      showSuccessToast: false,
    })
  }

  /**
   * Get single category by ID
   */
  static async getCategory(id: string) {
    return api.get<Category>(`/products/categories/${id}`, {
      loadingMessage: 'Loading category...',
      showSuccessToast: false,
    })
  }

  /**
   * Get subcategories for a parent category
   */
  static async getSubcategories(parentId: string) {
    return api.get<Category[]>(`/products/categories/${parentId}/subcategories`, {
      loadingMessage: 'Loading subcategories...',
      showSuccessToast: false,
    })
  }

  /**
   * Create new category
   */
  static async createCategory(category: CreateCategoryRequest) {
    return api.post<Category>('/products/categories', category, {
      loadingMessage: 'Creating category...',
      successMessage: 'Category created successfully!',
      errorMessage: 'Failed to create category.',
    })
  }

  /**
   * Update existing category
   */
  static async updateCategory(id: string, category: UpdateCategoryRequest) {
    return api.put<Category>(`/products/categories/${id}`, category, {
      loadingMessage: 'Updating category...',
      successMessage: 'Category updated successfully!',
      errorMessage: 'Failed to update category.',
    })
  }

  /**
   * Update category sort order
   */
  static async updateSortOrder(id: string, sortOrder: number) {
    return api.patch<Category>(`/products/categories/${id}/sort-order`, { sort_order: sortOrder }, {
      loadingMessage: 'Updating sort order...',
      successMessage: 'Sort order updated successfully!',
      errorMessage: 'Failed to update sort order.',
    })
  }

  /**
   * Delete category
   */
  static async deleteCategory(id: string) {
    return api.delete(`/products/categories/${id}`, {
      loadingMessage: 'Deleting category...',
      successMessage: 'Category deleted successfully!',
      errorMessage: 'Failed to delete category.',
    })
  }

  /**
   * Bulk delete categories
   */
  static async bulkDeleteCategories(ids: string[]) {
    return api.post('/products/categories/bulk-delete', { ids }, {
      loadingMessage: 'Deleting categories...',
      successMessage: `${ids.length} categories deleted successfully!`,
      errorMessage: 'Failed to delete categories.',
    })
  }

  /**
   * Search categories
   */
  static async searchCategories(searchTerm: string, filters: Omit<CategoriesQuery, 'search'> = {}) {
    return this.getCategories({
      ...filters,
      search: searchTerm,
    })
  }

  /**
   * Get category statistics
   */
  static async getCategoryStats(): Promise<CategoryStats> {
    // This would be implemented on the backend
    // For now, we'll calculate from the categories data
    const response = await this.getCategories({ limit: 1000 })
    const categories = response.data.categories
    
    return {
      totalCategories: categories.length,
      activeCategories: categories.filter(c => c.status === 'active').length,
      inactiveCategories: categories.filter(c => c.status === 'inactive').length,
      categoriesWithProducts: categories.filter(c => (c as any).productCount > 0).length,
      topLevelCategories: categories.filter(c => !c.parentId).length,
      subcategories: categories.filter(c => c.parentId).length,
    }
  }

  /**
   * Build category tree from flat list
   */
  static buildCategoryTree(categories: Category[]): CategoryTreeItem[] {
    const categoryMap = new Map<string, CategoryTreeItem>()
    const rootCategories: CategoryTreeItem[] = []

    // Create map of all categories with enhanced properties
    categories.forEach(category => {
      categoryMap.set(category.id, {
        ...category,
        level: 0,
        hasChildren: false,
        children: [],
      })
    })

    // Build tree structure
    categories.forEach(category => {
      const treeItem = categoryMap.get(category.id)!
      
      if (category.parentId && categoryMap.has(category.parentId)) {
        const parent = categoryMap.get(category.parentId)!
        treeItem.level = parent.level + 1
        parent.children = parent.children || []
        parent.children.push(treeItem)
        parent.hasChildren = true
      } else {
        rootCategories.push(treeItem)
      }
    })

    return rootCategories
  }

  /**
   * Flatten category tree for display
   */
  static flattenCategoryTree(tree: CategoryTreeItem[]): CategoryTreeItem[] {
    const flattened: CategoryTreeItem[] = []
    
    const traverse = (items: CategoryTreeItem[]) => {
      items.forEach(item => {
        flattened.push(item)
        if (item.children && item.children.length > 0) {
          traverse(item.children)
        }
      })
    }
    
    traverse(tree)
    return flattened
  }

  /**
   * Validate category data
   */
  static validateCategory(category: CreateCategoryRequest | UpdateCategoryRequest): string[] {
    const errors: string[] = []
    
    if (!category.name || category.name.trim().length < 2) {
      errors.push('Category name must be at least 2 characters long')
    }
    
    if (category.name && category.name.length > 100) {
      errors.push('Category name cannot exceed 100 characters')
    }
    
    if (category.description && category.description.length > 500) {
      errors.push('Description cannot exceed 500 characters')
    }
    
    return errors
  }

  /**
   * Check if category can be deleted
   */
  static async canDeleteCategory(id: string): Promise<{ canDelete: boolean; reason?: string }> {
    try {
      const category = await this.getCategory(id)
      
      // Check if category has products
      if ((category.data as any).productCount > 0) {
        return {
          canDelete: false,
          reason: 'Cannot delete category that contains products'
        }
      }
      
      // Check if category has subcategories
      const subcategories = await this.getSubcategories(id)
      if (subcategories.data.length > 0) {
        return {
          canDelete: false,
          reason: 'Cannot delete category that has subcategories'
        }
      }
      
      return { canDelete: true }
    } catch (error) {
      return {
        canDelete: false,
        reason: 'Error checking category dependencies'
      }
    }
  }
}

// Re-export types
export type {
  CategoriesResponse,
  CategoryStats,
  CategoryTreeItem,
  CategoryWithStats,
}