import { apiService } from './api';
import { API_ENDPOINTS } from '../constants';
import { 
  ServiceRequest, 
  ServiceProvider, 
  Booking, 
  Quote, 
  ServiceRequestForm, 
  ProviderProfileForm,
  ApiResponse,
  PaginatedResponse 
} from '../types';

class ServiceService {
  // Service Request Methods
  async createServiceRequest(requestData: ServiceRequestForm): Promise<ApiResponse<{ serviceRequest: ServiceRequest }>> {
    const response = await apiService.post(API_ENDPOINTS.SERVICE_REQUESTS.CREATE, requestData);
    return response.data;
  }

  async getServiceRequests(filters?: any): Promise<ApiResponse<PaginatedResponse<ServiceRequest>>> {
    const response = await apiService.get(API_ENDPOINTS.SERVICE_REQUESTS.LIST, { params: filters });
    return response.data;
  }

  async getServiceRequestById(id: string): Promise<ApiResponse<{ serviceRequest: ServiceRequest }>> {
    const response = await apiService.get(API_ENDPOINTS.SERVICE_REQUESTS.DETAILS(id));
    return response.data;
  }

  async updateServiceRequest(id: string, updates: Partial<ServiceRequestForm>): Promise<ApiResponse<{ serviceRequest: ServiceRequest }>> {
    const response = await apiService.put(API_ENDPOINTS.SERVICE_REQUESTS.UPDATE(id), updates);
    return response.data;
  }

  async updateServiceRequestStatus(id: string, status: string): Promise<ApiResponse<{ serviceRequest: ServiceRequest }>> {
    const response = await apiService.put(API_ENDPOINTS.SERVICE_REQUESTS.UPDATE_STATUS(id), { status });
    return response.data;
  }

  async deleteServiceRequest(id: string): Promise<ApiResponse> {
    const response = await apiService.delete(API_ENDPOINTS.SERVICE_REQUESTS.DETAILS(id));
    return response.data;
  }

  // Provider Methods
  async createProviderProfile(profileData: ProviderProfileForm): Promise<ApiResponse<{ provider: ServiceProvider }>> {
    const response = await apiService.post(API_ENDPOINTS.PROVIDERS.PROFILE, profileData);
    return response.data;
  }

  async getProviderProfile(): Promise<ApiResponse<{ provider: ServiceProvider }>> {
    const response = await apiService.get(API_ENDPOINTS.PROVIDERS.PROFILE);
    return response.data;
  }

  async updateProviderProfile(profileData: Partial<ProviderProfileForm>): Promise<ApiResponse<{ provider: ServiceProvider }>> {
    const response = await apiService.put(API_ENDPOINTS.PROVIDERS.PROFILE, profileData);
    return response.data;
  }

  async getProviders(filters?: any): Promise<ApiResponse<PaginatedResponse<ServiceProvider>>> {
    const response = await apiService.get(API_ENDPOINTS.PROVIDERS.LIST, { params: filters });
    return response.data;
  }

  async getProviderById(id: string): Promise<ApiResponse<{ provider: ServiceProvider }>> {
    const response = await apiService.get(API_ENDPOINTS.PROVIDERS.DETAILS(id));
    return response.data;
  }

  async getProvidersByServiceAndLocation(serviceType: string, city: string): Promise<ApiResponse<{ providers: ServiceProvider[] }>> {
    const response = await apiService.get(API_ENDPOINTS.PROVIDERS.BY_SERVICE_AND_LOCATION(serviceType, city));
    return response.data;
  }

  // Booking Methods
  async getBookings(filters?: any): Promise<ApiResponse<PaginatedResponse<Booking>>> {
    const response = await apiService.get(API_ENDPOINTS.BOOKINGS.LIST, { params: filters });
    return response.data;
  }

  async getBookingById(id: string): Promise<ApiResponse<{ booking: Booking }>> {
    const response = await apiService.get(API_ENDPOINTS.BOOKINGS.DETAILS(id));
    return response.data;
  }

  async updateBookingStatus(id: string, status: string): Promise<ApiResponse<{ booking: Booking }>> {
    const response = await apiService.put(API_ENDPOINTS.BOOKINGS.DETAILS(id), { status });
    return response.data;
  }

  // Quote Methods
  async submitQuote(requestId: string, quoteData: { amount: number; notes: string; valid_until: string }): Promise<ApiResponse<{ quote: Quote }>> {
    const response = await apiService.post(API_ENDPOINTS.QUOTES.CREATE(requestId), quoteData);
    return response.data;
  }

  async acceptQuote(quoteId: string): Promise<ApiResponse<{ booking: Booking }>> {
    const response = await apiService.post(API_ENDPOINTS.QUOTES.ACCEPT(quoteId));
    return response.data;
  }

  async rejectQuote(quoteId: string): Promise<ApiResponse> {
    const response = await apiService.put(`/quotes/${quoteId}/reject`);
    return response.data;
  }

  async getQuotes(filters?: any): Promise<ApiResponse<PaginatedResponse<Quote>>> {
    const response = await apiService.get('/quotes', { params: filters });
    return response.data;
  }

  // Call Methods
  async initiateCall(providerId: string, requestId?: string): Promise<ApiResponse<{ call: any }>> {
    const response = await apiService.post(API_ENDPOINTS.CALLS.INITIATE, { providerId, requestId });
    return response.data;
  }

  // WhatsApp Methods
  async sendWhatsAppMessage(phone: string, message: string): Promise<ApiResponse> {
    const response = await apiService.post('/whatsapp/send-message', { phone, message });
    return response.data;
  }

  async initiateQuickBooking(phone: string, serviceType: string): Promise<ApiResponse> {
    const response = await apiService.post(API_ENDPOINTS.WHATSAPP.QUICK_BOOKING, { phone, serviceType });
    return response.data;
  }

  // File Upload Methods
  async uploadImage(file: FormData): Promise<ApiResponse<{ url: string }>> {
    const response = await apiService.uploadFile('/upload/image', file);
    return response.data;
  }

  async uploadMultipleImages(files: FormData): Promise<ApiResponse<{ urls: string[] }>> {
    const response = await apiService.uploadFile('/upload/images', files);
    return response.data;
  }

  // Search Methods
  async searchProviders(query: string, filters?: any): Promise<ApiResponse<{ providers: ServiceProvider[] }>> {
    const response = await apiService.get('/providers/search', { 
      params: { q: query, ...filters } 
    });
    return response.data;
  }

  async searchServiceRequests(query: string, filters?: any): Promise<ApiResponse<{ serviceRequests: ServiceRequest[] }>> {
    const response = await apiService.get('/service-requests/search', { 
      params: { q: query, ...filters } 
    });
    return response.data;
  }

  // Analytics Methods
  async getProviderAnalytics(): Promise<ApiResponse<{ analytics: any }>> {
    const response = await apiService.get('/providers/analytics');
    return response.data;
  }

  async getCustomerAnalytics(): Promise<ApiResponse<{ analytics: any }>> {
    const response = await apiService.get('/customers/analytics');
    return response.data;
  }
}

export const serviceService = new ServiceService();
export default serviceService;
