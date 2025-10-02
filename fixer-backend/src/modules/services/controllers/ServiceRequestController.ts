import { Request, Response } from 'express';
import { ServiceRequestService } from '../services/ServiceRequestService';
import { ApiResponse } from '../../../core/types';
import { 
  CreateServiceRequestRequest, 
  UpdateServiceRequestRequest, 
  GetServiceRequestsRequest, 
  UpdateStatusRequest 
} from '../types';

export class ServiceRequestController {
  private serviceRequestService: ServiceRequestService;

  constructor() {
    this.serviceRequestService = new ServiceRequestService();
  }

  /**
   * Create a new service request
   */
  createServiceRequest = async (req: Request, res: Response): Promise<void> => {
    try {
      const customerId = (req as any).user.userId;
      const data: CreateServiceRequestRequest = req.body;
      const result = await this.serviceRequestService.createServiceRequest(customerId, data);

      const response: ApiResponse = {
        success: true,
        message: result.message,
        data: result,
      };

      res.status(201).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to create service request',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(400).json(response);
    }
  };

  /**
   * Get service requests
   */
  getServiceRequests = async (req: Request, res: Response): Promise<void> => {
    try {
      const params: GetServiceRequestsRequest = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        status: req.query.status as any,
        service_type: req.query.service_type as string,
        urgency: req.query.urgency as any,
        city: req.query.city as string,
        state: req.query.state as string,
        search: req.query.search as string,
      };

      const result = await this.serviceRequestService.getServiceRequests(params);

      const response: ApiResponse = {
        success: true,
        message: 'Service requests retrieved successfully',
        data: result,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve service requests',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(500).json(response);
    }
  };

  /**
   * Get service request by ID
   */
  getServiceRequestById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.serviceRequestService.getServiceRequestById(id);

      const response: ApiResponse = {
        success: true,
        message: 'Service request retrieved successfully',
        data: result,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve service request',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(404).json(response);
    }
  };

  /**
   * Update service request
   */
  updateServiceRequest = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const data: UpdateServiceRequestRequest = req.body;
      const result = await this.serviceRequestService.updateServiceRequest(id, data);

      const response: ApiResponse = {
        success: true,
        message: result.message,
        data: result,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to update service request',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(400).json(response);
    }
  };

  /**
   * Update service request status
   */
  updateStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const data: UpdateStatusRequest = req.body;
      const result = await this.serviceRequestService.updateStatus(id, data);

      const response: ApiResponse = {
        success: true,
        message: result.message,
        data: result,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to update service request status',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(400).json(response);
    }
  };

  /**
   * Delete service request
   */
  deleteServiceRequest = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.serviceRequestService.deleteServiceRequest(id);

      const response: ApiResponse = {
        success: true,
        message: result.message,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to delete service request',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(400).json(response);
    }
  };

  /**
   * Get service requests by customer
   */
  getServiceRequestsByCustomer = async (req: Request, res: Response): Promise<void> => {
    try {
      const customerId = (req as any).user.userId;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const result = await this.serviceRequestService.getServiceRequestsByCustomer(
        customerId, 
        page, 
        limit
      );

      const response: ApiResponse = {
        success: true,
        message: 'Customer service requests retrieved successfully',
        data: result,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve customer service requests',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(500).json(response);
    }
  };

  /**
   * Get service request statistics
   */
  getServiceRequestStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.serviceRequestService.getServiceRequestStats();

      const response: ApiResponse = {
        success: true,
        message: 'Service request statistics retrieved successfully',
        data: result,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve service request statistics',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(500).json(response);
    }
  };

  /**
   * Get customer service request statistics
   */
  getCustomerServiceRequestStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const customerId = (req as any).user.userId;
      const result = await this.serviceRequestService.getCustomerServiceRequestStats(customerId);

      const response: ApiResponse = {
        success: true,
        message: 'Customer service request statistics retrieved successfully',
        data: result,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve customer service request statistics',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(500).json(response);
    }
  };

  /**
   * Get service requests by type
   */
  getServiceRequestsByType = async (req: Request, res: Response): Promise<void> => {
    try {
      const { serviceType } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const result = await this.serviceRequestService.getServiceRequestsByType(
        serviceType, 
        page, 
        limit
      );

      const response: ApiResponse = {
        success: true,
        message: 'Service requests by type retrieved successfully',
        data: result,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve service requests by type',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(500).json(response);
    }
  };

  /**
   * Get service requests by location
   */
  getServiceRequestsByLocation = async (req: Request, res: Response): Promise<void> => {
    try {
      const { city, state } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const result = await this.serviceRequestService.getServiceRequestsByLocation(
        city, 
        state, 
        page, 
        limit
      );

      const response: ApiResponse = {
        success: true,
        message: 'Service requests by location retrieved successfully',
        data: result,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve service requests by location',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(500).json(response);
    }
  };

  /**
   * Get service requests by urgency
   */
  getServiceRequestsByUrgency = async (req: Request, res: Response): Promise<void> => {
    try {
      const { urgency } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const result = await this.serviceRequestService.getServiceRequestsByUrgency(
        urgency, 
        page, 
        limit
      );

      const response: ApiResponse = {
        success: true,
        message: 'Service requests by urgency retrieved successfully',
        data: result,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve service requests by urgency',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(500).json(response);
    }
  };

  /**
   * Search service requests
   */
  searchServiceRequests = async (req: Request, res: Response): Promise<void> => {
    try {
      const { search } = req.query;
      const filters = {
        serviceType: req.query.service_type as string,
        city: req.query.city as string,
        state: req.query.state as string,
        urgency: req.query.urgency as string,
        status: req.query.status as string,
        budgetMin: req.query.budget_min ? parseFloat(req.query.budget_min as string) : undefined,
        budgetMax: req.query.budget_max ? parseFloat(req.query.budget_max as string) : undefined,
      };
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const result = await this.serviceRequestService.searchServiceRequests(
        search as string, 
        filters, 
        page, 
        limit
      );

      const response: ApiResponse = {
        success: true,
        message: 'Service requests search completed successfully',
        data: result,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to search service requests',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(500).json(response);
    }
  };

  /**
   * Get recent service requests
   */
  getRecentServiceRequests = async (req: Request, res: Response): Promise<void> => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await this.serviceRequestService.getRecentServiceRequests(limit);

      const response: ApiResponse = {
        success: true,
        message: 'Recent service requests retrieved successfully',
        data: result,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve recent service requests',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(500).json(response);
    }
  };

  /**
   * Get service request analytics
   */
  getServiceRequestAnalytics = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.serviceRequestService.getServiceRequestAnalytics();

      const response: ApiResponse = {
        success: true,
        message: 'Service request analytics retrieved successfully',
        data: result,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve service request analytics',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(500).json(response);
    }
  };

  /**
   * Bulk update service request status
   */
  bulkUpdateStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { serviceRequestIds, status } = req.body;
      const updatedBy = (req as any).user.userId;
      
      const result = await this.serviceRequestService.bulkUpdateStatus(
        serviceRequestIds, 
        status, 
        updatedBy
      );

      const response: ApiResponse = {
        success: true,
        message: result.message,
        data: result,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to bulk update service request status',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(400).json(response);
    }
  };

  /**
   * Archive old service requests
   */
  archiveOldServiceRequests = async (req: Request, res: Response): Promise<void> => {
    try {
      const daysOld = parseInt(req.query.days_old as string) || 365;
      const result = await this.serviceRequestService.archiveOldServiceRequests(daysOld);

      const response: ApiResponse = {
        success: true,
        message: result.message,
        data: result,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to archive old service requests',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(500).json(response);
    }
  };
}
