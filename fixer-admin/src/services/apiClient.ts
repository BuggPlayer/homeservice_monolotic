import { store } from '../store'
import { setLoading, addToast } from '../store/slices/uiSlice'

// API Client configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api'

interface ApiRequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  headers?: Record<string, string>
  body?: any
  showLoading?: boolean
  loadingMessage?: string
  showSuccessToast?: boolean
  showErrorToast?: boolean
  successMessage?: string
  errorMessage?: string
}

class ApiClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private async request<T>(
    endpoint: string,
    config: ApiRequestConfig = {}
  ): Promise<T> {
    const {
      method = 'GET',
      headers = {},
      body,
      showLoading = true,
      loadingMessage = 'Loading...',
      showSuccessToast = true,
      showErrorToast = true,
      successMessage = 'Operation completed successfully',
      errorMessage = 'An error occurred'
    } = config

    // Show loading if enabled
    if (showLoading) {
      store.dispatch(setLoading({ isLoading: true, message: loadingMessage }))
    }

    try {
      // Get token from Redux store
      const state = store.getState()
      const token = state.auth.token

      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      // Show success toast if enabled
      if (showSuccessToast) {
        store.dispatch(addToast({
          message: successMessage,
          severity: 'success',
          duration: 4000,
        }))
      }

      return data
    } catch (error) {
      // Show error toast if enabled
      if (showErrorToast) {
        store.dispatch(addToast({
          message: errorMessage,
          severity: 'error',
          duration: 5000,
        }))
      }
      throw error
    } finally {
      // Hide loading if enabled
      if (showLoading) {
        store.dispatch(setLoading({ isLoading: false }))
      }
    }
  }

  // HTTP Methods
  async get<T>(endpoint: string, config?: Omit<ApiRequestConfig, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'GET' })
  }

  async post<T>(endpoint: string, body?: any, config?: Omit<ApiRequestConfig, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'POST', body })
  }

  async put<T>(endpoint: string, body?: any, config?: Omit<ApiRequestConfig, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'PUT', body })
  }

  async patch<T>(endpoint: string, body?: any, config?: Omit<ApiRequestConfig, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'PATCH', body })
  }

  async delete<T>(endpoint: string, config?: Omit<ApiRequestConfig, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' })
  }

  // File upload method
  async uploadFile<T>(endpoint: string, formData: FormData, config?: Omit<ApiRequestConfig, 'method' | 'body'>): Promise<T> {
    const {
      showLoading = true,
      loadingMessage = 'Uploading file...',
      showSuccessToast = true,
      showErrorToast = true,
      successMessage = 'File uploaded successfully',
      errorMessage = 'File upload failed'
    } = config || {}

    if (showLoading) {
      store.dispatch(setLoading({ isLoading: true, message: loadingMessage }))
    }

    try {
      const state = store.getState()
      const token = state.auth.token

      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Upload failed! status: ${response.status}`)
      }

      const data = await response.json()

      if (showSuccessToast) {
        store.dispatch(addToast({
          message: successMessage,
          severity: 'success',
          duration: 4000,
        }))
      }

      return data
    } catch (error) {
      if (showErrorToast) {
        store.dispatch(addToast({
          message: errorMessage,
          severity: 'error',
          duration: 5000,
        }))
      }
      throw error
    } finally {
      if (showLoading) {
        store.dispatch(setLoading({ isLoading: false }))
      }
    }
  }
}

// Create and export the API client instance
export const apiClient = new ApiClient(API_BASE_URL)

// Export the class for custom instances
export { ApiClient }
