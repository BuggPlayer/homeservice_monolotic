import { Pool } from 'pg';
import { Call } from '@/types';
import pool from '@/config/database';

export class CallModel {
  private pool: Pool;

  constructor() {
    this.pool = pool;
  }

  /**
   * Create a new call
   */
  async create(callData: Omit<Call, 'id' | 'created_at' | 'updated_at'>): Promise<Call> {
    const query = `
      INSERT INTO calls (
        customer_id, provider_id, call_duration, status, 
        recording_url, twilio_call_sid
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    const values = [
      callData.customer_id,
      callData.provider_id,
      callData.call_duration || null,
      callData.status || 'initiated',
      callData.recording_url || null,
      callData.twilio_call_sid || null,
    ];

    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Find call by ID
   */
  async findById(id: string): Promise<Call | null> {
    const query = 'SELECT * FROM calls WHERE id = $1';
    const result = await this.pool.query(query, [id]);
    return result.rows[0] || null;
  }

  /**
   * Find call by Twilio SID
   */
  async findByTwilioSid(twilioCallSid: string): Promise<Call | null> {
    const query = 'SELECT * FROM calls WHERE twilio_call_sid = $1';
    const result = await this.pool.query(query, [twilioCallSid]);
    return result.rows[0] || null;
  }

  /**
   * Get calls with filters and pagination
   */
  async findMany(filters: {
    customer_id?: string;
    provider_id?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{ calls: Call[]; total: number }> {
    const {
      customer_id,
      provider_id,
      status,
      page = 1,
      limit = 10,
    } = filters;

    const offset = (page - 1) * limit;
    let whereConditions = [];
    let queryParams = [];
    let paramCount = 0;

    if (customer_id) {
      paramCount++;
      whereConditions.push(`customer_id = $${paramCount}`);
      queryParams.push(customer_id);
    }

    if (provider_id) {
      paramCount++;
      whereConditions.push(`provider_id = $${paramCount}`);
      queryParams.push(provider_id);
    }

    if (status) {
      paramCount++;
      whereConditions.push(`status = $${paramCount}`);
      queryParams.push(status);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Count query
    const countQuery = `SELECT COUNT(*) FROM calls ${whereClause}`;
    const countResult = await this.pool.query(countQuery, queryParams);
    const total = parseInt(countResult.rows[0].count);

    // Data query
    paramCount++;
    const dataQuery = `
      SELECT * FROM calls 
      ${whereClause}
      ORDER BY created_at DESC 
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;
    queryParams.push(limit, offset);

    const result = await this.pool.query(dataQuery, queryParams);
    return { calls: result.rows, total };
  }

  /**
   * Update call
   */
  async update(id: string, updates: Partial<Omit<Call, 'id' | 'created_at' | 'updated_at'>>): Promise<Call | null> {
    const fields = Object.keys(updates).filter(key => updates[key as keyof typeof updates] !== undefined);
    
    if (fields.length === 0) {
      return this.findById(id);
    }

    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
    const query = `UPDATE calls SET ${setClause} WHERE id = $1 RETURNING *`;
    
    const values = [id, ...fields.map(field => updates[field as keyof typeof updates])];
    
    const result = await this.pool.query(query, values);
    return result.rows[0] || null;
  }

  /**
   * Update call status
   */
  async updateStatus(id: string, status: 'initiated' | 'ringing' | 'in_progress' | 'completed' | 'failed' | 'cancelled'): Promise<Call | null> {
    const query = 'UPDATE calls SET status = $1 WHERE id = $2 RETURNING *';
    const result = await this.pool.query(query, [status, id]);
    return result.rows[0] || null;
  }

  /**
   * Update call with Twilio data
   */
  async updateWithTwilioData(
    twilioCallSid: string, 
    updates: {
      status?: 'initiated' | 'ringing' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
      call_duration?: number;
      recording_url?: string;
    }
  ): Promise<Call | null> {
    const fields = Object.keys(updates).filter(key => updates[key as keyof typeof updates] !== undefined);
    
    if (fields.length === 0) {
      return this.findByTwilioSid(twilioCallSid);
    }

    const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
    const query = `UPDATE calls SET ${setClause} WHERE twilio_call_sid = $${fields.length + 1} RETURNING *`;
    
    const values = [...fields.map(field => updates[field as keyof typeof updates]), twilioCallSid];
    
    const result = await this.pool.query(query, values);
    return result.rows[0] || null;
  }

  /**
   * Delete call
   */
  async delete(id: string): Promise<boolean> {
    const query = 'DELETE FROM calls WHERE id = $1';
    const result = await this.pool.query(query, [id]);
    return result.rowCount > 0;
  }

  /**
   * Get calls by customer
   */
  async findByCustomer(customerId: string, page: number = 1, limit: number = 10): Promise<{ calls: Call[]; total: number }> {
    return this.findMany({ customer_id: customerId, page, limit });
  }

  /**
   * Get calls by provider
   */
  async findByProvider(providerId: string, page: number = 1, limit: number = 10): Promise<{ calls: Call[]; total: number }> {
    return this.findMany({ provider_id: providerId, page, limit });
  }

  /**
   * Get call with related data
   */
  async findByIdWithDetails(id: string): Promise<any | null> {
    const query = `
      SELECT 
        c.*,
        u.first_name as customer_first_name,
        u.last_name as customer_last_name,
        u.phone as customer_phone,
        sp.business_name as provider_business_name,
        sp.user_id as provider_user_id
      FROM calls c
      JOIN users u ON c.customer_id = u.id
      JOIN service_providers sp ON c.provider_id = sp.id
      WHERE c.id = $1
    `;
    
    const result = await this.pool.query(query, [id]);
    return result.rows[0] || null;
  }

  /**
   * Get recent calls for a user
   */
  async findRecentCalls(userId: string, userType: 'customer' | 'provider', limit: number = 10): Promise<Call[]> {
    const userField = userType === 'customer' ? 'customer_id' : 'provider_id';
    const query = `
      SELECT * FROM calls 
      WHERE ${userField} = $1
      ORDER BY created_at DESC 
      LIMIT $2
    `;
    
    const result = await this.pool.query(query, [userId, limit]);
    return result.rows;
  }

  /**
   * Get call statistics
   */
  async getCallStats(providerId: string, startDate?: Date, endDate?: Date): Promise<{
    totalCalls: number;
    completedCalls: number;
    averageDuration: number;
    totalDuration: number;
  }> {
    let whereClause = 'WHERE provider_id = $1';
    let queryParams = [providerId];
    let paramCount = 1;

    if (startDate) {
      paramCount++;
      whereClause += ` AND created_at >= $${paramCount}`;
      queryParams.push(startDate);
    }

    if (endDate) {
      paramCount++;
      whereClause += ` AND created_at <= $${paramCount}`;
      queryParams.push(endDate);
    }

    const query = `
      SELECT 
        COUNT(*) as total_calls,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_calls,
        AVG(call_duration) as average_duration,
        SUM(call_duration) as total_duration
      FROM calls 
      ${whereClause}
    `;
    
    const result = await this.pool.query(query, queryParams);
    const stats = result.rows[0];
    
    return {
      totalCalls: parseInt(stats.total_calls) || 0,
      completedCalls: parseInt(stats.completed_calls) || 0,
      averageDuration: parseFloat(stats.average_duration) || 0,
      totalDuration: parseInt(stats.total_duration) || 0,
    };
  }
}
