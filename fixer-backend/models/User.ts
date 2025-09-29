import { Pool } from 'pg';
import { User } from '@/types';
import pool from '@/config/database';

export class UserModel {
  private pool: Pool;

  constructor() {
    this.pool = pool;
  }

  /**
   * Create a new user
   */
  async create(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
    const query = `
      INSERT INTO users (email, phone, password_hash, user_type, first_name, last_name, profile_picture, is_verified)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;

    const values = [
      userData.email,
      userData.phone,
      userData.password_hash,
      userData.user_type,
      userData.first_name,
      userData.last_name,
      userData.profile_picture || null,
      userData.is_verified || false,
    ];

    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await this.pool.query(query, [email]);
    return result.rows[0] || null;
  }

  /**
   * Find user by phone
   */
  async findByPhone(phone: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE phone = $1';
    const result = await this.pool.query(query, [phone]);
    return result.rows[0] || null;
  }

  /**
   * Find user by ID
   */
  async findById(id: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await this.pool.query(query, [id]);
    return result.rows[0] || null;
  }

  /**
   * Update user
   */
  async update(id: string, updates: Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>): Promise<User | null> {
    const fields = Object.keys(updates).filter(key => updates[key as keyof typeof updates] !== undefined);
    
    if (fields.length === 0) {
      return this.findById(id);
    }

    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
    const query = `UPDATE users SET ${setClause} WHERE id = $1 RETURNING *`;
    
    const values = [id, ...fields.map(field => updates[field as keyof typeof updates])];
    
    const result = await this.pool.query(query, values);
    return result.rows[0] || null;
  }

  /**
   * Delete user
   */
  async delete(id: string): Promise<boolean> {
    const query = 'DELETE FROM users WHERE id = $1';
    const result = await this.pool.query(query, [id]);
    return result.rowCount > 0;
  }

  /**
   * Verify user email/phone
   */
  async verifyUser(id: string): Promise<User | null> {
    const query = 'UPDATE users SET is_verified = true WHERE id = $1 RETURNING *';
    const result = await this.pool.query(query, [id]);
    return result.rows[0] || null;
  }

  /**
   * Get users by type with pagination
   */
  async findByType(
    userType: string, 
    page: number = 1, 
    limit: number = 10
  ): Promise<{ users: User[]; total: number }> {
    const offset = (page - 1) * limit;
    
    const countQuery = 'SELECT COUNT(*) FROM users WHERE user_type = $1';
    const countResult = await this.pool.query(countQuery, [userType]);
    const total = parseInt(countResult.rows[0].count);

    const query = `
      SELECT * FROM users 
      WHERE user_type = $1 
      ORDER BY created_at DESC 
      LIMIT $2 OFFSET $3
    `;
    
    const result = await this.pool.query(query, [userType, limit, offset]);
    return { users: result.rows, total };
  }

  /**
   * Check if email exists
   */
  async emailExists(email: string): Promise<boolean> {
    const query = 'SELECT id FROM users WHERE email = $1';
    const result = await this.pool.query(query, [email]);
    return result.rows.length > 0;
  }

  /**
   * Check if phone exists
   */
  async phoneExists(phone: string): Promise<boolean> {
    const query = 'SELECT id FROM users WHERE phone = $1';
    const result = await this.pool.query(query, [phone]);
    return result.rows.length > 0;
  }
}
