import { Request, Response } from 'express';
import { CallModel } from '@/models/Call';
import { ServiceProviderModel } from '@/models/ServiceProvider';
import { ApiResponse, PaginatedResponse } from '@/types';
import { AppError } from '@/middleware/errorHandler';

export class CallController {
  private callModel: CallModel;
  private serviceProviderModel: ServiceProviderModel;

  constructor() {
    this.callModel = new CallModel();
    this.serviceProviderModel = new ServiceProviderModel();
  }

  /**
   * Initiate a call between customer and provider
   */
  initiateCall = async (req: Request, res: Response): Promise<void> => {
    try {
      const customerId = req.user?.userId;
      if (!customerId) {
        throw new AppError('Customer ID not found in token', 401);
      }

      const { provider_id, service_request_id } = req.body;

      // Verify provider exists
      const provider = await this.serviceProviderModel.findById(provider_id);
      if (!provider) {
        throw new AppError('Service provider not found', 404);
      }

      if (provider.verification_status !== 'verified') {
        throw new AppError('Provider is not verified', 400);
      }

      // Create call record
      const call = await this.callModel.create({
        customer_id,
        provider_id,
        status: 'initiated',
      });

      // TODO: Integrate with Twilio to initiate actual call
      // For now, we'll just return the call record

      const response: ApiResponse = {
        success: true,
        message: 'Call initiated successfully',
        data: { call },
      };

      res.status(201).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to initiate call',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      const statusCode = error instanceof AppError ? error.statusCode : 500;
      res.status(statusCode).json(response);
    }
  };

  /**
   * Get calls by customer
   */
  getCallsByCustomer = async (req: Request, res: Response): Promise<void> => {
    try {
      const customerId = req.user?.userId;
      if (!customerId) {
        throw new AppError('Customer ID not found in token', 401);
      }

      const { page = 1, limit = 10, status } = req.query;

      const { calls, total } = await this.callModel.findMany({
        customer_id: customerId,
        status: status as string,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
      });

      const response: PaginatedResponse<any> = {
        data: calls,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total,
          totalPages: Math.ceil(total / parseInt(limit as string)),
        },
      };

      res.json({
        success: true,
        message: 'Calls retrieved successfully',
        data: response,
      });
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve calls',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      const statusCode = error instanceof AppError ? error.statusCode : 500;
      res.status(statusCode).json(response);
    }
  };

  /**
   * Get calls by provider
   */
  getCallsByProvider = async (req: Request, res: Response): Promise<void> => {
    try {
      const providerId = req.user?.userId;
      if (!providerId) {
        throw new AppError('Provider ID not found in token', 401);
      }

      const { page = 1, limit = 10, status } = req.query;

      // Get provider details
      const provider = await this.serviceProviderModel.findByUserId(providerId);
      if (!provider) {
        throw new AppError('Service provider profile not found', 404);
      }

      const { calls, total } = await this.callModel.findMany({
        provider_id: provider.id,
        status: status as string,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
      });

      const response: PaginatedResponse<any> = {
        data: calls,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total,
          totalPages: Math.ceil(total / parseInt(limit as string)),
        },
      };

      res.json({
        success: true,
        message: 'Calls retrieved successfully',
        data: response,
      });
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve calls',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      const statusCode = error instanceof AppError ? error.statusCode : 500;
      res.status(statusCode).json(response);
    }
  };

  /**
   * Get call by ID with details
   */
  getCallById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { callId } = req.params;
      const userId = req.user?.userId;
      const userType = req.user?.userType;

      const call = await this.callModel.findByIdWithDetails(callId);
      if (!call) {
        throw new AppError('Call not found', 404);
      }

      // Check if user has access to this call
      if (userType === 'customer' && call.customer_id !== userId) {
        throw new AppError('Access denied', 403);
      }

      if (userType === 'provider' && call.provider_id !== userId) {
        throw new AppError('Access denied', 403);
      }

      const response: ApiResponse = {
        success: true,
        message: 'Call retrieved successfully',
        data: { call },
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve call',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      const statusCode = error instanceof AppError ? error.statusCode : 500;
      res.status(statusCode).json(response);
    }
  };

  /**
   * Update call status (webhook from Twilio)
   */
  updateCallStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { twilioCallSid } = req.params;
      const { status, call_duration, recording_url } = req.body;

      if (!['initiated', 'ringing', 'in_progress', 'completed', 'failed', 'cancelled'].includes(status)) {
        throw new AppError('Invalid status', 400);
      }

      const call = await this.callModel.findByTwilioSid(twilioCallSid);
      if (!call) {
        throw new AppError('Call not found', 404);
      }

      const updatedCall = await this.callModel.updateWithTwilioData(twilioCallSid, {
        status,
        call_duration,
        recording_url,
      });

      const response: ApiResponse = {
        success: true,
        message: 'Call status updated successfully',
        data: { call: updatedCall },
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to update call status',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      const statusCode = error instanceof AppError ? error.statusCode : 500;
      res.status(statusCode).json(response);
    }
  };

  /**
   * Get recent calls
   */
  getRecentCalls = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      const userType = req.user?.userType;
      const { limit = 10 } = req.query;

      if (!userId || !userType) {
        throw new AppError('User information not found in token', 401);
      }

      if (!['customer', 'provider'].includes(userType)) {
        throw new AppError('Invalid user type', 400);
      }

      const recentCalls = await this.callModel.findRecentCalls(
        userId,
        userType as 'customer' | 'provider',
        parseInt(limit as string)
      );

      const response: ApiResponse = {
        success: true,
        message: 'Recent calls retrieved successfully',
        data: { calls: recentCalls },
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve recent calls',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      const statusCode = error instanceof AppError ? error.statusCode : 500;
      res.status(statusCode).json(response);
    }
  };

  /**
   * Get call statistics for provider
   */
  getCallStatistics = async (req: Request, res: Response): Promise<void> => {
    try {
      const providerId = req.user?.userId;
      if (!providerId) {
        throw new AppError('Provider ID not found in token', 401);
      }

      const { start_date, end_date } = req.query;

      // Get provider details
      const provider = await this.serviceProviderModel.findByUserId(providerId);
      if (!provider) {
        throw new AppError('Service provider profile not found', 404);
      }

      const startDate = start_date ? new Date(start_date as string) : undefined;
      const endDate = end_date ? new Date(end_date as string) : undefined;

      const stats = await this.callModel.getCallStats(provider.id, startDate, endDate);

      const response: ApiResponse = {
        success: true,
        message: 'Call statistics retrieved successfully',
        data: { statistics: stats },
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve call statistics',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      const statusCode = error instanceof AppError ? error.statusCode : 500;
      res.status(statusCode).json(response);
    }
  };

  /**
   * End a call
   */
  endCall = async (req: Request, res: Response): Promise<void> => {
    try {
      const { callId } = req.params;
      const userId = req.user?.userId;
      const userType = req.user?.userType;

      const call = await this.callModel.findById(callId);
      if (!call) {
        throw new AppError('Call not found', 404);
      }

      // Check permissions
      if (userType === 'customer' && call.customer_id !== userId) {
        throw new AppError('Access denied', 403);
      }

      if (userType === 'provider') {
        const provider = await this.serviceProviderModel.findByUserId(userId!);
        if (!provider || provider.id !== call.provider_id) {
          throw new AppError('Access denied', 403);
        }
      }

      if (!['initiated', 'ringing', 'in_progress'].includes(call.status)) {
        throw new AppError('Call cannot be ended in current status', 400);
      }

      const updatedCall = await this.callModel.updateStatus(callId, 'completed');

      const response: ApiResponse = {
        success: true,
        message: 'Call ended successfully',
        data: { call: updatedCall },
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to end call',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      const statusCode = error instanceof AppError ? error.statusCode : 500;
      res.status(statusCode).json(response);
    }
  };
}
