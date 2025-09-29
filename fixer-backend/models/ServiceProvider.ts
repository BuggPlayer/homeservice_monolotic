import { Pool } from 'pg';
import { ServiceProvider } from '@/types';
import pool from '@/config/database';

export class ServiceProviderModel {
  private pool: Pool;

  constructor() {
    this.pool = pool;
  }

  /**
   * Create a new service provider
   */
  async create(providerData: Omit<ServiceProvider, 'id' | 'created_at' | 'updated_at'>): Promise<ServiceProvider> {
    const query = `
      INSERT INTO service_providers (
        user_id, business_name, business_license, services_offered, 
        service_areas, verification_status, rating, total_reviews, 
        years_experience, bio
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;

    const values = [
      providerData.user_id,
      providerData.business_name,
      providerData.business_license || null,
      providerData.services_offered,
      providerData.service_areas,
      providerData.verification_status || 'pending',
      providerData.rating || 0.00,
      providerData.total_reviews || 0,
      providerData.years_experience || 0,
      providerData.bio || null,
    ];

    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Find service provider by user ID
   */
  async findByUserId(userId: string): Promise<ServiceProvider | null> {
    const query = 'SELECT * FROM service_providers WHERE user_id = $1';
    const result = await this.pool.query(query, [userId]);
    return result.rows[0] || null;
  }

  /**
   * Find service provider by ID
   */
  async findById(id: string): Promise<ServiceProvider | null> {
    const query = 'SELECT * FROM service_providers WHERE id = $1';
    const result = await this.pool.query(query, [id]);
    return result.rows[0] || null;
  }

  /**
   * Get service providers with filters and pagination
   */
  async findMany(filters: {
    service_type?: string;
    service_area?: string;
    verification_status?: string;
    min_rating?: number;
    page?: number;
    limit?: number;
  }): Promise<{ providers: ServiceProvider[]; total: number }> {
    const {
      service_type,
      service_area,
      verification_status,
      min_rating,
      page = 1,
      limit = 10,
    } = filters;

    const offset = (page - 1) * limit;
    let whereConditions = [];
    let queryParams = [];
    let paramCount = 0;

    if (service_type) {
      paramCount++;
      whereConditions.push(`$${paramCount} = ANY(services_offered)`);
      queryParams.push(service_type);
    }

    if (service_area) {
      paramCount++;
      whereConditions.push(`$${paramCount} = ANY(service_areas)`);
      queryParams.push(service_area);
    }

    if (verification_status) {
      paramCount++;
      whereConditions.push(`verification_status = $${paramCount}`);
      queryParams.push(verification_status);
    }

    if (min_rating !== undefined) {
      paramCount++;
      whereConditions.push(`rating >= $${paramCount}`);
      queryParams.push(min_rating);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Count query
    const countQuery = `SELECT COUNT(*) FROM service_providers ${whereClause}`;
    const countResult = await this.pool.query(countQuery, queryParams);
    const total = parseInt(countResult.rows[0].count);

    // Data query
    paramCount++;
    const dataQuery = `
      SELECT * FROM service_providers 
      ${whereClause}
      ORDER BY rating DESC, total_reviews DESC, created_at DESC
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;
    queryParams.push(limit, offset);

    const result = await this.pool.query(dataQuery, queryParams);
    return { providers: result.rows, total };
  }

  /**
   * Update service provider
   */
  async update(id: string, updates: Partial<Omit<ServiceProvider, 'id' | 'created_at' | 'updated_at'>>): Promise<ServiceProvider | null> {
    const fields = Object.keys(updates).filter(key => updates[key as keyof typeof updates] !== undefined);
    
    if (fields.length === 0) {
      return this.findById(id);
    }

    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
    const query = `UPDATE service_providers SET ${setClause} WHERE id = $1 RETURNING *`;
    
    const values = [id, ...fields.map(field => updates[field as keyof typeof updates])];
    
    const result = await this.pool.query(query, values);
    return result.rows[0] || null;
  }

  /**
   * Update verification status
   */
  async updateVerificationStatus(id: string, status: 'pending' | 'verified' | 'rejected'): Promise<ServiceProvider | null> {
    const query = 'UPDATE service_providers SET verification_status = $1 WHERE id = $2 RETURNING *';
    const result = await this.pool.query(query, [status, id]);
    return result.rows[0] || null;
  }

  /**
   * Update rating
   */
  async updateRating(id: string, newRating: number): Promise<ServiceProvider | null> {
    // Get current rating and total reviews
    const current = await this.findById(id);
    if (!current) return null;

    // Calculate new average rating
    const newTotalReviews = current.total_reviews + 1;
    const newAverageRating = ((current.rating * current.total_reviews) + newRating) / newTotalReviews;

    const query = `
      UPDATE service_providers 
      SET rating = $1, total_reviews = $2 
      WHERE id = $3 
      RETURNING *
    `;
    
    const result = await this.pool.query(query, [newAverageRating, newTotalReviews, id]);
    return result.rows[0] || null;
  }

  /**
   * Delete service provider
   */
  async delete(id: string): Promise<boolean> {
    const query = 'DELETE FROM service_providers WHERE id = $1';
    const result = await this.pool.query(query, [id]);
    return result.rowCount > 0;
  }

  /**
   * Get providers by service type and location
   */
  async findByServiceAndLocation(serviceType: string, city: string): Promise<ServiceProvider[]> {
    const query = `
      SELECT * FROM service_providers 
      WHERE $1 = ANY(services_offered) 
      AND $2 = ANY(service_areas)
      AND verification_status = 'verified'
      ORDER BY rating DESC, total_reviews DESC
    `;
    
    const result = await this.pool.query(query, [serviceType, city]);
    return result.rows;
  }
}
