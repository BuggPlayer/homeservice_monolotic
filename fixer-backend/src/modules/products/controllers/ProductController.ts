import { Request, Response } from 'express';
import { ProductService } from '../services/ProductService';
import { ServiceProviderService } from '../../providers/services/ServiceProviderService';
import { ApiResponse } from '@/types';
import { 
  CreateProductRequest, 
  UpdateProductRequest, 
  GetProductsRequest, 
  UpdateStockRequest,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  GetCategoriesRequest,
  UpdateSortOrderRequest
} from '../types';

export class ProductController {
  private productService: ProductService;
  private serviceProviderService: ServiceProviderService;

  constructor() {
    this.productService = new ProductService();
    this.serviceProviderService = new ServiceProviderService();
  }

  /**
   * Create a new product
   */
  createProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.userId;
      
      // Get service provider ID from user ID
      const serviceProvider = await this.serviceProviderService.getServiceProviderByUserId(userId);
      const providerId = serviceProvider.serviceProvider.id;
      
      const data: CreateProductRequest = req.body;
      const result = await this.productService.createProduct(providerId, data);

      const response: ApiResponse = {
        success: true,
        message: result.message,
        data: result,
      };

      res.status(201).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to create product',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(400).json(response);
    }
  };

  /**
   * Create a draft product
   */
  createProductDraft = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.userId;
      
      // Get service provider ID from user ID
      const serviceProvider = await this.serviceProviderService.getServiceProviderByUserId(userId);
      const providerId = serviceProvider.serviceProvider.id;
      
      const data: CreateProductRequest = req.body;
      const result = await this.productService.createProductDraft(providerId, data);

      const response: ApiResponse = {
        success: true,
        message: result.message,
        data: result,
      };

      res.status(201).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to save product draft',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(400).json(response);
    }
  };

  /**
   * Get products
   */
  getProducts = async (req: Request, res: Response): Promise<void> => {
    try {
      const params: GetProductsRequest = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        category_id: req.query.category_id as string,
        provider_id: req.query.provider_id as string,
        is_active: req.query.is_active === 'true',
        is_featured: req.query.is_featured === 'true',
        min_price: req.query.min_price ? parseFloat(req.query.min_price as string) : undefined,
        max_price: req.query.max_price ? parseFloat(req.query.max_price as string) : undefined,
        search: req.query.search as string,
        tags: req.query.tags ? (req.query.tags as string).split(',') : undefined,
        sort_by: req.query.sort_by as any,
        sort_order: req.query.sort_order as any,
      };

      const result = await this.productService.getProducts(params);

      const response: ApiResponse = {
        success: true,
        message: 'Products retrieved successfully',
        data: result,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve products',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(500).json(response);
    }
  };

  /**
   * Get product by ID
   */
  getProductById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.productService.getProductById(id);

      const response: ApiResponse = {
        success: true,
        message: 'Product retrieved successfully',
        data: result,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve product',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(404).json(response);
    }
  };

  /**
   * Update product
   */
  updateProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const data: UpdateProductRequest = req.body;
      const result = await this.productService.updateProduct(id, data);

      const response: ApiResponse = {
        success: true,
        message: result.message,
        data: result,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to update product',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(400).json(response);
    }
  };

  /**
   * Update product stock
   */
  updateStock = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const data: UpdateStockRequest = req.body;
      const result = await this.productService.updateStock(id, data);

      const response: ApiResponse = {
        success: true,
        message: result.message,
        data: result,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to update product stock',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(400).json(response);
    }
  };

  /**
   * Delete product
   */
  deleteProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.productService.deleteProduct(id);

      const response: ApiResponse = {
        success: true,
        message: result.message,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to delete product',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(400).json(response);
    }
  };

  /**
   * Get products by provider
   */
  getProductsByProvider = async (req: Request, res: Response): Promise<void> => {
    try {
      const providerId = (req as any).user.userId;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const result = await this.productService.getProductsByProvider(
        providerId, 
        page, 
        limit
      );

      const response: ApiResponse = {
        success: true,
        message: 'Provider products retrieved successfully',
        data: result,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve provider products',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(500).json(response);
    }
  };

  /**
   * Get product statistics
   */
  getProductStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.productService.getProductStats();

      const response: ApiResponse = {
        success: true,
        message: 'Product statistics retrieved successfully',
        data: result,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve product statistics',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(500).json(response);
    }
  };

  // Category methods
  /**
   * Create a new category
   */
  createCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const data: CreateCategoryRequest = req.body;
      const result = await this.productService.createCategory(data);

      const response: ApiResponse = {
        success: true,
        message: result.message,
        data: result,
      };

      res.status(201).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to create category',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(400).json(response);
    }
  };

  /**
   * Get categories
   */
  getCategories = async (req: Request, res: Response): Promise<void> => {
    try {
      const params: GetCategoriesRequest = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        parent_id: req.query.parent_id as string,
        is_active: req.query.is_active === 'true',
        search: req.query.search as string,
      };

      const result = await this.productService.getCategories(params);

      const response: ApiResponse = {
        success: true,
        message: 'Categories retrieved successfully',
        data: result,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve categories',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(500).json(response);
    }
  };

  /**
   * Get category by ID
   */
  getCategoryById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.productService.getCategoryById(id);

      const response: ApiResponse = {
        success: true,
        message: 'Category retrieved successfully',
        data: result,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve category',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(404).json(response);
    }
  };

  /**
   * Update category
   */
  updateCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const data: UpdateCategoryRequest = req.body;
      const result = await this.productService.updateCategory(id, data);

      const response: ApiResponse = {
        success: true,
        message: result.message,
        data: result,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to update category',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(400).json(response);
    }
  };

  /**
   * Update category sort order
   */
  updateSortOrder = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const data: UpdateSortOrderRequest = req.body;
      const result = await this.productService.updateSortOrder(id, data);

      const response: ApiResponse = {
        success: true,
        message: result.message,
        data: result,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to update category sort order',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(400).json(response);
    }
  };

  /**
   * Delete category
   */
  deleteCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.productService.deleteCategory(id);

      const response: ApiResponse = {
        success: true,
        message: result.message,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to delete category',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(400).json(response);
    }
  };

  /**
   * Get category tree
   */
  getCategoryTree = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.productService.getCategoryTree();

      const response: ApiResponse = {
        success: true,
        message: 'Category tree retrieved successfully',
        data: result,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve category tree',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(500).json(response);
    }
  };

  /**
   * Get categories with counts
   */
  getCategoriesWithCounts = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.productService.getCategoriesWithCounts();

      const response: ApiResponse = {
        success: true,
        message: 'Categories with counts retrieved successfully',
        data: result,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve categories with counts',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(500).json(response);
    }
  };

  /**
   * Get subcategories
   */
  getSubcategories = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.productService.getSubcategories(id);

      const response: ApiResponse = {
        success: true,
        message: 'Subcategories retrieved successfully',
        data: result,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve subcategories',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(500).json(response);
    }
  };
}
