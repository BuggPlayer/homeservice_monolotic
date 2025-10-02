import { ServiceProviderRepository } from '../../../core/database/repositories';
import { ServiceProvider } from '@/types';
import { 
  CreateServiceProviderRequest, 
  UpdateServiceProviderRequest, 
  GetServiceProvidersRequest, 
  GetServiceProvidersResponse, 
  GetServiceProviderResponse, 
  CreateServiceProviderResponse, 
  UpdateServiceProviderResponse, 
  UpdateVerificationStatusRequest, 
  UpdateVerificationStatusResponse,
  GetServiceProviderStatsResponse 
} from '../types';

export class ServiceProviderService {
  private serviceProviderRepository: ServiceProviderRepository;

  constructor() {
    this.serviceProviderRepository = new ServiceProviderRepository();
  }

  /**
   * Create a new service provider
   */
  async createServiceProvider(
    userId: string, 
    data: CreateServiceProviderRequest
  ): Promise<CreateServiceProviderResponse> {
    // Check if user already has a service provider profile
    const existingProvider = await this.serviceProviderRepository.findByUserId(userId);
    if (existingProvider) {
      throw new Error('Service provider profile already exists for this user');
    }

    const serviceProviderData = {
      user_id: userId,
      business_name: data.business_name,
      business_license: data.business_license,
      services_offered: data.services_offered,
      service_areas: data.service_areas,
      verification_status: 'pending' as const,
      rating: 0,
      total_reviews: 0,
      years_experience: data.years_experience || 0,
      bio: data.bio,
    };

    const serviceProvider = await this.serviceProviderRepository.create(serviceProviderData);

    return {
      serviceProvider,
      message: 'Service provider profile created successfully',
    };
  }

  /**
   * Get service providers with filtering and pagination
   */
  async getServiceProviders(params: GetServiceProvidersRequest): Promise<GetServiceProvidersResponse> {
    const { page = 1, limit = 10, verification_status, service_type, location, search } = params;

    let result;
    
    if (search) {
      result = await this.serviceProviderRepository.search(
        search, 
        service_type, 
        location, 
        page, 
        limit
      );
    } else if (verification_status) {
      result = await this.serviceProviderRepository.findByVerificationStatus(
        verification_status, 
        page, 
        limit
      );
    } else if (service_type) {
      result = await this.serviceProviderRepository.findByServiceType(
        service_type, 
        page, 
        limit
      );
    } else if (location) {
      result = await this.serviceProviderRepository.findByLocation(
        location, 
        page, 
        limit
      );
    } else {
      result = await this.serviceProviderRepository.findAll(page, limit);
    }

    const totalPages = Math.ceil(result.total / limit);

    return {
      serviceProviders: result.data,
      pagination: {
        page,
        limit,
        total: result.total,
        totalPages,
      },
    };
  }

  /**
   * Get service provider by ID
   */
  async getServiceProviderById(serviceProviderId: string): Promise<GetServiceProviderResponse> {
    const serviceProvider = await this.serviceProviderRepository.findById(serviceProviderId);
    if (!serviceProvider) {
      throw new Error('Service provider not found');
    }

    return {
      serviceProvider,
    };
  }

  /**
   * Get service provider by user ID
   */
  async getServiceProviderByUserId(userId: string): Promise<GetServiceProviderResponse> {
    const serviceProvider = await this.serviceProviderRepository.findByUserId(userId);
    if (!serviceProvider) {
      throw new Error('Service provider not found');
    }

    return {
      serviceProvider,
    };
  }

  /**
   * Update service provider
   */
  async updateServiceProvider(
    serviceProviderId: string, 
    data: UpdateServiceProviderRequest
  ): Promise<UpdateServiceProviderResponse> {
    const serviceProvider = await this.serviceProviderRepository.findById(serviceProviderId);
    if (!serviceProvider) {
      throw new Error('Service provider not found');
    }

    const updatedServiceProvider = await this.serviceProviderRepository.update(
      serviceProviderId, 
      data
    );
    if (!updatedServiceProvider) {
      throw new Error('Failed to update service provider');
    }

    return {
      serviceProvider: updatedServiceProvider,
      message: 'Service provider updated successfully',
    };
  }

  /**
   * Update verification status
   */
  async updateVerificationStatus(
    serviceProviderId: string, 
    data: UpdateVerificationStatusRequest
  ): Promise<UpdateVerificationStatusResponse> {
    const serviceProvider = await this.serviceProviderRepository.findById(serviceProviderId);
    if (!serviceProvider) {
      throw new Error('Service provider not found');
    }

    const updatedServiceProvider = await this.serviceProviderRepository.updateVerificationStatus(
      serviceProviderId, 
      data.verification_status
    );
    if (!updatedServiceProvider) {
      throw new Error('Failed to update verification status');
    }

    return {
      serviceProvider: updatedServiceProvider,
      message: 'Verification status updated successfully',
    };
  }

  /**
   * Update rating
   */
  async updateRating(
    serviceProviderId: string, 
    rating: number, 
    totalReviews: number
  ): Promise<{ message: string }> {
    const serviceProvider = await this.serviceProviderRepository.findById(serviceProviderId);
    if (!serviceProvider) {
      throw new Error('Service provider not found');
    }

    await this.serviceProviderRepository.updateRating(serviceProviderId, rating, totalReviews);

    return {
      message: 'Rating updated successfully',
    };
  }

  /**
   * Get service provider statistics
   */
  async getServiceProviderStats(): Promise<GetServiceProviderStatsResponse> {
    const totalProviders = await this.serviceProviderRepository.count();
    const verifiedProviders = await this.serviceProviderRepository.count(
      'verification_status = $1', 
      ['verified']
    );
    const pendingProviders = await this.serviceProviderRepository.count(
      'verification_status = $1', 
      ['pending']
    );
    const rejectedProviders = await this.serviceProviderRepository.count(
      'verification_status = $1', 
      ['rejected']
    );

    // Get average rating
    const result = await this.serviceProviderRepository.executeQuery(
      'SELECT AVG(rating) as avg_rating, SUM(total_reviews) as total_reviews FROM service_providers WHERE verification_status = $1',
      ['verified']
    );

    const averageRating = parseFloat((result.rows[0] as any).avg_rating) || 0;
    const totalReviews = parseInt((result.rows[0] as any).total_reviews) || 0;

    return {
      totalProviders,
      verifiedProviders,
      pendingProviders,
      rejectedProviders,
      averageRating,
      totalReviews,
    };
  }
}
