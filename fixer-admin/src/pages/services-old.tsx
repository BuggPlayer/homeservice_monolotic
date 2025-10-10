import React, { useState } from 'react'
import {
  Box,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  useTheme,
  useMediaQuery,
  Fab,
  Tooltip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Divider,
  Badge,
  LinearProgress,
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Build as BuildIcon,
  Plumbing as PlumbingIcon,
  ElectricalServices as ElectricalIcon,
//   Cleaning as CleaningIcon,
  Security as SecurityIcon,
//   HomeRepair as HomeRepairIcon,
  Yard as GardenIcon,
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Star as StarIcon,
  Schedule as ScheduleIcon,
  AttachMoney as MoneyIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
} from '@mui/icons-material'
import { PageHeader } from '../components/common/PageHeader'
import { EmptyState } from '../components/common/EmptyState'
import { Card as CustomCard, StatsCard, InfoCard } from '../components/ui/card'
import { formatCurrency } from '../lib/utils'

// Mock data for services
const serviceCategories = [
  {
    id: 1,
    name: 'Plumbing',
    icon: <PlumbingIcon />,
    description: 'Professional plumbing services for homes and businesses',
    color: '#2196F3',
    serviceCount: 12,
    activeServices: 8,
    revenue: 15420,
    rating: 4.8,
  },
  {
    id: 2,
    name: 'Electrical',
    icon: <ElectricalIcon />,
    description: 'Certified electrical work and installations',
    color: '#FF9800',
    serviceCount: 8,
    activeServices: 6,
    revenue: 12350,
    rating: 4.9,
  },
  {
    id: 3,
    name: 'Cleaning',
    // icon: <CleaningServicesIcon />,
    description: 'Residential and commercial cleaning services',
    color: '#4CAF50',
    serviceCount: 15,
    activeServices: 12,
    revenue: 8750,
    rating: 4.7,
  },
  {
    id: 4,
    name: 'Security',
    icon: <SecurityIcon />,
    description: 'Home and business security system installations',
    color: '#F44336',
    serviceCount: 6,
    activeServices: 4,
    revenue: 18900,
    rating: 4.9,
  },
  {
    id: 5,
    name: 'Home Repair',
    // icon: <HomeRepairIcon />,
    description: 'General home maintenance and repair services',
    color: '#9C27B0',
    serviceCount: 20,
    activeServices: 16,
    revenue: 22100,
    rating: 4.6,
  },
  {
    id: 6,
    name: 'Gardening',
    icon: <GardenIcon />,
    description: 'Landscaping and garden maintenance services',
    color: '#8BC34A',
    serviceCount: 10,
    activeServices: 7,
    revenue: 9650,
    rating: 4.5,
  },
]

const recentServices = [
  {
    id: 1,
    name: 'Emergency Plumbing Repair',
    category: 'Plumbing',
    provider: 'John Smith',
    customer: 'Sarah Johnson',
    status: 'completed',
    price: 150,
    date: '2024-01-15',
    rating: 5,
  },
  {
    id: 2,
    name: 'Electrical Panel Upgrade',
    category: 'Electrical',
    provider: 'Mike Wilson',
    customer: 'David Brown',
    status: 'in-progress',
    price: 450,
    date: '2024-01-14',
    rating: 4,
  },
  {
    id: 3,
    name: 'Deep House Cleaning',
    category: 'Cleaning',
    provider: 'Emma Davis',
    customer: 'Lisa Anderson',
    status: 'scheduled',
    price: 200,
    date: '2024-01-16',
    rating: null,
  },
]

const statsData = [
  {
    title: 'Total Services',
    value: '71',
    subtitle: 'Active services',
    icon: <BuildIcon />,
    trend: { value: 12, isPositive: true },
    color: 'primary' as const,
  },
  {
    title: 'Active Providers',
    value: '53',
    subtitle: 'Certified professionals',
    icon: <PeopleIcon />,
    trend: { value: 8, isPositive: true },
    color: 'success' as const,
  },
  {
    title: 'Monthly Revenue',
    value: formatCurrency(87570),
    subtitle: 'This month',
    icon: <MoneyIcon />,
    trend: { value: 15, isPositive: true },
    color: 'info' as const,
  },
  {
    title: 'Average Rating',
    value: '4.7',
    subtitle: 'Customer satisfaction',
    icon: <StarIcon />,
    trend: { value: 3, isPositive: true },
    color: 'warning' as const,
  },
]

export function Services() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'))
  
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedService, setSelectedService] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [sortBy, setSortBy] = useState('name')

  const handleAddService = () => {
    setSelectedService(null)
    setOpenDialog(true)
  }

  const handleEditService = (service: any) => {
    setSelectedService(service)
    setOpenDialog(true)
  }

  const handleDeleteService = (serviceId: number) => {
    // Handle delete logic
    console.log('Delete service:', serviceId)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success'
      case 'in-progress':
        return 'warning'
      case 'scheduled':
        return 'info'
      case 'cancelled':
        return 'error'
      default:
        return 'default'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed'
      case 'in-progress':
        return 'In Progress'
      case 'scheduled':
        return 'Scheduled'
      case 'cancelled':
        return 'Cancelled'
      default:
        return status
    }
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      {/* Page Header */}
      <PageHeader
        title="Services Management"
        subtitle="Manage your service offerings, providers, and categories"
        action={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddService}
            size="large"
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              py: 1.5
            }}
          >
            Add Service
          </Button>
        }
      />

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statsData.map((stat, index) => (
          <Grid item xs={12} sm={6} lg={3} key={index}>
            <StatsCard
              title={stat.title}
              value={stat.value}
              subtitle={stat.subtitle}
              icon={stat.icon}
              trend={stat.trend}
              color={stat.color}
              sx={{ height: '100%' }}
            />
          </Grid>
        ))}
      </Grid>

      {/* Service Categories */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          Service Categories
        </Typography>
        <Grid container spacing={3}>
          {serviceCategories.map((category) => (
            <Grid item xs={12} sm={6} lg={4} key={category.id}>
              <CustomCard
                hover
                clickable
                sx={{ 
                  height: '100%',
                  border: `2px solid ${category.color}20`,
                  '&:hover': {
                    border: `2px solid ${category.color}`,
                    transform: 'translateY(-4px)',
                  }
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      sx={{
                        bgcolor: category.color,
                        mr: 2,
                        width: 48,
                        height: 48,
                      }}
                    >
                      {category.icon}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {category.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <StarIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                        <Typography variant="body2" color="text.secondary">
                          {category.rating}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {category.description}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Total Services
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {category.serviceCount}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Active
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: 'success.main' }}>
                        {category.activeServices}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Revenue
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                        {formatCurrency(category.revenue)}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <LinearProgress
                    variant="determinate"
                    value={(category.activeServices / category.serviceCount) * 100}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: `${category.color}20`,
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: category.color,
                      },
                    }}
                  />
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button size="small" startIcon={<VisibilityIcon />}>
                    View Details
                  </Button>
                  <Button size="small" startIcon={<EditIcon />}>
                    Edit
                  </Button>
                </CardActions>
              </CustomCard>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Recent Services */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Recent Services
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<SearchIcon />}
              size="small"
              sx={{ textTransform: 'none' }}
            >
              Search
            </Button>
            <Button
              variant="outlined"
              startIcon={<FilterIcon />}
              size="small"
              sx={{ textTransform: 'none' }}
            >
              Filter
            </Button>
            <Button
              variant="outlined"
              startIcon={<SortIcon />}
              size="small"
              sx={{ textTransform: 'none' }}
            >
              Sort
            </Button>
          </Box>
        </Box>
        
        <CustomCard>
          <List>
            {recentServices.map((service, index) => (
              <React.Fragment key={service.id}>
                <ListItem
                  sx={{
                    py: 2,
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <BuildIcon />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {service.name}
                        </Typography>
                        <Chip
                          label={getStatusLabel(service.status)}
                          color={getStatusColor(service.status) as any}
                          size="small"
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {service.category} • Provider: {service.provider} • Customer: {service.customer}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            {service.date}
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                            {formatCurrency(service.price)}
                          </Typography>
                          {service.rating && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <StarIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                              <Typography variant="body2" color="text.secondary">
                                {service.rating}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton size="small" onClick={() => handleEditService(service)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDeleteService(service.id)}>
                        <DeleteIcon />
                      </IconButton>
                      <IconButton size="small">
                        <MoreVertIcon />
                      </IconButton>
                    </Box>
                  </ListItemSecondaryAction>
                </ListItem>
                {index < recentServices.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </CustomCard>
      </Box>

      {/* Quick Actions */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          Quick Actions
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <InfoCard
              title="Add New Service"
              description="Create a new service offering"
              icon={<AddIcon />}
              action={
                <Button variant="contained" size="small" onClick={handleAddService}>
                  Add
                </Button>
              }
              color="primary"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <InfoCard
              title="Manage Providers"
              description="View and manage service providers"
              icon={<PeopleIcon />}
              action={
                <Button variant="outlined" size="small">
                  Manage
                </Button>
              }
              color="success"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <InfoCard
              title="Service Analytics"
              description="View detailed service analytics"
              icon={<TrendingUpIcon />}
              action={
                <Button variant="outlined" size="small">
                  View
                </Button>
              }
              color="info"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <InfoCard
              title="Schedule Services"
              description="Manage service scheduling"
              icon={<ScheduleIcon />}
              action={
                <Button variant="outlined" size="small">
                  Schedule
                </Button>
              }
              color="warning"
            />
          </Grid>
        </Grid>
      </Box>

      {/* Floating Action Button for Mobile */}
      {isMobile && (
        <Fab
          color="primary"
          aria-label="add service"
          onClick={handleAddService}
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            zIndex: 1000,
          }}
        >
          <AddIcon />
        </Fab>
      )}

      {/* Add/Edit Service Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>
          {selectedService ? 'Edit Service' : 'Add New Service'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
            <TextField
              label="Service Name"
              fullWidth
              defaultValue={selectedService?.name || ''}
              variant="outlined"
            />
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                label="Category"
                defaultValue={selectedService?.category || ''}
              >
                {serviceCategories.map((category) => (
                  <MenuItem key={category.id} value={category.name}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              defaultValue={selectedService?.description || ''}
              variant="outlined"
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Price"
                type="number"
                fullWidth
                defaultValue={selectedService?.price || ''}
                variant="outlined"
              />
              <TextField
                label="Duration (hours)"
                type="number"
                fullWidth
                defaultValue={selectedService?.duration || ''}
                variant="outlined"
              />
            </Box>
            <FormControlLabel
              control={<Switch defaultChecked={selectedService?.active || true} />}
              label="Active Service"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenDialog(false)}>
            Cancel
          </Button>
          <Button variant="contained" onClick={() => setOpenDialog(false)}>
            {selectedService ? 'Update' : 'Create'} Service
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Services
