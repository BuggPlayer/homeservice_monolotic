import Stripe from 'stripe';
import Razorpay from 'razorpay';
import { v4 as uuidv4 } from 'uuid';

export interface PaymentData {
  amount: number;
  currency: string;
  customerId: string;
  providerId: string;
  bookingId: string;
  description: string;
  metadata?: any;
}

export interface PaymentResult {
  success: boolean;
  paymentId?: string;
  clientSecret?: string;
  orderId?: string;
  error?: string;
}

export class PaymentService {
  private stripe: Stripe;
  private razorpay: Razorpay;

  constructor() {
    // Initialize Stripe
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2023-10-16',
    });

    // Initialize Razorpay
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });
  }

  /**
   * Create Stripe payment intent
   */
  async createStripePaymentIntent(paymentData: PaymentData): Promise<PaymentResult> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(paymentData.amount * 100), // Convert to cents
        currency: paymentData.currency.toLowerCase(),
        customer: paymentData.customerId,
        description: paymentData.description,
        metadata: {
          bookingId: paymentData.bookingId,
          providerId: paymentData.providerId,
          ...paymentData.metadata,
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return {
        success: true,
        paymentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret!,
      };
    } catch (error) {
      console.error('Stripe payment intent creation failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment creation failed',
      };
    }
  }

  /**
   * Confirm Stripe payment
   */
  async confirmStripePayment(paymentIntentId: string): Promise<PaymentResult> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);

      if (paymentIntent.status === 'succeeded') {
        return {
          success: true,
          paymentId: paymentIntent.id,
        };
      } else {
        return {
          success: false,
          error: `Payment status: ${paymentIntent.status}`,
        };
      }
    } catch (error) {
      console.error('Stripe payment confirmation failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment confirmation failed',
      };
    }
  }

  /**
   * Create Razorpay order
   */
  async createRazorpayOrder(paymentData: PaymentData): Promise<PaymentResult> {
    try {
      const order = await this.razorpay.orders.create({
        amount: Math.round(paymentData.amount * 100), // Convert to paise
        currency: paymentData.currency.toUpperCase(),
        receipt: `booking_${paymentData.bookingId}`,
        notes: {
          bookingId: paymentData.bookingId,
          providerId: paymentData.providerId,
          customerId: paymentData.customerId,
          description: paymentData.description,
          ...paymentData.metadata,
        },
      });

      return {
        success: true,
        orderId: order.id,
        paymentId: order.id,
      };
    } catch (error) {
      console.error('Razorpay order creation failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Order creation failed',
      };
    }
  }

  /**
   * Verify Razorpay payment
   */
  async verifyRazorpayPayment(
    orderId: string,
    paymentId: string,
    signature: string
  ): Promise<PaymentResult> {
    try {
      const crypto = require('crypto');
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');

      if (expectedSignature === signature) {
        // Fetch payment details
        const payment = await this.razorpay.payments.fetch(paymentId);
        
        if (payment.status === 'captured') {
          return {
            success: true,
            paymentId: payment.id,
          };
        } else {
          return {
            success: false,
            error: `Payment status: ${payment.status}`,
          };
        }
      } else {
        return {
          success: false,
          error: 'Invalid payment signature',
        };
      }
    } catch (error) {
      console.error('Razorpay payment verification failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment verification failed',
      };
    }
  }

  /**
   * Create Stripe customer
   */
  async createStripeCustomer(customerData: {
    email: string;
    name: string;
    phone?: string;
  }): Promise<{ success: boolean; customerId?: string; error?: string }> {
    try {
      const customer = await this.stripe.customers.create({
        email: customerData.email,
        name: customerData.name,
        phone: customerData.phone,
      });

      return {
        success: true,
        customerId: customer.id,
      };
    } catch (error) {
      console.error('Stripe customer creation failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Customer creation failed',
      };
    }
  }

  /**
   * Create payment method
   */
  async createPaymentMethod(
    customerId: string,
    paymentMethodData: {
      type: 'card';
      card: {
        number: string;
        exp_month: number;
        exp_year: number;
        cvc: string;
      };
    }
  ): Promise<{ success: boolean; paymentMethodId?: string; error?: string }> {
    try {
      const paymentMethod = await this.stripe.paymentMethods.create({
        type: paymentMethodData.type,
        card: paymentMethodData.card,
      });

      // Attach to customer
      await this.stripe.paymentMethods.attach(paymentMethod.id, {
        customer: customerId,
      });

      return {
        success: true,
        paymentMethodId: paymentMethod.id,
      };
    } catch (error) {
      console.error('Payment method creation failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment method creation failed',
      };
    }
  }

  /**
   * Process refund
   */
  async processRefund(
    paymentId: string,
    amount?: number,
    reason?: string
  ): Promise<{ success: boolean; refundId?: string; error?: string }> {
    try {
      const refund = await this.stripe.refunds.create({
        payment_intent: paymentId,
        amount: amount ? Math.round(amount * 100) : undefined,
        reason: reason as any,
      });

      return {
        success: true,
        refundId: refund.id,
      };
    } catch (error) {
      console.error('Refund processing failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Refund processing failed',
      };
    }
  }

  /**
   * Get payment details
   */
  async getPaymentDetails(paymentId: string): Promise<{ success: boolean; payment?: any; error?: string }> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentId);
      
      return {
        success: true,
        payment: {
          id: paymentIntent.id,
          amount: paymentIntent.amount / 100,
          currency: paymentIntent.currency,
          status: paymentIntent.status,
          created: paymentIntent.created,
          metadata: paymentIntent.metadata,
        },
      };
    } catch (error) {
      console.error('Failed to get payment details:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get payment details',
      };
    }
  }

  /**
   * Create webhook endpoint signature verification
   */
  verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
    try {
      const crypto = require('crypto');
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(payload)
        .digest('hex');

      return expectedSignature === signature;
    } catch (error) {
      console.error('Webhook signature verification failed:', error);
      return false;
    }
  }

  /**
   * Calculate platform fee
   */
  calculatePlatformFee(amount: number, feePercentage: number = 2.9): number {
    return Math.round(amount * (feePercentage / 100) * 100) / 100;
  }

  /**
   * Calculate provider payout
   */
  calculateProviderPayout(amount: number, platformFee: number): number {
    return Math.round((amount - platformFee) * 100) / 100;
  }

  /**
   * Format amount for display
   */
  formatAmount(amount: number, currency: string): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount);
  }

  /**
   * Validate payment data
   */
  validatePaymentData(paymentData: PaymentData): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!paymentData.amount || paymentData.amount <= 0) {
      errors.push('Amount must be greater than 0');
    }

    if (!paymentData.currency) {
      errors.push('Currency is required');
    }

    if (!paymentData.customerId) {
      errors.push('Customer ID is required');
    }

    if (!paymentData.providerId) {
      errors.push('Provider ID is required');
    }

    if (!paymentData.bookingId) {
      errors.push('Booking ID is required');
    }

    if (!paymentData.description) {
      errors.push('Description is required');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
