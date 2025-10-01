import { ServiceRequest } from '@/core/types';

export interface CreateServiceRequestRequest {
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

export interface UpdateServiceRequestRequest {
  title?: string;
  description?: string;
  location?: {
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

export interface GetServiceRequestsRequest {
  page?: number;
  limit?: number;
  status?: 'open' | 'quoted' | 'booked' | 'in_progress' | 'completed' | 'cancelled';
  service_type?: string;
  urgency?: 'low' | 'medium' | 'high' | 'emergency';
  city?: string;
  state?: string;
  search?: string;
}

export interface GetServiceRequestsResponse {
  serviceRequests: ServiceRequest[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface GetServiceRequestResponse {
  serviceRequest: ServiceRequest;
}

export interface CreateServiceRequestResponse {
  serviceRequest: ServiceRequest;
  message: string;
}

export interface UpdateServiceRequestResponse {
  serviceRequest: ServiceRequest;
  message: string;
}

export interface DeleteServiceRequestResponse {
  message: string;
}

export interface UpdateStatusRequest {
  status: 'open' | 'quoted' | 'booked' | 'in_progress' | 'completed' | 'cancelled';
}

export interface UpdateStatusResponse {
  serviceRequest: ServiceRequest;
  message: string;
}
