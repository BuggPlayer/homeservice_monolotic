import { api } from './base'
import type {
  Provider,
  CreateProviderRequest,
  UpdateProviderRequest,
  ProvidersResponse,
  ProvidersQuery,
} from '../../types'

/**
 * Providers Service
 * Handles all service provider-related API calls
 */
export class ProvidersService {
  /**
   * Get providers with pagination and filters
   */
  static async getProviders(query: ProvidersQuery = {}) {
    const params = new URLSearchParams()
    
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString())
      }
    })

    const endpoint = `/providers${params.toString() ? `?${params.toString()}` : ''}`
    
    return api.get<ProvidersResponse>(endpoint, {
      loadingMessage: 'Loading providers...',
      showSuccessToast: false,
    })
  }

  /**
   * Get single provider by ID
   */
  static async getProvider(id: string) {
    return api.get<Provider>(`/providers/${id}`, {
      loadingMessage: 'Loading provider...',
      showSuccessToast: false,
    })
  }

  /**
   * Create new provider profile
   */
  static async createProvider(provider: CreateProviderRequest) {
    return api.post<Provider>('/providers', provider, {
      loadingMessage: 'Creating provider profile...',
      successMessage: 'Provider profile created successfully!',
      errorMessage: 'Failed to create provider profile.',
    })
  }

  /**
   * Update existing provider
   */
  static async updateProvider(id: string, provider: UpdateProviderRequest) {
    return api.put<Provider>(`/providers/${id}`, provider, {
      loadingMessage: 'Updating provider...',
      successMessage: 'Provider updated successfully!',
      errorMessage: 'Failed to update provider.',
    })
  }

  /**
   * Delete provider
   */
  static async deleteProvider(id: string) {
    return api.delete(`/providers/${id}`, {
      loadingMessage: 'Deleting provider...',
      successMessage: 'Provider deleted successfully!',
      errorMessage: 'Failed to delete provider.',
    })
  }

  /**
   * Update provider verification status
   */
  static async updateVerificationStatus(id: string, status: 'pending' | 'verified' | 'rejected') {
    return api.patch<Provider>(`/providers/${id}/verification`, { status }, {
      loadingMessage: 'Updating verification status...',
      successMessage: 'Verification status updated successfully!',
      errorMessage: 'Failed to update verification status.',
    })
  }

  /**
   * Get providers by service type
   */
  static async getProvidersByServiceType(serviceType: string, query: Omit<ProvidersQuery, 'serviceType'> = {}) {
    return this.getProviders({
      ...query,
      serviceType,
    })
  }

  /**
   * Get providers by verification status
   */
  static async getProvidersByVerificationStatus(status: string, query: Omit<ProvidersQuery, 'verificationStatus'> = {}) {
    return this.getProviders({
      ...query,
      verificationStatus: status,
    })
  }

  /**
   * Get providers by rating
   */
  static async getProvidersByRating(minRating: number, query: Omit<ProvidersQuery, 'minRating'> = {}) {
    return this.getProviders({
      ...query,
      minRating,
    })
  }

  /**
   * Get providers by location
   */
  static async getProvidersByLocation(location: string, query: Omit<ProvidersQuery, 'location'> = {}) {
    return this.getProviders({
      ...query,
      location,
    })
  }

  /**
   * Upload provider documents
   */
  static async uploadProviderDocument(file: File, documentType: string) {
    const formData = new FormData()
    formData.append('document', file)
    formData.append('documentType', documentType)

    return api.uploadFile<{ url: string; documentType: string }>('/providers/upload-document', formData, {
      loadingMessage: 'Uploading document...',
      successMessage: 'Document uploaded successfully!',
      errorMessage: 'Failed to upload document.',
    })
  }

  /**
   * Get provider statistics
   */
  static async getProviderStats() {
    return api.get<{
      total: number
      byVerificationStatus: Record<string, number>
      byServiceType: Record<string, number>
      averageRating: number
      topRated: Provider[]
    }>('/providers/stats', {
      loadingMessage: 'Loading provider statistics...',
      showSuccessToast: false,
    })
  }

  /**
   * Get provider reviews
   */
  static async getProviderReviews(providerId: string, page: number = 1, limit: number = 10) {
    return api.get<{
      reviews: Array<{
        id: string
        rating: number
        comment: string
        customer: {
          firstName: string
          lastName: string
        }
        createdAt: string
      }>
      pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
      }
    }>(`/providers/${providerId}/reviews?page=${page}&limit=${limit}`, {
      loadingMessage: 'Loading reviews...',
      showSuccessToast: false,
    })
  }
}
