import { Request, Response } from 'express';
import { ServiceRequestModel } from '@/models/ServiceRequest';
import { validationSchemas } from '@/middleware/validation';
import { ApiResponse, PaginatedResponse } from '@/types';

export class ServiceRequestController {
  private serviceRequestModel: ServiceRequestModel;

  constructor() {
    this.serviceRequestModel = new ServiceRequestModel();
  }

  /**
   * Create a new service request
   */
  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const customerId = req.user?.userId;
      if (!customerId) {
        const response: ApiResponse = {
          success: false,
          message: 'User ID not found in token',
        };
        res.status(401).json(response);
        return;
      }

      const serviceRequest = await this.serviceRequestModel.create({
        ...req.body,
        customer_id: customerId,
        status: 'open',
      });

      const response: ApiResponse = {
        success: true,
        message: 'Service request created successfully',
        data: { serviceRequest },
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
   * Get service requests with filters
   */
  getServiceRequests = async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        service_type,
        status,
        urgency,
        city,
        page = 1,
        limit = 10,
      } = req.query;

      const filters = {
        service_type: service_type as string,
        status: status as string,
        urgency: urgency as string,
        city: city as string,
        page: parseInt(page as string) || 1,
        limit: parseInt(limit as string) || 10,
      };

      // If user is customer, only show their requests
      if (req.user?.userType === 'customer') {
        filters.customer_id = req.user.userId;
      }

      const { requests, total } = await this.serviceRequestModel.findMany(filters);

      const response: PaginatedResponse<typeof requests[0]> = {
        data: requests,
        pagination: {
          page: filters.page,
          limit: filters.limit,
          total,
          totalPages: Math.ceil(total / filters.limit),
        },
      };

      res.json({
        success: true,
        message: 'Service requests retrieved successfully',
        data: response,
      });
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
   * Get single service request by ID
   */
  getServiceRequest = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const serviceRequest = await this.serviceRequestModel.findById(id);

      if (!serviceRequest) {
        const response: ApiResponse = {
          success: false,
          message: 'Service request not found',
        };
        res.status(404).json(response);
        return;
      }

      // Check if user can access this request
      if (req.user?.userType === 'customer' && serviceRequest.customer_id !== req.user.userId) {
        const response: ApiResponse = {
          success: false,
          message: 'Access denied',
        };
        res.status(403).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        message: 'Service request retrieved successfully',
        data: { serviceRequest },
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve service request',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(500).json(response);
    }
  };

  /**
   * Update service request status
   */
  updateStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        const response: ApiResponse = {
          success: false,
          message: 'Status is required',
        };
        res.status(400).json(response);
        return;
      }

      const validStatuses = ['open', 'quoted', 'booked', 'in_progress', 'completed', 'cancelled'];
      if (!validStatuses.includes(status)) {
        const response: ApiResponse = {
          success: false,
          message: 'Invalid status',
        };
        res.status(400).json(response);
        return;
      }

      const serviceRequest = await this.serviceRequestModel.updateStatus(id, status);

      if (!serviceRequest) {
        const response: ApiResponse = {
          success: false,
          message: 'Service request not found',
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        message: 'Service request status updated successfully',
        data: { serviceRequest },
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to update service request status',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(500).json(response);
    }
  };

  /**
   * Update service request
   */
  updateServiceRequest = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const customerId = req.user?.userId;

      if (!customerId) {
        const response: ApiResponse = {
          success: false,
          message: 'User ID not found in token',
        };
        res.status(401).json(response);
        return;
      }

      // Check if service request exists and belongs to customer
      const existingRequest = await this.serviceRequestModel.findById(id);
      if (!existingRequest) {
        const response: ApiResponse = {
          success: false,
          message: 'Service request not found',
        };
        res.status(404).json(response);
        return;
      }

      if (existingRequest.customer_id !== customerId) {
        const response: ApiResponse = {
          success: false,
          message: 'Access denied',
        };
        res.status(403).json(response);
        return;
      }

      // Don't allow updating certain fields
      const allowedUpdates = ['title', 'description', 'urgency', 'budget_min', 'budget_max', 'preferred_date', 'images'];
      const updates = Object.keys(req.body).reduce((acc, key) => {
        if (allowedUpdates.includes(key)) {
          acc[key] = req.body[key];
        }
        return acc;
      }, {} as any);

      const serviceRequest = await this.serviceRequestModel.update(id, updates);

      const response: ApiResponse = {
        success: true,
        message: 'Service request updated successfully',
        data: { serviceRequest },
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to update service request',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(500).json(response);
    }
  };

  /**
   * Delete service request
   */
  deleteServiceRequest = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const customerId = req.user?.userId;

      if (!customerId) {
        const response: ApiResponse = {
          success: false,
          message: 'User ID not found in token',
        };
        res.status(401).json(response);
        return;
      }

      // Check if service request exists and belongs to customer
      const existingRequest = await this.serviceRequestModel.findById(id);
      if (!existingRequest) {
        const response: ApiResponse = {
          success: false,
          message: 'Service request not found',
        };
        res.status(404).json(response);
        return;
      }

      if (existingRequest.customer_id !== customerId) {
        const response: ApiResponse = {
          success: false,
          message: 'Access denied',
        };
        res.status(403).json(response);
        return;
      }

      const deleted = await this.serviceRequestModel.delete(id);

      if (!deleted) {
        const response: ApiResponse = {
          success: false,
          message: 'Failed to delete service request',
        };
        res.status(500).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        message: 'Service request deleted successfully',
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to delete service request',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(500).json(response);
    }
  };
}
