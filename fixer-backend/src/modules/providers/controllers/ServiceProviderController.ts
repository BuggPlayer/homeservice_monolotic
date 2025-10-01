import { Request, Response } from 'express';
import { ServiceProviderService } from '../services/ServiceProviderService';
import { ApiResponse } from '@/types';
import { 
  CreateServiceProviderRequest, 
  UpdateServiceProviderRequest, 
  GetServiceProvidersRequest, 
  UpdateVerificationStatusRequest 
} from '../types';

export class ServiceProviderController {
  private serviceProviderService: ServiceProviderService;

  constructor() {
    this.serviceProviderService = new ServiceProviderService();
  }

  /**
   * Create a new service provider
   */
  createServiceProvider = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.userId;
      const data: CreateServiceProviderRequest = req.body;
      const result = await this.serviceProviderService.createServiceProvider(userId, data);

      const response: ApiResponse = {
        success: true,
        message: result.message,
        data: result,
      };

      res.status(201).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to create service provider profile',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(400).json(response);
    }
  };

  /**
   * Get service providers
   */
  getServiceProviders = async (req: Request, res: Response): Promise<void> => {
    try {
      const params: GetServiceProvidersRequest = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        verification_status: req.query.verification_status as any,
        service_type: req.query.service_type as string,
        location: req.query.location as string,
        search: req.query.search as string,
      };

      const result = await this.serviceProviderService.getServiceProviders(params);

      const response: ApiResponse = {
        success: true,
        message: 'Service providers retrieved successfully',
        data: result,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve service providers',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(500).json(response);
    }
  };

  /**
   * Get service provider by ID
   */
  getServiceProviderById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.serviceProviderService.getServiceProviderById(id);

      const response: ApiResponse = {
        success: true,
        message: 'Service provider retrieved successfully',
        data: result,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve service provider',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(404).json(response);
    }
  };

  /**
   * Get service provider by user ID
   */
  getServiceProviderByUserId = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;
      const result = await this.serviceProviderService.getServiceProviderByUserId(userId);

      const response: ApiResponse = {
        success: true,
        message: 'Service provider retrieved successfully',
        data: result,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve service provider',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(404).json(response);
    }
  };

  /**
   * Update service provider
   */
  updateServiceProvider = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const data: UpdateServiceProviderRequest = req.body;
      const result = await this.serviceProviderService.updateServiceProvider(id, data);

      const response: ApiResponse = {
        success: true,
        message: result.message,
        data: result,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to update service provider',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(400).json(response);
    }
  };

  /**
   * Update verification status
   */
  updateVerificationStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const data: UpdateVerificationStatusRequest = req.body;
      const result = await this.serviceProviderService.updateVerificationStatus(id, data);

      const response: ApiResponse = {
        success: true,
        message: result.message,
        data: result,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to update verification status',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(400).json(response);
    }
  };

  /**
   * Get service provider statistics
   */
  getServiceProviderStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.serviceProviderService.getServiceProviderStats();

      const response: ApiResponse = {
        success: true,
        message: 'Service provider statistics retrieved successfully',
        data: result,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve service provider statistics',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(500).json(response);
    }
  };
}
