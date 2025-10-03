import React, { useState } from 'react'
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Button,
  IconButton,
  Rating,
  Badge,
  useTheme,
  useMediaQuery,
  ImageList,
  ImageListItem,
  Tabs,
  Tab,
} from '@mui/material'
import {
  Inventory as InventoryIcon,
  Category as CategoryIcon,
  AttachMoney as MoneyIcon,
  Star as StarIcon,
  Visibility as VisibilityIcon,
  ShoppingCart as ShoppingCartIcon,
  LocalShipping as ShippingIcon,
  Security as SecurityIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  ZoomIn as ZoomInIcon,
  Share as ShareIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
} from '@mui/icons-material'
import { formatCurrency, formatDate, safeFormatDate } from '../../lib/utils'

export interface ProductImage {
  id: string | number
  url: string
  alt: string
  isPrimary?: boolean
}

export interface ProductSpecification {
  name: string
  value: string
  icon?: React.ReactNode
}

export interface ProductReview {
  id: string | number
  customerName: string
  customerAvatar?: string
  rating: number
  comment: string
  date: string
  verified: boolean
}

export interface ProductPreviewData {
  id: string | number
  name: string
  description: string
  shortDescription?: string
  category: string
  subcategory?: string
  brand?: string
  sku: string
  price: number
  comparePrice?: number
  cost?: number
  status: 'active' | 'inactive' | 'draft' | 'archived'
  inventory: {
    quantity: number
    lowStockThreshold: number
    trackQuantity: boolean
    allowBackorder: boolean
  }
  images: ProductImage[]
  specifications: ProductSpecification[]
  features: string[]
  tags: string[]
  seo: {
    title?: string
    description?: string
    keywords?: string[]
  }
  shipping: {
    weight: number
    dimensions: {
      length: number
      width: number
      height: number
    }
    freeShipping: boolean
    shippingClass?: string
  }
  reviews: {
    averageRating: number
    totalReviews: number
    reviews: ProductReview[]
  }
  analytics: {
    views: number
    sales: number
    conversionRate: number
  }
  createdAt: string
  updatedAt: string
}

interface ProductPreviewProps {
  product: ProductPreviewData
  onEdit?: () => void
  onDelete?: () => void
  onDuplicate?: () => void
  onViewAnalytics?: () => void
}

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`product-tabpanel-${index}`}
      aria-labelledby={`product-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  )
}

export function ProductPreview({ 
  product, 
  onEdit, 
  onDelete, 
  onDuplicate, 
  onViewAnalytics 
}: ProductPreviewProps) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'))
  
  const [selectedImage, setSelectedImage] = useState(product.images[0]?.url || '')
  const [tabValue, setTabValue] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success'
      case 'inactive':
        return 'warning'
      case 'draft':
        return 'info'
      case 'archived':
        return 'error'
      default:
        return 'default'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active'
      case 'inactive':
        return 'Inactive'
      case 'draft':
        return 'Draft'
      case 'archived':
        return 'Archived'
      default:
        return status
    }
  }

  const getInventoryStatus = () => {
    if (product.inventory.quantity === 0) {
      return { color: 'error', label: 'Out of Stock', icon: <WarningIcon /> }
    } else if (product.inventory.quantity <= product.inventory.lowStockThreshold) {
      return { color: 'warning', label: 'Low Stock', icon: <WarningIcon /> }
    } else {
      return { color: 'success', label: 'In Stock', icon: <CheckCircleIcon /> }
    }
  }

  const inventoryStatus = getInventoryStatus()

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  return (
    <Box sx={{ maxWidth: '100%', mx: 'auto' }}>
      {/* Product Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
              {product.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <Chip
                label={getStatusLabel(product.status)}
                color={getStatusColor(product.status) as any}
                size="small"
              />
              <Chip
                label={inventoryStatus.label}
                color={inventoryStatus.color as any}
                size="small"
                icon={inventoryStatus.icon}
              />
              <Chip
                label={product.category}
                variant="outlined"
                size="small"
                icon={<CategoryIcon />}
              />
            </Box>
            <Typography variant="body2" color="text.secondary">
              SKU: {product.sku} • Created {safeFormatDate(product.createdAt)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              onClick={() => setIsFavorite(!isFavorite)}
              color={isFavorite ? 'error' : 'default'}
            >
              {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
            <IconButton>
              <ShareIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Left Column - Images and Basic Info */}
        <Grid item xs={12} lg={6}>
          {/* Product Images */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <InventoryIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Product Images
                </Typography>
              </Box>
              
              {/* Main Image */}
              <Box sx={{ mb: 2, textAlign: 'center' }}>
                <Box
                  component="img"
                  src={selectedImage}
                  alt={product.name}
                  sx={{
                    maxWidth: '100%',
                    maxHeight: 400,
                    borderRadius: 2,
                    boxShadow: theme.shadows[4],
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'scale(1.02)',
                      transition: 'transform 0.2s ease-in-out',
                    },
                  }}
                />
              </Box>

              {/* Thumbnail Images */}
              {product.images.length > 1 && (
                <ImageList
                  sx={{ width: '100%', height: 100 }}
                  cols={product.images.length}
                  rowHeight={100}
                >
                  {product.images.map((image) => (
                    <ImageListItem key={image.id}>
                      <Box
                        component="img"
                        src={image.url}
                        alt={image.alt}
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          borderRadius: 1,
                          cursor: 'pointer',
                          border: selectedImage === image.url ? 2 : 1,
                          borderColor: selectedImage === image.url ? 'primary.main' : 'divider',
                          '&:hover': {
                            borderColor: 'primary.main',
                          },
                        }}
                        onClick={() => setSelectedImage(image.url)}
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
              )}
            </CardContent>
          </Card>

          {/* Product Details */}
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <InfoIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Product Details
                </Typography>
              </Box>
              
              <List dense>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon>
                    <MoneyIcon sx={{ color: 'text.secondary' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Price"
                    secondary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                          {formatCurrency(product.price)}
                        </Typography>
                        {product.comparePrice && (
                          <Typography
                            variant="body2"
                            sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
                          >
                            {formatCurrency(product.comparePrice)}
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                </ListItem>
                
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon>
                    <InventoryIcon sx={{ color: 'text.secondary' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Inventory"
                    secondary={`${product.inventory.quantity} units available`}
                  />
                </ListItem>

                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon>
                    <StarIcon sx={{ color: 'text.secondary' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Rating"
                    secondary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Rating value={product.reviews.averageRating} readOnly size="small" />
                        <Typography variant="body2" color="text.secondary">
                          ({product.reviews.totalReviews} reviews)
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>

                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon>
                    <VisibilityIcon sx={{ color: 'text.secondary' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Views"
                    secondary={`${product.analytics.views.toLocaleString()} views`}
                  />
                </ListItem>

                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon>
                    <ShoppingCartIcon sx={{ color: 'text.secondary' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Sales"
                    secondary={`${product.analytics.sales} sold`}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column - Tabs with Details */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="product details tabs">
                  <Tab label="Description" />
                  <Tab label="Specifications" />
                  <Tab label="Reviews" />
                  <Tab label="Analytics" />
                </Tabs>
              </Box>

              <TabPanel value={tabValue} index={0}>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {product.description}
                </Typography>
                
                {product.features.length > 0 && (
                  <Box>
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                      Key Features
                    </Typography>
                    <List dense>
                      {product.features.map((feature, index) => (
                        <ListItem key={index} sx={{ px: 0 }}>
                          <ListItemIcon>
                            <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20 }} />
                          </ListItemIcon>
                          <ListItemText primary={feature} />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}

                {product.tags.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                      Tags
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {product.tags.map((tag, index) => (
                        <Chip key={index} label={tag} size="small" variant="outlined" />
                      ))}
                    </Box>
                  </Box>
                )}
              </TabPanel>

              <TabPanel value={tabValue} index={1}>
                <List>
                  {product.specifications.map((spec, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemIcon>
                        {spec.icon || <InfoIcon sx={{ color: 'text.secondary' }} />}
                      </ListItemIcon>
                      <ListItemText
                        primary={spec.name}
                        secondary={spec.value}
                      />
                    </ListItem>
                  ))}
                </List>
              </TabPanel>

              <TabPanel value={tabValue} index={2}>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Rating value={product.reviews.averageRating} readOnly />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {product.reviews.averageRating.toFixed(1)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ({product.reviews.totalReviews} reviews)
                    </Typography>
                  </Box>
                </Box>

                <List>
                  {product.reviews.reviews.slice(0, 3).map((review) => (
                    <ListItem key={review.id} sx={{ px: 0, alignItems: 'flex-start' }}>
                      <ListItemIcon>
                        <Avatar src={review.customerAvatar} sx={{ width: 32, height: 32 }}>
                          {review.customerName.charAt(0)}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              {review.customerName}
                            </Typography>
                            {review.verified && (
                              <Chip label="Verified" size="small" color="success" />
                            )}
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Rating value={review.rating} readOnly size="small" sx={{ mb: 0.5 }} />
                            <Typography variant="body2" color="text.secondary">
                              {review.comment}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {safeFormatDate(review.date)}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </TabPanel>

              <TabPanel value={tabValue} index={3}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                        {product.analytics.views.toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Views
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                        {product.analytics.sales}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Sales
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ textAlign: 'center', p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.main' }}>
                        {product.analytics.conversionRate.toFixed(1)}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Conversion Rate
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </TabPanel>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default ProductPreview
