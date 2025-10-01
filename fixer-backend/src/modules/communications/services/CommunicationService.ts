import { CallRepository } from '@/core/database/repositories';
import { Call } from '@/types';
import { 
  InitiateCallRequest, 
  UpdateCallStatusRequest, 
  GetCallsRequest, 
  GetCallsResponse, 
  GetCallResponse, 
  InitiateCallResponse, 
  UpdateCallStatusResponse,
  GetCallStatsResponse,
  SendMessageRequest,
  SendMessageResponse,
  GetMessagesRequest,
  GetMessagesResponse,
  MarkMessageReadRequest,
  MarkMessageReadResponse
} from '../types';

export class CommunicationService {
  private callRepository: CallRepository;

  constructor() {
    this.callRepository = new CallRepository();
  }

  /**
   * Initiate a call
   */
  async initiateCall(
    customerId: string, 
    data: InitiateCallRequest
  ): Promise<InitiateCallResponse> {
    const callData = {
      customer_id: customerId,
      provider_id: data.provider_id,
      status: 'initiated' as const,
      service_request_id: data.service_request_id,
    };

    const call = await this.callRepository.create(callData);

    return {
      call,
      message: 'Call initiated successfully',
    };
  }

  /**
   * Get calls with filtering and pagination
   */
  async getCalls(params: GetCallsRequest): Promise<GetCallsResponse> {
    const { page = 1, limit = 10, status, customer_id, provider_id } = params;

    let result;
    
    if (customer_id) {
      result = await this.callRepository.findByCustomerId(customer_id, page, limit);
    } else if (provider_id) {
      result = await this.callRepository.findByProviderId(provider_id, page, limit);
    } else if (status) {
      result = await this.callRepository.findByStatus(status, page, limit);
    } else {
      result = await this.callRepository.findAll(page, limit);
    }

    const totalPages = Math.ceil(result.total / limit);

    return {
      calls: result.data,
      pagination: {
        page,
        limit,
        total: result.total,
        totalPages,
      },
    };
  }

  /**
   * Get call by ID
   */
  async getCallById(callId: string): Promise<GetCallResponse> {
    const call = await this.callRepository.findById(callId);
    if (!call) {
      throw new Error('Call not found');
    }

    return {
      call,
    };
  }

  /**
   * Update call status
   */
  async updateCallStatus(
    callId: string, 
    data: UpdateCallStatusRequest
  ): Promise<UpdateCallStatusResponse> {
    const call = await this.callRepository.findById(callId);
    if (!call) {
      throw new Error('Call not found');
    }

    const updatedCall = await this.callRepository.updateCallDetails(
      callId,
      data.call_duration,
      data.recording_url
    );

    if (data.status) {
      const statusUpdatedCall = await this.callRepository.updateStatus(callId, data.status);
      if (!statusUpdatedCall) {
        throw new Error('Failed to update call status');
      }
      return {
        call: statusUpdatedCall,
        message: 'Call status updated successfully',
      };
    }

    if (!updatedCall) {
      throw new Error('Failed to update call details');
    }

    return {
      call: updatedCall,
      message: 'Call details updated successfully',
    };
  }

  /**
   * Get calls by customer
   */
  async getCallsByCustomer(
    customerId: string, 
    page: number = 1, 
    limit: number = 10
  ) {
    const result = await this.callRepository.findByCustomerId(
      customerId, 
      page, 
      limit
    );
    const totalPages = Math.ceil(result.total / limit);

    return {
      calls: result.data,
      pagination: {
        page,
        limit,
        total: result.total,
        totalPages,
      },
    };
  }

  /**
   * Get calls by provider
   */
  async getCallsByProvider(
    providerId: string, 
    page: number = 1, 
    limit: number = 10
  ) {
    const result = await this.callRepository.findByProviderId(
      providerId, 
      page, 
      limit
    );
    const totalPages = Math.ceil(result.total / limit);

    return {
      calls: result.data,
      pagination: {
        page,
        limit,
        total: result.total,
        totalPages,
      },
    };
  }

  /**
   * Get call statistics
   */
  async getCallStats(): Promise<GetCallStatsResponse> {
    const totalCalls = await this.callRepository.count();
    const completedCalls = await this.callRepository.count('status = $1', ['completed']);
    const failedCalls = await this.callRepository.count('status = $1', ['failed']);
    const cancelledCalls = await this.callRepository.count('status = $1', ['cancelled']);

    // Get duration statistics
    const result = await this.callRepository.query(
      'SELECT AVG(call_duration) as avg_duration, SUM(call_duration) as total_duration FROM calls WHERE status = $1',
      ['completed']
    );

    const averageDuration = parseFloat(result.rows[0].avg_duration) || 0;
    const totalDuration = parseInt(result.rows[0].total_duration) || 0;

    return {
      totalCalls,
      completedCalls,
      failedCalls,
      cancelledCalls,
      averageDuration,
      totalDuration,
    };
  }

  /**
   * Get call statistics for customer
   */
  async getCustomerCallStats(customerId: string) {
    return await this.callRepository.getCustomerStats(customerId);
  }

  /**
   * Get call statistics for provider
   */
  async getProviderCallStats(providerId: string) {
    return await this.callRepository.getProviderStats(providerId);
  }

  /**
   * Get active calls
   */
  async getActiveCalls() {
    return await this.callRepository.findActiveCalls();
  }

  /**
   * Clean up old failed calls
   */
  async cleanupOldFailedCalls(daysOld: number = 7) {
    return await this.callRepository.cleanupOldFailedCalls(daysOld);
  }

  /**
   * Send message (placeholder for future implementation)
   */
  async sendMessage(
    fromUserId: string,
    data: SendMessageRequest
  ): Promise<SendMessageResponse> {
    // This would integrate with a messaging service
    // For now, return a placeholder response
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      messageId,
      message: 'Message sent successfully',
    };
  }

  /**
   * Get messages (placeholder for future implementation)
   */
  async getMessages(
    userId: string,
    params: GetMessagesRequest
  ): Promise<GetMessagesResponse> {
    // This would integrate with a messaging service
    // For now, return empty response
    return {
      messages: [],
      pagination: {
        page: params.page || 1,
        limit: params.limit || 10,
        total: 0,
        totalPages: 0,
      },
    };
  }

  /**
   * Mark message as read (placeholder for future implementation)
   */
  async markMessageRead(
    userId: string,
    data: MarkMessageReadRequest
  ): Promise<MarkMessageReadResponse> {
    // This would integrate with a messaging service
    return {
      message: 'Message marked as read',
    };
  }
}
