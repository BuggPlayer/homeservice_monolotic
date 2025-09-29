import { apiService } from './api';
import { 
  ServiceProvider, 
  ServiceRequest, 
  Quote, 
  Booking, 
  User, 
  Review, 
  ProviderProfileForm, 
  QuoteForm,
  ApiResponse,
  PaginatedResponse 
} from '../types';

class ProviderService {
  // Profile Management
  async getProfile(): Promise<ApiResponse<{ provider: ServiceProvider }>> {
    const response = await apiService.get('/providers/profile');
    return response.data;
  }

  async updateProfile(profileData: ProviderProfileForm): Promise<ApiResponse<{ provider: ServiceProvider }>> {
    const response = await apiService.put('/providers/profile', profileData);
    return response.data;
  }

  async uploadDocument(file: FormData): Promise<ApiResponse<{ url: string }>> {
    const response = await apiService.uploadFile('/providers/upload-document', file);
    return response.data;
  }

  // Service Requests
  async getServiceRequests(filters?: any): Promise<ApiResponse<{ serviceRequests: ServiceRequest[] }>> {
    const response = await apiService.get('/providers/service-requests', { params: filters });
    return response.data;
  }

  async getServiceRequestById(id: string): Promise<ApiResponse<{ serviceRequest: ServiceRequest }>> {
    const response = await apiService.get(`/providers/service-requests/${id}`);
    return response.data;
  }

  // Quote Management
  async getQuotes(filters?: any): Promise<ApiResponse<{ quotes: Quote[] }>> {
    const response = await apiService.get('/providers/quotes', { params: filters });
    return response.data;
  }

  async submitQuote(requestId: string, quoteData: QuoteForm): Promise<ApiResponse<{ quote: Quote }>> {
    const response = await apiService.post(`/service-requests/${requestId}/quotes`, quoteData);
    return response.data;
  }

  async updateQuote(quoteId: string, updates: Partial<QuoteForm>): Promise<ApiResponse<{ quote: Quote }>> {
    const response = await apiService.put(`/quotes/${quoteId}`, updates);
    return response.data;
  }

  async withdrawQuote(quoteId: string): Promise<ApiResponse> {
    const response = await apiService.delete(`/quotes/${quoteId}`);
    return response.data;
  }

  // Booking Management
  async getBookings(filters?: any): Promise<ApiResponse<{ bookings: Booking[] }>> {
    const response = await apiService.get('/providers/bookings', { params: filters });
    return response.data;
  }

  async getBookingById(id: string): Promise<ApiResponse<{ booking: Booking }>> {
    const response = await apiService.get(`/providers/bookings/${id}`);
    return response.data;
  }

  async updateBookingStatus(bookingId: string, status: string): Promise<ApiResponse<{ booking: Booking }>> {
    const response = await apiService.put(`/providers/bookings/${bookingId}/status`, { status });
    return response.data;
  }

  async updateBookingNotes(bookingId: string, notes: string): Promise<ApiResponse<{ booking: Booking }>> {
    const response = await apiService.put(`/providers/bookings/${bookingId}/notes`, { notes });
    return response.data;
  }

  // Customer Management
  async getCustomers(filters?: any): Promise<ApiResponse<{ customers: User[] }>> {
    const response = await apiService.get('/providers/customers', { params: filters });
    return response.data;
  }

  async getCustomerById(id: string): Promise<ApiResponse<{ customer: User }>> {
    const response = await apiService.get(`/providers/customers/${id}`);
    return response.data;
  }

  // Review Management
  async getReviews(filters?: any): Promise<ApiResponse<{ reviews: Review[] }>> {
    const response = await apiService.get('/providers/reviews', { params: filters });
    return response.data;
  }

  async replyToReview(reviewId: string, reply: string): Promise<ApiResponse<{ review: Review }>> {
    const response = await apiService.post(`/providers/reviews/${reviewId}/reply`, { reply });
    return response.data;
  }

  // Availability Management
  async getAvailability(): Promise<ApiResponse<{ availability: any[] }>> {
    const response = await apiService.get('/providers/availability');
    return response.data;
  }

  async updateAvailability(availability: any[]): Promise<ApiResponse<{ availability: any[] }>> {
    const response = await apiService.put('/providers/availability', { availability });
    return response.data;
  }

  // Pricing Management
  async getPricing(): Promise<ApiResponse<{ pricing: any[] }>> {
    const response = await apiService.get('/providers/pricing');
    return response.data;
  }

  async updatePricing(pricing: any[]): Promise<ApiResponse<{ pricing: any[] }>> {
    const response = await apiService.put('/providers/pricing', { pricing });
    return response.data;
  }

  // Communication
  async getMessages(customerId?: string): Promise<ApiResponse<{ messages: any[] }>> {
    const response = await apiService.get('/providers/messages', {
      params: customerId ? { customerId } : {}
    });
    return response.data;
  }

  async sendMessage(customerId: string, message: string): Promise<ApiResponse<{ message: any }>> {
    const response = await apiService.post('/providers/messages', {
      customerId,
      message
    });
    return response.data;
  }

  async initiateCall(customerId: string): Promise<ApiResponse<{ call: any }>> {
    const response = await apiService.post('/providers/calls/initiate', {
      customerId
    });
    return response.data;
  }

  // Analytics
  async getProviderAnalytics(): Promise<ApiResponse<{ analytics: any }>> {
    const response = await apiService.get('/providers/analytics');
    return response.data;
  }

  async getEarningsReport(timeRange: string): Promise<ApiResponse<{ report: any }>> {
    const response = await apiService.get('/providers/earnings-report', {
      params: { timeRange }
    });
    return response.data;
  }

  // Settings
  async getSettings(): Promise<ApiResponse<{ settings: any }>> {
    const response = await apiService.get('/providers/settings');
    return response.data;
  }

  async updateSettings(settings: any): Promise<ApiResponse<{ settings: any }>> {
    const response = await apiService.put('/providers/settings', settings);
    return response.data;
  }
}

export const providerService = new ProviderService();
export default providerService;
