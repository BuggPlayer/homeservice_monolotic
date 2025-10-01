import { BaseRepository } from './BaseRepository';
import { ServiceProvider } from '@/types';

export class ServiceProviderRepository extends BaseRepository<ServiceProvider> {
  constructor() {
    super('service_providers');
  }

  /**
   * Find service provider by user ID
   */
  async findByUserId(userId: string): Promise<ServiceProvider | null> {
    const result = await this.query(
      'SELECT * FROM service_providers WHERE user_id = $1',
      [userId]
    );
    return result.rows[0] || null;
  }

  /**
   * Find service providers by verification status
   */
  async findByVerificationStatus(
    status: string, 
    page: number = 1, 
    limit: number = 10
  ) {
    const offset = (page - 1) * limit;
    
    const countResult = await this.query(
      'SELECT COUNT(*) FROM service_providers WHERE verification_status = $1',
      [status]
    );
    const total = parseInt(countResult.rows[0].count);

    const result = await this.query(
      `SELECT sp.*, u.first_name, u.last_name, u.email, u.phone 
       FROM service_providers sp 
       JOIN users u ON sp.user_id = u.id 
       WHERE sp.verification_status = $1 
       ORDER BY sp.created_at DESC 
       LIMIT $2 OFFSET $3`,
      [status, limit, offset]
    );

    return {
      data: result.rows,
      total,
    };
  }

  /**
   * Find service providers by service type
   */
  async findByServiceType(
    serviceType: string, 
    page: number = 1, 
    limit: number = 10
  ) {
    const offset = (page - 1) * limit;
    
    const countResult = await this.query(
      'SELECT COUNT(*) FROM service_providers WHERE $1 = ANY(services_offered)',
      [serviceType]
    );
    const total = parseInt(countResult.rows[0].count);

    const result = await this.query(
      `SELECT sp.*, u.first_name, u.last_name, u.email, u.phone 
       FROM service_providers sp 
       JOIN users u ON sp.user_id = u.id 
       WHERE $1 = ANY(sp.services_offered) 
       ORDER BY sp.rating DESC, sp.total_reviews DESC 
       LIMIT $2 OFFSET $3`,
      [serviceType, limit, offset]
    );

    return {
      data: result.rows,
      total,
    };
  }

  /**
   * Find service providers by location
   */
  async findByLocation(
    location: string, 
    page: number = 1, 
    limit: number = 10
  ) {
    const offset = (page - 1) * limit;
    
    const countResult = await this.query(
      'SELECT COUNT(*) FROM service_providers WHERE $1 = ANY(service_areas)',
      [location]
    );
    const total = parseInt(countResult.rows[0].count);

    const result = await this.query(
      `SELECT sp.*, u.first_name, u.last_name, u.email, u.phone 
       FROM service_providers sp 
       JOIN users u ON sp.user_id = u.id 
       WHERE $1 = ANY(sp.service_areas) 
       ORDER BY sp.rating DESC, sp.total_reviews DESC 
       LIMIT $2 OFFSET $3`,
      [location, limit, offset]
    );

    return {
      data: result.rows,
      total,
    };
  }

  /**
   * Update verification status
   */
  async updateVerificationStatus(
    id: string, 
    status: 'pending' | 'verified' | 'rejected'
  ): Promise<ServiceProvider | null> {
    const result = await this.query(
      'UPDATE service_providers SET verification_status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, id]
    );
    return result.rows[0] || null;
  }

  /**
   * Update rating
   */
  async updateRating(id: string, rating: number, totalReviews: number): Promise<ServiceProvider | null> {
    const result = await this.query(
      'UPDATE service_providers SET rating = $1, total_reviews = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
      [rating, totalReviews, id]
    );
    return result.rows[0] || null;
  }

  /**
   * Search service providers
   */
  async search(
    searchTerm: string, 
    serviceType?: string, 
    location?: string,
    page: number = 1, 
    limit: number = 10
  ) {
    const offset = (page - 1) * limit;
    const searchPattern = `%${searchTerm}%`;
    
    let whereClause = 'sp.business_name ILIKE $1 OR u.first_name ILIKE $1 OR u.last_name ILIKE $1';
    const params: any[] = [searchPattern];
    let paramIndex = 2;

    if (serviceType) {
      whereClause += ` AND $${paramIndex} = ANY(sp.services_offered)`;
      params.push(serviceType);
      paramIndex++;
    }

    if (location) {
      whereClause += ` AND $${paramIndex} = ANY(sp.service_areas)`;
      params.push(location);
      paramIndex++;
    }

    const countResult = await this.query(
      `SELECT COUNT(*) FROM service_providers sp 
       JOIN users u ON sp.user_id = u.id 
       WHERE ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].count);

    const result = await this.query(
      `SELECT sp.*, u.first_name, u.last_name, u.email, u.phone 
       FROM service_providers sp 
       JOIN users u ON sp.user_id = u.id 
       WHERE ${whereClause}
       ORDER BY sp.rating DESC, sp.total_reviews DESC 
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...params, limit, offset]
    );

    return {
      data: result.rows,
      total,
    };
  }
}
