import { BaseRepository } from './BaseRepository';
import { Booking } from '../../types';

export class BookingRepository extends BaseRepository<Booking> {
  constructor() {
    super('bookings');
  }

  /**
   * Find bookings by customer ID
   */
  async findByCustomerId(
    customerId: string, 
    page: number = 1, 
    limit: number = 10
  ) {
    const offset = (page - 1) * limit;
    
    const countResult = await this.query(
      'SELECT COUNT(*) FROM bookings WHERE customer_id = $1',
      [customerId]
    );
    const total = parseInt(countResult.rows[0].count);

    const result = await this.query(
      `SELECT b.*, sp.business_name, sr.title, q.amount, u.first_name, u.last_name 
       FROM bookings b 
       JOIN service_providers sp ON b.provider_id = sp.id 
       JOIN service_requests sr ON b.service_request_id = sr.id 
       JOIN quotes q ON b.quote_id = q.id 
       JOIN users u ON sp.user_id = u.id 
       WHERE b.customer_id = $1 
       ORDER BY b.scheduled_time DESC 
       LIMIT $2 OFFSET $3`,
      [customerId, limit, offset]
    );

    return {
      data: result.rows,
      total,
    };
  }

  /**
   * Find bookings by provider ID
   */
  async findByProviderId(
    providerId: string, 
    page: number = 1, 
    limit: number = 10
  ) {
    const offset = (page - 1) * limit;
    
    const countResult = await this.query(
      'SELECT COUNT(*) FROM bookings WHERE provider_id = $1',
      [providerId]
    );
    const total = parseInt(countResult.rows[0].count);

    const result = await this.query(
      `SELECT b.*, sr.title, sr.description, q.amount, u.first_name, u.last_name 
       FROM bookings b 
       JOIN service_requests sr ON b.service_request_id = sr.id 
       JOIN quotes q ON b.quote_id = q.id 
       JOIN users u ON b.customer_id = u.id 
       WHERE b.provider_id = $1 
       ORDER BY b.scheduled_time DESC 
       LIMIT $2 OFFSET $3`,
      [providerId, limit, offset]
    );

    return {
      data: result.rows,
      total,
    };
  }

  /**
   * Find bookings by status
   */
  async findByStatus(
    status: string, 
    page: number = 1, 
    limit: number = 10
  ) {
    const offset = (page - 1) * limit;
    
    const countResult = await this.query(
      'SELECT COUNT(*) FROM bookings WHERE status = $1',
      [status]
    );
    const total = parseInt(countResult.rows[0].count);

    const result = await this.query(
      `SELECT b.*, sp.business_name, sr.title, u.first_name, u.last_name 
       FROM bookings b 
       JOIN service_providers sp ON b.provider_id = sp.id 
       JOIN service_requests sr ON b.service_request_id = sr.id 
       JOIN users u ON b.customer_id = u.id 
       WHERE b.status = $1 
       ORDER BY b.scheduled_time DESC 
       LIMIT $2 OFFSET $3`,
      [status, limit, offset]
    );

    return {
      data: result.rows,
      total,
    };
  }

  /**
   * Find bookings by date range
   */
  async findByDateRange(
    startDate: Date, 
    endDate: Date, 
    page: number = 1, 
    limit: number = 10
  ) {
    const offset = (page - 1) * limit;
    
    const countResult = await this.query(
      'SELECT COUNT(*) FROM bookings WHERE scheduled_time BETWEEN $1 AND $2',
      [startDate, endDate]
    );
    const total = parseInt(countResult.rows[0].count);

    const result = await this.query(
      `SELECT b.*, sp.business_name, sr.title, u.first_name, u.last_name 
       FROM bookings b 
       JOIN service_providers sp ON b.provider_id = sp.id 
       JOIN service_requests sr ON b.service_request_id = sr.id 
       JOIN users u ON b.customer_id = u.id 
       WHERE b.scheduled_time BETWEEN $1 AND $2 
       ORDER BY b.scheduled_time ASC 
       LIMIT $3 OFFSET $4`,
      [startDate, endDate, limit, offset]
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
    status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  ): Promise<Booking | null> {
    const result = await this.query(
      'UPDATE bookings SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, id]
    );
    return result.rows[0] || null;
  }

  /**
   * Get upcoming bookings for provider
   */
  async getUpcomingBookings(providerId: string, limit: number = 10) {
    const result = await this.query(
      `SELECT b.*, sr.title, u.first_name, u.last_name, u.phone 
       FROM bookings b 
       JOIN service_requests sr ON b.service_request_id = sr.id 
       JOIN users u ON b.customer_id = u.id 
       WHERE b.provider_id = $1 
       AND b.status IN ('scheduled', 'in_progress') 
       AND b.scheduled_time >= CURRENT_TIMESTAMP 
       ORDER BY b.scheduled_time ASC 
       LIMIT $2`,
      [providerId, limit]
    );

    return result.rows;
  }

  /**
   * Get booking statistics for provider
   */
  async getProviderStats(providerId: string) {
    const result = await this.query(
      `SELECT 
         COUNT(*) as total_bookings,
         COUNT(CASE WHEN status = 'scheduled' THEN 1 END) as scheduled_bookings,
         COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress_bookings,
         COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_bookings,
         COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_bookings,
         SUM(total_amount) as total_earnings,
         AVG(total_amount) as average_booking_value
       FROM bookings 
       WHERE provider_id = $1`,
      [providerId]
    );

    return result.rows[0];
  }

  /**
   * Check for booking conflicts
   */
  async hasBookingConflict(
    providerId: string, 
    scheduledTime: Date, 
    duration: number = 60, // minutes
    excludeBookingId?: string
  ): Promise<boolean> {
    const endTime = new Date(scheduledTime.getTime() + duration * 60000);
    
    let query = `
      SELECT 1 FROM bookings 
      WHERE provider_id = $1 
      AND status IN ('scheduled', 'in_progress') 
      AND (
        (scheduled_time <= $2 AND scheduled_time + INTERVAL '1 hour' > $3) OR
        (scheduled_time < $4 AND scheduled_time + INTERVAL '1 hour' >= $2)
      )
    `;
    
    const params = [providerId, scheduledTime, scheduledTime, endTime];
    
    if (excludeBookingId) {
      query += ' AND id != $5';
      params.push(excludeBookingId);
    }
    
    const result = await this.query(query, params);
    return result.rows.length > 0;
  }
}
