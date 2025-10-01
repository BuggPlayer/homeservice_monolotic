import { Pool } from 'pg';
import { Quote } from '@/types';
import pool from '@/config/database';

export class QuoteModel {
  private pool: Pool;

  constructor() {
    this.pool = pool;
  }

  /**
   * Create a new quote
   */
  async create(quoteData: Omit<Quote, 'id' | 'created_at' | 'updated_at'>): Promise<Quote> {
    const query = `
      INSERT INTO quotes (service_request_id, provider_id, amount, notes, status, valid_until)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    const values = [
      quoteData.service_request_id,
      quoteData.provider_id,
      quoteData.amount,
      quoteData.notes || null,
      quoteData.status || 'pending',
      quoteData.valid_until,
    ];

    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Find quote by ID
   */
  async findById(id: string): Promise<Quote | null> {
    const query = 'SELECT * FROM quotes WHERE id = $1';
    const result = await this.pool.query(query, [id]);
    return result.rows[0] || null;
  }

  /**
   * Get quotes with filters and pagination
   */
  async findMany(filters: {
    service_request_id?: string;
    provider_id?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{ quotes: Quote[]; total: number }> {
    const {
      service_request_id,
      provider_id,
      status,
      page = 1,
      limit = 10,
    } = filters;

    const offset = (page - 1) * limit;
    let whereConditions = [];
    let queryParams = [];
    let paramCount = 0;

    if (service_request_id) {
      paramCount++;
      whereConditions.push(`service_request_id = $${paramCount}`);
      queryParams.push(service_request_id);
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
    const countQuery = `SELECT COUNT(*) FROM quotes ${whereClause}`;
    const countResult = await this.pool.query(countQuery, queryParams);
    const total = parseInt(countResult.rows[0].count);

    // Data query
    paramCount++;
    const dataQuery = `
      SELECT * FROM quotes 
      ${whereClause}
      ORDER BY created_at DESC 
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;
    queryParams.push(limit, offset);

    const result = await this.pool.query(dataQuery, queryParams);
    return { quotes: result.rows, total };
  }

  /**
   * Update quote
   */
  async update(id: string, updates: Partial<Omit<Quote, 'id' | 'created_at' | 'updated_at'>>): Promise<Quote | null> {
    const fields = Object.keys(updates).filter(key => updates[key as keyof typeof updates] !== undefined);
    
    if (fields.length === 0) {
      return this.findById(id);
    }

    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
    const query = `UPDATE quotes SET ${setClause} WHERE id = $1 RETURNING *`;
    
    const values = [id, ...fields.map(field => updates[field as keyof typeof updates])];
    
    const result = await this.pool.query(query, values);
    return result.rows[0] || null;
  }

  /**
   * Update quote status
   */
  async updateStatus(id: string, status: 'pending' | 'accepted' | 'rejected' | 'expired'): Promise<Quote | null> {
    const query = 'UPDATE quotes SET status = $1 WHERE id = $2 RETURNING *';
    const result = await this.pool.query(query, [status, id]);
    return result.rows[0] || null;
  }

  /**
   * Delete quote
   */
  async delete(id: string): Promise<boolean> {
    const query = 'DELETE FROM quotes WHERE id = $1';
    const result = await this.pool.query(query, [id]);
    return result.rowCount > 0;
  }

  /**
   * Get quotes for a service request
   */
  async findByServiceRequest(serviceRequestId: string): Promise<Quote[]> {
    const query = `
      SELECT q.*, sp.business_name, sp.rating, sp.total_reviews
      FROM quotes q
      JOIN service_providers sp ON q.provider_id = sp.id
      WHERE q.service_request_id = $1
      ORDER BY q.created_at DESC
    `;
    
    const result = await this.pool.query(query, [serviceRequestId]);
    return result.rows;
  }

  /**
   * Get quotes by provider
   */
  async findByProvider(providerId: string, page: number = 1, limit: number = 10): Promise<{ quotes: Quote[]; total: number }> {
    return this.findMany({ provider_id: providerId, page, limit });
  }

  /**
   * Check if provider has already quoted on a service request
   */
  async hasProviderQuoted(serviceRequestId: string, providerId: string): Promise<boolean> {
    const query = 'SELECT id FROM quotes WHERE service_request_id = $1 AND provider_id = $2';
    const result = await this.pool.query(query, [serviceRequestId, providerId]);
    return result.rows.length > 0;
  }

  /**
   * Get expired quotes
   */
  async findExpiredQuotes(): Promise<Quote[]> {
    const query = `
      SELECT * FROM quotes 
      WHERE status = 'pending' 
      AND valid_until < NOW()
    `;
    
    const result = await this.pool.query(query);
    return result.rows;
  }

  /**
   * Mark expired quotes as expired
   */
  async markExpiredQuotes(): Promise<number> {
    const query = `
      UPDATE quotes 
      SET status = 'expired' 
      WHERE status = 'pending' 
      AND valid_until < NOW()
    `;
    
    const result = await this.pool.query(query);
    return result.rowCount;
  }
}
