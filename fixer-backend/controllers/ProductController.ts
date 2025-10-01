import { Request, Response } from 'express';
import { ProductModel } from '@/models/Product';
import { CategoryModel } from '@/models/Category';
import { ServiceProviderModel } from '@/models/ServiceProvider';
import { ApiResponse, PaginatedResponse } from '@/types';
import { AppError } from '@/middleware/errorHandler';

export class ProductController {
  private productModel: ProductModel;
  private categoryModel: CategoryModel;
  private serviceProviderModel: ServiceProviderModel;

  constructor() {
    this.productModel = new ProductModel();
    this.categoryModel = new CategoryModel();
    this.serviceProviderModel = new ServiceProviderModel();
  }

  /**
   * Create a new product
   */
  createProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const providerId = req.user?.userId;
      if (!providerId) {
        throw new AppError('Provider ID not found in token', 401);
      }

      // Get provider details
      const provider = await this.serviceProviderModel.findByUserId(providerId);
      if (!provider) {
        throw new AppError('Service provider profile not found', 404);
      }

      if (provider.verification_status !== 'verified') {
        throw new AppError('Provider must be verified to create products', 403);
      }

      // Check if SKU already exists
      const skuExists = await this.productModel.skuExists(req.body.sku);
      if (skuExists) {
        throw new AppError('SKU already exists', 400);
      }

      // Verify category exists
      const category = await this.categoryModel.findById(req.body.category_id);
      if (!category) {
        throw new AppError('Category not found', 404);
      }

      const product = await this.productModel.create({
        ...req.body,
        provider_id: provider.id,
      });

      const response: ApiResponse = {
        success: true,
        message: 'Product created successfully',
        data: { product },
      };

      res.status(201).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to create product',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      const statusCode = error instanceof AppError ? error.statusCode : 500;
      res.status(statusCode).json(response);
    }
  };

  /**
   * Get products with filters
   */
  getProducts = async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        page = 1,
        limit = 10,
        category_id,
        provider_id,
        min_price,
        max_price,
        search,
        is_featured,
        tags,
      } = req.query;

      const filters: any = {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        is_active: true,
      };

      if (category_id) filters.category_id = category_id as string;
      if (provider_id) filters.provider_id = provider_id as string;
      if (min_price) filters.min_price = parseFloat(min_price as string);
      if (max_price) filters.max_price = parseFloat(max_price as string);
      if (search) filters.search = search as string;
      if (is_featured) filters.is_featured = is_featured === 'true';
      if (tags) filters.tags = (tags as string).split(',');

      const { products, total } = await this.productModel.findMany(filters);

      const response: PaginatedResponse<any> = {
        data: products,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total,
          totalPages: Math.ceil(total / parseInt(limit as string)),
        },
      };

      res.json({
        success: true,
        message: 'Products retrieved successfully',
        data: response,
      });
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
      const { productId } = req.params;

      const product = await this.productModel.findByIdWithDetails(productId);
      if (!product) {
        throw new AppError('Product not found', 404);
      }

      const response: ApiResponse = {
        success: true,
        message: 'Product retrieved successfully',
        data: { product },
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve product',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      const statusCode = error instanceof AppError ? error.statusCode : 500;
      res.status(statusCode).json(response);
    }
  };

  /**
   * Update product
   */
  updateProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const { productId } = req.params;
      const providerId = req.user?.userId;
      if (!providerId) {
        throw new AppError('Provider ID not found in token', 401);
      }

      const product = await this.productModel.findById(productId);
      if (!product) {
        throw new AppError('Product not found', 404);
      }

      // Get provider details
      const provider = await this.serviceProviderModel.findByUserId(providerId);
      if (!provider || provider.id !== product.provider_id) {
        throw new AppError('You can only update your own products', 403);
      }

      // Check SKU if it's being updated
      if (req.body.sku && req.body.sku !== product.sku) {
        const skuExists = await this.productModel.skuExists(req.body.sku, productId);
        if (skuExists) {
          throw new AppError('SKU already exists', 400);
        }
      }

      const updatedProduct = await this.productModel.update(productId, req.body);

      const response: ApiResponse = {
        success: true,
        message: 'Product updated successfully',
        data: { product: updatedProduct },
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to update product',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      const statusCode = error instanceof AppError ? error.statusCode : 500;
      res.status(statusCode).json(response);
    }
  };

  /**
   * Delete product
   */
  deleteProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const { productId } = req.params;
      const providerId = req.user?.userId;
      if (!providerId) {
        throw new AppError('Provider ID not found in token', 401);
      }

      const product = await this.productModel.findById(productId);
      if (!product) {
        throw new AppError('Product not found', 404);
      }

      // Get provider details
      const provider = await this.serviceProviderModel.findByUserId(providerId);
      if (!provider || provider.id !== product.provider_id) {
        throw new AppError('You can only delete your own products', 403);
      }

      const deleted = await this.productModel.delete(productId);
      if (!deleted) {
        throw new AppError('Failed to delete product', 500);
      }

      const response: ApiResponse = {
        success: true,
        message: 'Product deleted successfully',
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to delete product',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      const statusCode = error instanceof AppError ? error.statusCode : 500;
      res.status(statusCode).json(response);
    }
  };

  /**
   * Get products by provider
   */
  getProductsByProvider = async (req: Request, res: Response): Promise<void> => {
    try {
      const providerId = req.user?.userId;
      if (!providerId) {
        throw new AppError('Provider ID not found in token', 401);
      }

      const { page = 1, limit = 10 } = req.query;

      // Get provider details
      const provider = await this.serviceProviderModel.findByUserId(providerId);
      if (!provider) {
        throw new AppError('Service provider profile not found', 404);
      }

      const { products, total } = await this.productModel.findByProvider(
        provider.id,
        parseInt(page as string),
        parseInt(limit as string)
      );

      const response: PaginatedResponse<any> = {
        data: products,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total,
          totalPages: Math.ceil(total / parseInt(limit as string)),
        },
      };

      res.json({
        success: true,
        message: 'Products retrieved successfully',
        data: response,
      });
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve products',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      const statusCode = error instanceof AppError ? error.statusCode : 500;
      res.status(statusCode).json(response);
    }
  };

  /**
   * Get featured products
   */
  getFeaturedProducts = async (req: Request, res: Response): Promise<void> => {
    try {
      const { limit = 10 } = req.query;

      const products = await this.productModel.findFeatured(parseInt(limit as string));

      const response: ApiResponse = {
        success: true,
        message: 'Featured products retrieved successfully',
        data: { products },
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve featured products',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(500).json(response);
    }
  };

  /**
   * Search products
   */
  searchProducts = async (req: Request, res: Response): Promise<void> => {
    try {
      const { q, page = 1, limit = 10 } = req.query;

      if (!q) {
        throw new AppError('Search query is required', 400);
      }

      const { products, total } = await this.productModel.search(
        q as string,
        parseInt(page as string),
        parseInt(limit as string)
      );

      const response: PaginatedResponse<any> = {
        data: products,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total,
          totalPages: Math.ceil(total / parseInt(limit as string)),
        },
      };

      res.json({
        success: true,
        message: 'Search results retrieved successfully',
        data: response,
      });
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to search products',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      const statusCode = error instanceof AppError ? error.statusCode : 500;
      res.status(statusCode).json(response);
    }
  };

  /**
   * Update product stock
   */
  updateStock = async (req: Request, res: Response): Promise<void> => {
    try {
      const { productId } = req.params;
      const { quantity } = req.body;
      const providerId = req.user?.userId;
      if (!providerId) {
        throw new AppError('Provider ID not found in token', 401);
      }

      if (quantity < 0) {
        throw new AppError('Stock quantity cannot be negative', 400);
      }

      const product = await this.productModel.findById(productId);
      if (!product) {
        throw new AppError('Product not found', 404);
      }

      // Get provider details
      const provider = await this.serviceProviderModel.findByUserId(providerId);
      if (!provider || provider.id !== product.provider_id) {
        throw new AppError('You can only update your own products', 403);
      }

      const updatedProduct = await this.productModel.updateStock(productId, quantity);

      const response: ApiResponse = {
        success: true,
        message: 'Stock updated successfully',
        data: { product: updatedProduct },
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to update stock',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      const statusCode = error instanceof AppError ? error.statusCode : 500;
      res.status(statusCode).json(response);
    }
  };
}
