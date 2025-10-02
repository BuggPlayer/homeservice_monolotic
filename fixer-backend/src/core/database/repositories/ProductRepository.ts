import { BaseRepository } from './BaseRepository';
import { Product } from '../../../types';

export class ProductRepository extends BaseRepository<Product> {
  constructor() {
    super('products');
  }

  /**
   * Find products by category
   */
  async findByCategory(categoryId: string): Promise<Product[]> {
    return this.find('category_id = $1', [categoryId]);
  }

  /**
   * Find products by provider
   */
  async findByProvider(providerId: string): Promise<Product[]> {
    return this.find('provider_id = $1', [providerId]);
  }

  /**
   * Find products by status
   */
  async findByStatus(status: string): Promise<Product[]> {
    return this.find('status = $1', [status]);
  }

  /**
   * Search products by name or description
   */
  async search(searchTerm: string): Promise<Product[]> {
    return this.find(
      'LOWER(name) LIKE LOWER($1) OR LOWER(description) LIKE LOWER($1)',
      [`%${searchTerm}%`]
    );
  }

  /**
   * Find products with low stock
   */
  async findLowStock(threshold: number = 10): Promise<Product[]> {
    return this.find('stock_quantity <= $1', [threshold]);
  }

  /**
   * Update product stock
   */
  async updateStock(productId: string, quantity: number): Promise<Product | null> {
    const result = await this.executeQuery(
      'UPDATE products SET stock_quantity = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [quantity, productId]
    );

    return result.rows[0] || null;
  }

  /**
   * Find product by SKU
   */
  async findBySku(sku: string): Promise<Product | null> {
    const result = await this.find('sku = $1', [sku]);
    return result[0] || null;
  }

  /**
   * Find featured products
   */
  async findFeatured(): Promise<Product[]> {
    return this.find('is_featured = $1', [true]);
  }

  /**
   * Get product statistics
   */
  async getProductStats() {
    const totalProducts = await this.count();
    const activeProducts = await this.count('status = $1', ['active']);
    const lowStockProducts = await this.count('stock_quantity <= $1', [10]);
    const outOfStockProducts = await this.count('stock_quantity = $1', [0]);

    return {
      totalProducts,
      activeProducts,
      lowStockProducts,
      outOfStockProducts,
    };
  }

  /**
   * Get provider statistics
   */
  async getProviderStats(providerId: string) {
    const totalProducts = await this.count('provider_id = $1', [providerId]);
    const activeProducts = await this.count('provider_id = $1 AND status = $2', [providerId, 'active']);
    const lowStockProducts = await this.count('provider_id = $1 AND stock_quantity <= $2', [providerId, 10]);

    return {
      totalProducts,
      activeProducts,
      lowStockProducts,
    };
  }
}
