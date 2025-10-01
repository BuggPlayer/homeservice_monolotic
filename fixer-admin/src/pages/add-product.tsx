import React, { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Chip,
  IconButton,
  Divider,
  Alert,
  useTheme,
  useMediaQuery,
  Stack,
  Paper,
  InputAdornment,
  Autocomplete,
} from '@mui/material'
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  CloudUpload as UploadIcon,
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  Image as ImageIcon,
  Inventory as PackageIcon,
  AttachMoney as DollarIcon,
  Scale as ScaleIcon,
  Category as CategoryIcon,
  Tag as TagIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material'
import { Product, Category } from '../types'
import { formatCurrency } from '../lib/utils'
import staticData from '../data/staticData.json'

interface ProductFormData {
  name: string
  description: string
  price: number
  originalPrice: number
  sku: string
  stockQuantity: number
  categoryId: number
  providerId: number
  weight: number
  dimensions: {
    length: number
    width: number
    height: number
  }
  tags: string[]
  specifications: Array<{
    key: string
    value: string
  }>
  images: string[]
  isActive: boolean
  isFeatured: boolean
}

const initialFormData: ProductFormData = {
  name: '',
  description: '',
  price: 0,
  originalPrice: 0,
  sku: '',
  stockQuantity: 0,
  categoryId: 1,
  providerId: 1,
  weight: 0,
  dimensions: {
    length: 0,
    width: 0,
    height: 0,
  },
  tags: [],
  specifications: [{ key: '', value: '' }],
  images: [],
  isActive: true,
  isFeatured: false,
}

export function AddProduct() {
  const [formData, setFormData] = useState<ProductFormData>(initialFormData)
  const [errors, setErrors] = useState<Partial<ProductFormData>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [newTag, setNewTag] = useState('')
  const [newSpecKey, setNewSpecKey] = useState('')
  const [newSpecValue, setNewSpecValue] = useState('')

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const categories = staticData.categories
  const providers = staticData.serviceProviders

  const handleInputChange = (field: keyof ProductFormData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any
  ) => {
    const value = event.target.value
    setFormData(prev => ({
      ...prev,
      [field]: field === 'price' || field === 'originalPrice' || field === 'stockQuantity' || field === 'weight' 
        ? Number(value) || 0 
        : value,
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined,
      }))
    }
  }

  const handleNestedInputChange = (parentField: keyof ProductFormData, childField: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = Number(event.target.value) || 0
    setFormData(prev => ({
      ...prev,
      [parentField]: {
        ...prev[parentField] as any,
        [childField]: value,
      },
    }))
  }

  const handleSpecificationChange = (index: number, field: 'key' | 'value', value: string) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.map((spec, i) =>
        i === index ? { ...spec, [field]: value } : spec
      ),
    }))
  }

  const addSpecification = () => {
    if (newSpecKey && newSpecValue) {
      setFormData(prev => ({
        ...prev,
        specifications: [...prev.specifications, { key: newSpecKey, value: newSpecValue }],
      }))
      setNewSpecKey('')
      setNewSpecValue('')
    }
  }

  const removeSpecification = (index: number) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index),
    }))
  }

  const addTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag],
      }))
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }))
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<ProductFormData> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Product description is required'
    }

    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0'
    }

    if (formData.originalPrice < 0) {
      newErrors.originalPrice = 'Original price cannot be negative'
    }

    if (!formData.sku.trim()) {
      newErrors.sku = 'SKU is required'
    }

    if (formData.stockQuantity < 0) {
      newErrors.stockQuantity = 'Stock quantity cannot be negative'
    }

    if (formData.weight < 0) {
      newErrors.weight = 'Weight cannot be negative'
    }

    if (formData.dimensions.length < 0 || formData.dimensions.width < 0 || formData.dimensions.height < 0) {
      newErrors.dimensions = 'Dimensions cannot be negative'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      console.log('Product data to submit:', formData)
      // Handle product creation logic here
      
      // Reset form after successful submission
      setFormData(initialFormData)
    } catch (error) {
      console.error('Error creating product:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveDraft = () => {
    console.log('Saving draft:', formData)
    // Handle draft save logic here
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <IconButton sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Add New Product
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Create a new product for your catalog
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Main Form */}
        <Grid item xs={12} lg={8}>
          <Stack spacing={3}>
            {/* Basic Information */}
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PackageIcon />
                  Basic Information
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Product Name"
                      value={formData.name}
                      onChange={handleInputChange('name')}
                      error={!!errors.name}
                      helperText={errors.name}
                      placeholder="Enter product name"
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Description"
                      multiline
                      rows={4}
                      value={formData.description}
                      onChange={handleInputChange('description')}
                      error={!!errors.description}
                      helperText={errors.description}
                      placeholder="Enter detailed product description"
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth error={!!errors.categoryId}>
                      <InputLabel>Category</InputLabel>
                      <Select
                        value={formData.categoryId}
                        label="Category"
                        onChange={handleInputChange('categoryId')}
                      >
                        {categories.map(category => (
                          <MenuItem key={category.id} value={category.id}>
                            {category.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Provider</InputLabel>
                      <Select
                        value={formData.providerId}
                        label="Provider"
                        onChange={handleInputChange('providerId')}
                      >
                        {providers.map(provider => (
                          <MenuItem key={provider.id} value={provider.id}>
                            {provider.business_name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Pricing & Inventory */}
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <DollarIcon />
                  Pricing & Inventory
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Price"
                      type="number"
                      value={formData.price}
                      onChange={handleInputChange('price')}
                      error={!!errors.price}
                      helperText={errors.price}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Original Price"
                      type="number"
                      value={formData.originalPrice}
                      onChange={handleInputChange('originalPrice')}
                      error={!!errors.originalPrice}
                      helperText={errors.originalPrice}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="SKU"
                      value={formData.sku}
                      onChange={handleInputChange('sku')}
                      error={!!errors.sku}
                      helperText={errors.sku}
                      placeholder="e.g., PROD-001"
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Stock Quantity"
                      type="number"
                      value={formData.stockQuantity}
                      onChange={handleInputChange('stockQuantity')}
                      error={!!errors.stockQuantity}
                      helperText={errors.stockQuantity}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Physical Properties */}
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ScaleIcon />
                  Physical Properties
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Weight (lbs)"
                      type="number"
                      value={formData.weight}
                      onChange={handleInputChange('weight')}
                      error={!!errors.weight}
                      helperText={errors.weight}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={2}>
                    <TextField
                      fullWidth
                      label="Length"
                      type="number"
                      value={formData.dimensions.length}
                      onChange={handleNestedInputChange('dimensions', 'length')}
                      error={!!errors.dimensions}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={2}>
                    <TextField
                      fullWidth
                      label="Width"
                      type="number"
                      value={formData.dimensions.width}
                      onChange={handleNestedInputChange('dimensions', 'width')}
                      error={!!errors.dimensions}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={2}>
                    <TextField
                      fullWidth
                      label="Height"
                      type="number"
                      value={formData.dimensions.height}
                      onChange={handleNestedInputChange('dimensions', 'height')}
                      error={!!errors.dimensions}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TagIcon />
                  Tags
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                    {formData.tags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        onDelete={() => removeTag(tag)}
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Stack>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth
                    label="Add Tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addTag()
                      }
                    }}
                  />
                  <Button
                    variant="outlined"
                    onClick={addTag}
                    disabled={!newTag}
                    startIcon={<AddIcon />}
                  >
                    Add
                  </Button>
                </Box>
              </CardContent>
            </Card>

            {/* Specifications */}
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <DescriptionIcon />
                  Specifications
                </Typography>
                
                <Stack spacing={2}>
                  {formData.specifications.map((spec, index) => (
                    <Box key={index} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <TextField
                        fullWidth
                        label="Key"
                        value={spec.key}
                        onChange={(e) => handleSpecificationChange(index, 'key', e.target.value)}
                        size="small"
                      />
                      <TextField
                        fullWidth
                        label="Value"
                        value={spec.value}
                        onChange={(e) => handleSpecificationChange(index, 'value', e.target.value)}
                        size="small"
                      />
                      <IconButton
                        onClick={() => removeSpecification(index)}
                        color="error"
                        disabled={formData.specifications.length === 1}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  ))}
                  
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      fullWidth
                      label="New Key"
                      value={newSpecKey}
                      onChange={(e) => setNewSpecKey(e.target.value)}
                      size="small"
                    />
                    <TextField
                      fullWidth
                      label="New Value"
                      value={newSpecValue}
                      onChange={(e) => setNewSpecValue(e.target.value)}
                      size="small"
                    />
                    <Button
                      variant="outlined"
                      onClick={addSpecification}
                      disabled={!newSpecKey || !newSpecValue}
                      startIcon={<AddIcon />}
                    >
                      Add
                    </Button>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} lg={4}>
          <Stack spacing={3}>
            {/* Status & Settings */}
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  Status & Settings
                </Typography>
                
                <Stack spacing={2}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.isActive}
                        onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                      />
                    }
                    label="Active"
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.isFeatured}
                        onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                      />
                    }
                    label="Featured"
                  />
                </Stack>
              </CardContent>
            </Card>

            {/* Images */}
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ImageIcon />
                  Product Images
                </Typography>
                
                <Box
                  sx={{
                    border: '2px dashed',
                    borderColor: 'grey.300',
                    borderRadius: 2,
                    p: 3,
                    textAlign: 'center',
                    cursor: 'pointer',
                    '&:hover': {
                      borderColor: 'primary.main',
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  <UploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="body2" color="text.secondary">
                    Click to upload images or drag and drop
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    PNG, JPG up to 10MB each
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  Actions
                </Typography>
                
                <Stack spacing={2}>
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    onClick={handleSubmit}
                    disabled={isLoading}
                    startIcon={<SaveIcon />}
                  >
                    {isLoading ? 'Creating...' : 'Create Product'}
                  </Button>
                  
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={handleSaveDraft}
                    startIcon={<SaveIcon />}
                  >
                    Save as Draft
                  </Button>
                  
                  <Button
                    variant="text"
                    fullWidth
                    onClick={() => setFormData(initialFormData)}
                  >
                    Reset Form
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  )
}
