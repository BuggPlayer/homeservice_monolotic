import { useState, useCallback } from 'react'
import { useAppDispatch } from '../store/hooks'
import { setCredentials, logout } from '../store/slices/authSlice'
import { AuthService, ProductsService, CategoriesService } from '../services/api'

/**
 * Custom hook for API operations
 * Provides a clean interface for using services with Redux integration
 */
export function useApi() {
  const dispatch = useAppDispatch()
  const [isLoading, setIsLoading] = useState(false)

  // Auth operations
  const auth = {
    login: useCallback(async (credentials: Parameters<typeof AuthService.login>[0]) => {
      setIsLoading(true)
      try {
        const response = await AuthService.login(credentials)
        dispatch(setCredentials({
          user: response.data.user,
          token: response.data.token
        }))
        
        // Store in localStorage if remember me is checked
        if (credentials.rememberMe) {
          localStorage.setItem('user', JSON.stringify(response.data.user))
          localStorage.setItem('token', response.data.token)
        }
        
        return response
      } finally {
        setIsLoading(false)
      }
    }, [dispatch]),

    logout: useCallback(async () => {
      try {
        await AuthService.logout()
      } finally {
        dispatch(logout())
        localStorage.removeItem('user')
        localStorage.removeItem('token')
      }
    }, [dispatch]),

    register: useCallback(async (userData: Parameters<typeof AuthService.register>[0]) => {
      setIsLoading(true)
      try {
        const response = await AuthService.register(userData)
        dispatch(setCredentials({
          user: response.data.user,
          token: response.data.token
        }))
        return response
      } finally {
        setIsLoading(false)
      }
    }, [dispatch]),

    getProfile: useCallback(async () => {
      return AuthService.getProfile()
    }, []),

    updateProfile: useCallback(async (userData: Parameters<typeof AuthService.updateProfile>[0]) => {
      return AuthService.updateProfile(userData)
    }, []),
  }

  // Products operations
  const products = {
    getProducts: useCallback(async (query?: Parameters<typeof ProductsService.getProducts>[0]) => {
      return ProductsService.getProducts(query)
    }, []),

    getProduct: useCallback(async (id: number) => {
      return ProductsService.getProduct(id)
    }, []),

    createProduct: useCallback(async (product: Parameters<typeof ProductsService.createProduct>[0]) => {
      return ProductsService.createProduct(product)
    }, []),

    updateProduct: useCallback(async (id: number, product: Parameters<typeof ProductsService.updateProduct>[1]) => {
      return ProductsService.updateProduct(id, product)
    }, []),

    deleteProduct: useCallback(async (id: number) => {
      return ProductsService.deleteProduct(id)
    }, []),

    bulkDeleteProducts: useCallback(async (ids: number[]) => {
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

    getCategory: useCallback(async (id: number) => {
      return CategoriesService.getCategory(id)
    }, []),

    createCategory: useCallback(async (category: Parameters<typeof CategoriesService.createCategory>[0]) => {
      return CategoriesService.createCategory(category)
    }, []),

    updateCategory: useCallback(async (id: number, category: Parameters<typeof CategoriesService.updateCategory>[1]) => {
      return CategoriesService.updateCategory(id, category)
    }, []),

    deleteCategory: useCallback(async (id: number) => {
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
