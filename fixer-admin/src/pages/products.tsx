import React, { useState } from 'react'
import { Box, Tabs, Tab, Paper, useTheme, useMediaQuery, Typography } from '@mui/material'
import { ProductTable } from '../components/products/ProductTable'
import { PageHeader } from '../components/common/PageHeader'
import { PreviewModal, ProductPreview } from '../components/common'
import { useAppDispatch } from '../store/hooks'
import { addToast } from '../store/slices/uiSlice'
import staticData from '../data/staticData.json'
import { Product } from '../types'
import {  useNavigate } from 'react-router-dom'

export function Products() {
  const navigate = useNavigate()
  const [products, setProducts] = useState<Product[]>(staticData.products)
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  const [productPreviewOpen, setProductPreviewOpen] = useState(false)
  const [selectedProductForPreview, setSelectedProductForPreview] = useState<Product | null>(null)
  
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const dispatch = useAppDispatch()

  const categories = staticData.categories

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts(prev => 
      prev.map(product => 
        product.id === updatedProduct.id ? updatedProduct : product
      )
    )
    dispatch(addToast({
      message: 'Product updated successfully!',
      severity: 'success',
      duration: 4000,
    }))
  }

  const handleDeleteProduct = (productId: number) => {
    setProducts(prev => prev.filter(product => product.id !== productId))
    dispatch(addToast({
      message: 'Product deleted successfully!',
      severity: 'success',
      duration: 4000,
    }))
  }

  const handleAddProduct = () => {
    navigate('/products/add')
    // dispatch(addToast({
    //   message: 'Add product feature coming soon!',
    //   severity: 'info',
    //   duration: 4000,
    // }))
  }

  const handleViewProduct = (product: Product) => {
    setSelectedProductForPreview(product)
    setProductPreviewOpen(true)
  }

  const handleCloseProductPreview = () => {
    setProductPreviewOpen(false)
    setSelectedProductForPreview(null)
  }

  return (
    <Box sx={{ flexGrow: 1, p: { xs: 1, sm: 2, md: 3 } }}>
      <PageHeader
        title="Products"
        subtitle="Manage your product catalog and inventory"
        action={
          <Paper sx={{ display: 'flex', width: { xs: '100%', sm: 'auto' } }}>
            <Tabs
              value={viewMode}
              onChange={(_, value) => setViewMode(value)}
              variant={isMobile ? 'fullWidth' : 'standard'}
              sx={{ minHeight: 48 }}
            >
              <Tab label="Table View" value="table" />
              <Tab label="Grid View" value="grid" />
            </Tabs>
          </Paper>
        }
      />

      {viewMode === 'table' ? (
        <ProductTable
          products={products}
          onUpdate={handleUpdateProduct}
          onDelete={handleDeleteProduct}
          onAdd={handleAddProduct}
          onView={handleViewProduct}
          categories={categories}
        />
      ) : (
        <Box>
          {/* Grid view implementation can be added here */}
          <Typography>Grid view coming soon...</Typography>
        </Box>
      )}

      {/* Product Preview Modal */}
      {selectedProductForPreview && (
        <PreviewModal
          open={productPreviewOpen}
          onClose={handleCloseProductPreview}
          title={selectedProductForPreview.name}
          subtitle={`SKU: ${selectedProductForPreview.sku}`}
          maxWidth="lg"
        >
          <ProductPreview
            product={{
              id: selectedProductForPreview.id,
              name: selectedProductForPreview.name,
              description: selectedProductForPreview.description || 'No description available',
              shortDescription: selectedProductForPreview.short_description,
              category: categories.find(c => c.id === selectedProductForPreview.category_id)?.name || 'Uncategorized',
              sku: selectedProductForPreview.sku,
              price: selectedProductForPreview.price,
              comparePrice: selectedProductForPreview.compare_price,
              cost: selectedProductForPreview.cost,
              status: selectedProductForPreview.status as any,
              inventory: {
                quantity: selectedProductForPreview.stock_quantity || 0,
                lowStockThreshold: 10,
                trackQuantity: true,
                allowBackorder: false,
              },
              images: selectedProductForPreview.images?.map((img, index) => ({
                id: index + 1,
                url: img,
                alt: selectedProductForPreview.name,
                isPrimary: index === 0,
              })) || [{
                id: 1,
                url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
                alt: selectedProductForPreview.name,
                isPrimary: true,
              }],
              specifications: [
                { name: 'SKU', value: selectedProductForPreview.sku },
                { name: 'Category', value: categories.find(c => c.id === selectedProductForPreview.category_id)?.name || 'Uncategorized' },
                { name: 'Status', value: selectedProductForPreview.status },
                { name: 'Stock', value: selectedProductForPreview.stock_quantity?.toString() || '0' },
                { name: 'Weight', value: selectedProductForPreview.weight?.toString() || 'N/A' },
                { name: 'Dimensions', value: selectedProductForPreview.dimensions ? 
                  `${selectedProductForPreview.dimensions.length}" × ${selectedProductForPreview.dimensions.width}" × ${selectedProductForPreview.dimensions.height}"` : 'N/A' },
              ],
              features: selectedProductForPreview.features || [],
              tags: selectedProductForPreview.tags || [],
              seo: {
                title: selectedProductForPreview.seo_title,
                description: selectedProductForPreview.seo_description,
                keywords: selectedProductForPreview.seo_keywords || [],
              },
              shipping: {
                weight: parseFloat(selectedProductForPreview.weight || '0'),
                dimensions: {
                  length: 10,
                  width: 10,
                  height: 10,
                },
                freeShipping: selectedProductForPreview.free_shipping || false,
                shippingClass: 'Standard',
              },
              reviews: {
                averageRating: selectedProductForPreview.average_rating || 4.5,
                totalReviews: selectedProductForPreview.review_count || 0,
                reviews: [],
              },
              analytics: {
                views: selectedProductForPreview.view_count || 0,
                sales: selectedProductForPreview.sales_count || 0,
                conversionRate: 5.2,
              },
              createdAt: selectedProductForPreview.created_at || new Date().toISOString(),
              updatedAt: selectedProductForPreview.updated_at || new Date().toISOString(),
            }}
            onEdit={() => handleUpdateProduct(selectedProductForPreview)}
            onDelete={() => handleDeleteProduct(selectedProductForPreview.id)}
            onDuplicate={() => console.log('Duplicate product')}
            onViewAnalytics={() => console.log('View analytics')}
          />
        </PreviewModal>
      )}
    </Box>
  )
}