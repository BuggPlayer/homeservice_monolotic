import { Router } from 'express';
import { ProductController } from '../controllers/ProductController';
import { 
  authenticateToken, 
  requireProvider, 
  requireAdmin,
  validatePagination,
  validateIdParam
} from '../../../core/middleware';
import { RateLimiter } from '../../../core/middleware/rateLimiter';

const router = Router();
const productController = new ProductController();

// Apply rate limiting
router.use(RateLimiter.moderate);

// All routes require authentication
router.use(authenticateToken);

// Product routes
// Get product statistics (admin only)
router.get('/stats', requireAdmin, productController.getProductStats);

// Get all products (public)
router.get('/', validatePagination, productController.getProducts);

// Get products by provider (provider only, own products)
router.get('/my-products', requireProvider, validatePagination, productController.getProductsByProvider);

// Get product by ID (public)
router.get('/:id', validateIdParam, productController.getProductById);

// Create product (provider only)
router.post('/', requireProvider, productController.createProduct);

// Update product (provider only, own products)
router.put('/:id', requireProvider, validateIdParam, productController.updateProduct);

// Update product stock (provider only, own products)
router.patch('/:id/stock', requireProvider, validateIdParam, productController.updateStock);

// Delete product (provider only, own products)
router.delete('/:id', requireProvider, validateIdParam, productController.deleteProduct);

// Category routes
// Get category tree (public)
router.get('/categories/tree', productController.getCategoryTree);

// Get categories with counts (public)
router.get('/categories/with-counts', productController.getCategoriesWithCounts);

// Get all categories (public)
router.get('/categories', validatePagination, productController.getCategories);

// Get subcategories (public)
router.get('/categories/:id/subcategories', validateIdParam, productController.getSubcategories);

// Get category by ID (public)
router.get('/categories/:id', validateIdParam, productController.getCategoryById);

// Create category (admin only)
router.post('/categories', requireAdmin, productController.createCategory);

// Update category (admin only)
router.put('/categories/:id', requireAdmin, validateIdParam, productController.updateCategory);

// Update category sort order (admin only)
router.patch('/categories/:id/sort-order', requireAdmin, validateIdParam, productController.updateSortOrder);

// Delete category (admin only)
router.delete('/categories/:id', requireAdmin, validateIdParam, productController.deleteCategory);

export default router;
