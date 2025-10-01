import { ServiceProviderModel } from '@/models/ServiceProvider';
import { UserModel } from '@/models/User';
import { ServiceProvider } from '@/types';
import { AppError } from '@/middleware/errorHandler';

export class ServiceProviderService {
  private serviceProviderModel: ServiceProviderModel;
  private userModel: UserModel;

  constructor() {
    this.serviceProviderModel = new ServiceProviderModel();
    this.userModel = new UserModel();
  }

  /**
   * Register a new service provider
   */
  async registerProvider(
    userId: string,
    providerData: {
      business_name: string;
      business_license?: string;
      services_offered: string[];
      service_areas: string[];
      years_experience?: number;
      bio?: string;
    }
  ): Promise<ServiceProvider> {
    // Check if user exists and is of type 'provider'
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (user.user_type !== 'provider') {
      throw new AppError('User must be of type provider', 400);
    }

    // Check if provider profile already exists
    const existingProvider = await this.serviceProviderModel.findByUserId(userId);
    if (existingProvider) {
      throw new AppError('Service provider profile already exists', 400);
    }

    // Create service provider profile
    const provider = await this.serviceProviderModel.create({
      user_id: userId,
      ...providerData,
    });

    return provider;
  }

  /**
   * Get service provider profile by user ID
   */
  async getProviderByUserId(userId: string): Promise<ServiceProvider | null> {
    return await this.serviceProviderModel.findByUserId(userId);
  }

  /**
   * Get service provider by ID
   */
  async getProviderById(providerId: string): Promise<ServiceProvider | null> {
    return await this.serviceProviderModel.findById(providerId);
  }

  /**
   * Update service provider profile
   */
  async updateProvider(
    userId: string,
    updates: Partial<{
      business_name: string;
      business_license: string;
      services_offered: string[];
      service_areas: string[];
      years_experience: number;
      bio: string;
    }>
  ): Promise<ServiceProvider | null> {
    const provider = await this.serviceProviderModel.findByUserId(userId);
    if (!provider) {
      throw new AppError('Service provider profile not found', 404);
    }

    return await this.serviceProviderModel.update(provider.id, updates);
  }

  /**
   * Get service providers with filters
   */
  async getProviders(filters: {
    service_type?: string;
    service_area?: string;
    verification_status?: string;
    min_rating?: number;
    page?: number;
    limit?: number;
  }): Promise<{ providers: ServiceProvider[]; total: number }> {
    return await this.serviceProviderModel.findMany(filters);
  }

  /**
   * Search providers by service and location
   */
  async searchProviders(serviceType: string, city: string): Promise<ServiceProvider[]> {
    return await this.serviceProviderModel.findByServiceAndLocation(serviceType, city);
  }

  /**
   * Update verification status (admin only)
   */
  async updateVerificationStatus(
    providerId: string,
    status: 'pending' | 'verified' | 'rejected'
  ): Promise<ServiceProvider | null> {
    const provider = await this.serviceProviderModel.findById(providerId);
    if (!provider) {
      throw new AppError('Service provider not found', 404);
    }

    return await this.serviceProviderModel.updateVerificationStatus(providerId, status);
  }

  /**
   * Update provider rating
   */
  async updateRating(providerId: string, newRating: number): Promise<ServiceProvider | null> {
    if (newRating < 1 || newRating > 5) {
      throw new AppError('Rating must be between 1 and 5', 400);
    }

    const provider = await this.serviceProviderModel.findById(providerId);
    if (!provider) {
      throw new AppError('Service provider not found', 404);
    }

    return await this.serviceProviderModel.updateRating(providerId, newRating);
  }

  /**
   * Delete service provider profile
   */
  async deleteProvider(userId: string): Promise<boolean> {
    const provider = await this.serviceProviderModel.findByUserId(userId);
    if (!provider) {
      throw new AppError('Service provider profile not found', 404);
    }

    return await this.serviceProviderModel.delete(provider.id);
  }

  /**
   * Get provider with user details
   */
  async getProviderWithUserDetails(providerId: string): Promise<any | null> {
    const provider = await this.serviceProviderModel.findById(providerId);
    if (!provider) {
      return null;
    }

    const user = await this.userModel.findById(provider.user_id);
    if (!user) {
      return null;
    }

    return {
      ...provider,
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        first_name: user.first_name,
        last_name: user.last_name,
        profile_picture: user.profile_picture,
        is_verified: user.is_verified,
      },
    };
  }

  /**
   * Get providers by verification status
   */
  async getProvidersByVerificationStatus(
    status: 'pending' | 'verified' | 'rejected',
    page: number = 1,
    limit: number = 10
  ): Promise<{ providers: ServiceProvider[]; total: number }> {
    return await this.serviceProviderModel.findMany({
      verification_status: status,
      page,
      limit,
    });
  }

  /**
   * Get top-rated providers
   */
  async getTopRatedProviders(limit: number = 10): Promise<ServiceProvider[]> {
    const { providers } = await this.serviceProviderModel.findMany({
      verification_status: 'verified',
      min_rating: 4.0,
      page: 1,
      limit,
    });

    return providers.sort((a, b) => b.rating - a.rating);
  }

  /**
   * Get provider statistics
   */
  async getProviderStats(providerId: string): Promise<{
    totalBookings: number;
    completedBookings: number;
    averageRating: number;
    totalReviews: number;
    verificationStatus: string;
  }> {
    const provider = await this.serviceProviderModel.findById(providerId);
    if (!provider) {
      throw new AppError('Service provider not found', 404);
    }

    // TODO: Implement booking statistics when booking service is ready
    return {
      totalBookings: 0,
      completedBookings: 0,
      averageRating: provider.rating,
      totalReviews: provider.total_reviews,
      verificationStatus: provider.verification_status,
    };
  }
}
