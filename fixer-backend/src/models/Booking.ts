import pool from '@/config/database';

export type BookingStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'rescheduled';

export interface Booking {
  id: string;
  service_request_id: string;
  quote_id: string;
  customer_id: string;
  provider_id: string;
  scheduled_time: Date;
  scheduled_end_time?: Date;
  actual_start_time?: Date;
  actual_end_time?: Date;
  status: BookingStatus;
  total_amount: number;
  payment_status: string;
  payment_transaction_id?: string;
  customer_rating?: number;
  customer_review?: string;
  provider_notes?: string;
  created_at: Date;
  updated_at: Date;
}

export class BookingModel {
  static async create(booking: Omit<Booking, 'id' | 'created_at' | 'updated_at' | 'status' | 'payment_status'> & { status?: BookingStatus; payment_status?: string }): Promise<Booking> {
    const result = await pool.query(
      `INSERT INTO bookings (service_request_id, quote_id, customer_id, provider_id, scheduled_time, scheduled_end_time, total_amount, status, payment_status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        booking.service_request_id,
        booking.quote_id,
        booking.customer_id,
        booking.provider_id,
        booking.scheduled_time,
        booking.scheduled_end_time,
        booking.total_amount,
        booking.status || 'scheduled',
        booking.payment_status || 'pending',
      ]
    );
    return result.rows[0];
  }

  static async findById(id: string): Promise<Booking | null> {
    const result = await pool.query('SELECT * FROM bookings WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  static async findAll(filters?: { status?: BookingStatus; customer_id?: string; provider_id?: string; service_request_id?: string }): Promise<Booking[]> {
    let query = 'SELECT * FROM bookings WHERE 1=1';
    const values: any[] = [];
    let paramIndex = 1;

    if (filters?.status) {
      query += ` AND status = $${paramIndex}`;
      values.push(filters.status);
      paramIndex++;
    }
    if (filters?.customer_id) {
      query += ` AND customer_id = $${paramIndex}`;
      values.push(filters.customer_id);
      paramIndex++;
    }
    if (filters?.provider_id) {
      query += ` AND provider_id = $${paramIndex}`;
      values.push(filters.provider_id);
      paramIndex++;
    }
    if (filters?.service_request_id) {
      query += ` AND service_request_id = $${paramIndex}`;
      values.push(filters.service_request_id);
      paramIndex++;
    }

    query += ' ORDER BY scheduled_time DESC';
    const result = await pool.query(query, values);
    return result.rows;
  }

  static async update(id: string, updates: Partial<Omit<Booking, 'id' | 'created_at' | 'updated_at'>>): Promise<Booking | null> {
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
      UPDATE bookings
      SET ${setClauses.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *;
    `;

    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  static async updateStatus(id: string, status: BookingStatus): Promise<Booking | null> {
    const result = await pool.query(
      `UPDATE bookings SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
      [status, id]
    );
    return result.rows[0] || null;
  }

  static async updateNotes(id: string, notes: string): Promise<Booking | null> {
    const result = await pool.query(
      `UPDATE bookings SET provider_notes = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
      [notes, id]
    );
    return result.rows[0] || null;
  }

  static async cancel(id: string, reason?: string): Promise<Booking | null> {
    const result = await pool.query(
      `UPDATE bookings SET status = $1, provider_notes = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *`,
      ['cancelled', reason, id]
    );
    return result.rows[0] || null;
  }

  static async complete(id: string, completionNotes?: string, finalAmount?: number): Promise<Booking | null> {
    const updates: any = {
      status: 'completed',
      actual_end_time: new Date(),
    };

    if (completionNotes) {
      updates.provider_notes = completionNotes;
    }
    if (finalAmount) {
      updates.total_amount = finalAmount;
    }

    return this.update(id, updates);
  }

  static async start(id: string): Promise<Booking | null> {
    const result = await pool.query(
      `UPDATE bookings SET status = $1, actual_start_time = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *`,
      ['in_progress', new Date(), id]
    );
    return result.rows[0] || null;
  }

  static async reschedule(id: string, newScheduledTime: Date): Promise<Booking | null> {
    const result = await pool.query(
      `UPDATE bookings SET scheduled_time = $1, status = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *`,
      [newScheduledTime, 'rescheduled', id]
    );
    return result.rows[0] || null;
  }

  static async updatePaymentStatus(id: string, paymentStatus: string, transactionId?: string): Promise<Booking | null> {
    const updates: any = {
      payment_status: paymentStatus,
    };

    if (transactionId) {
      updates.payment_transaction_id = transactionId;
    }

    return this.update(id, updates);
  }

  static async addRating(id: string, rating: number, review?: string): Promise<Booking | null> {
    const result = await pool.query(
      `UPDATE bookings SET customer_rating = $1, customer_review = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *`,
      [rating, review, id]
    );
    return result.rows[0] || null;
  }
}
