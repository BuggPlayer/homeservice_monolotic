import { BaseRepository } from './BaseRepository';
import { Category } from '../../../types';

export class CategoryRepository extends BaseRepository<Category> {
  constructor() {
    super('categories');
  }

  /**
   * Find categories by parent
   */
  async findByParent(parentId: string | null): Promise<Category[]> {
    if (parentId === null) {
      return this.find('parent_id IS NULL');
    }
    return this.find('parent_id = $1', [parentId]);
  }

  /**
   * Find root categories (no parent)
   */
  async findRootCategories(): Promise<Category[]> {
    return this.find('parent_id IS NULL');
  }

  /**
   * Find subcategories of a category
   */
  async findSubcategories(parentId: string): Promise<Category[]> {
    return this.find('parent_id = $1', [parentId]);
  }

  /**
   * Find categories by status
   */
  async findByStatus(status: string): Promise<Category[]> {
    return this.find('status = $1', [status]);
  }

  /**
   * Search categories by name or description
   */
  async search(searchTerm: string): Promise<Category[]> {
    return this.find(
      'LOWER(name) LIKE LOWER($1) OR LOWER(description) LIKE LOWER($1)',
      [`%${searchTerm}%`]
    );
  }

  /**
   * Get category hierarchy
   */
  async getCategoryHierarchy(): Promise<Category[]> {
    const result = await this.executeQuery(`
      WITH RECURSIVE category_tree AS (
        SELECT id, name, description, parent_id, status, created_at, updated_at, 0 as level
        FROM categories
        WHERE parent_id IS NULL
        
        UNION ALL
        
        SELECT c.id, c.name, c.description, c.parent_id, c.status, c.created_at, c.updated_at, ct.level + 1
        FROM categories c
        INNER JOIN category_tree ct ON c.parent_id = ct.id
      )
      SELECT * FROM category_tree ORDER BY level, name
    `);

    return result.rows;
  }

  /**
   * Find category by name
   */
  async findByName(name: string): Promise<Category | null> {
    const result = await this.find('LOWER(name) = LOWER($1)', [name]);
    return result[0] || null;
  }

  /**
   * Find categories by parent ID
   */
  async findByParentId(parentId: string): Promise<Category[]> {
    return this.find('parent_id = $1', [parentId]);
  }

  /**
   * Find active categories
   */
  async findByActiveStatus(): Promise<Category[]> {
    return this.find('status = $1', ['active']);
  }

  /**
   * Update category sort order
   */
  async updateSortOrder(categoryId: string, sortOrder: number): Promise<Category | null> {
    const result = await this.executeQuery(
      'UPDATE categories SET sort_order = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [sortOrder, categoryId]
    );
    return result.rows[0] || null;
  }

  /**
   * Get category tree
   */
  async getCategoryTree(): Promise<Category[]> {
    return this.getCategoryHierarchy();
  }

  /**
   * Get categories with product counts
   */
  async getCategoriesWithCounts(): Promise<any[]> {
    const result = await this.executeQuery(`
      SELECT c.*, COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id
      GROUP BY c.id
      ORDER BY c.name
    `);
    return result.rows;
  }

  /**
   * Get category statistics
   */
  async getCategoryStats() {
    const totalCategories = await this.count();
    const activeCategories = await this.count('status = $1', ['active']);
    const rootCategories = await this.count('parent_id IS NULL');

    return {
      totalCategories,
      activeCategories,
      rootCategories,
    };
  }
}
