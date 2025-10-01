import React, { useState } from 'react'
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  useMediaQuery,
  Stack,
  IconButton,
  Menu,
  Paper,
} from '@mui/material'
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  AttachMoney as DollarIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Assignment as AssignmentIcon,
  MoreVert as MoreVertIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material'
import staticData from '../data/staticData.json'
import { Booking, ServiceRequest } from '../types'
import { formatCurrency, formatDate, getInitials } from '../lib/utils'

const statusColors = {
  scheduled: 'info',
  in_progress: 'warning',
  completed: 'success',
  cancelled: 'error',
} as const

const statusIcons = {
  scheduled: ScheduleIcon,
  in_progress: TimeIcon,
  completed: CheckCircleIcon,
  cancelled: CancelIcon,
}

export function Bookings() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  // Mock bookings data (in real app, this would come from API)
  const bookings: Booking[] = [
    {
      id: 1,
      service_request_id: 1,
      quote_id: 1,
      provider_id: 1,
      customer_id: 1,
      scheduled_time: '2024-01-15T10:00:00Z',
      status: 'scheduled',
      total_amount: 250.00,
      notes: 'Please call 30 minutes before arrival. Gate code: 1234',
      created_at: '2024-01-10T12:00:00Z'
    },
    {
      id: 2,
      service_request_id: 2,
      quote_id: 3,
      provider_id: 2,
      customer_id: 2,
      scheduled_time: '2024-01-18T14:00:00Z',
      status: 'in_progress',
      total_amount: 350.00,
      notes: 'Customer prefers morning appointment. Will need access to electrical panel.',
      created_at: '2024-01-12T11:30:00Z'
    },
    {
      id: 3,
      service_request_id: 3,
      quote_id: 2,
      provider_id: 3,
      customer_id: 3,
      scheduled_time: '2024-01-20T09:00:00Z',
      status: 'completed',
      total_amount: 180.00,
      notes: 'Service completed successfully. Customer satisfied.',
      created_at: '2024-01-15T08:00:00Z'
    },
  ]

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.notes.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || booking.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const bookingStats = {
    scheduled: bookings.filter(b => b.status === 'scheduled').length,
    in_progress: bookings.filter(b => b.status === 'in_progress').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, booking: Booking) => {
    setAnchorEl(event.currentTarget)
    setSelectedBooking(booking)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedBooking(null)
  }

  const StatCard = ({ title, value, color = 'primary' }: any) => (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: `${color}.main`,
            }}
          />
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )

  const BookingCard = ({ booking }: { booking: Booking }) => {
    const StatusIcon = statusIcons[booking.status]
    const statusColor = statusColors[booking.status]

    return (
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Booking #{booking.id}
                </Typography>
                <Chip
                  icon={<StatusIcon />}
                  label={booking.status.replace('_', ' ')}
                  size="small"
                  color={statusColor}
                  sx={{ textTransform: 'capitalize' }}
                />
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {booking.notes}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<VisibilityIcon />}
              >
                View
              </Button>
              <Button
                variant="outlined"
                size="small"
                startIcon={<EditIcon />}
              >
                Edit
              </Button>
              <IconButton
                size="small"
                onClick={(e) => handleMenuOpen(e, booking)}
              >
                <MoreVertIcon />
              </IconButton>
            </Box>
          </Box>

          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {formatDate(booking.scheduled_time)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Scheduled time
                  </Typography>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <DollarIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {formatCurrency(booking.total_amount)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Total amount
                  </Typography>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AssignmentIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Request #{booking.service_request_id}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Service request
                  </Typography>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TimeIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {formatDate(booking.created_at)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Created
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ width: 32, height: 32 }}>
                {getInitials('Customer Name')}
              </Avatar>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Customer Name
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  customer@email.com
                </Typography>
              </Box>
            </Box>
            
            <Stack direction="row" spacing={1}>
              <Chip
                label={`Quote #${booking.quote_id}`}
                size="small"
                variant="outlined"
              />
              <Chip
                label={`Provider #${booking.provider_id}`}
                size="small"
                variant="outlined"
              />
            </Stack>
          </Box>
        </CardContent>
      </Card>
    )
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Bookings
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage and track service bookings
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" startIcon={<FilterIcon />}>
            Export
          </Button>
          <Button variant="contained" startIcon={<CalendarIcon />}>
            New Booking
          </Button>
        </Stack>
      </Box>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={6} sm={3}>
          <StatCard title="Scheduled" value={bookingStats.scheduled} color="info" />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard title="In Progress" value={bookingStats.in_progress} color="warning" />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard title="Completed" value={bookingStats.completed} color="success" />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard title="Cancelled" value={bookingStats.cancelled} color="error" />
        </Grid>
      </Grid>

      {/* Filters */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={selectedStatus}
                  label="Status"
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="scheduled">Scheduled</MenuItem>
                  <MenuItem value="in_progress">In Progress</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                variant="outlined"
                startIcon={<FilterIcon />}
                fullWidth
                sx={{ height: 56 }}
              >
                More Filters
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Bookings List */}
      {filteredBookings.length > 0 ? (
        <Stack spacing={2}>
          {filteredBookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </Stack>
      ) : (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <CalendarIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>
              No bookings found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchTerm || selectedStatus !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'Bookings will appear here when customers schedule services.'}
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Booking Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { minWidth: 160 }
        }}
      >
        <MenuItem onClick={handleMenuClose}>
          <VisibilityIcon sx={{ mr: 1 }} />
          View Details
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <EditIcon sx={{ mr: 1 }} />
          Edit Booking
        </MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1 }} />
          Cancel Booking
        </MenuItem>
      </Menu>
    </Box>
  )
}
