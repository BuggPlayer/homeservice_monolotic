import { Router } from 'express';
import { CategoryController } from '@/controllers/CategoryController';
import { authenticateToken, requireAdmin } from '@/middleware/auth';
import {
  validatePagination,
  validateIdParam,
  validateCategory,
  validateSortOrderUpdate,
} from '@/middleware/validation';

const router = Router();
const categoryController = new CategoryController();

// All routes require authentication
router.use(authenticateToken);

// Get all categories
router.get('/', validatePagination, categoryController.getCategories);

// Get category tree
router.get('/tree', categoryController.getCategoryTree);

// Get root categories
router.get('/root', categoryController.getRootCategories);

// Get categories with product counts
router.get('/with-counts', categoryController.getCategoriesWithProductCounts);

// Get subcategories
router.get('/:categoryId/subcategories', validateIdParam, categoryController.getSubcategories);

// Get category by ID
router.get('/:categoryId', validateIdParam, categoryController.getCategoryById);

// Create category (admin only)
router.post('/', requireAdmin, validateCategory, categoryController.createCategory);

// Update category (admin only)
router.put('/:categoryId', requireAdmin, validateIdParam, validateCategory, categoryController.updateCategory);

// Update sort order (admin only)
router.patch('/:categoryId/sort-order', requireAdmin, validateIdParam, validateSortOrderUpdate, categoryController.updateSortOrder);

// Delete category (admin only)
router.delete('/:categoryId', requireAdmin, validateIdParam, categoryController.deleteCategory);

export default router;
