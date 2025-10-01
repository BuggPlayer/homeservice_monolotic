import { ServiceRequestModel } from '@/models/ServiceRequest';
import { UserModel } from '@/models/User';
import { ServiceRequest } from '@/types';
import { AppError } from '@/middleware/errorHandler';

export class ServiceRequestService {
  private serviceRequestModel: ServiceRequestModel;
  private userModel: UserModel;

  constructor() {
    this.serviceRequestModel = new ServiceRequestModel();
    this.userModel = new UserModel();
  }

  /**
   * Create a new service request
   */
  async createServiceRequest(
    customerId: string,
    requestData: {
      service_type: string;
      title: string;
      description: string;
      location: {
        address: string;
        city: string;
        state: string;
        zip_code: string;
        coordinates: {
          lat: number;
          lng: number;
        };
      };
      urgency?: 'low' | 'medium' | 'high' | 'emergency';
      budget_min?: number;
      budget_max?: number;
      preferred_date?: Date;
      images?: string[];
    }
  ): Promise<ServiceRequest> {
    // Verify customer exists
    const customer = await this.userModel.findById(customerId);
    if (!customer) {
      throw new AppError('Customer not found', 404);
    }

    if (customer.user_type !== 'customer') {
      throw new AppError('User must be of type customer', 400);
    }

    // Validate budget range
    if (requestData.budget_min && requestData.budget_max && requestData.budget_min > requestData.budget_max) {
      throw new AppError('Minimum budget cannot be greater than maximum budget', 400);
    }

    // Create service request
    const serviceRequest = await this.serviceRequestModel.create({
      customer_id: customerId,
      ...requestData,
      status: 'open',
    });

    return serviceRequest;
  }

  /**
   * Get service request by ID
   */
  async getServiceRequestById(requestId: string): Promise<ServiceRequest | null> {
    return await this.serviceRequestModel.findById(requestId);
  }

  /**
   * Get service requests with filters
   */
  async getServiceRequests(filters: {
    customer_id?: string;
    service_type?: string;
    status?: string;
    urgency?: string;
    city?: string;
    page?: number;
    limit?: number;
  }): Promise<{ requests: ServiceRequest[]; total: number }> {
    return await this.serviceRequestModel.findMany(filters);
  }

  /**
   * Get service requests by customer
   */
  async getServiceRequestsByCustomer(
    customerId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ requests: ServiceRequest[]; total: number }> {
    return await this.serviceRequestModel.findByCustomer(customerId, page, limit);
  }

  /**
   * Get available service requests for providers
   */
  async getAvailableServiceRequests(
    serviceType?: string,
    city?: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ requests: ServiceRequest[]; total: number }> {
    return await this.serviceRequestModel.findAvailableForProviders(serviceType, city, page, limit);
  }

  /**
   * Update service request
   */
  async updateServiceRequest(
    requestId: string,
    customerId: string,
    updates: Partial<{
      title: string;
      description: string;
      location: {
        address: string;
        city: string;
        state: string;
        zip_code: string;
        coordinates: {
          lat: number;
          lng: number;
        };
      };
      urgency: 'low' | 'medium' | 'high' | 'emergency';
      budget_min: number;
      budget_max: number;
      preferred_date: Date;
      images: string[];
    }>
  ): Promise<ServiceRequest | null> {
    const serviceRequest = await this.serviceRequestModel.findById(requestId);
    if (!serviceRequest) {
      throw new AppError('Service request not found', 404);
    }

    if (serviceRequest.customer_id !== customerId) {
      throw new AppError('You can only update your own service requests', 403);
    }

    if (serviceRequest.status !== 'open') {
      throw new AppError('Only open service requests can be updated', 400);
    }

    // Validate budget range if both are provided
    if (updates.budget_min && updates.budget_max && updates.budget_min > updates.budget_max) {
      throw new AppError('Minimum budget cannot be greater than maximum budget', 400);
    }

    return await this.serviceRequestModel.update(requestId, updates);
  }

  /**
   * Update service request status
   */
  async updateServiceRequestStatus(
    requestId: string,
    status: 'open' | 'quoted' | 'booked' | 'in_progress' | 'completed' | 'cancelled'
  ): Promise<ServiceRequest | null> {
    const serviceRequest = await this.serviceRequestModel.findById(requestId);
    if (!serviceRequest) {
      throw new AppError('Service request not found', 404);
    }

    return await this.serviceRequestModel.updateStatus(requestId, status);
  }

  /**
   * Delete service request
   */
  async deleteServiceRequest(requestId: string, customerId: string): Promise<boolean> {
    const serviceRequest = await this.serviceRequestModel.findById(requestId);
    if (!serviceRequest) {
      throw new AppError('Service request not found', 404);
    }

    if (serviceRequest.customer_id !== customerId) {
      throw new AppError('You can only delete your own service requests', 403);
    }

    if (serviceRequest.status !== 'open') {
      throw new AppError('Only open service requests can be deleted', 400);
    }

    return await this.serviceRequestModel.delete(requestId);
  }

  /**
   * Get service request with customer details
   */
  async getServiceRequestWithDetails(requestId: string): Promise<any | null> {
    const serviceRequest = await this.serviceRequestModel.findById(requestId);
    if (!serviceRequest) {
      return null;
    }

    const customer = await this.userModel.findById(serviceRequest.customer_id);
    if (!customer) {
      return null;
    }

    return {
      ...serviceRequest,
      customer: {
        id: customer.id,
        first_name: customer.first_name,
        last_name: customer.last_name,
        phone: customer.phone,
        profile_picture: customer.profile_picture,
      },
    };
  }

  /**
   * Search service requests
   */
  async searchServiceRequests(searchParams: {
    service_type?: string;
    city?: string;
    urgency?: string;
    budget_min?: number;
    budget_max?: number;
    page?: number;
    limit?: number;
  }): Promise<{ requests: ServiceRequest[]; total: number }> {
    const filters: any = {
      status: 'open',
      page: searchParams.page || 1,
      limit: searchParams.limit || 10,
    };

    if (searchParams.service_type) {
      filters.service_type = searchParams.service_type;
    }

    if (searchParams.city) {
      filters.city = searchParams.city;
    }

    if (searchParams.urgency) {
      filters.urgency = searchParams.urgency;
    }

    const { requests, total } = await this.serviceRequestModel.findMany(filters);

    // Filter by budget range if specified
    let filteredRequests = requests;
    if (searchParams.budget_min !== undefined || searchParams.budget_max !== undefined) {
      filteredRequests = requests.filter(request => {
        if (searchParams.budget_min !== undefined && request.budget_min && request.budget_min < searchParams.budget_min) {
          return false;
        }
        if (searchParams.budget_max !== undefined && request.budget_max && request.budget_max > searchParams.budget_max) {
          return false;
        }
        return true;
      });
    }

    return { requests: filteredRequests, total: filteredRequests.length };
  }

  /**
   * Get service request statistics
   */
  async getServiceRequestStats(customerId: string): Promise<{
    totalRequests: number;
    openRequests: number;
    completedRequests: number;
    cancelledRequests: number;
  }> {
    const { requests } = await this.serviceRequestModel.findByCustomer(customerId, 1, 1000);

    const stats = {
      totalRequests: requests.length,
      openRequests: requests.filter(r => r.status === 'open').length,
      completedRequests: requests.filter(r => r.status === 'completed').length,
      cancelledRequests: requests.filter(r => r.status === 'cancelled').length,
    };

    return stats;
  }

  /**
   * Get popular service types
   */
  async getPopularServiceTypes(limit: number = 10): Promise<{ service_type: string; count: number }[]> {
    // This would require a more complex query to get service type counts
    // For now, return empty array - can be implemented with raw SQL query
    return [];
  }

  /**
   * Get service requests by urgency
   */
  async getServiceRequestsByUrgency(
    urgency: 'low' | 'medium' | 'high' | 'emergency',
    page: number = 1,
    limit: number = 10
  ): Promise<{ requests: ServiceRequest[]; total: number }> {
    return await this.serviceRequestModel.findMany({
      urgency,
      status: 'open',
      page,
      limit,
    });
  }
}
