import { ServiceProvider } from '@/types';

export interface CreateServiceProviderRequest {
  business_name: string;
  business_license?: string;
  services_offered: string[];
  service_areas: string[];
  years_experience?: number;
  bio?: string;
}

export interface UpdateServiceProviderRequest {
  business_name?: string;
  business_license?: string;
  services_offered?: string[];
  service_areas?: string[];
  years_experience?: number;
  bio?: string;
}

export interface GetServiceProvidersRequest {
  page?: number;
  limit?: number;
  verification_status?: 'pending' | 'verified' | 'rejected';
  service_type?: string;
  location?: string;
  search?: string;
}

export interface GetServiceProvidersResponse {
  serviceProviders: ServiceProvider[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface GetServiceProviderResponse {
  serviceProvider: ServiceProvider;
}

export interface CreateServiceProviderResponse {
  serviceProvider: ServiceProvider;
  message: string;
}

export interface UpdateServiceProviderResponse {
  serviceProvider: ServiceProvider;
  message: string;
}

export interface UpdateVerificationStatusRequest {
  verification_status: 'pending' | 'verified' | 'rejected';
}

export interface UpdateVerificationStatusResponse {
  serviceProvider: ServiceProvider;
  message: string;
}

export interface GetServiceProviderStatsResponse {
  totalProviders: number;
  verifiedProviders: number;
  pendingProviders: number;
  rejectedProviders: number;
  averageRating: number;
  totalReviews: number;
}
