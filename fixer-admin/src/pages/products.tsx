import React, { useState } from 'react'
import { Box, Tabs, Tab, Paper, useTheme, useMediaQuery, Typography } from '@mui/material'
import { ProductTable } from '../components/products/ProductTable'
import { PageHeader } from '../components/common/PageHeader'
import { useAppDispatch } from '../store/hooks'
import { addToast } from '../store/slices/uiSlice'
import staticData from '../data/staticData.json'
import { Product } from '../types'

export function Products() {
  const [products, setProducts] = useState<Product[]>(staticData.products)
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  
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
    dispatch(addToast({
      message: 'Add product feature coming soon!',
      severity: 'info',
      duration: 4000,
    }))
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
          categories={categories}
        />
      ) : (
        <Box>
          {/* Grid view implementation can be added here */}
          <Typography>Grid view coming soon...</Typography>
        </Box>
      )}
    </Box>
  )
}