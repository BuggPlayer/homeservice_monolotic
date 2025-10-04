import { useState, useCallback } from 'react'
import { useAppDispatch } from '../store/hooks'
import { loginUser, registerUser, logoutUser, logout } from '../store/slices/authSlice'
import { ProductsService, CategoriesService } from '../services/api'

/**
 * Custom hook for API operations
 * Provides a clean interface for using services with Redux integration
 */
export function useApi() {
  const dispatch = useAppDispatch()
  const [isLoading, setIsLoading] = useState(false)

  // Auth operations
  const auth = {
    login: useCallback(async (credentials: Parameters<typeof loginUser>[0]) => {
      setIsLoading(true)
      try {
        const result = await dispatch(loginUser(credentials))
        
        // Store in localStorage if remember me is checked
        if (loginUser.fulfilled.match(result) && credentials.rememberMe) {
          localStorage.setItem('user', JSON.stringify(result.payload.user))
          localStorage.setItem('token', result.payload.token)
        }
        
        return result
      } finally {
        setIsLoading(false)
      }
    }, [dispatch]),

    logout: useCallback(async () => {
      try {
        await dispatch(logoutUser())
      } finally {
        dispatch(logout())
        localStorage.removeItem('user')
        localStorage.removeItem('token')
      }
    }, [dispatch]),

    register: useCallback(async (userData: Parameters<typeof registerUser>[0]) => {
      setIsLoading(true)
      try {
        const result = await dispatch(registerUser(userData))
        return result
      } finally {
        setIsLoading(false)
      }
    }, [dispatch]),

    getProfile: useCallback(async () => {
      // This would need to be implemented as an async thunk if needed
      // For now, returning a placeholder
      return { data: null }
    }, []),

    updateProfile: useCallback(async (userData: any) => {
      // This would need to be implemented as an async thunk if needed
      // For now, returning a placeholder
      return { data: null }
    }, []),
  }

  // Products operations
  const products = {
    getProducts: useCallback(async (query?: Parameters<typeof ProductsService.getProducts>[0]) => {
      return ProductsService.getProducts(query)
    }, []),

    getProduct: useCallback(async (id: string) => {
      return ProductsService.getProduct(id)
    }, []),

    createProduct: useCallback(async (product: Parameters<typeof ProductsService.createProduct>[0]) => {
      return ProductsService.createProduct(product)
    }, []),

    updateProduct: useCallback(async (id: string, product: Parameters<typeof ProductsService.updateProduct>[1]) => {
      return ProductsService.updateProduct(id, product)
    }, []),

    deleteProduct: useCallback(async (id: string) => {
      return ProductsService.deleteProduct(id)
    }, []),

    bulkDeleteProducts: useCallback(async (ids: string[]) => {
      return ProductsService.bulkDeleteProducts(ids)
    }, []),

    uploadImage: useCallback(async (file: File) => {
      return ProductsService.uploadProductImage(file)
    }, []),

    getFeatured: useCallback(async () => {
      return ProductsService.getFeaturedProducts()
    }, []),

    search: useCallback(async (searchTerm: string, filters?: Omit<Parameters<typeof ProductsService.searchProducts>[1], 'search'>) => {
      return ProductsService.searchProducts(searchTerm, filters)
    }, []),
  }

  // Categories operations
  const categories = {
    getCategories: useCallback(async () => {
      return CategoriesService.getCategories()
    }, []),

    getCategory: useCallback(async (id: string) => {
      return CategoriesService.getCategory(id)
    }, []),

    createCategory: useCallback(async (category: Parameters<typeof CategoriesService.createCategory>[0]) => {
      return CategoriesService.createCategory(category)
    }, []),

    updateCategory: useCallback(async (id: string, category: Parameters<typeof CategoriesService.updateCategory>[1]) => {
      return CategoriesService.updateCategory(id, category)
    }, []),

    deleteCategory: useCallback(async (id: string) => {
      return CategoriesService.deleteCategory(id)
    }, []),

    getActive: useCallback(async () => {
      return CategoriesService.getActiveCategories()
    }, []),

    getTree: useCallback(async () => {
      return CategoriesService.getCategoriesTree()
    }, []),
  }

  return {
    isLoading,
    auth,
    products,
    categories,
  }
}
