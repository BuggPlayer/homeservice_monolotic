import { Request, Response } from 'express';
import { CategoryModel } from '@/models/Category';
import { ApiResponse, PaginatedResponse } from '@/types';
import { AppError } from '@/middleware/errorHandler';

export class CategoryController {
  private categoryModel: CategoryModel;

  constructor() {
    this.categoryModel = new CategoryModel();
  }

  /**
   * Create a new category
   */
  createCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      // Check if category name already exists
      const nameExists = await this.categoryModel.nameExists(req.body.name);
      if (nameExists) {
        throw new AppError('Category name already exists', 400);
      }

      // If parent_id is provided, verify parent exists
      if (req.body.parent_id) {
        const parent = await this.categoryModel.findById(req.body.parent_id);
        if (!parent) {
          throw new AppError('Parent category not found', 404);
        }
      }

      const category = await this.categoryModel.create(req.body);

      const response: ApiResponse = {
        success: true,
        message: 'Category created successfully',
        data: { category },
      };

      res.status(201).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to create category',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      const statusCode = error instanceof AppError ? error.statusCode : 500;
      res.status(statusCode).json(response);
    }
  };

  /**
   * Get all categories
   */
  getCategories = async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        page = 1,
        limit = 100,
        parent_id,
        is_active,
      } = req.query;

      const filters: any = {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
      };

      if (parent_id !== undefined) {
        filters.parent_id = parent_id === 'null' ? null : parent_id as string;
      }
      if (is_active !== undefined) {
        filters.is_active = is_active === 'true';
      }

      const { categories, total } = await this.categoryModel.findMany(filters);

      const response: PaginatedResponse<any> = {
        data: categories,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total,
          totalPages: Math.ceil(total / parseInt(limit as string)),
        },
      };

      res.json({
        success: true,
        message: 'Categories retrieved successfully',
        data: response,
      });
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
      const { categoryId } = req.params;

      const category = await this.categoryModel.findByIdWithProductCount(categoryId);
      if (!category) {
        throw new AppError('Category not found', 404);
      }

      const response: ApiResponse = {
        success: true,
        message: 'Category retrieved successfully',
        data: { category },
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve category',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      const statusCode = error instanceof AppError ? error.statusCode : 500;
      res.status(statusCode).json(response);
    }
  };

  /**
   * Update category
   */
  updateCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const { categoryId } = req.params;

      const category = await this.categoryModel.findById(categoryId);
      if (!category) {
        throw new AppError('Category not found', 404);
      }

      // Check if name is being updated and if it already exists
      if (req.body.name && req.body.name !== category.name) {
        const nameExists = await this.categoryModel.nameExists(req.body.name, categoryId);
        if (nameExists) {
          throw new AppError('Category name already exists', 400);
        }
      }

      // If parent_id is being updated, verify parent exists
      if (req.body.parent_id && req.body.parent_id !== category.parent_id) {
        if (req.body.parent_id === categoryId) {
          throw new AppError('Category cannot be its own parent', 400);
        }

        const parent = await this.categoryModel.findById(req.body.parent_id);
        if (!parent) {
          throw new AppError('Parent category not found', 404);
        }
      }

      const updatedCategory = await this.categoryModel.update(categoryId, req.body);

      const response: ApiResponse = {
        success: true,
        message: 'Category updated successfully',
        data: { category: updatedCategory },
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to update category',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      const statusCode = error instanceof AppError ? error.statusCode : 500;
      res.status(statusCode).json(response);
    }
  };

  /**
   * Delete category
   */
  deleteCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const { categoryId } = req.params;

      const category = await this.categoryModel.findById(categoryId);
      if (!category) {
        throw new AppError('Category not found', 404);
      }

      const deleted = await this.categoryModel.delete(categoryId);
      if (!deleted) {
        throw new AppError('Failed to delete category', 500);
      }

      const response: ApiResponse = {
        success: true,
        message: 'Category deleted successfully',
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to delete category',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      const statusCode = error instanceof AppError ? error.statusCode : 500;
      res.status(statusCode).json(response);
    }
  };

  /**
   * Get category tree
   */
  getCategoryTree = async (req: Request, res: Response): Promise<void> => {
    try {
      const categories = await this.categoryModel.getCategoryTree();

      const response: ApiResponse = {
        success: true,
        message: 'Category tree retrieved successfully',
        data: { categories },
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
   * Get subcategories
   */
  getSubcategories = async (req: Request, res: Response): Promise<void> => {
    try {
      const { categoryId } = req.params;

      const parentCategory = await this.categoryModel.findById(categoryId);
      if (!parentCategory) {
        throw new AppError('Parent category not found', 404);
      }

      const subcategories = await this.categoryModel.getSubcategories(categoryId);

      const response: ApiResponse = {
        success: true,
        message: 'Subcategories retrieved successfully',
        data: { subcategories },
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve subcategories',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      const statusCode = error instanceof AppError ? error.statusCode : 500;
      res.status(statusCode).json(response);
    }
  };

  /**
   * Get root categories
   */
  getRootCategories = async (req: Request, res: Response): Promise<void> => {
    try {
      const rootCategories = await this.categoryModel.getRootCategories();

      const response: ApiResponse = {
        success: true,
        message: 'Root categories retrieved successfully',
        data: { categories: rootCategories },
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve root categories',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(500).json(response);
    }
  };

  /**
   * Get categories with product counts
   */
  getCategoriesWithProductCounts = async (req: Request, res: Response): Promise<void> => {
    try {
      const categories = await this.categoryModel.getCategoriesWithProductCounts();

      const response: ApiResponse = {
        success: true,
        message: 'Categories with product counts retrieved successfully',
        data: { categories },
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve categories with product counts',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(500).json(response);
    }
  };

  /**
   * Update category sort order
   */
  updateSortOrder = async (req: Request, res: Response): Promise<void> => {
    try {
      const { categoryId } = req.params;
      const { sort_order } = req.body;

      if (sort_order < 0) {
        throw new AppError('Sort order cannot be negative', 400);
      }

      const category = await this.categoryModel.findById(categoryId);
      if (!category) {
        throw new AppError('Category not found', 404);
      }

      const updatedCategory = await this.categoryModel.updateSortOrder(categoryId, sort_order);

      const response: ApiResponse = {
        success: true,
        message: 'Sort order updated successfully',
        data: { category: updatedCategory },
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to update sort order',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      const statusCode = error instanceof AppError ? error.statusCode : 500;
      res.status(statusCode).json(response);
    }
  };
}
