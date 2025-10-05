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
} from '@mui/material'
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Add as AddIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  People as PeopleIcon,
  Security as AdminIcon,
  Build as ProviderIcon,
  ShoppingCart as CustomerIcon,
  CheckCircle as VerifiedIcon,
  Cancel as UnverifiedIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  CalendarToday as CalendarIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material'
import staticData from '../data/staticData.json'
import { User } from '../types'
import { formatDate, getInitials } from '../lib/utils'

const userTypeIcons = {
  admin: AdminIcon,
  provider: ProviderIcon,
  customer: CustomerIcon,
}

const userTypeColors = {
  admin: 'error',
  provider: 'info',
  customer: 'success',
} as const

export function Users() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.down('md'))

  // Mock users data (in real app, this would come from API)
  const users: User[] = [
    {
      id: 1,
      email: 'admin@fixer.com',
      phone: '+1-555-0001',
      user_type: 'admin',
      first_name: 'John',
      last_name: 'Admin',
      profile_picture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
      is_verified: true,
      created_at: '2024-01-01T00:00:00Z'
    },
    {
      id: 2,
      email: 'elite.plumbing@fixer.com',
      phone: '+1-555-1001',
      user_type: 'provider',
      first_name: 'Mike',
      last_name: 'Johnson',
      profile_picture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      is_verified: true,
      created_at: '2024-01-02T00:00:00Z'
    },
    {
      id: 3,
      email: 'john.doe@email.com',
      phone: '+1-555-2001',
      user_type: 'customer',
      first_name: 'John',
      last_name: 'Doe',
      profile_picture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
      is_verified: true,
      created_at: '2024-01-03T00:00:00Z'
    },
    {
      id: 4,
      email: 'jane.smith@email.com',
      phone: '+1-555-2002',
      user_type: 'customer',
      first_name: 'Jane',
      last_name: 'Smith',
      profile_picture: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400',
      is_verified: false,
      created_at: '2024-01-04T00:00:00Z'
    },
    {
      id: 5,
      email: 'bright.electric@fixer.com',
      phone: '+1-555-1002',
      user_type: 'provider',
      first_name: 'David',
      last_name: 'Chen',
      profile_picture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
      is_verified: true,
      created_at: '2024-01-05T00:00:00Z'
    },
  ]

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === 'all' || user.user_type === selectedType
    const matchesStatus = selectedStatus === 'all' || 
                         (selectedStatus === 'verified' && user.is_verified) ||
                         (selectedStatus === 'unverified' && !user.is_verified)
    return matchesSearch && matchesType && matchesStatus
  })

  const userStats = {
    total: users.length,
    admins: users.filter(u => u.user_type === 'admin').length,
    providers: users.filter(u => u.user_type === 'provider').length,
    customers: users.filter(u => u.user_type === 'customer').length,
    verified: users.filter(u => u.is_verified).length,
    unverified: users.filter(u => !u.is_verified).length,
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, user: User) => {
    setAnchorEl(event.currentTarget)
    setSelectedUser(user)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedUser(null)
  }

  const StatCard = ({ title, value, icon: Icon, color = 'primary' }: any) => (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Icon sx={{ color: `${color}.main`, fontSize: 32 }} />
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

  const UserCard = ({ user }: { user: User }) => {
    const UserTypeIcon = userTypeIcons[user.user_type]
    const typeColor = userTypeColors[user.user_type]

    return (
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
              <Avatar
                src={user.profile_picture}
                sx={{ width: 48, height: 48 }}
              >
                {getInitials(`${user.first_name} ${user.last_name}`)}
              </Avatar>
              
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {user.first_name} {user.last_name}
                  </Typography>
                  <Chip
                    icon={<UserTypeIcon />}
                    label={user.user_type}
                    size="small"
                    color={typeColor}
                    sx={{ textTransform: 'capitalize' }}
                  />
                  <Chip
                    icon={user.is_verified ? <VerifiedIcon /> : <UnverifiedIcon />}
                    label={user.is_verified ? 'Verified' : 'Unverified'}
                    size="small"
                    color={user.is_verified ? 'success' : 'default'}
                    variant={user.is_verified ? 'filled' : 'outlined'}
                  />
                </Box>
                
                <Stack direction="row" spacing={3} sx={{ flexWrap: 'wrap', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <EmailIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {user.email}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <PhoneIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {user.phone}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <CalendarIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      Joined {formatDate(user.created_at!)}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
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
                onClick={(e) => handleMenuOpen(e, user)}
              >
                <MoreVertIcon />
              </IconButton>
            </Box>
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
            Users
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage user accounts and permissions
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ minWidth: 140 }}
        >
          Add User
        </Button>
      </Box>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={6} sm={4} md={2}>
          <StatCard title="Total Users" value={userStats.total} icon={<PeopleIcon />} color="primary" />
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <StatCard title="Admins" value={userStats.admins} icon={<AdminIcon />} color="error" />
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <StatCard title="Providers" value={userStats.providers} icon={<ProviderIcon />} color="info" />
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <StatCard title="Customers" value={userStats.customers} icon={<CustomerIcon />} color="success" />
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <StatCard title="Verified" value={userStats.verified} icon={<VerifiedIcon />} color="success" />
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <StatCard title="Unverified" value={userStats.unverified} icon={<UnverifiedIcon />} color="warning" />
        </Grid>
      </Grid>

      {/* Filters */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search users..."
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
                <InputLabel>Type</InputLabel>
                <Select
                  value={selectedType}
                  label="Type"
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="admin">Admins</MenuItem>
                  <MenuItem value="provider">Providers</MenuItem>
                  <MenuItem value="customer">Customers</MenuItem>
                </Select>
              </FormControl>
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
                  <MenuItem value="verified">Verified</MenuItem>
                  <MenuItem value="unverified">Unverified</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
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

      {/* Users List */}
      {filteredUsers.length > 0 ? (
        <Stack spacing={2}>
          {filteredUsers.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </Stack>
      ) : (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <PeopleIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>
              No users found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchTerm || selectedType !== 'all' || selectedStatus !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'Users will appear here when they register.'}
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* User Actions Menu */}
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
          View Profile
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <EditIcon sx={{ mr: 1 }} />
          Edit User
        </MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1 }} />
          Delete User
        </MenuItem>
      </Menu>
    </Box>
  )
}