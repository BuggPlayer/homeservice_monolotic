import { Request, Response } from 'express';
import { CommunicationService } from '../services/CommunicationService';
import { ApiResponse } from '@/types';
import { 
  InitiateCallRequest, 
  UpdateCallStatusRequest, 
  GetCallsRequest,
  SendMessageRequest,
  GetMessagesRequest,
  MarkMessageReadRequest
} from '../types';

export class CommunicationController {
  private communicationService: CommunicationService;

  constructor() {
    this.communicationService = new CommunicationService();
  }

  /**
   * Initiate a call
   */
  initiateCall = async (req: Request, res: Response): Promise<void> => {
    try {
      const customerId = (req as any).user.userId;
      const data: InitiateCallRequest = req.body;
      const result = await this.communicationService.initiateCall(customerId, data);

      const response: ApiResponse = {
        success: true,
        message: result.message,
        data: result,
      };

      res.status(201).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to initiate call',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(400).json(response);
    }
  };

  /**
   * Get calls
   */
  getCalls = async (req: Request, res: Response): Promise<void> => {
    try {
      const params: GetCallsRequest = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        status: req.query.status as any,
        customer_id: req.query.customer_id as string,
        provider_id: req.query.provider_id as string,
      };

      const result = await this.communicationService.getCalls(params);

      const response: ApiResponse = {
        success: true,
        message: 'Calls retrieved successfully',
        data: result,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve calls',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(500).json(response);
    }
  };

  /**
   * Get call by ID
   */
  getCallById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.communicationService.getCallById(id);

      const response: ApiResponse = {
        success: true,
        message: 'Call retrieved successfully',
        data: result,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve call',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(404).json(response);
    }
  };

  /**
   * Update call status
   */
  updateCallStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const data: UpdateCallStatusRequest = req.body;
      const result = await this.communicationService.updateCallStatus(id, data);

      const response: ApiResponse = {
        success: true,
        message: result.message,
        data: result,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to update call status',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(400).json(response);
    }
  };

  /**
   * Get calls by customer
   */
  getCallsByCustomer = async (req: Request, res: Response): Promise<void> => {
    try {
      const customerId = (req as any).user.userId;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const result = await this.communicationService.getCallsByCustomer(
        customerId, 
        page, 
        limit
      );

      const response: ApiResponse = {
        success: true,
        message: 'Customer calls retrieved successfully',
        data: result,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve customer calls',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(500).json(response);
    }
  };

  /**
   * Get calls by provider
   */
  getCallsByProvider = async (req: Request, res: Response): Promise<void> => {
    try {
      const providerId = (req as any).user.userId;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const result = await this.communicationService.getCallsByProvider(
        providerId, 
        page, 
        limit
      );

      const response: ApiResponse = {
        success: true,
        message: 'Provider calls retrieved successfully',
        data: result,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve provider calls',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(500).json(response);
    }
  };

  /**
   * Get call statistics
   */
  getCallStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.communicationService.getCallStats();

      const response: ApiResponse = {
        success: true,
        message: 'Call statistics retrieved successfully',
        data: result,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve call statistics',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(500).json(response);
    }
  };

  /**
   * Get customer call statistics
   */
  getCustomerCallStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const customerId = (req as any).user.userId;
      const result = await this.communicationService.getCustomerCallStats(customerId);

      const response: ApiResponse = {
        success: true,
        message: 'Customer call statistics retrieved successfully',
        data: result,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve customer call statistics',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(500).json(response);
    }
  };

  /**
   * Get provider call statistics
   */
  getProviderCallStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const providerId = (req as any).user.userId;
      const result = await this.communicationService.getProviderCallStats(providerId);

      const response: ApiResponse = {
        success: true,
        message: 'Provider call statistics retrieved successfully',
        data: result,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve provider call statistics',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(500).json(response);
    }
  };

  /**
   * Send message
   */
  sendMessage = async (req: Request, res: Response): Promise<void> => {
    try {
      const fromUserId = (req as any).user.userId;
      const data: SendMessageRequest = req.body;
      const result = await this.communicationService.sendMessage(fromUserId, data);

      const response: ApiResponse = {
        success: true,
        message: result.message,
        data: result,
      };

      res.status(201).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to send message',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(400).json(response);
    }
  };

  /**
   * Get messages
   */
  getMessages = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.userId;
      const params: GetMessagesRequest = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        conversation_with: req.query.conversation_with as string,
      };

      const result = await this.communicationService.getMessages(userId, params);

      const response: ApiResponse = {
        success: true,
        message: 'Messages retrieved successfully',
        data: result,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve messages',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(500).json(response);
    }
  };

  /**
   * Mark message as read
   */
  markMessageRead = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.userId;
      const data: MarkMessageReadRequest = req.body;
      const result = await this.communicationService.markMessageRead(userId, data);

      const response: ApiResponse = {
        success: true,
        message: result.message,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to mark message as read',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(400).json(response);
    }
  };
}
