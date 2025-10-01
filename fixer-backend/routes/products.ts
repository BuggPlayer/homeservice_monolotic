import { Router } from 'express';
import { ProductController } from '@/controllers/ProductController';
import { authenticateToken, requireProvider, requireCustomer } from '@/middleware/auth';
import {
  validatePagination,
  validateIdParam,
  validateProduct,
  validateStockUpdate,
} from '@/middleware/validation';

const router = Router();
const productController = new ProductController();

// All routes require authentication
router.use(authenticateToken);

// Get products with filters (public for authenticated users)
router.get('/', validatePagination, productController.getProducts);

// Get featured products
router.get('/featured', validatePagination, productController.getFeaturedProducts);

// Search products
router.get('/search', validatePagination, productController.searchProducts);

// Get product by ID
router.get('/:productId', validateIdParam, productController.getProductById);

// Create product (provider only)
router.post('/', requireProvider, validateProduct, productController.createProduct);

// Get products by provider (provider only)
router.get('/provider/my-products', requireProvider, validatePagination, productController.getProductsByProvider);

// Update product (provider only)
router.put('/:productId', requireProvider, validateIdParam, productController.updateProduct);

// Update product stock (provider only)
router.patch('/:productId/stock', requireProvider, validateIdParam, validateStockUpdate, productController.updateStock);

// Delete product (provider only)
router.delete('/:productId', requireProvider, validateIdParam, productController.deleteProduct);

export default router;
