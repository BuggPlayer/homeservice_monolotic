import { BaseRepository } from './BaseRepository';
import { Call } from '@/types';

export class CallRepository extends BaseRepository<Call> {
  constructor() {
    super('calls');
  }

  /**
   * Find calls by customer ID
   */
  async findByCustomerId(
    customerId: string, 
    page: number = 1, 
    limit: number = 10
  ) {
    const offset = (page - 1) * limit;
    
    const countResult = await this.query(
      'SELECT COUNT(*) FROM calls WHERE customer_id = $1',
      [customerId]
    );
    const total = parseInt(countResult.rows[0].count);

    const result = await this.query(
      `SELECT c.*, sp.business_name, u.first_name, u.last_name 
       FROM calls c 
       JOIN service_providers sp ON c.provider_id = sp.id 
       JOIN users u ON sp.user_id = u.id 
       WHERE c.customer_id = $1 
       ORDER BY c.created_at DESC 
       LIMIT $2 OFFSET $3`,
      [customerId, limit, offset]
    );

    return {
      data: result.rows,
      total,
    };
  }

  /**
   * Find calls by provider ID
   */
  async findByProviderId(
    providerId: string, 
    page: number = 1, 
    limit: number = 10
  ) {
    const offset = (page - 1) * limit;
    
    const countResult = await this.query(
      'SELECT COUNT(*) FROM calls WHERE provider_id = $1',
      [providerId]
    );
    const total = parseInt(countResult.rows[0].count);

    const result = await this.query(
      `SELECT c.*, u.first_name, u.last_name 
       FROM calls c 
       JOIN users u ON c.customer_id = u.id 
       WHERE c.provider_id = $1 
       ORDER BY c.created_at DESC 
       LIMIT $2 OFFSET $3`,
      [providerId, limit, offset]
    );

    return {
      data: result.rows,
      total,
    };
  }

  /**
   * Find calls by status
   */
  async findByStatus(
    status: string, 
    page: number = 1, 
    limit: number = 10
  ) {
    const offset = (page - 1) * limit;
    
    const countResult = await this.query(
      'SELECT COUNT(*) FROM calls WHERE status = $1',
      [status]
    );
    const total = parseInt(countResult.rows[0].count);

    const result = await this.query(
      `SELECT c.*, sp.business_name, u.first_name, u.last_name 
       FROM calls c 
       JOIN service_providers sp ON c.provider_id = sp.id 
       JOIN users u ON c.customer_id = u.id 
       WHERE c.status = $1 
       ORDER BY c.created_at DESC 
       LIMIT $2 OFFSET $3`,
      [status, limit, offset]
    );

    return {
      data: result.rows,
      total,
    };
  }

  /**
   * Find calls by Twilio call SID
   */
  async findByTwilioCallSid(twilioCallSid: string): Promise<Call | null> {
    const result = await this.query(
      'SELECT * FROM calls WHERE twilio_call_sid = $1',
      [twilioCallSid]
    );
    return result.rows[0] || null;
  }

  /**
   * Update status
   */
  async updateStatus(
    id: string, 
    status: 'initiated' | 'ringing' | 'in_progress' | 'completed' | 'failed' | 'cancelled'
  ): Promise<Call | null> {
    const result = await this.query(
      'UPDATE calls SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, id]
    );
    return result.rows[0] || null;
  }

  /**
   * Update call details
   */
  async updateCallDetails(
    id: string, 
    callDuration?: number, 
    recordingUrl?: string
  ): Promise<Call | null> {
    const updates: string[] = [];
    const params: any[] = [id];
    let paramIndex = 2;

    if (callDuration !== undefined) {
      updates.push(`call_duration = $${paramIndex}`);
      params.push(callDuration);
      paramIndex++;
    }

    if (recordingUrl !== undefined) {
      updates.push(`recording_url = $${paramIndex}`);
      params.push(recordingUrl);
      paramIndex++;
    }

    if (updates.length === 0) {
      return this.findById(id);
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');

    const result = await this.query(
      `UPDATE calls SET ${updates.join(', ')} WHERE id = $1 RETURNING *`,
      params
    );

    return result.rows[0] || null;
  }

  /**
   * Get call statistics for provider
   */
  async getProviderStats(providerId: string) {
    const result = await this.query(
      `SELECT 
         COUNT(*) as total_calls,
         COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_calls,
         COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_calls,
         COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_calls,
         AVG(call_duration) as average_duration,
         SUM(call_duration) as total_duration
       FROM calls 
       WHERE provider_id = $1`,
      [providerId]
    );

    return result.rows[0];
  }

  /**
   * Get call statistics for customer
   */
  async getCustomerStats(customerId: string) {
    const result = await this.query(
      `SELECT 
         COUNT(*) as total_calls,
         COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_calls,
         COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_calls,
         COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_calls,
         AVG(call_duration) as average_duration,
         SUM(call_duration) as total_duration
       FROM calls 
       WHERE customer_id = $1`,
      [customerId]
    );

    return result.rows[0];
  }

  /**
   * Find active calls
   */
  async findActiveCalls(): Promise<Call[]> {
    const result = await this.query(
      'SELECT * FROM calls WHERE status IN (\'initiated\', \'ringing\', \'in_progress\')'
    );
    return result.rows;
  }

  /**
   * Clean up old failed calls
   */
  async cleanupOldFailedCalls(daysOld: number = 7): Promise<number> {
    const result = await this.query(
      'DELETE FROM calls WHERE status = \'failed\' AND created_at < CURRENT_TIMESTAMP - INTERVAL \'$1 days\'',
      [daysOld]
    );
    return result.rowCount;
  }
}
