import { Request, Response } from 'express';
import { PaymentService } from '../services/PaymentService';
import { ApiResponse } from '@/types';
import { 
  ProcessPaymentRequest, 
  RefundPaymentRequest, 
  GetPaymentsRequest,
  WebhookRequest,
  CreatePaymentIntentRequest,
  ConfirmPaymentRequest
} from '../types';

export class PaymentController {
  private paymentService: PaymentService;

  constructor() {
    this.paymentService = new PaymentService();
  }

  /**
   * Process a payment
   */
  processPayment = async (req: Request, res: Response): Promise<void> => {
    try {
      const data: ProcessPaymentRequest = req.body;
      const result = await this.paymentService.processPayment(data);

      const response: ApiResponse = {
        success: true,
        message: result.message,
        data: result,
      };

      res.status(201).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Payment processing failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(400).json(response);
    }
  };

  /**
   * Refund a payment
   */
  refundPayment = async (req: Request, res: Response): Promise<void> => {
    try {
      const data: RefundPaymentRequest = req.body;
      const result = await this.paymentService.refundPayment(data);

      const response: ApiResponse = {
        success: true,
        message: result.message,
        data: result,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Refund processing failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(400).json(response);
    }
  };

  /**
   * Get payments
   */
  getPayments = async (req: Request, res: Response): Promise<void> => {
    try {
      const params: GetPaymentsRequest = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        status: req.query.status as any,
        payment_method: req.query.payment_method as any,
        customer_id: req.query.customer_id as string,
        provider_id: req.query.provider_id as string,
        start_date: req.query.start_date ? new Date(req.query.start_date as string) : undefined,
        end_date: req.query.end_date ? new Date(req.query.end_date as string) : undefined,
      };

      const result = await this.paymentService.getPayments(params);

      const response: ApiResponse = {
        success: true,
        message: 'Payments retrieved successfully',
        data: result,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve payments',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(500).json(response);
    }
  };

  /**
   * Get payment by ID
   */
  getPaymentById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.paymentService.getPaymentById(id);

      const response: ApiResponse = {
        success: true,
        message: 'Payment retrieved successfully',
        data: result,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve payment',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(404).json(response);
    }
  };

  /**
   * Get payment statistics
   */
  getPaymentStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.paymentService.getPaymentStats();

      const response: ApiResponse = {
        success: true,
        message: 'Payment statistics retrieved successfully',
        data: result,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve payment statistics',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(500).json(response);
    }
  };

  /**
   * Handle webhook
   */
  handleWebhook = async (req: Request, res: Response): Promise<void> => {
    try {
      const data: WebhookRequest = req.body;
      const result = await this.paymentService.handleWebhook(data);

      const response: ApiResponse = {
        success: true,
        message: result.message,
        data: result,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Webhook processing failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(400).json(response);
    }
  };

  /**
   * Create payment intent
   */
  createPaymentIntent = async (req: Request, res: Response): Promise<void> => {
    try {
      const data: CreatePaymentIntentRequest = req.body;
      const result = await this.paymentService.createPaymentIntent(data);

      const response: ApiResponse = {
        success: true,
        message: result.message,
        data: result,
      };

      res.status(201).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Payment intent creation failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(400).json(response);
    }
  };

  /**
   * Confirm payment
   */
  confirmPayment = async (req: Request, res: Response): Promise<void> => {
    try {
      const data: ConfirmPaymentRequest = req.body;
      const result = await this.paymentService.confirmPayment(data);

      const response: ApiResponse = {
        success: true,
        message: result.message,
        data: result,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Payment confirmation failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(400).json(response);
    }
  };

  /**
   * Get payments by customer
   */
  getPaymentsByCustomer = async (req: Request, res: Response): Promise<void> => {
    try {
      const customerId = (req as any).user.userId;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const result = await this.paymentService.getPaymentsByCustomer(
        customerId, 
        page, 
        limit
      );

      const response: ApiResponse = {
        success: true,
        message: 'Customer payments retrieved successfully',
        data: result,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve customer payments',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(500).json(response);
    }
  };

  /**
   * Get payments by provider
   */
  getPaymentsByProvider = async (req: Request, res: Response): Promise<void> => {
    try {
      const providerId = (req as any).user.userId;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const result = await this.paymentService.getPaymentsByProvider(
        providerId, 
        page, 
        limit
      );

      const response: ApiResponse = {
        success: true,
        message: 'Provider payments retrieved successfully',
        data: result,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve provider payments',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(500).json(response);
    }
  };

  /**
   * Get customer payment statistics
   */
  getCustomerPaymentStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const customerId = (req as any).user.userId;
      const result = await this.paymentService.getCustomerPaymentStats(customerId);

      const response: ApiResponse = {
        success: true,
        message: 'Customer payment statistics retrieved successfully',
        data: result,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve customer payment statistics',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(500).json(response);
    }
  };

  /**
   * Get provider payment statistics
   */
  getProviderPaymentStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const providerId = (req as any).user.userId;
      const result = await this.paymentService.getProviderPaymentStats(providerId);

      const response: ApiResponse = {
        success: true,
        message: 'Provider payment statistics retrieved successfully',
        data: result,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve provider payment statistics',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(500).json(response);
    }
  };
}
