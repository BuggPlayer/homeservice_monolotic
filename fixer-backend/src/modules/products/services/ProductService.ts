import { ProductRepository, CategoryRepository } from '../../../core/database/repositories';
import { Product, Category } from '../../../types';
import { 
  CreateProductRequest, 
  UpdateProductRequest, 
  GetProductsRequest, 
  GetProductsResponse, 
  GetProductResponse, 
  CreateProductResponse, 
  UpdateProductResponse, 
  UpdateStockRequest, 
  UpdateStockResponse,
  GetProductStatsResponse,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  GetCategoriesRequest,
  GetCategoriesResponse,
  GetCategoryResponse,
  CreateCategoryResponse,
  UpdateCategoryResponse,
  UpdateSortOrderRequest,
  UpdateSortOrderResponse,
  GetCategoryTreeResponse,
  GetCategoryWithCountsResponse
} from '../types';

export class ProductService {
  private productRepository: ProductRepository;
  private categoryRepository: CategoryRepository;

  constructor() {
    this.productRepository = new ProductRepository();
    this.categoryRepository = new CategoryRepository();
  }

  /**
   * Create a new product
   */
  async createProduct(
    providerId: string, 
    data: CreateProductRequest
  ): Promise<CreateProductResponse> {
    // Check if SKU already exists
    const existingProduct = await this.productRepository.findBySku(data.sku);
    if (existingProduct) {
      throw new Error('Product with this SKU already exists');
    }

    const productData = {
      provider_id: providerId,
      category_id: data.category_id,
      name: data.name,
      description: data.description,
      price: data.price,
      original_price: data.original_price,
      sku: data.sku,
      stock_quantity: data.stock_quantity,
      images: data.images || [],
      specifications: data.specifications,
      is_active: data.is_active ?? true,
      is_featured: data.is_featured ?? false,
      weight: data.weight,
      dimensions: data.dimensions,
      tags: data.tags || [],
    };

    const product = await this.productRepository.create(productData);

    return {
      product,
      message: 'Product created successfully',
    };
  }

  /**
   * Create a draft product
   */
  async createProductDraft(
    providerId: string, 
    data: CreateProductRequest
  ): Promise<CreateProductResponse> {
    // For drafts, we allow partial data and set is_active to false
    const productData = {
      provider_id: providerId,
      category_id: data.category_id,
      name: data.name || 'Draft Product', // Default name for drafts
      description: data.description || '', // Allow empty description for drafts
      price: data.price || 0, // Allow 0 price for drafts
      original_price: data.original_price,
      sku: data.sku || `DRAFT-${Date.now()}`, // Generate unique SKU for drafts
      stock_quantity: data.stock_quantity || 0,
      images: data.images || [],
      specifications: data.specifications,
      is_active: false, // Drafts are inactive by default
      is_featured: false, // Drafts are never featured
      weight: data.weight,
      dimensions: data.dimensions,
      tags: data.tags || [],
    };

    const product = await this.productRepository.create(productData);

    return {
      product,
      message: 'Product draft saved successfully',
    };
  }

  /**
   * Get products with filtering and pagination
   */
  async getProducts(params: GetProductsRequest): Promise<GetProductsResponse> {
    const { 
      page = 1, 
      limit = 10, 
      category_id, 
      provider_id, 
      is_active, 
      is_featured, 
      min_price, 
      max_price, 
      search, 
      tags, 
      sort_by = 'created_at', 
      sort_order = 'desc' 
    } = params;

    let result;
    
    if (search) {
      const products = await this.productRepository.search(search);
      result = { data: products, total: products.length };
    } else if (category_id) {
      const products = await this.productRepository.findByCategory(category_id);
      result = { data: products, total: products.length };
    } else if (provider_id) {
      const products = await this.productRepository.findByProvider(provider_id);
      result = { data: products, total: products.length };
    } else if (is_featured) {
      const products = await this.productRepository.findFeatured();
      result = { data: products, total: products.length };
    } else {
      result = await this.productRepository.findAll(page, limit, sort_by, sort_order.toUpperCase() as 'ASC' | 'DESC');
    }

    const totalPages = Math.ceil(result.total / limit);

    return {
      products: result.data,
      pagination: {
        page,
        limit,
        total: result.total,
        totalPages,
      },
    };
  }

  /**
   * Get product by ID
   */
  async getProductById(productId: string): Promise<GetProductResponse> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    return {
      product,
    };
  }

  /**
   * Update product
   */
  async updateProduct(
    productId: string, 
    data: UpdateProductRequest
  ): Promise<UpdateProductResponse> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    // Check if SKU is being updated and if it's already taken
    if (data.sku && data.sku !== product.sku) {
      const existingProduct = await this.productRepository.findBySku(data.sku);
      if (existingProduct) {
        throw new Error('Product with this SKU already exists');
      }
    }

    const updatedProduct = await this.productRepository.update(productId, data);
    if (!updatedProduct) {
      throw new Error('Failed to update product');
    }

    return {
      product: updatedProduct,
      message: 'Product updated successfully',
    };
  }

  /**
   * Update product stock
   */
  async updateStock(
    productId: string, 
    data: UpdateStockRequest
  ): Promise<UpdateStockResponse> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    const updatedProduct = await this.productRepository.updateStock(
      productId, 
      data.stock_quantity
    );
    if (!updatedProduct) {
      throw new Error('Failed to update product stock');
    }

    return {
      product: updatedProduct,
      message: 'Product stock updated successfully',
    };
  }

  /**
   * Delete product
   */
  async deleteProduct(productId: string): Promise<{ message: string }> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    const deleted = await this.productRepository.delete(productId);
    if (!deleted) {
      throw new Error('Failed to delete product');
    }

    return {
      message: 'Product deleted successfully',
    };
  }

  /**
   * Get products by provider
   */
  async getProductsByProvider(
    providerId: string, 
    page: number = 1, 
    limit: number = 10
  ) {
    const products = await this.productRepository.findByProvider(providerId);
    const totalPages = Math.ceil(products.length / limit);

    return {
      products: products.slice((page - 1) * limit, page * limit),
      pagination: {
        page,
        limit,
        total: products.length,
        totalPages,
      },
    };
  }

  /**
   * Get product statistics
   */
  async getProductStats(): Promise<GetProductStatsResponse> {
    const totalProducts = await this.productRepository.count();
    const activeProducts = await this.productRepository.count('status = $1', ['active']);
    const featuredProducts = await this.productRepository.count('is_featured = $1', [true]);
    const lowStockProducts = await this.productRepository.count('stock_quantity < 10 AND stock_quantity > 0', []);
    const outOfStockProducts = await this.productRepository.count('stock_quantity = 0', []);

    // Get value statistics
    const result = await this.productRepository.executeQuery(
      'SELECT SUM(price * stock_quantity) as total_value, AVG(price) as avg_price FROM products WHERE status = $1',
      ['active']
    );

    const totalValue = parseFloat((result.rows[0] as any).total_value) || 0;
    const averagePrice = parseFloat((result.rows[0] as any).avg_price) || 0;

    return {
      totalProducts,
      activeProducts,
      featuredProducts,
      lowStockProducts,
      outOfStockProducts,
      totalValue,
      averagePrice,
    };
  }

  /**
   * Get product statistics for provider
   */
  async getProviderProductStats(providerId: string) {
    return await this.productRepository.getProviderStats(providerId);
  }

  // Category methods
  /**
   * Create a new category
   */
  async createCategory(data: CreateCategoryRequest): Promise<CreateCategoryResponse> {
    // Check if category name already exists
    const existingCategory = await this.categoryRepository.findByName(data.name);
    if (existingCategory) {
      throw new Error('Category with this name already exists');
    }

    const categoryData = {
      name: data.name,
      description: data.description,
      parent_id: data.parent_id,
      image: data.image,
      is_active: data.is_active ?? true,
      sort_order: data.sort_order ?? 0,
    };

    const category = await this.categoryRepository.create(categoryData);

    return {
      category,
      message: 'Category created successfully',
    };
  }

  /**
   * Get categories with filtering and pagination
   */
  async getCategories(params: GetCategoriesRequest): Promise<GetCategoriesResponse> {
    const { page = 1, limit = 10, parent_id, is_active, search } = params;

    let result;
    
    if (search) {
      const categories = await this.categoryRepository.search(search);
      result = { data: categories, total: categories.length };
    } else if (parent_id) {
      const categories = await this.categoryRepository.findByParentId(parent_id);
      result = { data: categories, total: categories.length };
    } else if (is_active !== undefined) {
      const categories = await this.categoryRepository.findByStatus(is_active ? 'active' : 'inactive');
      result = { data: categories, total: categories.length };
    } else {
      result = await this.categoryRepository.findAll(page, limit);
    }

    const totalPages = Math.ceil(result.total / limit);

    return {
      categories: result.data,
      pagination: {
        page,
        limit,
        total: result.total,
        totalPages,
      },
    };
  }

  /**
   * Get category by ID
   */
  async getCategoryById(categoryId: string): Promise<GetCategoryResponse> {
    const category = await this.categoryRepository.findById(categoryId);
    if (!category) {
      throw new Error('Category not found');
    }

    return {
      category,
    };
  }

  /**
   * Update category
   */
  async updateCategory(
    categoryId: string, 
    data: UpdateCategoryRequest
  ): Promise<UpdateCategoryResponse> {
    const category = await this.categoryRepository.findById(categoryId);
    if (!category) {
      throw new Error('Category not found');
    }

    // Check if category name is being updated and if it's already taken
    if (data.name && data.name !== category.name) {
      const existingCategory = await this.categoryRepository.findByName(data.name);
      if (existingCategory) {
        throw new Error('Category with this name already exists');
      }
    }

    const updatedCategory = await this.categoryRepository.update(categoryId, data);
    if (!updatedCategory) {
      throw new Error('Failed to update category');
    }

    return {
      category: updatedCategory,
      message: 'Category updated successfully',
    };
  }

  /**
   * Update category sort order
   */
  async updateSortOrder(
    categoryId: string, 
    data: UpdateSortOrderRequest
  ): Promise<UpdateSortOrderResponse> {
    const category = await this.categoryRepository.findById(categoryId);
    if (!category) {
      throw new Error('Category not found');
    }

    const updatedCategory = await this.categoryRepository.updateSortOrder(
      categoryId, 
      data.sort_order
    );
    if (!updatedCategory) {
      throw new Error('Failed to update category sort order');
    }

    return {
      category: updatedCategory,
      message: 'Category sort order updated successfully',
    };
  }

  /**
   * Delete category
   */
  async deleteCategory(categoryId: string): Promise<{ message: string }> {
    const category = await this.categoryRepository.findById(categoryId);
    if (!category) {
      throw new Error('Category not found');
    }

    // Check if category has products
    const productCount = await this.productRepository.count('category_id = $1', [categoryId]);
    if (productCount > 0) {
      throw new Error('Cannot delete category with products');
    }

    // Check if category has subcategories
    const subcategoryCount = await this.categoryRepository.count('parent_id = $1', [categoryId]);
    if (subcategoryCount > 0) {
      throw new Error('Cannot delete category with subcategories');
    }

    const deleted = await this.categoryRepository.delete(categoryId);
    if (!deleted) {
      throw new Error('Failed to delete category');
    }

    return {
      message: 'Category deleted successfully',
    };
  }

  /**
   * Get category tree
   */
  async getCategoryTree(): Promise<GetCategoryTreeResponse> {
    const categories = await this.categoryRepository.getCategoryTree();
    return { categories };
  }

  /**
   * Get categories with product counts
   */
  async getCategoriesWithCounts(): Promise<GetCategoryWithCountsResponse> {
    const categories = await this.categoryRepository.getCategoriesWithCounts();
    return { categories };
  }

  /**
   * Get subcategories
   */
  async getSubcategories(categoryId: string) {
    const categories = await this.categoryRepository.findByParentId(categoryId);
    return { categories };
  }
}
