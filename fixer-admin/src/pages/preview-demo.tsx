import React, { useState } from 'react'
import {
  Box,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Avatar,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import {
  Visibility as VisibilityIcon,
  ShoppingCart as ShoppingCartIcon,
  Inventory as InventoryIcon,
  Person as PersonIcon,
  AttachMoney as MoneyIcon,
  LocalShipping as ShippingIcon,
} from '@mui/icons-material'
import { PageHeader } from '../components/common/PageHeader'
import { PreviewModal, OrderPreview, ProductPreview } from '../components/common'
import { formatCurrency, formatDate } from '../lib/utils'

// Sample Order Data
const sampleOrder = {
  id: 'AT456BB',
  orderNumber: '#AT456BB',
  status: 'processing' as const,
  createdAt: '2024-03-03T00:00:00Z',
  updatedAt: '2024-03-03T12:30:00Z',
  items: [
    {
      id: 1,
      name: 'Sports Jacket',
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
      category: 'Fashion',
      quantity: 1,
      price: 120.99,
      total: 120.99,
    },
    {
      id: 2,
      name: 'Black T-Shirt',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
      category: 'Fashion',
      quantity: 2,
      price: 24.99,
      total: 49.98,
    },
  ],
  customer: {
    id: 1,
    name: 'Cameron Williamson',
    email: 'cameronwilliamson@mail.com',
    phone: '(+1) 840-492-1485',
    address: '123 Main Street, New York, NY 10001',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    type: 'Premium Customer',
  },
  payment: {
    method: 'Bank Transfer',
    status: 'Confirmed',
    subtotal: 170.97,
    shipping: 5.75,
    tax: 13.68,
    discount: 0,
    total: 190.40,
  },
  shipping: {
    method: 'Express',
    address: '123 Main Street, New York, NY 10001',
    trackingNumber: 'TRK123456789',
    estimatedDelivery: 'March 05, 2024',
  },
  timeline: [
    {
      id: '1',
      title: 'Order Placed',
      description: 'Order has been successfully placed by the customer',
      completed: true,
      active: false,
      date: 'March 03, 2024',
      time: '10:30 AM',
    },
    {
      id: '2',
      title: 'Payment Confirmed',
      description: 'Payment has been successfully processed and verified.',
      completed: true,
      active: false,
      date: 'March 03, 2024',
      time: '11:15 AM',
    },
    {
      id: '3',
      title: 'Order Processed',
      description: 'The order is being prepared (products are being packed)',
      completed: false,
      active: true,
      date: 'March 03, 2024',
      time: '12:30 PM',
    },
  ],
}

// Sample Product Data
const sampleProduct = {
  id: 1,
  name: 'Premium Wireless Headphones',
  description: 'High-quality wireless headphones with noise cancellation, premium sound quality, and comfortable over-ear design. Perfect for music lovers and professionals who need crystal-clear audio.',
  shortDescription: 'Premium wireless headphones with noise cancellation',
  category: 'Electronics',
  subcategory: 'Audio',
  brand: 'TechSound',
  sku: 'TS-WH-001',
  price: 299.99,
  comparePrice: 399.99,
  cost: 150.00,
  status: 'active' as const,
  inventory: {
    quantity: 45,
    lowStockThreshold: 10,
    trackQuantity: true,
    allowBackorder: false,
  },
  images: [
    {
      id: 1,
      url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
      alt: 'Premium Wireless Headphones - Front View',
      isPrimary: true,
    },
    {
      id: 2,
      url: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800',
      alt: 'Premium Wireless Headphones - Side View',
    },
    {
      id: 3,
      url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800',
      alt: 'Premium Wireless Headphones - Detail View',
    },
  ],
  specifications: [
    { name: 'Driver Size', value: '40mm', icon: <InventoryIcon /> },
    { name: 'Frequency Response', value: '20Hz - 20kHz', icon: <InventoryIcon /> },
    { name: 'Impedance', value: '32 Ohms', icon: <InventoryIcon /> },
    { name: 'Battery Life', value: '30 hours', icon: <InventoryIcon /> },
    { name: 'Connectivity', value: 'Bluetooth 5.0, 3.5mm Jack', icon: <InventoryIcon /> },
    { name: 'Weight', value: '250g', icon: <InventoryIcon /> },
    { name: 'Color', value: 'Black, White, Silver', icon: <InventoryIcon /> },
    { name: 'Warranty', value: '2 years', icon: <InventoryIcon /> },
  ],
  features: [
    'Active Noise Cancellation',
    '30-hour battery life',
    'Quick charge (5 min = 3 hours)',
    'Premium sound quality',
    'Comfortable over-ear design',
    'Bluetooth 5.0 connectivity',
    'Built-in microphone',
    'Foldable design',
  ],
  tags: ['wireless', 'noise-cancellation', 'premium', 'bluetooth', 'headphones'],
  seo: {
    title: 'Premium Wireless Headphones - TechSound',
    description: 'High-quality wireless headphones with noise cancellation and premium sound quality.',
    keywords: ['wireless headphones', 'noise cancellation', 'premium audio', 'bluetooth'],
  },
  shipping: {
    weight: 0.5,
    dimensions: {
      length: 20,
      width: 18,
      height: 8,
    },
    freeShipping: true,
    shippingClass: 'Standard',
  },
  reviews: {
    averageRating: 4.7,
    totalReviews: 128,
    reviews: [
      {
        id: 1,
        customerName: 'Sarah Johnson',
        customerAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400',
        rating: 5,
        comment: 'Amazing sound quality! The noise cancellation works perfectly and the battery life is incredible.',
        date: '2024-02-15T00:00:00Z',
        verified: true,
      },
      {
        id: 2,
        customerName: 'Mike Chen',
        customerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
        rating: 4,
        comment: 'Great headphones, very comfortable for long listening sessions. The build quality is excellent.',
        date: '2024-02-10T00:00:00Z',
        verified: true,
      },
      {
        id: 3,
        customerName: 'Emily Davis',
        customerAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
        rating: 5,
        comment: 'Perfect for work calls and music. The microphone quality is surprisingly good.',
        date: '2024-02-05T00:00:00Z',
        verified: false,
      },
    ],
  },
  analytics: {
    views: 15420,
    sales: 89,
    conversionRate: 5.8,
  },
  createdAt: '2024-01-15T00:00:00Z',
  updatedAt: '2024-03-01T00:00:00Z',
}

export function PreviewDemo() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  
  const [orderPreviewOpen, setOrderPreviewOpen] = useState(false)
  const [productPreviewOpen, setProductPreviewOpen] = useState(false)

  const handleOrderPreview = () => {
    setOrderPreviewOpen(true)
  }

  const handleProductPreview = () => {
    setProductPreviewOpen(true)
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      {/* Page Header */}
      <PageHeader
        title="Preview Components Demo"
        subtitle="Interactive preview modals for orders and products"
      />

      {/* Demo Cards */}
      <Grid container spacing={3}>
        {/* Order Preview Demo */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <ShoppingCartIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Order Preview
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Interactive order details modal
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                  {sampleOrder.orderNumber}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Chip
                    label={sampleOrder.status}
                    color="warning"
                    size="small"
                  />
                  <Chip
                    label={sampleOrder.customer.name}
                    variant="outlined"
                    size="small"
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {formatDate(sampleOrder.createdAt)} • {formatCurrency(sampleOrder.payment.total)}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {sampleOrder.customer.name}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <MoneyIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {sampleOrder.payment.method}
                  </Typography>
                </Box>
              </Box>

              <Typography variant="body2" color="text.secondary">
                {sampleOrder.items.length} items • {sampleOrder.timeline.length} timeline steps
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                startIcon={<VisibilityIcon />}
                onClick={handleOrderPreview}
                fullWidth
              >
                Preview Order
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Product Preview Demo */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                  <InventoryIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Product Preview
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Interactive product details modal
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                  {sampleProduct.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Chip
                    label={sampleProduct.status}
                    color="success"
                    size="small"
                  />
                  <Chip
                    label={sampleProduct.category}
                    variant="outlined"
                    size="small"
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  SKU: {sampleProduct.sku} • {formatCurrency(sampleProduct.price)}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <InventoryIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {sampleProduct.inventory.quantity} in stock
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ShippingIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    Free shipping
                  </Typography>
                </Box>
              </Box>

              <Typography variant="body2" color="text.secondary">
                {sampleProduct.images.length} images • {sampleProduct.specifications.length} specs • {sampleProduct.reviews.totalReviews} reviews
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                startIcon={<VisibilityIcon />}
                onClick={handleProductPreview}
                fullWidth
                color="success"
              >
                Preview Product
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      {/* Features Overview */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          Preview Features
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 2 }}>
                  <VisibilityIcon />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Responsive Design
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Fully responsive modals that adapt to all screen sizes
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Avatar sx={{ bgcolor: 'success.main', mx: 'auto', mb: 2 }}>
                  <InventoryIcon />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Rich Content
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Comprehensive information display with images, specs, and analytics
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Avatar sx={{ bgcolor: 'warning.main', mx: 'auto', mb: 2 }}>
                  <ShoppingCartIcon />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Interactive Elements
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Timeline, tabs, ratings, and interactive components
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Avatar sx={{ bgcolor: 'info.main', mx: 'auto', mb: 2 }}>
                  <PersonIcon />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Professional UI
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Industry-standard design with smooth animations
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Order Preview Modal */}
      <PreviewModal
        open={orderPreviewOpen}
        onClose={() => setOrderPreviewOpen(false)}
        title={sampleOrder.orderNumber}
        subtitle="Order Details"
        maxWidth="lg"
      >
        <OrderPreview
          order={sampleOrder}
          onEdit={() => console.log('Edit order')}
          onDelete={() => console.log('Delete order')}
          onPrint={() => console.log('Print order')}
          onShare={() => console.log('Share order')}
        />
      </PreviewModal>

      {/* Product Preview Modal */}
      <PreviewModal
        open={productPreviewOpen}
        onClose={() => setProductPreviewOpen(false)}
        title={sampleProduct.name}
        subtitle={`SKU: ${sampleProduct.sku}`}
        maxWidth="lg"
      >
        <ProductPreview
          product={sampleProduct}
          onEdit={() => console.log('Edit product')}
          onDelete={() => console.log('Delete product')}
          onDuplicate={() => console.log('Duplicate product')}
          onViewAnalytics={() => console.log('View analytics')}
        />
      </PreviewModal>
    </Box>
  )
}

export default PreviewDemo
