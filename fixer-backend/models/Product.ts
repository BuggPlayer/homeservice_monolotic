import { Pool } from 'pg';
import { Product } from '@/types';
import pool from '@/config/database';

export class ProductModel {
  private pool: Pool;

  constructor() {
    this.pool = pool;
  }

  /**
   * Create a new product
   */
  async create(productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
    const query = `
      INSERT INTO products (
        provider_id, category_id, name, description, price, original_price, 
        sku, stock_quantity, images, specifications, is_active, is_featured, 
        weight, dimensions, tags
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *
    `;

    const values = [
      productData.provider_id,
      productData.category_id,
      productData.name,
      productData.description,
      productData.price,
      productData.original_price || null,
      productData.sku,
      productData.stock_quantity,
      productData.images,
      productData.specifications ? JSON.stringify(productData.specifications) : null,
      productData.is_active,
      productData.is_featured,
      productData.weight || null,
      productData.dimensions ? JSON.stringify(productData.dimensions) : null,
      productData.tags,
    ];

    const result = await this.pool.query(query, values);
    const product = result.rows[0];
    
    // Parse JSON fields
    if (product.specifications) {
      product.specifications = JSON.parse(product.specifications);
    }
    if (product.dimensions) {
      product.dimensions = JSON.parse(product.dimensions);
    }
    
    return product;
  }

  /**
   * Find product by ID
   */
  async findById(id: string): Promise<Product | null> {
    const query = 'SELECT * FROM products WHERE id = $1';
    const result = await this.pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return null;
    }

    const product = result.rows[0];
    // Parse JSON fields
    if (product.specifications) {
      product.specifications = JSON.parse(product.specifications);
    }
    if (product.dimensions) {
      product.dimensions = JSON.parse(product.dimensions);
    }
    
    return product;
  }

  /**
   * Get products with filters and pagination
   */
  async findMany(filters: {
    provider_id?: string;
    category_id?: string;
    is_active?: boolean;
    is_featured?: boolean;
    min_price?: number;
    max_price?: number;
    search?: string;
    tags?: string[];
    page?: number;
    limit?: number;
  }): Promise<{ products: Product[]; total: number }> {
    const {
      provider_id,
      category_id,
      is_active,
      is_featured,
      min_price,
      max_price,
      search,
      tags,
      page = 1,
      limit = 10,
    } = filters;

    const offset = (page - 1) * limit;
    let whereConditions = [];
    let queryParams = [];
    let paramCount = 0;

    if (provider_id) {
      paramCount++;
      whereConditions.push(`provider_id = $${paramCount}`);
      queryParams.push(provider_id);
    }

    if (category_id) {
      paramCount++;
      whereConditions.push(`category_id = $${paramCount}`);
      queryParams.push(category_id);
    }

    if (is_active !== undefined) {
      paramCount++;
      whereConditions.push(`is_active = $${paramCount}`);
      queryParams.push(is_active);
    }

    if (is_featured !== undefined) {
      paramCount++;
      whereConditions.push(`is_featured = $${paramCount}`);
      queryParams.push(is_featured);
    }

    if (min_price !== undefined) {
      paramCount++;
      whereConditions.push(`price >= $${paramCount}`);
      queryParams.push(min_price);
    }

    if (max_price !== undefined) {
      paramCount++;
      whereConditions.push(`price <= $${paramCount}`);
      queryParams.push(max_price);
    }

    if (search) {
      paramCount++;
      whereConditions.push(`(name ILIKE $${paramCount} OR description ILIKE $${paramCount})`);
      queryParams.push(`%${search}%`);
    }

    if (tags && tags.length > 0) {
      paramCount++;
      whereConditions.push(`tags && $${paramCount}`);
      queryParams.push(tags);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Count query
    const countQuery = `SELECT COUNT(*) FROM products ${whereClause}`;
    const countResult = await this.pool.query(countQuery, queryParams);
    const total = parseInt(countResult.rows[0].count);

    // Data query
    paramCount++;
    const dataQuery = `
      SELECT * FROM products 
      ${whereClause}
      ORDER BY created_at DESC 
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;
    queryParams.push(limit, offset);

    const result = await this.pool.query(dataQuery, queryParams);
    
    // Parse JSON fields for each product
    const products = result.rows.map(product => {
      if (product.specifications) {
        product.specifications = JSON.parse(product.specifications);
      }
      if (product.dimensions) {
        product.dimensions = JSON.parse(product.dimensions);
      }
      return product;
    });

    return { products, total };
  }

  /**
   * Update product
   */
  async update(id: string, updates: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>>): Promise<Product | null> {
    const fields = Object.keys(updates).filter(key => updates[key as keyof typeof updates] !== undefined);
    
    if (fields.length === 0) {
      return this.findById(id);
    }

    const setClause = fields.map((field, index) => {
      if (field === 'specifications' || field === 'dimensions') {
        return `${field} = $${index + 2}::jsonb`;
      }
      return `${field} = $${index + 2}`;
    }).join(', ');

    const query = `UPDATE products SET ${setClause} WHERE id = $1 RETURNING *`;
    
    const values = [id, ...fields.map(field => {
      const value = updates[field as keyof typeof updates];
      if (field === 'specifications' || field === 'dimensions') {
        return JSON.stringify(value);
      }
      return value;
    })];
    
    const result = await this.pool.query(query, values);
    
    if (result.rows.length === 0) {
      return null;
    }

    const product = result.rows[0];
    // Parse JSON fields
    if (product.specifications) {
      product.specifications = JSON.parse(product.specifications);
    }
    if (product.dimensions) {
      product.dimensions = JSON.parse(product.dimensions);
    }
    
    return product;
  }

  /**
   * Delete product
   */
  async delete(id: string): Promise<boolean> {
    const query = 'DELETE FROM products WHERE id = $1';
    const result = await this.pool.query(query, [id]);
    return result.rowCount > 0;
  }

  /**
   * Update stock quantity
   */
  async updateStock(id: string, quantity: number): Promise<Product | null> {
    const query = 'UPDATE products SET stock_quantity = $1 WHERE id = $2 RETURNING *';
    const result = await this.pool.query(query, [quantity, id]);
    
    if (result.rows.length === 0) {
      return null;
    }

    const product = result.rows[0];
    // Parse JSON fields
    if (product.specifications) {
      product.specifications = JSON.parse(product.specifications);
    }
    if (product.dimensions) {
      product.dimensions = JSON.parse(product.dimensions);
    }
    
    return product;
  }

  /**
   * Get products by provider
   */
  async findByProvider(providerId: string, page: number = 1, limit: number = 10): Promise<{ products: Product[]; total: number }> {
    return this.findMany({ provider_id: providerId, page, limit });
  }

  /**
   * Get featured products
   */
  async findFeatured(limit: number = 10): Promise<Product[]> {
    const { products } = await this.findMany({ is_featured: true, is_active: true, limit });
    return products;
  }

  /**
   * Search products
   */
  async search(searchTerm: string, page: number = 1, limit: number = 10): Promise<{ products: Product[]; total: number }> {
    return this.findMany({ search: searchTerm, page, limit });
  }

  /**
   * Get products by category
   */
  async findByCategory(categoryId: string, page: number = 1, limit: number = 10): Promise<{ products: Product[]; total: number }> {
    return this.findMany({ category_id: categoryId, is_active: true, page, limit });
  }

  /**
   * Get product with provider details
   */
  async findByIdWithDetails(id: string): Promise<any | null> {
    const query = `
      SELECT 
        p.*,
        sp.business_name as provider_name,
        sp.rating as provider_rating,
        c.name as category_name
      FROM products p
      JOIN service_providers sp ON p.provider_id = sp.id
      JOIN categories c ON p.category_id = c.id
      WHERE p.id = $1
    `;
    
    const result = await this.pool.query(query, [id]);
    if (result.rows.length === 0) {
      return null;
    }

    const product = result.rows[0];
    // Parse JSON fields
    if (product.specifications) {
      product.specifications = JSON.parse(product.specifications);
    }
    if (product.dimensions) {
      product.dimensions = JSON.parse(product.dimensions);
    }
    
    return product;
  }

  /**
   * Check if SKU exists
   */
  async skuExists(sku: string, excludeId?: string): Promise<boolean> {
    let query = 'SELECT id FROM products WHERE sku = $1';
    let params = [sku];
    
    if (excludeId) {
      query += ' AND id != $2';
      params.push(excludeId);
    }
    
    const result = await this.pool.query(query, params);
    return result.rows.length > 0;
  }
}
