import { ServiceRequestRepository } from '@/core/database/repositories';
import { ServiceRequest } from '@/core/types';
import { 
  CreateServiceRequestRequest, 
  UpdateServiceRequestRequest, 
  GetServiceRequestsRequest, 
  GetServiceRequestsResponse, 
  GetServiceRequestResponse, 
  CreateServiceRequestResponse, 
  UpdateServiceRequestResponse, 
  DeleteServiceRequestResponse, 
  UpdateStatusRequest, 
  UpdateStatusResponse 
} from '../types';

export class ServiceRequestService {
  private serviceRequestRepository: ServiceRequestRepository;

  constructor() {
    this.serviceRequestRepository = new ServiceRequestRepository();
  }

  /**
   * Create a new service request
   */
  async createServiceRequest(
    customerId: string, 
    data: CreateServiceRequestRequest
  ): Promise<CreateServiceRequestResponse> {
    const serviceRequestData = {
      customer_id: customerId,
      service_type: data.service_type,
      title: data.title,
      description: data.description,
      location: data.location,
      urgency: data.urgency || 'medium',
      budget_min: data.budget_min,
      budget_max: data.budget_max,
      preferred_date: data.preferred_date,
      images: data.images || [],
      status: 'open' as const,
    };

    const serviceRequest = await this.serviceRequestRepository.create(serviceRequestData);

    return {
      serviceRequest,
      message: 'Service request created successfully',
    };
  }

  /**
   * Get service requests with filtering and pagination
   */
  async getServiceRequests(params: GetServiceRequestsRequest): Promise<GetServiceRequestsResponse> {
    const { page = 1, limit = 10, status, service_type, urgency, city, state, search } = params;

    let result;
    
    if (search) {
      result = await this.serviceRequestRepository.search(
        search, 
        service_type, 
        city, 
        state, 
        urgency, 
        page, 
        limit
      );
    } else if (status) {
      result = await this.serviceRequestRepository.findByStatus(status, page, limit);
    } else if (service_type) {
      result = await this.serviceRequestRepository.findByServiceType(service_type, page, limit);
    } else if (city && state) {
      result = await this.serviceRequestRepository.findByLocation(city, state, page, limit);
    } else if (urgency) {
      result = await this.serviceRequestRepository.findByUrgency(urgency, page, limit);
    } else {
      result = await this.serviceRequestRepository.findAll(page, limit);
    }

    const totalPages = Math.ceil(result.total / limit);

    return {
      serviceRequests: result.data,
      pagination: {
        page,
        limit,
        total: result.total,
        totalPages,
      },
    };
  }

  /**
   * Get service request by ID
   */
  async getServiceRequestById(serviceRequestId: string): Promise<GetServiceRequestResponse> {
    const serviceRequest = await this.serviceRequestRepository.findById(serviceRequestId);
    if (!serviceRequest) {
      throw new Error('Service request not found');
    }

    return {
      serviceRequest,
    };
  }

  /**
   * Update service request
   */
  async updateServiceRequest(
    serviceRequestId: string, 
    data: UpdateServiceRequestRequest
  ): Promise<UpdateServiceRequestResponse> {
    const serviceRequest = await this.serviceRequestRepository.findById(serviceRequestId);
    if (!serviceRequest) {
      throw new Error('Service request not found');
    }

    // Only allow updates if status is 'open' or 'quoted'
    if (!['open', 'quoted'].includes(serviceRequest.status)) {
      throw new Error('Cannot update service request in current status');
    }

    const updatedServiceRequest = await this.serviceRequestRepository.update(serviceRequestId, data);
    if (!updatedServiceRequest) {
      throw new Error('Failed to update service request');
    }

    return {
      serviceRequest: updatedServiceRequest,
      message: 'Service request updated successfully',
    };
  }

  /**
   * Update service request status
   */
  async updateStatus(
    serviceRequestId: string, 
    data: UpdateStatusRequest
  ): Promise<UpdateStatusResponse> {
    const serviceRequest = await this.serviceRequestRepository.findById(serviceRequestId);
    if (!serviceRequest) {
      throw new Error('Service request not found');
    }

    const updatedServiceRequest = await this.serviceRequestRepository.updateStatus(
      serviceRequestId, 
      data.status
    );
    if (!updatedServiceRequest) {
      throw new Error('Failed to update service request status');
    }

    return {
      serviceRequest: updatedServiceRequest,
      message: 'Service request status updated successfully',
    };
  }

  /**
   * Delete service request
   */
  async deleteServiceRequest(serviceRequestId: string): Promise<DeleteServiceRequestResponse> {
    const serviceRequest = await this.serviceRequestRepository.findById(serviceRequestId);
    if (!serviceRequest) {
      throw new Error('Service request not found');
    }

    // Only allow deletion if status is 'open' or 'cancelled'
    if (!['open', 'cancelled'].includes(serviceRequest.status)) {
      throw new Error('Cannot delete service request in current status');
    }

    const deleted = await this.serviceRequestRepository.delete(serviceRequestId);
    if (!deleted) {
      throw new Error('Failed to delete service request');
    }

    return {
      message: 'Service request deleted successfully',
    };
  }

  /**
   * Get service requests by customer
   */
  async getServiceRequestsByCustomer(
    customerId: string, 
    page: number = 1, 
    limit: number = 10
  ) {
    const result = await this.serviceRequestRepository.findByCustomerId(customerId, page, limit);
    const totalPages = Math.ceil(result.total / limit);

    return {
      serviceRequests: result.data,
      pagination: {
        page,
        limit,
        total: result.total,
        totalPages,
      },
    };
  }

  /**
   * Get service request statistics
   */
  async getServiceRequestStats() {
    const totalRequests = await this.serviceRequestRepository.count();
    const openRequests = await this.serviceRequestRepository.count('status = $1', ['open']);
    const quotedRequests = await this.serviceRequestRepository.count('status = $1', ['quoted']);
    const bookedRequests = await this.serviceRequestRepository.count('status = $1', ['booked']);
    const completedRequests = await this.serviceRequestRepository.count('status = $1', ['completed']);
    const cancelledRequests = await this.serviceRequestRepository.count('status = $1', ['cancelled']);

    return {
      totalRequests,
      openRequests,
      quotedRequests,
      bookedRequests,
      completedRequests,
      cancelledRequests,
    };
  }
}
