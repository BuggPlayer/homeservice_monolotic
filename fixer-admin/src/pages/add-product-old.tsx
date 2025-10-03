import React, { useState, useCallback, useRef } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,

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
  Tabs,
  Tab,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Badge,
  Avatar,
  Tooltip,
  
  LinearProgress,
  Fade,
  Zoom,
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
  ExpandMore as ExpandMoreIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  LocalShipping as ShippingIcon,
  Search as SeoIcon,
  Palette as ColorIcon,
  Straighten as SizeIcon,
  Star as StarIcon,
  TrendingUp as TrendingIcon,
  Security as SecurityIcon,
  Schedule as ScheduleIcon,
  Language as LanguageIcon,
  Public as PublicIcon,
  Lock as LockIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Close as CloseIcon,
  Edit as EditIcon,
  DragIndicator as DragIcon,
  ZoomIn as ZoomInIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'
import { useDropzone } from 'react-dropzone'
import { Product, Category } from '../types'
import { formatCurrency } from '../lib/utils'
import staticData from '../data/staticData.json'

// Import common form components
import {
  FormField,
  SelectField,
  RichTextField,
  ImageUploadField,
  SpecificationField,
  TagField,
  SwitchField,
  DateField,
  type SelectOption,
  type ImageFile,
  type Specification,
} from '../components/forms'

interface ProductFormData {
  // Basic Information
  name: string
  shortDescription: string
  description: string
  brand: string
  model: string
  barcode: string
  
  // Pricing & Inventory
  price: number
  originalPrice: number
  costPrice: number
  sku: string
  stockQuantity: number
  lowStockThreshold: number
  trackInventory: boolean
  allowBackorder: boolean
  
  // Categorization
  categoryId: number
  subcategoryId: number
  providerId: number
  tags: string[]
  collections: string[]
  
  // Physical Properties
  weight: number
  weightUnit: string
  dimensions: {
    length: number
    width: number
    height: number
    unit: string
  }
  
  // Product Variants
  variants: Array<{
    id: string
    name: string
    sku: string
    price: number
    stock: number
    attributes: Array<{
      name: string
    value: string
  }>
  images: string[]
  }>
  
  // SEO & Marketing
  seoTitle: string
  seoDescription: string
  seoKeywords: string[]
  metaTags: string[]
  isFeatured: boolean
  isNew: boolean
  isOnSale: boolean
  featuredUntil: string
  
  // Shipping & Handling
  shippingWeight: number
  shippingDimensions: {
    length: number
    width: number
    height: number
  }
  requiresShipping: boolean
  freeShipping: boolean
  shippingClass: string
  handlingTime: number
  
  // Digital Product
  isDigital: boolean
  downloadLimit: number
  downloadExpiry: number
  digitalFiles: string[]
  
  // Advanced Settings
  specifications: Specification[]
  customFields: Array<{
    name: string
    value: string
    type: string
  }>
  relatedProducts: number[]
  crossSellProducts: number[]
  upSellProducts: number[]
  
  // Media
  images: ImageFile[]
  videos: Array<{
    id: string
    url: string
    type: string
    thumbnail: string
  }>
  
  // Status & Visibility
  isActive: boolean
  visibility: 'public' | 'private' | 'password'
  password: string
  publishDate: string
  expiryDate: string
  
  // Tax & Compliance
  taxClass: string
  taxStatus: 'taxable' | 'shipping' | 'none'
  customsInfo: {
    hsCode: string
    countryOfOrigin: string
    customsDescription: string
  }
  
  // Warranty & Support
  warrantyPeriod: number
  warrantyType: string
  supportEmail: string
  supportPhone: string
  instructionManual: string
}

const initialFormData: ProductFormData = {
  // Basic Information
  name: '',
  shortDescription: '',
  description: '',
  brand: '',
  model: '',
  barcode: '',
  
  // Pricing & Inventory
  price: 0,
  originalPrice: 0,
  costPrice: 0,
  sku: '',
  stockQuantity: 0,
  lowStockThreshold: 5,
  trackInventory: true,
  allowBackorder: false,
  
  // Categorization
  categoryId: 1,
  subcategoryId: 0,
  providerId: 1,
  tags: [],
  collections: [],
  
  // Physical Properties
  weight: 0,
  weightUnit: 'lbs',
  dimensions: {
    length: 0,
    width: 0,
    height: 0,
    unit: 'in',
  },
  
  // Product Variants
  variants: [],
  
  // SEO & Marketing
  seoTitle: '',
  seoDescription: '',
  seoKeywords: [],
  metaTags: [],
  isFeatured: false,
  isNew: false,
  isOnSale: false,
  featuredUntil: '',
  
  // Shipping & Handling
  shippingWeight: 0,
  shippingDimensions: {
    length: 0,
    width: 0,
    height: 0,
  },
  requiresShipping: true,
  freeShipping: false,
  shippingClass: 'standard',
  handlingTime: 1,
  
  // Digital Product
  isDigital: false,
  downloadLimit: 0,
  downloadExpiry: 0,
  digitalFiles: [],
  
  // Advanced Settings
  specifications: [{ key: '', value: '', group: 'General' }],
  customFields: [],
  relatedProducts: [],
  crossSellProducts: [],
  upSellProducts: [],
  
  // Media
  images: [],
  videos: [],
  
  // Status & Visibility
  isActive: true,
  visibility: 'public',
  password: '',
  publishDate: new Date().toISOString().split('T')[0],
  expiryDate: '',
  
  // Tax & Compliance
  taxClass: 'standard',
  taxStatus: 'taxable',
  customsInfo: {
    hsCode: '',
    countryOfOrigin: '',
    customsDescription: '',
  },
  
  // Warranty & Support
  warrantyPeriod: 0,
  warrantyType: 'manufacturer',
  supportEmail: '',
  supportPhone: '',
  instructionManual: '',
}

export function AddProduct() {
  const [formData, setFormData] = useState<ProductFormData>(initialFormData)
  const [errors, setErrors] = useState<Partial<ProductFormData>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const [activeStep, setActiveStep] = useState(0)
  const [newTag, setNewTag] = useState('')
  const [newSpecKey, setNewSpecKey] = useState('')
  const [newSpecValue, setNewSpecValue] = useState('')
  const [newSpecGroup, setNewSpecGroup] = useState('General')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const quillRef = useRef<ReactQuill>(null)

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const categories = staticData.categories
  const providers = staticData.serviceProviders

  // Quill editor configuration
  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['link', 'image', 'video'],
      ['clean']
    ],
  }

  const quillFormats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'color', 'background', 'list', 'bullet', 'indent',
    'align', 'link', 'image', 'video'
  ]

  // Image upload handlers
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      url: URL.createObjectURL(file),
      alt: file.name,
      isPrimary: uploadedFiles.length === 0,
      order: uploadedFiles.length,
      file: file
    }))
    
    setUploadedFiles(prev => [...prev, ...acceptedFiles])
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newFiles]
    }))
  }, [uploadedFiles.length])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    multiple: true
  })

  const removeImage = (imageId: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(img => img.id !== imageId)
    }))
  }

  const setPrimaryImage = (imageId: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map(img => ({
        ...img,
        isPrimary: img.id === imageId
      }))
    }))
  }

  const handleInputChange = (field: keyof ProductFormData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any
  ) => {
    const value = event.target.value
    setFormData(prev => ({
      ...prev,
      [field]: field === 'price' || field === 'originalPrice' || field === 'costPrice' || field === 'stockQuantity' || field === 'weight' || field === 'lowStockThreshold' || field === 'handlingTime' || field === 'downloadLimit' || field === 'downloadExpiry' || field === 'warrantyPeriod'
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

  const handleDescriptionChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      description: value
    }))
  }

  const handleNestedInputChange = (parentField: keyof ProductFormData, childField: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.type === 'number' ? Number(event.target.value) || 0 : event.target.value
    setFormData(prev => ({
      ...prev,
      [parentField]: {
        ...prev[parentField] as any,
        [childField]: value,
      },
    }))
  }

  const handleSpecificationChange = (index: number, field: 'key' | 'value' | 'group', value: string) => {
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
        specifications: [...prev.specifications, { key: newSpecKey, value: newSpecValue, group: newSpecGroup }],
      }))
      setNewSpecKey('')
      setNewSpecValue('')
      setNewSpecGroup('General')
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

  const addCollection = (collection: string) => {
    if (collection && !formData.collections.includes(collection)) {
      setFormData(prev => ({
        ...prev,
        collections: [...prev.collections, collection],
      }))
    }
  }

  const removeCollection = (collectionToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      collections: prev.collections.filter(collection => collection !== collectionToRemove),
    }))
  }

  const validateForm = (): boolean => {
    const newErrors: any = {}

    // Basic validation
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required'
    }

    if (!formData.shortDescription.trim()) {
      newErrors.shortDescription = 'Short description is required'
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

    // SEO validation
    if (formData.seoTitle && formData.seoTitle.length > 60) {
      newErrors.seoTitle = 'SEO title should be under 60 characters'
    }

    if (formData.seoDescription && formData.seoDescription.length > 160) {
      newErrors.seoDescription = 'SEO description should be under 160 characters'
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

  const steps = [
    'Basic Information',
    'Pricing & Inventory',
    'Media & SEO',
    'Shipping & Variants',
    'Advanced Settings',
    'Review & Publish'
  ]

  return (
    <Box sx={{ flexGrow: 1, bgcolor: 'grey.50', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ 
        bgcolor: 'white', 
        borderBottom: 1, 
        borderColor: 'divider',
        px: 3,
        py: 2,
        mb: 3
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton sx={{ mr: 2, color: 'primary.main' }}>
          <ArrowBackIcon />
        </IconButton>
        <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5, color: 'text.primary' }}>
                Create New Product
          </Typography>
              <Typography variant="body2" color="text.secondary">
                Build a comprehensive product listing with all necessary details
          </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<SaveIcon />}
              onClick={handleSaveDraft}
            >
              Save Draft
            </Button>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSubmit}
              disabled={isLoading}
              sx={{ minWidth: 140 }}
            >
              {isLoading ? 'Creating...' : 'Create Product'}
            </Button>
          </Box>
        </Box>
      </Box>

      <Box sx={{ px: 3 }}>
        {/* Progress Stepper */}
        <Card sx={{ mb: 3, overflow: 'visible' }}>
          <CardContent sx={{ pb: 2 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel
                    onClick={() => setActiveStep(index)}
                    sx={{ cursor: 'pointer' }}
                  >
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </CardContent>
        </Card>

        <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', lg: 'row' } }}>
        {/* Main Form */}
          <Box sx={{ flex: { xs: 1, lg: 2 } }}>
          <Stack spacing={3}>
              {/* Step 1: Basic Information */}
              {activeStep === 0 && (
                <Fade in={true}>
            <Card>
              <CardContent>
                      <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main' }}>
                  <PackageIcon />
                  Basic Information
                </Typography>
                
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <Box>
                          <FormField
                      label="Product Name"
                      value={formData.name}
                      onChange={handleInputChange('name')}
                            error={errors.name}
                            helperText="Enter a clear, descriptive product name"
                            placeholder="e.g., Professional Wireless Headphones"
                            required
                          />
                        </Box>
                  
                        <Box>
                          <FormField
                            label="Short Description"
                            value={formData.shortDescription}
                            onChange={handleInputChange('shortDescription')}
                            error={errors.shortDescription}
                            helperText="Brief description for product cards and search results"
                            placeholder="Brief, compelling description of your product"
                      multiline
                            rows={2}
                            required
                          />
                        </Box>
                        
                        <Box>
                          <RichTextField
                            label="Detailed Description"
                      value={formData.description}
                            onChange={handleDescriptionChange}
                            error={errors.description}
                            helperText="Create a detailed, compelling description of your product"
                            placeholder="Start typing your detailed product description..."
                            required
                            height={200}
                          />
                        </Box>
                        
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <Box sx={{ flex: 1 }}>
                            <FormField
                              label="Brand"
                              value={formData.brand}
                              onChange={handleInputChange('brand')}
                              placeholder="e.g., Apple, Samsung"
                              helperText="Product brand or manufacturer"
                            />
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <FormField
                              label="Model"
                              value={formData.model}
                              onChange={handleInputChange('model')}
                              placeholder="e.g., iPhone 15 Pro"
                              helperText="Product model number"
                            />
                          </Box>
                        </Box>
                        
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <Box sx={{ flex: 1 }}>
                            <FormField
                              label="Barcode / UPC"
                              value={formData.barcode}
                              onChange={handleInputChange('barcode')}
                              placeholder="123456789012"
                              helperText="Product barcode or UPC code"
                            />
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <SelectField
                        label="Category"
                              value={formData.categoryId}
                        onChange={handleInputChange('categoryId')}
                              options={categories.map(category => ({
                                value: category.id,
                                label: category.name
                              }))}
                              error={errors.categoryId}
                              helperText="Select product category"
                              required
                            />
                          </Box>
                        </Box>
                        
                        <Box>
                          <SelectField
                        label="Provider"
                            value={formData.providerId}
                        onChange={handleInputChange('providerId')}
                            options={providers.map(provider => ({
                              value: provider.id,
                              label: provider.business_name
                            }))}
                            helperText="Select service provider"
                          />
                        </Box>
                      </Box>
              </CardContent>
            </Card>
                </Fade>
              )}

              {/* Step 2: Pricing & Inventory */}
              {activeStep === 1 && (
                <Fade in={true}>
            <Card>
              <CardContent>
                      <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main' }}>
                  <DollarIcon />
                  Pricing & Inventory
                </Typography>
                
                      <Box container spacing={3}>
                        <Box item xs={12} sm={4}>
                    <TextField
                      fullWidth
                            label="Selling Price *"
                      type="number"
                      value={formData.price}
                      onChange={handleInputChange('price')}
                      error={!!errors.price}
                            helperText={errors.price || 'Customer-facing price'}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                            variant="outlined"
                    />
                        </Box>
                  
                        <Box item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Original Price"
                      type="number"
                      value={formData.originalPrice}
                      onChange={handleInputChange('originalPrice')}
                      error={!!errors.originalPrice}
                            helperText={errors.originalPrice || 'MSRP or regular price'}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                            variant="outlined"
                    />
                        </Box>
                  
                        <Box item xs={12} sm={4}>
                    <TextField
                      fullWidth
                            label="Cost Price"
                            type="number"
                            value={formData.costPrice}
                            onChange={handleInputChange('costPrice')}
                            helperText="Your cost for profit calculation"
                            InputProps={{
                              startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                            variant="outlined"
                          />
                        </Box>
                        
                        <Box item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="SKU *"
                      value={formData.sku}
                      onChange={handleInputChange('sku')}
                      error={!!errors.sku}
                            helperText={errors.sku || 'Unique product identifier'}
                      placeholder="e.g., PROD-001"
                            variant="outlined"
                    />
                        </Box>
                  
                        <Box item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Stock Quantity"
                      type="number"
                      value={formData.stockQuantity}
                      onChange={handleInputChange('stockQuantity')}
                      error={!!errors.stockQuantity}
                            helperText={errors.stockQuantity || 'Available inventory'}
                            variant="outlined"
                          />
                        </Box>
                        
                        <Box item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Low Stock Threshold"
                            type="number"
                            value={formData.lowStockThreshold}
                            onChange={handleInputChange('lowStockThreshold')}
                            helperText="Alert when stock falls below this number"
                            variant="outlined"
                          />
                        </Box>
                        
                        <Box item xs={12} sm={6}>
                          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', height: '100%' }}>
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={formData.trackInventory}
                                  onChange={(e) => setFormData(prev => ({ ...prev, trackInventory: e.target.checked }))}
                                />
                              }
                              label="Track Inventory"
                            />
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={formData.allowBackorder}
                                  onChange={(e) => setFormData(prev => ({ ...prev, allowBackorder: e.target.checked }))}
                                />
                              }
                              label="Allow Backorder"
                            />
                          </Box>
                        </Box>
                      </Box>
              </CardContent>
            </Card>
                </Fade>
              )}

              {/* Step 3: Media & SEO */}
              {activeStep === 2 && (
                <Fade in={true}>
                  <Stack spacing={3}>
                    {/* Image Upload */}
                    <Card>
                      <CardContent>
                        <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main' }}>
                          <ImageIcon />
                          Product Images
                        </Typography>
                        
                        <Box
                          {...getRootProps()}
                          sx={{
                            border: '2px dashed',
                            borderColor: isDragActive ? 'primary.main' : 'grey.300',
                            borderRadius: 2,
                            p: 4,
                            textAlign: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                              borderColor: 'primary.main',
                              backgroundColor: 'action.hover',
                            },
                          }}
                        >
                          <input {...getInputProps()} />
                          <UploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                          <Typography variant="h6" sx={{ mb: 1 }}>
                            {isDragActive ? 'Drop images here' : 'Upload Product Images'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Drag and drop images here, or click to select files
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            PNG, JPG, GIF, WebP up to 10MB each
                          </Typography>
                        </Box>
                        
                        {/* Image Gallery */}
                        {formData.images.length > 0 && (
                          <Box sx={{ mt: 3 }}>
                            <Typography variant="subtitle2" sx={{ mb: 2 }}>
                              Uploaded Images ({formData.images.length})
                            </Typography>
                            <Box container spacing={2}>
                              {formData.images.map((image, index) => (
                                <Box item xs={6} sm={4} md={3} key={image.id}>
                                  <Box sx={{ position: 'relative' }}>
                                    <Card sx={{ overflow: 'hidden' }}>
                                      <Box
                                        component="img"
                                        src={image.url}
                                        alt={image.alt}
                                        sx={{
                                          width: '100%',
                                          height: 120,
                                          objectFit: 'cover',
                                          cursor: 'pointer'
                                        }}
                                        onClick={() => setImagePreview(image.url)}
                                      />
                                      {image.isPrimary && (
                                        <Chip
                                          label="Primary"
                                          color="primary"
                                          size="small"
                                          sx={{
                                            position: 'absolute',
                                            top: 8,
                                            left: 8,
                                          }}
                                        />
                                      )}
                                    </Card>
                                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                      <Button
                                        size="small"
                                        variant={image.isPrimary ? "contained" : "outlined"}
                                        onClick={() => setPrimaryImage(image.id)}
                                        startIcon={<StarIcon />}
                                      >
                                        {image.isPrimary ? 'Primary' : 'Set Primary'}
                                      </Button>
                                      <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() => removeImage(image.id)}
                                      >
                                        <DeleteIcon />
                                      </IconButton>
                                    </Box>
                                  </Box>
                                </Box>
                              ))}
                            </Box>
                          </Box>
                        )}
                      </CardContent>
                    </Card>

                    {/* SEO Settings */}
                    <Card>
                      <CardContent>
                        <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main' }}>
                          <SeoIcon />
                          SEO & Marketing
                        </Typography>
                        
                        <Box container spacing={3}>
                          <Box item xs={12}>
                            <TextField
                              fullWidth
                              label="SEO Title"
                              value={formData.seoTitle}
                              onChange={handleInputChange('seoTitle')}
                              error={!!errors.seoTitle}
                              helperText={errors.seoTitle || `${formData.seoTitle.length}/60 characters`}
                              placeholder="Optimized title for search engines"
                              variant="outlined"
                            />
                          </Box>
                          
                          <Box item xs={12}>
                            <TextField
                              fullWidth
                              label="SEO Description"
                              multiline
                              rows={3}
                              value={formData.seoDescription}
                              onChange={handleInputChange('seoDescription')}
                              error={!!errors.seoDescription}
                              helperText={errors.seoDescription || `${formData.seoDescription.length}/160 characters`}
                              placeholder="Meta description for search results"
                              variant="outlined"
                            />
                          </Box>
                          
                          <Box item xs={12}>
                            <Autocomplete
                              multiple
                              freeSolo
                              options={[]}
                              value={formData.seoKeywords}
                              onChange={(event, newValue) => {
                                setFormData(prev => ({ ...prev, seoKeywords: newValue }))
                              }}
                              renderTags={(value, getTagProps) =>
                                value.map((option, index) => (
                                  <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                                ))
                              }
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="SEO Keywords"
                                  placeholder="Add keywords for better search visibility"
                                  variant="outlined"
                                />
                              )}
                            />
                          </Box>
                          
                          <Box item xs={12}>
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={formData.isFeatured}
                                    onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                                  />
                                }
                                label="Featured Product"
                              />
                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={formData.isNew}
                                    onChange={(e) => setFormData(prev => ({ ...prev, isNew: e.target.checked }))}
                                  />
                                }
                                label="New Product"
                              />
                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={formData.isOnSale}
                                    onChange={(e) => setFormData(prev => ({ ...prev, isOnSale: e.target.checked }))}
                                  />
                                }
                                label="On Sale"
                              />
                            </Box>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Stack>
                </Fade>
              )}

              {/* Step 4: Shipping & Variants */}
              {activeStep === 3 && (
                <Fade in={true}>
                  <Stack spacing={3}>
            {/* Physical Properties */}
            <Card>
              <CardContent>
                        <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main' }}>
                  <ScaleIcon />
                  Physical Properties
                </Typography>
                
                        <Box container spacing={3}>
                          <Box item xs={12} sm={6}>
                    <TextField
                      fullWidth
                              label="Weight"
                      type="number"
                      value={formData.weight}
                      onChange={handleInputChange('weight')}
                      error={!!errors.weight}
                              helperText={errors.weight || 'Product weight'}
                              InputProps={{
                                endAdornment: <InputAdornment position="end">{formData.weightUnit}</InputAdornment>,
                              }}
                              variant="outlined"
                            />
                          </Box>
                          
                          <Box item xs={12} sm={6}>
                            <FormControl fullWidth>
                              <InputLabel>Weight Unit</InputLabel>
                              <Select
                                value={formData.weightUnit}
                                label="Weight Unit"
                                onChange={(e) => setFormData(prev => ({ ...prev, weightUnit: e.target.value }))}
                              >
                                <MenuItem value="lbs">Pounds (lbs)</MenuItem>
                                <MenuItem value="kg">Kilograms (kg)</MenuItem>
                                <MenuItem value="oz">Ounces (oz)</MenuItem>
                                <MenuItem value="g">Grams (g)</MenuItem>
                              </Select>
                            </FormControl>
                          </Box>
                          
                          <Box item xs={12}>
                            <Typography variant="subtitle2" sx={{ mb: 2 }}>
                              Dimensions
                            </Typography>
                            <Box container spacing={2}>
                              <Box item xs={4}>
                    <TextField
                      fullWidth
                      label="Length"
                      type="number"
                      value={formData.dimensions.length}
                      onChange={handleNestedInputChange('dimensions', 'length')}
                      error={!!errors.dimensions}
                                  variant="outlined"
                    />
                              </Box>
                              <Box item xs={4}>
                    <TextField
                      fullWidth
                      label="Width"
                      type="number"
                      value={formData.dimensions.width}
                      onChange={handleNestedInputChange('dimensions', 'width')}
                      error={!!errors.dimensions}
                                  variant="outlined"
                    />
                              </Box>
                              <Box item xs={4}>
                    <TextField
                      fullWidth
                      label="Height"
                      type="number"
                      value={formData.dimensions.height}
                      onChange={handleNestedInputChange('dimensions', 'height')}
                      error={!!errors.dimensions}
                                  variant="outlined"
                                />
                              </Box>
                            </Box>
                          </Box>
                        </Box>
              </CardContent>
            </Card>

                    {/* Shipping Settings */}
            <Card>
              <CardContent>
                        <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main' }}>
                          <ShippingIcon />
                          Shipping & Handling
                        </Typography>
                        
                        <Box container spacing={3}>
                          <Box item xs={12} sm={6}>
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={formData.requiresShipping}
                                  onChange={(e) => setFormData(prev => ({ ...prev, requiresShipping: e.target.checked }))}
                                />
                              }
                              label="Requires Shipping"
                            />
                          </Box>
                          
                          <Box item xs={12} sm={6}>
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={formData.freeShipping}
                                  onChange={(e) => setFormData(prev => ({ ...prev, freeShipping: e.target.checked }))}
                                />
                              }
                              label="Free Shipping"
                            />
                          </Box>
                          
                          <Box item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Handling Time (days)"
                              type="number"
                              value={formData.handlingTime}
                              onChange={handleInputChange('handlingTime')}
                              helperText="Days to prepare for shipment"
                              variant="outlined"
                            />
                          </Box>
                          
                          <Box item xs={12} sm={6}>
                            <FormControl fullWidth>
                              <InputLabel>Shipping Class</InputLabel>
                              <Select
                                value={formData.shippingClass}
                                label="Shipping Class"
                                onChange={(e) => setFormData(prev => ({ ...prev, shippingClass: e.target.value }))}
                              >
                                <MenuItem value="standard">Standard</MenuItem>
                                <MenuItem value="express">Express</MenuItem>
                                <MenuItem value="overnight">Overnight</MenuItem>
                                <MenuItem value="fragile">Fragile</MenuItem>
                              </Select>
                            </FormControl>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>

                    {/* Tags & Collections */}
                    <Card>
                      <CardContent>
                        <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main' }}>
                  <TagIcon />
                          Tags & Collections
                </Typography>
                
                        <Box container spacing={3}>
                          <Box item xs={12}>
                            <Typography variant="subtitle2" sx={{ mb: 2 }}>
                              Product Tags
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
                                variant="outlined"
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
                          </Box>
                </Box>
              </CardContent>
            </Card>
                  </Stack>
                </Fade>
              )}

              {/* Step 5: Advanced Settings */}
              {activeStep === 4 && (
                <Fade in={true}>
                  <Stack spacing={3}>
            {/* Specifications */}
            <Card>
              <CardContent>
                        <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main' }}>
                  <DescriptionIcon />
                          Product Specifications
                </Typography>
                
                <Stack spacing={2}>
                  {formData.specifications.map((spec, index) => (
                    <Box key={index} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <TextField
                        fullWidth
                                label="Specification Key"
                        value={spec.key}
                        onChange={(e) => handleSpecificationChange(index, 'key', e.target.value)}
                        size="small"
                                variant="outlined"
                      />
                      <TextField
                        fullWidth
                        label="Value"
                        value={spec.value}
                        onChange={(e) => handleSpecificationChange(index, 'value', e.target.value)}
                        size="small"
                                variant="outlined"
                              />
                              <TextField
                                fullWidth
                                label="Group"
                                value={spec.group}
                                onChange={(e) => handleSpecificationChange(index, 'group', e.target.value)}
                                size="small"
                                variant="outlined"
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
                              variant="outlined"
                    />
                    <TextField
                      fullWidth
                      label="New Value"
                      value={newSpecValue}
                      onChange={(e) => setNewSpecValue(e.target.value)}
                      size="small"
                              variant="outlined"
                            />
                            <TextField
                              fullWidth
                              label="Group"
                              value={newSpecGroup}
                              onChange={(e) => setNewSpecGroup(e.target.value)}
                              size="small"
                              variant="outlined"
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

                    {/* Status & Visibility */}
            <Card>
              <CardContent>
                        <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main' }}>
                          <SecurityIcon />
                          Status & Visibility
                </Typography>
                
                        <Box container spacing={3}>
                          <Box item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.isActive}
                        onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                      />
                    }
                              label="Product Active"
                            />
                          </Box>
                          
                          <Box item xs={12} sm={6}>
                            <FormControl fullWidth>
                              <InputLabel>Visibility</InputLabel>
                              <Select
                                value={formData.visibility}
                                label="Visibility"
                                onChange={(e) => setFormData(prev => ({ ...prev, visibility: e.target.value as any }))}
                              >
                                <MenuItem value="public">Public</MenuItem>
                                <MenuItem value="private">Private</MenuItem>
                                <MenuItem value="password">Password Protected</MenuItem>
                              </Select>
                            </FormControl>
                          </Box>
                          
                          {formData.visibility === 'password' && (
                            <Box item xs={12}>
                              <TextField
                                fullWidth
                                label="Password"
                                type="password"
                                value={formData.password}
                                onChange={handleInputChange('password')}
                                helperText="Password to access this product"
                                variant="outlined"
                              />
                            </Box>
                          )}
                          
                          <Box item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Publish Date"
                              type="date"
                              value={formData.publishDate}
                              onChange={handleInputChange('publishDate')}
                              InputLabelProps={{ shrink: true }}
                              variant="outlined"
                            />
                          </Box>
                          
                          <Box item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Expiry Date"
                              type="date"
                              value={formData.expiryDate}
                              onChange={handleInputChange('expiryDate')}
                              InputLabelProps={{ shrink: true }}
                              variant="outlined"
                            />
                          </Box>
                        </Box>
              </CardContent>
            </Card>
                  </Stack>
                </Fade>
              )}

              {/* Step 6: Review & Publish */}
              {activeStep === 5 && (
                <Fade in={true}>
            <Card>
              <CardContent>
                      <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main' }}>
                        <CheckIcon />
                        Review & Publish
                </Typography>
                
                      <Alert severity="info" sx={{ mb: 3 }}>
                        Review all information before publishing your product. You can always edit these details later.
                      </Alert>
                      
                      <Box container spacing={3}>
                        <Box item xs={12} md={6}>
                          <Typography variant="h6" sx={{ mb: 2 }}>Product Summary</Typography>
                          <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                              {formData.name || 'Untitled Product'}
                  </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                              {formData.shortDescription || 'No description provided'}
                            </Typography>
                            <Typography variant="h6" color="primary">
                              ${formData.price || 0}
                  </Typography>
                          </Box>
                        </Box>
                        
                        <Box item xs={12} md={6}>
                          <Typography variant="h6" sx={{ mb: 2 }}>Status</Typography>
                          <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              {formData.isActive ? <CheckIcon color="success" /> : <ErrorIcon color="error" />}
                              <Typography variant="body2">
                                {formData.isActive ? 'Active' : 'Inactive'}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              {formData.isFeatured ? <StarIcon color="warning" /> : <VisibilityOffIcon color="disabled" />}
                              <Typography variant="body2">
                                {formData.isFeatured ? 'Featured' : 'Not Featured'}
                              </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                              Visibility: {formData.visibility}
                            </Typography>
                          </Box>
                        </Box>
                </Box>
              </CardContent>
            </Card>
                </Fade>
              )}

              {/* Navigation Buttons */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button
                  variant="outlined"
                  onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                  disabled={activeStep === 0}
                >
                  Previous
                </Button>
                  <Button
                    variant="contained"
                  onClick={() => setActiveStep(Math.min(steps.length - 1, activeStep + 1))}
                  disabled={activeStep === steps.length - 1}
                >
                  Next
                  </Button>
              </Box>
            </Stack>
          </Box>

          {/* Sidebar */}
          <Box sx={{ flex: { xs: 1, lg: 1 } }}>
            <Stack spacing={3}>
              {/* Progress Summary */}
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Progress
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={(activeStep + 1) / steps.length * 100} 
                    sx={{ mb: 2 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    Step {activeStep + 1} of {steps.length}: {steps[activeStep]}
                  </Typography>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Quick Actions
                  </Typography>
                  <Stack spacing={1}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<SaveIcon />}
                      onClick={handleSaveDraft}
                  >
                      Save Draft
                  </Button>
                  <Button
                    variant="text"
                    fullWidth
                      startIcon={<RefreshIcon />}
                    onClick={() => setFormData(initialFormData)}
                  >
                    Reset Form
                  </Button>
                </Stack>
              </CardContent>
            </Card>

              {/* Image Preview Modal */}
              {imagePreview && (
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Image Preview
                    </Typography>
                    <Box
                      component="img"
                      src={imagePreview}
                      alt="Preview"
                      sx={{
                        width: '100%',
                        height: 200,
                        objectFit: 'cover',
                        borderRadius: 1,
                        cursor: 'pointer'
                      }}
                      onClick={() => setImagePreview(null)}
                    />
                  </CardContent>
                </Card>
              )}
          </Stack>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
