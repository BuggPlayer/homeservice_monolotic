import { Pool } from 'pg';
import { ServiceRequest } from '@/types';
import pool from '@/config/database';

export class ServiceRequestModel {
  private pool: Pool;

  constructor() {
    this.pool = pool;
  }

  /**
   * Create a new service request
   */
  async create(requestData: Omit<ServiceRequest, 'id' | 'created_at' | 'updated_at'>): Promise<ServiceRequest> {
    const query = `
      INSERT INTO service_requests (
        customer_id, service_type, title, description, location, 
        urgency, status, budget_min, budget_max, preferred_date, images
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;

    const values = [
      requestData.customer_id,
      requestData.service_type,
      requestData.title,
      requestData.description,
      JSON.stringify(requestData.location),
      requestData.urgency,
      requestData.status,
      requestData.budget_min || null,
      requestData.budget_max || null,
      requestData.preferred_date || null,
      requestData.images || [],
    ];

    const result = await this.pool.query(query, values);
    const serviceRequest = result.rows[0];
    
    // Parse location JSON
    serviceRequest.location = JSON.parse(serviceRequest.location);
    
    return serviceRequest;
  }

  /**
   * Find service request by ID
   */
  async findById(id: string): Promise<ServiceRequest | null> {
    const query = 'SELECT * FROM service_requests WHERE id = $1';
    const result = await this.pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return null;
    }

    const serviceRequest = result.rows[0];
    serviceRequest.location = JSON.parse(serviceRequest.location);
    
    return serviceRequest;
  }

  /**
   * Get service requests with filters and pagination
   */
  async findMany(filters: {
    customer_id?: string;
    service_type?: string;
    status?: string;
    urgency?: string;
    city?: string;
    page?: number;
    limit?: number;
  }): Promise<{ requests: ServiceRequest[]; total: number }> {
    const {
      customer_id,
      service_type,
      status,
      urgency,
      city,
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

    if (service_type) {
      paramCount++;
      whereConditions.push(`service_type = $${paramCount}`);
      queryParams.push(service_type);
    }

    if (status) {
      paramCount++;
      whereConditions.push(`status = $${paramCount}`);
      queryParams.push(status);
    }

    if (urgency) {
      paramCount++;
      whereConditions.push(`urgency = $${paramCount}`);
      queryParams.push(urgency);
    }

    if (city) {
      paramCount++;
      whereConditions.push(`location->>'city' = $${paramCount}`);
      queryParams.push(city);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Count query
    const countQuery = `SELECT COUNT(*) FROM service_requests ${whereClause}`;
    const countResult = await this.pool.query(countQuery, queryParams);
    const total = parseInt(countResult.rows[0].count);

    // Data query
    paramCount++;
    const dataQuery = `
      SELECT * FROM service_requests 
      ${whereClause}
      ORDER BY created_at DESC 
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;
    queryParams.push(limit, offset);

    const result = await this.pool.query(dataQuery, queryParams);
    
    // Parse location JSON for each request
    const requests = result.rows.map(request => {
      request.location = JSON.parse(request.location);
      return request;
    });

    return { requests, total };
  }

  /**
   * Update service request
   */
  async update(id: string, updates: Partial<Omit<ServiceRequest, 'id' | 'created_at' | 'updated_at'>>): Promise<ServiceRequest | null> {
    const fields = Object.keys(updates).filter(key => updates[key as keyof typeof updates] !== undefined);
    
    if (fields.length === 0) {
      return this.findById(id);
    }

    const setClause = fields.map((field, index) => {
      if (field === 'location') {
        return `${field} = $${index + 2}::jsonb`;
      }
      return `${field} = $${index + 2}`;
    }).join(', ');

    const query = `UPDATE service_requests SET ${setClause} WHERE id = $1 RETURNING *`;
    
    const values = [id, ...fields.map(field => {
      const value = updates[field as keyof typeof updates];
      return field === 'location' ? JSON.stringify(value) : value;
    })];
    
    const result = await this.pool.query(query, values);
    
    if (result.rows.length === 0) {
      return null;
    }

    const serviceRequest = result.rows[0];
    serviceRequest.location = JSON.parse(serviceRequest.location);
    
    return serviceRequest;
  }

  /**
   * Delete service request
   */
  async delete(id: string): Promise<boolean> {
    const query = 'DELETE FROM service_requests WHERE id = $1';
    const result = await this.pool.query(query, [id]);
    return result.rowCount > 0;
  }

  /**
   * Update service request status
   */
  async updateStatus(id: string, status: string): Promise<ServiceRequest | null> {
    const query = 'UPDATE service_requests SET status = $1 WHERE id = $2 RETURNING *';
    const result = await this.pool.query(query, [status, id]);
    
    if (result.rows.length === 0) {
      return null;
    }

    const serviceRequest = result.rows[0];
    serviceRequest.location = JSON.parse(serviceRequest.location);
    
    return serviceRequest;
  }

  /**
   * Get service requests by customer
   */
  async findByCustomer(customerId: string, page: number = 1, limit: number = 10): Promise<{ requests: ServiceRequest[]; total: number }> {
    return this.findMany({ customer_id: customerId, page, limit });
  }

  /**
   * Get available service requests for providers
   */
  async findAvailableForProviders(serviceType?: string, city?: string, page: number = 1, limit: number = 10): Promise<{ requests: ServiceRequest[]; total: number }> {
    return this.findMany({ 
      service_type: serviceType, 
      status: 'open', 
      city, 
      page, 
      limit 
    });
  }
}
