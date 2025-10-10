import React, { useState, useMemo } from 'react'
import {
  Box,
  Typography,
  Button,
  Grid,
  useTheme,
  useMediaQuery,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem as SelectMenuItem,
  Switch,
  FormControlLabel
} from '@mui/material'
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Build as BuildIcon,
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  Star as StarIcon
} from '@mui/icons-material'
import { PageHeader } from '../components/common/PageHeader'
import { OrderStatsCard } from '../components/common/OrderStatsCard'
import { ServiceFilters } from '../components/services/ServiceFilters'
import { ServiceTable, Service } from '../components/services/ServiceTable'
import { Pagination } from '../components/common/Pagination'

// Mock data
const mockServices: Service[] = [
  {
    id: '1',
    name: 'Emergency Plumbing Repair',
    description: 'Fast and reliable emergency plumbing services available 24/7. We handle all types of plumbing emergencies including burst pipes, leaks, and clogged drains.',
    category: {
      id: '1',
      name: 'Plumbing',
      color: '#2196F3'
    },
    price: 150,
    duration: 2,
    isActive: true,
    isFeatured: true,
    provider: {
      id: '1',
      name: 'John Smith',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      rating: 4.8
    },
    rating: 4.8,
    reviewCount: 124,
    bookingsCount: 342,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z'
  },
  {
    id: '2',
    name: 'Electrical Panel Upgrade',
    description: 'Professional electrical panel upgrade service. Ensure your home\'s electrical system meets modern safety standards.',
    category: {
      id: '2',
      name: 'Electrical',
      color: '#FF9800'
    },
    price: 450,
    duration: 4,
    isActive: true,
    isFeatured: false,
    provider: {
      id: '2',
      name: 'Mike Wilson',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
      rating: 4.9
    },
    rating: 4.9,
    reviewCount: 87,
    bookingsCount: 156,
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-18T14:20:00Z'
  },
  {
    id: '3',
    name: 'Deep House Cleaning',
    description: 'Thorough deep cleaning service for your entire home. We clean every corner and leave your home spotless.',
    category: {
      id: '3',
      name: 'Cleaning',
      color: '#4CAF50'
    },
    price: 200,
    duration: 3,
    isActive: true,
    isFeatured: true,
    provider: {
      id: '3',
      name: 'Emma Davis',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400',
      rating: 4.7
    },
    rating: 4.7,
    reviewCount: 203,
    bookingsCount: 567,
    createdAt: '2024-01-05T11:00:00Z',
    updatedAt: '2024-01-19T16:45:00Z'
  },
  {
    id: '4',
    name: 'HVAC Installation',
    description: 'Complete HVAC system installation with warranty. Energy-efficient systems for optimal comfort.',
    category: {
      id: '4',
      name: 'HVAC',
      color: '#00BCD4'
    },
    price: 3500,
    duration: 8,
    isActive: true,
    isFeatured: false,
    provider: {
      id: '4',
      name: 'Robert Martinez',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
      rating: 4.9
    },
    rating: 4.9,
    reviewCount: 45,
    bookingsCount: 89,
    createdAt: '2024-01-12T08:30:00Z'
  },
  {
    id: '5',
    name: 'Home Security System Installation',
    description: 'Professional installation of modern security systems with 24/7 monitoring capabilities.',
    category: {
      id: '5',
      name: 'Security',
      color: '#F44336'
    },
    price: 800,
    duration: 5,
    isActive: true,
    isFeatured: true,
    provider: {
      id: '5',
      name: 'David Chen',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
      rating: 4.8
    },
    rating: 4.8,
    reviewCount: 67,
    bookingsCount: 134,
    createdAt: '2024-01-08T10:15:00Z'
  },
  {
    id: '6',
    name: 'Kitchen Remodeling',
    description: 'Complete kitchen renovation service including cabinets, countertops, and appliances.',
    category: {
      id: '6',
      name: 'Home Repair',
      color: '#9C27B0'
    },
    price: 5000,
    duration: 40,
    isActive: false,
    isFeatured: false,
    provider: {
      id: '6',
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400',
      rating: 4.6
    },
    rating: 4.6,
    reviewCount: 32,
    bookingsCount: 45,
    createdAt: '2024-01-03T09:45:00Z'
  },
  {
    id: '7',
    name: 'Garden Landscaping',
    description: 'Professional landscaping services to transform your outdoor space into a beautiful garden.',
    category: {
      id: '7',
      name: 'Gardening',
      color: '#8BC34A'
    },
    price: 600,
    duration: 6,
    isActive: true,
    isFeatured: false,
    provider: {
      id: '7',
      name: 'James Wilson',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      rating: 4.5
    },
    rating: 4.5,
    reviewCount: 89,
    bookingsCount: 178,
    createdAt: '2024-01-14T11:30:00Z'
  },
  {
    id: '8',
    name: 'Interior Painting',
    description: 'Professional interior painting service with premium quality paints and expert finish.',
    category: {
      id: '8',
      name: 'Painting',
      color: '#E91E63'
    },
    price: 350,
    duration: 5,
    isActive: true,
    isFeatured: false,
    provider: {
      id: '8',
      name: 'Michael Brown',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
      rating: 4.7
    },
    rating: 4.7,
    reviewCount: 156,
    bookingsCount: 289,
    createdAt: '2024-01-09T13:00:00Z'
  }
]

const mockCategories = [
  { id: '1', name: 'Plumbing' },
  { id: '2', name: 'Electrical' },
  { id: '3', name: 'Cleaning' },
  { id: '4', name: 'HVAC' },
  { id: '5', name: 'Security' },
  { id: '6', name: 'Home Repair' },
  { id: '7', name: 'Gardening' },
  { id: '8', name: 'Painting' }
]

export function Services() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  
  // State management
  const [services, setServices] = useState<Service[]>(mockServices)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [moreActionsAnchor, setMoreActionsAnchor] = useState<null | HTMLElement>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null)
  const [serviceToEdit, setServiceToEdit] = useState<Service | null>(null)
  const [snackbar, setSnackbar] = useState<{
    open: boolean
    message: string
    severity: 'success' | 'error' | 'warning' | 'info'
  }>({ open: false, message: '', severity: 'info' })

  // Calculate stats
  const stats = useMemo(() => {
    const activeServices = services.filter(s => s.isActive).length
    const totalRevenue = services.reduce((sum, s) => sum + (s.price * s.bookingsCount), 0)
    const avgRating = services.reduce((sum, s) => sum + s.rating, 0) / services.length
    const totalProviders = new Set(services.map(s => s.provider?.id).filter(Boolean)).size

    return {
      totalServices: services.length,
      activeServices,
      totalRevenue,
      avgRating,
      totalProviders
    }
  }, [services])

  // Filtered services
  const filteredServices = useMemo(() => {
    return services.filter(service => {
      const matchesSearch = 
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.category.name.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesCategory = categoryFilter === 'all' || service.category.id === categoryFilter
      
      const matchesStatus = 
        statusFilter === 'all' ||
        (statusFilter === 'active' && service.isActive) ||
        (statusFilter === 'inactive' && !service.isActive) ||
        (statusFilter === 'featured' && service.isFeatured)
      
      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [services, searchQuery, categoryFilter, statusFilter])

  // Paginated services
  const paginatedServices = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredServices.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredServices, currentPage, itemsPerPage])

  const totalPages = Math.ceil(filteredServices.length / itemsPerPage)

  // Handlers
  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  const handleCategoryChange = (category: string) => {
    setCategoryFilter(category)
    setCurrentPage(1)
  }

  const handleStatusChange = (status: string) => {
    setStatusFilter(status)
    setCurrentPage(1)
  }

  const handleClearFilters = () => {
    setSearchQuery('')
    setCategoryFilter('all')
    setStatusFilter('all')
    setCurrentPage(1)
  }

  const handleMoreFilters = () => {
    setSnackbar({
      open: true,
      message: 'More filters feature coming soon!',
      severity: 'info'
    })
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleItemsPerPageChange = (itemsPerPage: number) => {
    setItemsPerPage(itemsPerPage)
    setCurrentPage(1)
  }

  const handleViewService = (service: Service) => {
    setSnackbar({
      open: true,
      message: `Viewing service: ${service.name}`,
      severity: 'info'
    })
  }

  const handleEditService = (service: Service) => {
    setServiceToEdit(service)
    setEditDialogOpen(true)
  }

  const handleDeleteService = (service: Service) => {
    setServiceToDelete(service)
    setDeleteDialogOpen(true)
  }

  const handleToggleActive = (service: Service) => {
    setServices(prev =>
      prev.map(s =>
        s.id === service.id ? { ...s, isActive: !s.isActive } : s
      )
    )
    setSnackbar({
      open: true,
      message: `Service ${service.isActive ? 'deactivated' : 'activated'} successfully`,
      severity: 'success'
    })
  }

  const handleDuplicateService = (service: Service) => {
    const newService = {
      ...service,
      id: String(Date.now()),
      name: `${service.name} (Copy)`,
      createdAt: new Date().toISOString()
    }
    setServices(prev => [newService, ...prev])
    setSnackbar({
      open: true,
      message: 'Service duplicated successfully',
      severity: 'success'
    })
  }

  const handleConfirmDelete = () => {
    if (serviceToDelete) {
      setServices(prev => prev.filter(s => s.id !== serviceToDelete.id))
      setSnackbar({
        open: true,
        message: `Service "${serviceToDelete.name}" deleted successfully`,
        severity: 'success'
      })
    }
    setDeleteDialogOpen(false)
    setServiceToDelete(null)
  }

  const handleMoreActions = (event: React.MouseEvent<HTMLElement>) => {
    setMoreActionsAnchor(event.currentTarget)
  }

  const handleMoreActionsClose = () => {
    setMoreActionsAnchor(null)
  }

  const handleAddService = () => {
    setServiceToEdit(null)
    setEditDialogOpen(true)
  }

  const handleExportServices = () => {
    setSnackbar({
      open: true,
      message: 'Export services feature coming soon!',
      severity: 'info'
    })
    handleMoreActionsClose()
  }

  const handleImportServices = () => {
    setSnackbar({
      open: true,
      message: 'Import services feature coming soon!',
      severity: 'info'
    })
    handleMoreActionsClose()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount)
  }

  return (
    <Box sx={{ flexGrow: 1, p: { xs: 1, sm: 2, md: 3 } }}>
      {/* Page Header */}
      <PageHeader
        title="Services Management"
        subtitle="Manage your service offerings and providers"
        action={
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddService}
              sx={{ 
                borderRadius: 2,
                px: 3,
                py: 1,
                fontWeight: 600,
                textTransform: 'none'
              }}
            >
              + Add Service
            </Button>
            <IconButton
              onClick={handleMoreActions}
              sx={{ 
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
                p: 1
              }}
            >
              <MoreVertIcon />
            </IconButton>
          </Box>
        }
      />

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <OrderStatsCard
            title="Total Services"
            value={stats.totalServices.toString()}
            subtitle={`${stats.activeServices} active`}
            trend={{ value: 12, isPositive: true }}
            icon={<BuildIcon />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <OrderStatsCard
            title="Active Providers"
            value={stats.totalProviders.toString()}
            subtitle="Verified professionals"
            trend={{ value: 8, isPositive: true }}
            icon={<PeopleIcon />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <OrderStatsCard
            title="Total Revenue"
            value={formatCurrency(stats.totalRevenue)}
            subtitle="All time"
            trend={{ value: 15, isPositive: true }}
            icon={<MoneyIcon />}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <OrderStatsCard
            title="Average Rating"
            value={stats.avgRating.toFixed(1)}
            subtitle="Customer satisfaction"
            trend={{ value: 3, isPositive: true }}
            icon={<StarIcon />}
            color="warning"
          />
        </Grid>
      </Grid>

      {/* Filters */}
      <ServiceFilters
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        categoryFilter={categoryFilter}
        onCategoryChange={handleCategoryChange}
        statusFilter={statusFilter}
        onStatusChange={handleStatusChange}
        categories={mockCategories}
        onClearFilters={handleClearFilters}
        onMoreFilters={handleMoreFilters}
      />

      {/* Services Table */}
      <ServiceTable
        services={paginatedServices}
        onViewService={handleViewService}
        onEditService={handleEditService}
        onDeleteService={handleDeleteService}
        onToggleActive={handleToggleActive}
        onDuplicateService={handleDuplicateService}
      />

      {/* Pagination */}
      {filteredServices.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredServices.length}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      )}

      {/* More Actions Menu */}
      <Menu
        anchorEl={moreActionsAnchor}
        open={Boolean(moreActionsAnchor)}
        onClose={handleMoreActionsClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleExportServices}>
          Export Services
        </MenuItem>
        <MenuItem onClick={handleImportServices}>
          Import Services
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Delete Service</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the service "{serviceToDelete?.name}"? 
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmDelete} 
            color="error" 
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit/Add Service Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>
          {serviceToEdit ? 'Edit Service' : 'Add New Service'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
            <TextField
              label="Service Name"
              fullWidth
              defaultValue={serviceToEdit?.name || ''}
              variant="outlined"
            />
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                label="Category"
                defaultValue={serviceToEdit?.category.id || ''}
              >
                {mockCategories.map((category) => (
                  <SelectMenuItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectMenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              defaultValue={serviceToEdit?.description || ''}
              variant="outlined"
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Price ($)"
                type="number"
                fullWidth
                defaultValue={serviceToEdit?.price || ''}
                variant="outlined"
              />
              <TextField
                label="Duration (hours)"
                type="number"
                fullWidth
                defaultValue={serviceToEdit?.duration || ''}
                variant="outlined"
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControlLabel
                control={<Switch defaultChecked={serviceToEdit?.isActive ?? true} />}
                label="Active"
              />
              <FormControlLabel
                control={<Switch defaultChecked={serviceToEdit?.isFeatured || false} />}
                label="Featured"
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setEditDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={() => {
              setEditDialogOpen(false)
              setSnackbar({
                open: true,
                message: serviceToEdit ? 'Service updated successfully' : 'Service created successfully',
                severity: 'success'
              })
            }}
          >
            {serviceToEdit ? 'Update' : 'Create'} Service
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default Services
