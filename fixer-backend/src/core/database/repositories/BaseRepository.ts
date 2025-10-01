import { pool } from '@/config';
import { QueryResult } from 'pg';

export abstract class BaseRepository<T> {
  protected tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  /**
   * Execute a query with parameters
   */
  protected async query(text: string, params?: any[]): Promise<QueryResult<T>> {
    const client = await pool.connect();
    try {
      const result = await client.query(text, params);
      return result;
    } finally {
      client.release();
    }
  }

  /**
   * Find a record by ID
   */
  async findById(id: string): Promise<T | null> {
    const result = await this.query(
      `SELECT * FROM ${this.tableName} WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  /**
   * Find all records with pagination
   */
  async findAll(
    page: number = 1,
    limit: number = 10,
    orderBy: string = 'created_at',
    orderDirection: 'ASC' | 'DESC' = 'DESC'
  ): Promise<{ data: T[]; total: number }> {
    const offset = (page - 1) * limit;
    
    const countResult = await this.query(`SELECT COUNT(*) FROM ${this.tableName}`);
    const total = parseInt(countResult.rows[0].count);

    const result = await this.query(
      `SELECT * FROM ${this.tableName} ORDER BY ${orderBy} ${orderDirection} LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    return {
      data: result.rows,
      total,
    };
  }

  /**
   * Create a new record
   */
  async create(data: Partial<T>): Promise<T> {
    const columns = Object.keys(data).join(', ');
    const values = Object.values(data);
    const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');

    const result = await this.query(
      `INSERT INTO ${this.tableName} (${columns}) VALUES (${placeholders}) RETURNING *`,
      values
    );

    return result.rows[0];
  }

  /**
   * Update a record by ID
   */
  async update(id: string, data: Partial<T>): Promise<T | null> {
    const columns = Object.keys(data);
    const values = Object.values(data);
    const setClause = columns.map((col, index) => `${col} = $${index + 2}`).join(', ');

    const result = await this.query(
      `UPDATE ${this.tableName} SET ${setClause} WHERE id = $1 RETURNING *`,
      [id, ...values]
    );

    return result.rows[0] || null;
  }

  /**
   * Delete a record by ID
   */
  async delete(id: string): Promise<boolean> {
    const result = await this.query(
      `DELETE FROM ${this.tableName} WHERE id = $1`,
      [id]
    );

    return result.rowCount > 0;
  }

  /**
   * Soft delete a record by ID (if table has deleted_at column)
   */
  async softDelete(id: string): Promise<boolean> {
    try {
      const result = await this.query(
        `UPDATE ${this.tableName} SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1`,
        [id]
      );

      return result.rowCount > 0;
    } catch (error) {
      // If deleted_at column doesn't exist, fall back to hard delete
      return this.delete(id);
    }
  }

  /**
   * Check if a record exists
   */
  async exists(id: string): Promise<boolean> {
    const result = await this.query(
      `SELECT 1 FROM ${this.tableName} WHERE id = $1`,
      [id]
    );

    return result.rows.length > 0;
  }

  /**
   * Count total records
   */
  async count(whereClause?: string, params?: any[]): Promise<number> {
    const where = whereClause ? `WHERE ${whereClause}` : '';
    const result = await this.query(
      `SELECT COUNT(*) FROM ${this.tableName} ${where}`,
      params
    );

    return parseInt(result.rows[0].count);
  }
}
