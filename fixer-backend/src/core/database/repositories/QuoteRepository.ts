import { BaseRepository } from './BaseRepository';
import { Quote } from '../../../types';

export class QuoteRepository extends BaseRepository<Quote> {
  constructor() {
    super('quotes');
  }

  /**
   * Find quotes by service request ID
   */
  async findByServiceRequestId(
    serviceRequestId: string, 
    page: number = 1, 
    limit: number = 10
  ) {
    const offset = (page - 1) * limit;
    
    const countResult = await this.query(
      'SELECT COUNT(*) as count FROM quotes WHERE service_request_id = $1',
      [serviceRequestId]
    );
    const total = parseInt((countResult.rows[0] as any).count);

    const result = await this.query(
      `SELECT q.*, sp.business_name, sp.rating, sp.total_reviews, u.first_name, u.last_name 
       FROM quotes q 
       JOIN service_providers sp ON q.provider_id = sp.id 
       JOIN users u ON sp.user_id = u.id 
       WHERE q.service_request_id = $1 
       ORDER BY q.created_at DESC 
       LIMIT $2 OFFSET $3`,
      [serviceRequestId, limit, offset]
    );

    return {
      data: result.rows,
      total,
    };
  }

  /**
   * Find quotes by provider ID
   */
  async findByProviderId(
    providerId: string, 
    page: number = 1, 
    limit: number = 10
  ) {
    const offset = (page - 1) * limit;
    
    const countResult = await this.query(
      'SELECT COUNT(*) as count FROM quotes WHERE provider_id = $1',
      [providerId]
    );
    const total = parseInt((countResult.rows[0] as any).count);

    const result = await this.query(
      `SELECT q.*, sr.title, sr.description, sr.urgency, u.first_name, u.last_name 
       FROM quotes q 
       JOIN service_requests sr ON q.service_request_id = sr.id 
       JOIN users u ON sr.customer_id = u.id 
       WHERE q.provider_id = $1 
       ORDER BY q.created_at DESC 
       LIMIT $2 OFFSET $3`,
      [providerId, limit, offset]
    );

    return {
      data: result.rows,
      total,
    };
  }

  /**
   * Find quotes by status
   */
  async findByStatus(
    status: string, 
    page: number = 1, 
    limit: number = 10
  ) {
    const offset = (page - 1) * limit;
    
    const countResult = await this.query(
      'SELECT COUNT(*) as count FROM quotes WHERE status = $1',
      [status]
    );
    const total = parseInt((countResult.rows[0] as any).count);

    const result = await this.query(
      `SELECT q.*, sp.business_name, sr.title, u.first_name, u.last_name 
       FROM quotes q 
       JOIN service_providers sp ON q.provider_id = sp.id 
       JOIN service_requests sr ON q.service_request_id = sr.id 
       JOIN users u ON sr.customer_id = u.id 
       WHERE q.status = $1 
       ORDER BY q.created_at DESC 
       LIMIT $2 OFFSET $3`,
      [status, limit, offset]
    );

    return {
      data: result.rows,
      total,
    };
  }

  /**
   * Update status
   */
  async updateStatus(
    id: string, 
    status: 'pending' | 'accepted' | 'rejected' | 'expired'
  ): Promise<Quote | null> {
    const result = await this.query(
      'UPDATE quotes SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, id]
    );
    return result.rows[0] || null;
  }

  /**
   * Find expired quotes
   */
  async findExpiredQuotes(): Promise<Quote[]> {
    const result = await this.query(
      'SELECT * FROM quotes WHERE status = \'pending\' AND valid_until < CURRENT_TIMESTAMP'
    );
    return result.rows;
  }

  /**
   * Mark quotes as expired
   */
  async markAsExpired(ids: string[]): Promise<number> {
    if (ids.length === 0) return 0;
    
    const placeholders = ids.map((_, index) => `$${index + 1}`).join(',');
    const result = await this.query(
      `UPDATE quotes SET status = 'expired', updated_at = CURRENT_TIMESTAMP WHERE id IN (${placeholders})`,
      ids
    );
    return result.rowCount ?? 0;
  }

  /**
   * Get quote statistics for provider
   */
  async getProviderStats(providerId: string) {
    const result = await this.query(
      `SELECT 
         COUNT(*) as total_quotes,
         COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_quotes,
         COUNT(CASE WHEN status = 'accepted' THEN 1 END) as accepted_quotes,
         COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected_quotes,
         COUNT(CASE WHEN status = 'expired' THEN 1 END) as expired_quotes,
         AVG(amount) as average_amount
       FROM quotes 
       WHERE provider_id = $1`,
      [providerId]
    );

    return result.rows[0];
  }
}
