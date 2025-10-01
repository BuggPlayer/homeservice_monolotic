import nodemailer from 'nodemailer';
import twilio from 'twilio';
import { createClient } from 'redis';

export interface NotificationData {
  to: string;
  subject?: string;
  message: string;
  type: 'email' | 'sms' | 'push';
  template?: string;
  data?: any;
}

export class NotificationService {
  private emailTransporter: nodemailer.Transporter;
  private twilioClient: twilio.Twilio;
  private redisClient: any;

  constructor() {
    // Initialize email transporter
    this.emailTransporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Initialize Twilio client
    this.twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    // Initialize Redis client for caching
    this.redisClient = createClient({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
    });

    this.redisClient.on('error', (err: Error) => {
      console.error('Redis Client Error:', err);
    });
  }

  /**
   * Send notification
   */
  async sendNotification(notification: NotificationData): Promise<boolean> {
    try {
      switch (notification.type) {
        case 'email':
          return await this.sendEmail(notification);
        case 'sms':
          return await this.sendSMS(notification);
        case 'push':
          return await this.sendPushNotification(notification);
        default:
          throw new Error('Invalid notification type');
      }
    } catch (error) {
      console.error('Failed to send notification:', error);
      return false;
    }
  }

  /**
   * Send email notification
   */
  private async sendEmail(notification: NotificationData): Promise<boolean> {
    try {
      const mailOptions = {
        from: process.env.SMTP_USER,
        to: notification.to,
        subject: notification.subject || 'Fixer Notification',
        html: this.generateEmailTemplate(notification),
      };

      await this.emailTransporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Email sending failed:', error);
      return false;
    }
  }

  /**
   * Send SMS notification
   */
  private async sendSMS(notification: NotificationData): Promise<boolean> {
    try {
      await this.twilioClient.messages.create({
        body: notification.message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: notification.to,
      });
      return true;
    } catch (error) {
      console.error('SMS sending failed:', error);
      return false;
    }
  }

  /**
   * Send push notification
   */
  private async sendPushNotification(notification: NotificationData): Promise<boolean> {
    try {
      // TODO: Implement push notification logic
      // This would integrate with Firebase Cloud Messaging or similar service
      console.log('Push notification:', notification);
      return true;
    } catch (error) {
      console.error('Push notification failed:', error);
      return false;
    }
  }

  /**
   * Generate email template
   */
  private generateEmailTemplate(notification: NotificationData): string {
    const template = notification.template || 'default';
    
    switch (template) {
      case 'welcome':
        return this.getWelcomeEmailTemplate(notification.data);
      case 'quote_received':
        return this.getQuoteReceivedEmailTemplate(notification.data);
      case 'booking_confirmed':
        return this.getBookingConfirmedEmailTemplate(notification.data);
      case 'booking_reminder':
        return this.getBookingReminderEmailTemplate(notification.data);
      case 'password_reset':
        return this.getPasswordResetEmailTemplate(notification.data);
      default:
        return this.getDefaultEmailTemplate(notification.message);
    }
  }

  /**
   * Welcome email template
   */
  private getWelcomeEmailTemplate(data: any): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .button { background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Fixer!</h1>
          </div>
          <div class="content">
            <h2>Hello ${data.first_name}!</h2>
            <p>Welcome to Fixer, your trusted home services marketplace. We're excited to have you on board!</p>
            <p>Your account has been successfully created and you can now start using our platform.</p>
            <a href="${process.env.FRONTEND_URL}/dashboard" class="button">Go to Dashboard</a>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Quote received email template
   */
  private getQuoteReceivedEmailTemplate(data: any): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #2196F3; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .quote-details { background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Quote Received!</h1>
          </div>
          <div class="content">
            <h2>Hello ${data.customer_name}!</h2>
            <p>You have received a new quote for your service request: <strong>${data.service_title}</strong></p>
            <div class="quote-details">
              <p><strong>Provider:</strong> ${data.provider_name}</p>
              <p><strong>Amount:</strong> $${data.amount}</p>
              <p><strong>Notes:</strong> ${data.notes || 'No additional notes'}</p>
            </div>
            <p>Please review the quote and take action within the validity period.</p>
            <a href="${process.env.FRONTEND_URL}/quotes/${data.quote_id}" class="button">View Quote</a>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Booking confirmed email template
   */
  private getBookingConfirmedEmailTemplate(data: any): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .booking-details { background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Booking Confirmed!</h1>
          </div>
          <div class="content">
            <h2>Hello ${data.customer_name}!</h2>
            <p>Your booking has been confirmed. Here are the details:</p>
            <div class="booking-details">
              <p><strong>Service:</strong> ${data.service_title}</p>
              <p><strong>Provider:</strong> ${data.provider_name}</p>
              <p><strong>Date & Time:</strong> ${new Date(data.scheduled_time).toLocaleString()}</p>
              <p><strong>Total Amount:</strong> $${data.total_amount}</p>
            </div>
            <p>We'll send you a reminder before your scheduled service.</p>
            <a href="${process.env.FRONTEND_URL}/bookings/${data.booking_id}" class="button">View Booking</a>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Booking reminder email template
   */
  private getBookingReminderEmailTemplate(data: any): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #FF9800; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .booking-details { background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Service Reminder</h1>
          </div>
          <div class="content">
            <h2>Hello ${data.customer_name}!</h2>
            <p>This is a reminder that you have a service scheduled soon:</p>
            <div class="booking-details">
              <p><strong>Service:</strong> ${data.service_title}</p>
              <p><strong>Provider:</strong> ${data.provider_name}</p>
              <p><strong>Date & Time:</strong> ${new Date(data.scheduled_time).toLocaleString()}</p>
              <p><strong>Provider Phone:</strong> ${data.provider_phone}</p>
            </div>
            <p>Please ensure you're available at the scheduled time.</p>
            <a href="${process.env.FRONTEND_URL}/bookings/${data.booking_id}" class="button">View Booking</a>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Password reset email template
   */
  private getPasswordResetEmailTemplate(data: any): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #f44336; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .reset-link { background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0; word-break: break-all; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <h2>Hello ${data.first_name}!</h2>
            <p>You requested to reset your password. Click the link below to reset it:</p>
            <div class="reset-link">
              <a href="${data.reset_link}">${data.reset_link}</a>
            </div>
            <p>This link will expire in 1 hour for security reasons.</p>
            <p>If you didn't request this password reset, please ignore this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Default email template
   */
  private getDefaultEmailTemplate(message: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Fixer Notification</h1>
          </div>
          <div class="content">
            <p>${message}</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Send bulk notifications
   */
  async sendBulkNotifications(notifications: NotificationData[]): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;

    for (const notification of notifications) {
      const result = await this.sendNotification(notification);
      if (result) {
        success++;
      } else {
        failed++;
      }
    }

    return { success, failed };
  }

  /**
   * Schedule notification
   */
  async scheduleNotification(notification: NotificationData, scheduledTime: Date): Promise<boolean> {
    try {
      // Store notification in Redis with TTL
      const delay = scheduledTime.getTime() - Date.now();
      if (delay <= 0) {
        return await this.sendNotification(notification);
      }

      const notificationKey = `notification:${Date.now()}:${Math.random()}`;
      await this.redisClient.setex(
        notificationKey,
        Math.ceil(delay / 1000),
        JSON.stringify(notification)
      );

      return true;
    } catch (error) {
      console.error('Failed to schedule notification:', error);
      return false;
    }
  }
}
