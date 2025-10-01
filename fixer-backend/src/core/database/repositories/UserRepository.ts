import { BaseRepository } from './BaseRepository';
import { User } from '@/types';

export class UserRepository extends BaseRepository<User> {
  constructor() {
    super('users');
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    const result = await this.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0] || null;
  }

  /**
   * Find user by phone
   */
  async findByPhone(phone: string): Promise<User | null> {
    const result = await this.query(
      'SELECT * FROM users WHERE phone = $1',
      [phone]
    );
    return result.rows[0] || null;
  }

  /**
   * Find users by type
   */
  async findByUserType(userType: string, page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;
    
    const countResult = await this.query(
      'SELECT COUNT(*) FROM users WHERE user_type = $1',
      [userType]
    );
    const total = parseInt(countResult.rows[0].count);

    const result = await this.query(
      'SELECT * FROM users WHERE user_type = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
      [userType, limit, offset]
    );

    return {
      data: result.rows,
      total,
    };
  }

  /**
   * Update user verification status
   */
  async updateVerificationStatus(id: string, isVerified: boolean): Promise<User | null> {
    const result = await this.query(
      'UPDATE users SET is_verified = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [isVerified, id]
    );
    return result.rows[0] || null;
  }

  /**
   * Update user password
   */
  async updatePassword(id: string, passwordHash: string): Promise<User | null> {
    const result = await this.query(
      'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [passwordHash, id]
    );
    return result.rows[0] || null;
  }

  /**
   * Search users
   */
  async search(searchTerm: string, page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;
    const searchPattern = `%${searchTerm}%`;
    
    const countResult = await this.query(
      `SELECT COUNT(*) FROM users 
       WHERE first_name ILIKE $1 OR last_name ILIKE $1 OR email ILIKE $1`,
      [searchPattern]
    );
    const total = parseInt(countResult.rows[0].count);

    const result = await this.query(
      `SELECT * FROM users 
       WHERE first_name ILIKE $1 OR last_name ILIKE $1 OR email ILIKE $1
       ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
      [searchPattern, limit, offset]
    );

    return {
      data: result.rows,
      total,
    };
  }
}
