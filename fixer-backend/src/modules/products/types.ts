import { Product, Category } from '@/types';

export interface CreateProductRequest {
  category_id: string;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  sku: string;
  stock_quantity: number;
  images?: string[];
  specifications?: { [key: string]: any };
  is_active?: boolean;
  is_featured?: boolean;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  tags?: string[];
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  original_price?: number;
  sku?: string;
  stock_quantity?: number;
  images?: string[];
  specifications?: { [key: string]: any };
  is_active?: boolean;
  is_featured?: boolean;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  tags?: string[];
}

export interface GetProductsRequest {
  page?: number;
  limit?: number;
  category_id?: string;
  provider_id?: string;
  is_active?: boolean;
  is_featured?: boolean;
  min_price?: number;
  max_price?: number;
  search?: string;
  tags?: string[];
  sort_by?: 'name' | 'price' | 'created_at' | 'rating';
  sort_order?: 'asc' | 'desc';
}

export interface GetProductsResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface GetProductResponse {
  product: Product;
}

export interface CreateProductResponse {
  product: Product;
  message: string;
}

export interface UpdateProductResponse {
  product: Product;
  message: string;
}

export interface UpdateStockRequest {
  stock_quantity: number;
}

export interface UpdateStockResponse {
  product: Product;
  message: string;
}

export interface GetProductStatsResponse {
  totalProducts: number;
  activeProducts: number;
  featuredProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  totalValue: number;
  averagePrice: number;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  parent_id?: string;
  image?: string;
  is_active?: boolean;
  sort_order?: number;
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
  parent_id?: string;
  image?: string;
  is_active?: boolean;
  sort_order?: number;
}

export interface GetCategoriesRequest {
  page?: number;
  limit?: number;
  parent_id?: string;
  is_active?: boolean;
  search?: string;
}

export interface GetCategoriesResponse {
  categories: Category[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface GetCategoryResponse {
  category: Category;
}

export interface CreateCategoryResponse {
  category: Category;
  message: string;
}

export interface UpdateCategoryResponse {
  category: Category;
  message: string;
}

export interface UpdateSortOrderRequest {
  sort_order: number;
}

export interface UpdateSortOrderResponse {
  category: Category;
  message: string;
}

export interface GetCategoryTreeResponse {
  categories: Category[];
}

export interface GetCategoryWithCountsResponse {
  categories: (Category & { product_count: number })[];
}
