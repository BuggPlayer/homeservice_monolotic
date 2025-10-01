import React from 'react'
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  useTheme,
  useMediaQuery,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material'
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AttachMoney as DollarIcon,
  People as PeopleIcon,
  Assignment as FileTextIcon,
  Build as WrenchIcon,
  Timeline as TimelineIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { formatCurrency, formatDate } from '../lib/utils'

// Mock data for charts
const revenueData = [
  { month: 'Jan', revenue: 12000, orders: 45 },
  { month: 'Feb', revenue: 15000, orders: 52 },
  { month: 'Mar', revenue: 18000, orders: 61 },
  { month: 'Apr', revenue: 22000, orders: 73 },
  { month: 'May', revenue: 19000, orders: 68 },
  { month: 'Jun', revenue: 25000, orders: 85 },
]

const topCategories = [
  { name: 'Plumbing', count: 8, revenue: 3200, color: '#2563eb' },
  { name: 'Electrical', count: 6, revenue: 2800, color: '#7c3aed' },
  { name: 'Cleaning', count: 5, revenue: 1200, color: '#059669' },
  { name: 'HVAC', count: 4, revenue: 1800, color: '#dc2626' },
  { name: 'Security', count: 3, revenue: 2400, color: '#d97706' },
]

const recentActivity = [
  { type: 'new_booking', message: 'New booking scheduled for plumbing service', timestamp: '2024-01-14T10:30:00Z' },
  { type: 'quote_accepted', message: 'Quote accepted for electrical work', timestamp: '2024-01-14T09:15:00Z' },
  { type: 'new_service_request', message: 'New service request for HVAC repair', timestamp: '2024-01-14T08:45:00Z' },
  { type: 'product_added', message: 'New product added to catalog', timestamp: '2024-01-14T07:20:00Z' },
]

const StatCard = ({ title, value, change, icon: Icon, color = 'primary' }: any) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
            {title}
          </Typography>
          <Icon sx={{ color: `${color}.main`, fontSize: 24 }} />
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          {value}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {change > 0 ? (
            <TrendingUpIcon sx={{ color: 'success.main', fontSize: 16 }} />
          ) : (
            <TrendingDownIcon sx={{ color: 'error.main', fontSize: 16 }} />
          )}
          <Typography
            variant="body2"
            sx={{
              color: change > 0 ? 'success.main' : 'error.main',
              fontWeight: 600,
            }}
          >
            {change > 0 ? '+' : ''}{change}% from last month
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}

export function Dashboard() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back! Here's what's happening with your business today.
        </Typography>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Total Revenue"
            value={formatCurrency(15420.50)}
            change={20.1}
            icon={DollarIcon}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Total Users"
            value="1,234"
            change={12.5}
            icon={PeopleIcon}
            color="secondary"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Service Requests"
            value="89"
            change={-2.3}
            icon={FileTextIcon}
            color="error"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Active Providers"
            value="156"
            change={5.2}
            icon={WrenchIcon}
            color="success"
          />
        </Grid>
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Revenue Overview
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Monthly revenue and order trends for the past 6 months
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'revenue' ? formatCurrency(Number(value)) : value,
                        name === 'revenue' ? 'Revenue' : 'Orders'
                      ]}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke={theme.palette.primary.main}
                      strokeWidth={2}
                      name="revenue"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="orders" 
                      stroke={theme.palette.secondary.main}
                      strokeWidth={2}
                      name="orders"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Top Categories
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Best performing service categories
              </Typography>
              <List dense>
                {topCategories.map((category, index) => (
                  <ListItem key={category.name} sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          backgroundColor: category.color,
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={category.name}
                      secondary={`${formatCurrency(category.revenue)} • ${category.count} services`}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Bottom Row */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Recent Activity
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Latest updates and notifications
              </Typography>
              <List>
                {recentActivity.map((activity, index) => (
                  <React.Fragment key={index}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            backgroundColor: 'primary.main',
                          }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={activity.message}
                        secondary={formatDate(activity.timestamp)}
                      />
                      <Chip
                        label={activity.type.replace('_', ' ')}
                        size="small"
                        variant="outlined"
                        sx={{ ml: 2 }}
                      />
                    </ListItem>
                    {index < recentActivity.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Quick Stats
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Key performance indicators
              </Typography>
              <List dense>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText
                    primary="Avg. Order Value"
                    secondary={formatCurrency(285.75)}
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText
                    primary="Conversion Rate"
                    secondary="12.5%"
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText
                    primary="Customer Satisfaction"
                    secondary="4.8/5"
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText
                    primary="Response Time"
                    secondary="2.3h"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}