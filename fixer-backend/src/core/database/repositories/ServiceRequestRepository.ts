import { BaseRepository } from './BaseRepository';
import { ServiceRequest } from '@/types';

export class ServiceRequestRepository extends BaseRepository<ServiceRequest> {
  constructor() {
    super('service_requests');
  }

  /**
   * Find service requests by customer ID
   */
  async findByCustomerId(
    customerId: string, 
    page: number = 1, 
    limit: number = 10
  ) {
    const offset = (page - 1) * limit;
    
    const countResult = await this.query(
      'SELECT COUNT(*) FROM service_requests WHERE customer_id = $1',
      [customerId]
    );
    const total = parseInt(countResult.rows[0].count);

    const result = await this.query(
      'SELECT * FROM service_requests WHERE customer_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
      [customerId, limit, offset]
    );

    return {
      data: result.rows,
      total,
    };
  }

  /**
   * Find service requests by status
   */
  async findByStatus(
    status: string, 
    page: number = 1, 
    limit: number = 10
  ) {
    const offset = (page - 1) * limit;
    
    const countResult = await this.query(
      'SELECT COUNT(*) FROM service_requests WHERE status = $1',
      [status]
    );
    const total = parseInt(countResult.rows[0].count);

    const result = await this.query(
      'SELECT * FROM service_requests WHERE status = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
      [status, limit, offset]
    );

    return {
      data: result.rows,
      total,
    };
  }

  /**
   * Find service requests by service type
   */
  async findByServiceType(
    serviceType: string, 
    page: number = 1, 
    limit: number = 10
  ) {
    const offset = (page - 1) * limit;
    
    const countResult = await this.query(
      'SELECT COUNT(*) FROM service_requests WHERE service_type = $1',
      [serviceType]
    );
    const total = parseInt(countResult.rows[0].count);

    const result = await this.query(
      'SELECT * FROM service_requests WHERE service_type = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
      [serviceType, limit, offset]
    );

    return {
      data: result.rows,
      total,
    };
  }

  /**
   * Find service requests by location
   */
  async findByLocation(
    city: string, 
    state: string, 
    page: number = 1, 
    limit: number = 10
  ) {
    const offset = (page - 1) * limit;
    
    const countResult = await this.query(
      'SELECT COUNT(*) FROM service_requests WHERE location->>\'city\' = $1 AND location->>\'state\' = $2',
      [city, state]
    );
    const total = parseInt(countResult.rows[0].count);

    const result = await this.query(
      'SELECT * FROM service_requests WHERE location->>\'city\' = $1 AND location->>\'state\' = $2 ORDER BY created_at DESC LIMIT $3 OFFSET $4',
      [city, state, limit, offset]
    );

    return {
      data: result.rows,
      total,
    };
  }

  /**
   * Find service requests by urgency
   */
  async findByUrgency(
    urgency: string, 
    page: number = 1, 
    limit: number = 10
  ) {
    const offset = (page - 1) * limit;
    
    const countResult = await this.query(
      'SELECT COUNT(*) FROM service_requests WHERE urgency = $1',
      [urgency]
    );
    const total = parseInt(countResult.rows[0].count);

    const result = await this.query(
      'SELECT * FROM service_requests WHERE urgency = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
      [urgency, limit, offset]
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
    status: 'open' | 'quoted' | 'booked' | 'in_progress' | 'completed' | 'cancelled'
  ): Promise<ServiceRequest | null> {
    const result = await this.query(
      'UPDATE service_requests SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, id]
    );
    return result.rows[0] || null;
  }

  /**
   * Search service requests
   */
  async search(
    searchTerm: string, 
    serviceType?: string, 
    city?: string, 
    state?: string,
    urgency?: string,
    page: number = 1, 
    limit: number = 10
  ) {
    const offset = (page - 1) * limit;
    const searchPattern = `%${searchTerm}%`;
    
    let whereClause = 'title ILIKE $1 OR description ILIKE $1';
    const params: any[] = [searchPattern];
    let paramIndex = 2;

    if (serviceType) {
      whereClause += ` AND service_type = $${paramIndex}`;
      params.push(serviceType);
      paramIndex++;
    }

    if (city) {
      whereClause += ` AND location->>\'city\' = $${paramIndex}`;
      params.push(city);
      paramIndex++;
    }

    if (state) {
      whereClause += ` AND location->>\'state\' = $${paramIndex}`;
      params.push(state);
      paramIndex++;
    }

    if (urgency) {
      whereClause += ` AND urgency = $${paramIndex}`;
      params.push(urgency);
      paramIndex++;
    }

    const countResult = await this.query(
      `SELECT COUNT(*) FROM service_requests WHERE ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].count);

    const result = await this.query(
      `SELECT * FROM service_requests WHERE ${whereClause} ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...params, limit, offset]
    );

    return {
      data: result.rows,
      total,
    };
  }
}
