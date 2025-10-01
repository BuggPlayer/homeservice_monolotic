import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { SocketUser, SocketMessage, SocketNotification } from '@/types';
import { NotificationService } from './NotificationService';

export class SocketService {
  private io: SocketIOServer;
  private connectedUsers: Map<string, SocketUser> = new Map();
  private notificationService: NotificationService;

  constructor(server: HTTPServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.SOCKET_IO_CORS_ORIGIN || "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
      }
    });

    this.notificationService = new NotificationService();
    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`User connected: ${socket.id}`);

      // Handle user authentication
      socket.on('authenticate', (data: { userId: string; userType: string }) => {
        this.handleAuthentication(socket, data);
      });

      // Handle joining rooms
      socket.on('join_room', (room: string) => {
        socket.join(room);
        console.log(`User ${socket.id} joined room: ${room}`);
      });

      // Handle leaving rooms
      socket.on('leave_room', (room: string) => {
        socket.leave(room);
        console.log(`User ${socket.id} left room: ${room}`);
      });

      // Handle private messages
      socket.on('send_message', (data: SocketMessage) => {
        this.handlePrivateMessage(socket, data);
      });

      // Handle quote notifications
      socket.on('quote_submitted', (data: { quoteId: string; customerId: string; providerId: string }) => {
        this.handleQuoteSubmitted(socket, data);
      });

      // Handle booking notifications
      socket.on('booking_created', (data: { bookingId: string; customerId: string; providerId: string }) => {
        this.handleBookingCreated(socket, data);
      });

      // Handle order notifications
      socket.on('order_placed', (data: { orderId: string; customerId: string; providerId: string }) => {
        this.handleOrderPlaced(socket, data);
      });

      // Handle typing indicators
      socket.on('typing_start', (data: { to: string; room: string }) => {
        this.handleTypingStart(socket, data);
      });

      socket.on('typing_stop', (data: { to: string; room: string }) => {
        this.handleTypingStop(socket, data);
      });

      // Handle call notifications
      socket.on('call_initiated', (data: { callId: string; customerId: string; providerId: string }) => {
        this.handleCallInitiated(socket, data);
      });

      // Handle disconnect
      socket.on('disconnect', () => {
        this.handleDisconnect(socket);
      });
    });
  }

  private handleAuthentication(socket: any, data: { userId: string; userType: string }) {
    const user: SocketUser = {
      userId: data.userId,
      userType: data.userType as 'customer' | 'provider' | 'admin',
      socketId: socket.id
    };

    this.connectedUsers.set(data.userId, user);
    socket.userId = data.userId;
    socket.userType = data.userType;

    // Join user-specific room
    socket.join(`user_${data.userId}`);

    // Join role-specific room
    socket.join(`${data.userType}s`);

    console.log(`User authenticated: ${data.userId} (${data.userType})`);
    
    // Send confirmation
    socket.emit('authenticated', { success: true, userId: data.userId });
  }

  private handlePrivateMessage(socket: any, data: SocketMessage) {
    const message: SocketMessage = {
      ...data,
      id: this.generateId(),
      timestamp: new Date()
    };

    // Send to recipient
    this.io.to(`user_${data.to}`).emit('message_received', message);

    // Send confirmation to sender
    socket.emit('message_sent', { success: true, messageId: message.id });

    // Send notification if user is offline
    this.sendNotification(data.to, {
      type: 'message_received',
      title: 'New Message',
      message: data.message,
      data: { messageId: message.id },
      userId: data.to,
      timestamp: new Date()
    });
  }

  private handleQuoteSubmitted(socket: any, data: { quoteId: string; customerId: string; providerId: string }) {
    const notification: SocketNotification = {
      type: 'quote_received',
      title: 'New Quote Received',
      message: 'You have received a new quote for your service request',
      data: { quoteId: data.quoteId },
      userId: data.customerId,
      timestamp: new Date()
    };

    this.sendNotification(data.customerId, notification);
    this.sendEmailNotification(data.customerId, 'quote_received', {
      quoteId: data.quoteId,
      providerId: data.providerId
    });
  }

  private handleBookingCreated(socket: any, data: { bookingId: string; customerId: string; providerId: string }) {
    const customerNotification: SocketNotification = {
      type: 'booking_confirmed',
      title: 'Booking Confirmed',
      message: 'Your service booking has been confirmed',
      data: { bookingId: data.bookingId },
      userId: data.customerId,
      timestamp: new Date()
    };

    const providerNotification: SocketNotification = {
      type: 'booking_confirmed',
      title: 'New Booking',
      message: 'You have a new service booking',
      data: { bookingId: data.bookingId },
      userId: data.providerId,
      timestamp: new Date()
    };

    this.sendNotification(data.customerId, customerNotification);
    this.sendNotification(data.providerId, providerNotification);

    this.sendEmailNotification(data.customerId, 'booking_confirmed', {
      bookingId: data.bookingId,
      providerId: data.providerId
    });
  }

  private handleOrderPlaced(socket: any, data: { orderId: string; customerId: string; providerId: string }) {
    const customerNotification: SocketNotification = {
      type: 'order_placed',
      title: 'Order Placed',
      message: 'Your order has been placed successfully',
      data: { orderId: data.orderId },
      userId: data.customerId,
      timestamp: new Date()
    };

    const providerNotification: SocketNotification = {
      type: 'order_placed',
      title: 'New Order',
      message: 'You have received a new order',
      data: { orderId: data.orderId },
      userId: data.providerId,
      timestamp: new Date()
    };

    this.sendNotification(data.customerId, customerNotification);
    this.sendNotification(data.providerId, providerNotification);

    this.sendEmailNotification(data.customerId, 'order_placed', {
      orderId: data.orderId,
      providerId: data.providerId
    });
  }

  private handleTypingStart(socket: any, data: { to: string; room: string }) {
    this.io.to(`user_${data.to}`).emit('user_typing', {
      userId: socket.userId,
      room: data.room,
      isTyping: true
    });
  }

  private handleTypingStop(socket: any, data: { to: string; room: string }) {
    this.io.to(`user_${data.to}`).emit('user_typing', {
      userId: socket.userId,
      room: data.room,
      isTyping: false
    });
  }

  private handleCallInitiated(socket: any, data: { callId: string; customerId: string; providerId: string }) {
    const notification: SocketNotification = {
      type: 'message_received',
      title: 'Incoming Call',
      message: 'You have an incoming call',
      data: { callId: data.callId },
      userId: data.providerId,
      timestamp: new Date()
    };

    this.sendNotification(data.providerId, notification);
  }

  private handleDisconnect(socket: any) {
    if (socket.userId) {
      this.connectedUsers.delete(socket.userId);
      console.log(`User disconnected: ${socket.userId}`);
    }
  }

  /**
   * Send notification to a specific user
   */
  public sendNotification(userId: string, notification: SocketNotification) {
    this.io.to(`user_${userId}`).emit('notification', notification);
  }

  /**
   * Send notification to all users of a specific type
   */
  public sendNotificationToUserType(userType: 'customer' | 'provider' | 'admin', notification: SocketNotification) {
    this.io.to(`${userType}s`).emit('notification', notification);
  }

  /**
   * Send notification to all connected users
   */
  public broadcastNotification(notification: SocketNotification) {
    this.io.emit('notification', notification);
  }

  /**
   * Send message to a specific room
   */
  public sendToRoom(room: string, event: string, data: any) {
    this.io.to(room).emit(event, data);
  }

  /**
   * Get connected users
   */
  public getConnectedUsers(): SocketUser[] {
    return Array.from(this.connectedUsers.values());
  }

  /**
   * Check if user is online
   */
  public isUserOnline(userId: string): boolean {
    return this.connectedUsers.has(userId);
  }

  /**
   * Get user's socket ID
   */
  public getUserSocketId(userId: string): string | undefined {
    return this.connectedUsers.get(userId)?.socketId;
  }

  /**
   * Send email notification
   */
  private async sendEmailNotification(userId: string, template: string, data: any) {
    try {
      // This would integrate with your existing notification service
      // For now, we'll just log it
      console.log(`Sending email notification to user ${userId}: ${template}`);
    } catch (error) {
      console.error('Failed to send email notification:', error);
    }
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  /**
   * Get socket.io instance
   */
  public getIO(): SocketIOServer {
    return this.io;
  }
}
