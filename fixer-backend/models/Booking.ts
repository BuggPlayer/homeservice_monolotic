import { Pool } from 'pg';
import { Booking } from '@/types';
import pool from '@/config/database';

export class BookingModel {
  private pool: Pool;

  constructor() {
    this.pool = pool;
  }

  /**
   * Create a new booking
   */
  async create(bookingData: Omit<Booking, 'id' | 'created_at' | 'updated_at'>): Promise<Booking> {
    const query = `
      INSERT INTO bookings (
        service_request_id, quote_id, provider_id, customer_id, 
        scheduled_time, status, total_amount, notes
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;

    const values = [
      bookingData.service_request_id,
      bookingData.quote_id,
      bookingData.provider_id,
      bookingData.customer_id,
      bookingData.scheduled_time,
      bookingData.status || 'scheduled',
      bookingData.total_amount,
      bookingData.notes || null,
    ];

    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Find booking by ID
   */
  async findById(id: string): Promise<Booking | null> {
    const query = 'SELECT * FROM bookings WHERE id = $1';
    const result = await this.pool.query(query, [id]);
    return result.rows[0] || null;
  }

  /**
   * Get bookings with filters and pagination
   */
  async findMany(filters: {
    customer_id?: string;
    provider_id?: string;
    status?: string;
    service_request_id?: string;
    page?: number;
    limit?: number;
  }): Promise<{ bookings: Booking[]; total: number }> {
    const {
      customer_id,
      provider_id,
      status,
      service_request_id,
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

    if (service_request_id) {
      paramCount++;
      whereConditions.push(`service_request_id = $${paramCount}`);
      queryParams.push(service_request_id);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Count query
    const countQuery = `SELECT COUNT(*) FROM bookings ${whereClause}`;
    const countResult = await this.pool.query(countQuery, queryParams);
    const total = parseInt(countResult.rows[0].count);

    // Data query
    paramCount++;
    const dataQuery = `
      SELECT * FROM bookings 
      ${whereClause}
      ORDER BY scheduled_time DESC 
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;
    queryParams.push(limit, offset);

    const result = await this.pool.query(dataQuery, queryParams);
    return { bookings: result.rows, total };
  }

  /**
   * Update booking
   */
  async update(id: string, updates: Partial<Omit<Booking, 'id' | 'created_at' | 'updated_at'>>): Promise<Booking | null> {
    const fields = Object.keys(updates).filter(key => updates[key as keyof typeof updates] !== undefined);
    
    if (fields.length === 0) {
      return this.findById(id);
    }

    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
    const query = `UPDATE bookings SET ${setClause} WHERE id = $1 RETURNING *`;
    
    const values = [id, ...fields.map(field => updates[field as keyof typeof updates])];
    
    const result = await this.pool.query(query, values);
    return result.rows[0] || null;
  }

  /**
   * Update booking status
   */
  async updateStatus(id: string, status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'): Promise<Booking | null> {
    const query = 'UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *';
    const result = await this.pool.query(query, [status, id]);
    return result.rows[0] || null;
  }

  /**
   * Delete booking
   */
  async delete(id: string): Promise<boolean> {
    const query = 'DELETE FROM bookings WHERE id = $1';
    const result = await this.pool.query(query, [id]);
    return result.rowCount > 0;
  }

  /**
   * Get bookings by customer
   */
  async findByCustomer(customerId: string, page: number = 1, limit: number = 10): Promise<{ bookings: Booking[]; total: number }> {
    return this.findMany({ customer_id: customerId, page, limit });
  }

  /**
   * Get bookings by provider
   */
  async findByProvider(providerId: string, page: number = 1, limit: number = 10): Promise<{ bookings: Booking[]; total: number }> {
    return this.findMany({ provider_id: providerId, page, limit });
  }

  /**
   * Get booking with related data
   */
  async findByIdWithDetails(id: string): Promise<any | null> {
    const query = `
      SELECT 
        b.*,
        sr.title as service_title,
        sr.description as service_description,
        sr.service_type,
        sr.location,
        u.first_name as customer_first_name,
        u.last_name as customer_last_name,
        u.phone as customer_phone,
        sp.business_name as provider_business_name,
        q.amount as quote_amount,
        q.notes as quote_notes
      FROM bookings b
      JOIN service_requests sr ON b.service_request_id = sr.id
      JOIN users u ON b.customer_id = u.id
      JOIN service_providers sp ON b.provider_id = sp.id
      JOIN quotes q ON b.quote_id = q.id
      WHERE b.id = $1
    `;
    
    const result = await this.pool.query(query, [id]);
    if (result.rows.length === 0) {
      return null;
    }

    const booking = result.rows[0];
    // Parse location JSON if it exists
    if (booking.location) {
      booking.location = JSON.parse(booking.location);
    }
    
    return booking;
  }

  /**
   * Get upcoming bookings for provider
   */
  async findUpcomingForProvider(providerId: string, limit: number = 10): Promise<Booking[]> {
    const query = `
      SELECT * FROM bookings 
      WHERE provider_id = $1 
      AND status IN ('scheduled', 'in_progress')
      AND scheduled_time >= NOW()
      ORDER BY scheduled_time ASC 
      LIMIT $2
    `;
    
    const result = await this.pool.query(query, [providerId, limit]);
    return result.rows;
  }

  /**
   * Get upcoming bookings for customer
   */
  async findUpcomingForCustomer(customerId: string, limit: number = 10): Promise<Booking[]> {
    const query = `
      SELECT * FROM bookings 
      WHERE customer_id = $1 
      AND status IN ('scheduled', 'in_progress')
      AND scheduled_time >= NOW()
      ORDER BY scheduled_time ASC 
      LIMIT $2
    `;
    
    const result = await this.pool.query(query, [customerId, limit]);
    return result.rows;
  }

  /**
   * Check for booking conflicts
   */
  async hasConflictingBooking(providerId: string, scheduledTime: Date, duration: number = 60): Promise<boolean> {
    const startTime = new Date(scheduledTime);
    const endTime = new Date(scheduledTime.getTime() + duration * 60 * 1000);

    const query = `
      SELECT id FROM bookings 
      WHERE provider_id = $1 
      AND status IN ('scheduled', 'in_progress')
      AND (
        (scheduled_time <= $2 AND scheduled_time + INTERVAL '1 hour' > $3) OR
        (scheduled_time >= $2 AND scheduled_time < $4)
      )
    `;
    
    const result = await this.pool.query(query, [providerId, startTime, endTime, endTime]);
    return result.rows.length > 0;
  }
}
