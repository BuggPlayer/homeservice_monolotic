import pool from '@/config/database';

export type QuoteStatus = 'pending' | 'accepted' | 'rejected' | 'expired';

export interface Quote {
  id: string;
  service_request_id: string;
  provider_id: string;
  amount: number;
  notes: string;
  status: QuoteStatus;
  valid_until: Date;
  created_at: Date;
  updated_at: Date;
}

export class QuoteModel {
  static async create(quote: Omit<Quote, 'id' | 'created_at' | 'updated_at' | 'status'> & { status?: QuoteStatus }): Promise<Quote> {
    const result = await pool.query(
      `INSERT INTO quotes (service_request_id, provider_id, amount, notes, status, valid_until)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        quote.service_request_id,
        quote.provider_id,
        quote.amount,
        quote.notes,
        quote.status || 'pending',
        quote.valid_until,
      ]
    );
    return result.rows[0];
  }

  static async findById(id: string): Promise<Quote | null> {
    const result = await pool.query('SELECT * FROM quotes WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  static async findAll(filters?: { status?: QuoteStatus; provider_id?: string; customer_id?: string; service_request_id?: string }): Promise<Quote[]> {
    let query = 'SELECT q.* FROM quotes q';
    const values: any[] = [];
    let paramIndex = 1;

    if (filters?.customer_id) {
      query += ' JOIN service_requests sr ON q.service_request_id = sr.id';
      query += ' WHERE sr.customer_id = $' + paramIndex;
      values.push(filters.customer_id);
      paramIndex++;
    } else {
      query += ' WHERE 1=1';
    }

    if (filters?.status) {
      query += ` AND q.status = $${paramIndex}`;
      values.push(filters.status);
      paramIndex++;
    }
    if (filters?.provider_id) {
      query += ` AND q.provider_id = $${paramIndex}`;
      values.push(filters.provider_id);
      paramIndex++;
    }
    if (filters?.service_request_id) {
      query += ` AND q.service_request_id = $${paramIndex}`;
      values.push(filters.service_request_id);
      paramIndex++;
    }

    query += ' ORDER BY q.created_at DESC';
    const result = await pool.query(query, values);
    return result.rows;
  }

  static async update(id: string, updates: Partial<Omit<Quote, 'id' | 'created_at' | 'updated_at'>>): Promise<Quote | null> {
    const setClauses: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    for (const key in updates) {
      if (Object.prototype.hasOwnProperty.call(updates, key)) {
        setClauses.push(`${key} = $${paramIndex}`);
        values.push((updates as any)[key]);
        paramIndex++;
      }
    }

    if (setClauses.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    setClauses.push(`updated_at = CURRENT_TIMESTAMP`);

    const query = `
      UPDATE quotes
      SET ${setClauses.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *;
    `;

    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  static async updateStatus(id: string, status: QuoteStatus): Promise<Quote | null> {
    const result = await pool.query(
      `UPDATE quotes SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
      [status, id]
    );
    return result.rows[0] || null;
  }

  static async delete(id: string): Promise<boolean> {
    const result = await pool.query('DELETE FROM quotes WHERE id = $1', [id]);
    return result.rowCount > 0;
  }

  static async getServiceRequest(serviceRequestId: string): Promise<any> {
    const result = await pool.query('SELECT * FROM service_requests WHERE id = $1', [serviceRequestId]);
    return result.rows[0] || null;
  }

  static async acceptQuote(quoteId: string, customerId: string): Promise<any> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Update quote status
      await client.query('UPDATE quotes SET status = $1 WHERE id = $2', ['accepted', quoteId]);

      // Get quote details
      const quoteResult = await client.query('SELECT * FROM quotes WHERE id = $1', [quoteId]);
      const quote = quoteResult.rows[0];

      // Create booking
      const bookingResult = await client.query(
        `INSERT INTO bookings (service_request_id, quote_id, customer_id, provider_id, scheduled_time, total_amount, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [
          quote.service_request_id,
          quoteId,
          customerId,
          quote.provider_id,
          new Date(), // You might want to get this from the service request
          quote.amount,
          'scheduled'
        ]
      );

      // Update service request status
      await client.query('UPDATE service_requests SET status = $1 WHERE id = $2', ['booked', quote.service_request_id]);

      await client.query('COMMIT');
      return bookingResult.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}
