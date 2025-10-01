import { Pool } from 'pg';
import { Category } from '@/types';
import pool from '@/config/database';

export class CategoryModel {
  private pool: Pool;

  constructor() {
    this.pool = pool;
  }

  /**
   * Create a new category
   */
  async create(categoryData: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category> {
    const query = `
      INSERT INTO categories (name, description, parent_id, image, is_active, sort_order)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    const values = [
      categoryData.name,
      categoryData.description || null,
      categoryData.parent_id || null,
      categoryData.image || null,
      categoryData.is_active,
      categoryData.sort_order || 0,
    ];

    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Find category by ID
   */
  async findById(id: string): Promise<Category | null> {
    const query = 'SELECT * FROM categories WHERE id = $1';
    const result = await this.pool.query(query, [id]);
    return result.rows[0] || null;
  }

  /**
   * Get all categories with optional filters
   */
  async findMany(filters: {
    parent_id?: string | null;
    is_active?: boolean;
    page?: number;
    limit?: number;
  } = {}): Promise<{ categories: Category[]; total: number }> {
    const {
      parent_id,
      is_active,
      page = 1,
      limit = 100,
    } = filters;

    const offset = (page - 1) * limit;
    let whereConditions = [];
    let queryParams = [];
    let paramCount = 0;

    if (parent_id !== undefined) {
      paramCount++;
      if (parent_id === null) {
        whereConditions.push(`parent_id IS NULL`);
      } else {
        whereConditions.push(`parent_id = $${paramCount}`);
        queryParams.push(parent_id);
      }
    }

    if (is_active !== undefined) {
      paramCount++;
      whereConditions.push(`is_active = $${paramCount}`);
      queryParams.push(is_active);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Count query
    const countQuery = `SELECT COUNT(*) FROM categories ${whereClause}`;
    const countResult = await this.pool.query(countQuery, queryParams);
    const total = parseInt(countResult.rows[0].count);

    // Data query
    paramCount++;
    const dataQuery = `
      SELECT * FROM categories 
      ${whereClause}
      ORDER BY sort_order ASC, name ASC 
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;
    queryParams.push(limit, offset);

    const result = await this.pool.query(dataQuery, queryParams);
    return { categories: result.rows, total };
  }

  /**
   * Update category
   */
  async update(id: string, updates: Partial<Omit<Category, 'id' | 'created_at' | 'updated_at'>>): Promise<Category | null> {
    const fields = Object.keys(updates).filter(key => updates[key as keyof typeof updates] !== undefined);
    
    if (fields.length === 0) {
      return this.findById(id);
    }

    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
    const query = `UPDATE categories SET ${setClause} WHERE id = $1 RETURNING *`;
    
    const values = [id, ...fields.map(field => updates[field as keyof typeof updates])];
    
    const result = await this.pool.query(query, values);
    return result.rows[0] || null;
  }

  /**
   * Delete category
   */
  async delete(id: string): Promise<boolean> {
    // Check if category has subcategories
    const subcategories = await this.pool.query('SELECT id FROM categories WHERE parent_id = $1', [id]);
    if (subcategories.rows.length > 0) {
      throw new Error('Cannot delete category with subcategories');
    }

    // Check if category has products
    const products = await this.pool.query('SELECT id FROM products WHERE category_id = $1', [id]);
    if (products.rows.length > 0) {
      throw new Error('Cannot delete category with products');
    }

    const query = 'DELETE FROM categories WHERE id = $1';
    const result = await this.pool.query(query, [id]);
    return result.rowCount > 0;
  }

  /**
   * Get category tree (hierarchical structure)
   */
  async getCategoryTree(): Promise<Category[]> {
    const query = `
      WITH RECURSIVE category_tree AS (
        SELECT id, name, description, parent_id, image, is_active, sort_order, created_at, updated_at, 0 as level
        FROM categories 
        WHERE parent_id IS NULL AND is_active = true
        
        UNION ALL
        
        SELECT c.id, c.name, c.description, c.parent_id, c.image, c.is_active, c.sort_order, c.created_at, c.updated_at, ct.level + 1
        FROM categories c
        INNER JOIN category_tree ct ON c.parent_id = ct.id
        WHERE c.is_active = true
      )
      SELECT * FROM category_tree ORDER BY level, sort_order, name
    `;
    
    const result = await this.pool.query(query);
    return result.rows;
  }

  /**
   * Get subcategories
   */
  async getSubcategories(parentId: string): Promise<Category[]> {
    const { categories } = await this.findMany({ parent_id: parentId, is_active: true });
    return categories;
  }

  /**
   * Get root categories (no parent)
   */
  async getRootCategories(): Promise<Category[]> {
    const { categories } = await this.findMany({ parent_id: null, is_active: true });
    return categories;
  }

  /**
   * Check if category name exists
   */
  async nameExists(name: string, excludeId?: string): Promise<boolean> {
    let query = 'SELECT id FROM categories WHERE name = $1';
    let params = [name];
    
    if (excludeId) {
      query += ' AND id != $2';
      params.push(excludeId);
    }
    
    const result = await this.pool.query(query, params);
    return result.rows.length > 0;
  }

  /**
   * Get category with product count
   */
  async findByIdWithProductCount(id: string): Promise<any | null> {
    const query = `
      SELECT 
        c.*,
        COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id AND p.is_active = true
      WHERE c.id = $1
      GROUP BY c.id
    `;
    
    const result = await this.pool.query(query, [id]);
    return result.rows[0] || null;
  }

  /**
   * Update sort order
   */
  async updateSortOrder(categoryId: string, sortOrder: number): Promise<Category | null> {
    return this.update(categoryId, { sort_order: sortOrder });
  }

  /**
   * Get categories with product counts
   */
  async getCategoriesWithProductCounts(): Promise<any[]> {
    const query = `
      SELECT 
        c.*,
        COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id AND p.is_active = true
      WHERE c.is_active = true
      GROUP BY c.id
      ORDER BY c.sort_order ASC, c.name ASC
    `;
    
    const result = await this.pool.query(query);
    return result.rows;
  }
}
