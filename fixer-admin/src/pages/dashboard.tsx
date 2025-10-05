import React from 'react'
import {
  Box,
  Grid,
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
import { StatsCard, ContentCard } from '../components/ui'

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

// StatCard is now replaced by StatsCard from design system

export function Dashboard() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <Box sx={{ flexGrow: 1, p: { xs: 1, sm: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
        <Typography variant="h4" sx={{ 
          fontWeight: 700, 
          mb: 1,
          fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }
        }}>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{
          fontSize: { xs: '0.875rem', sm: '1rem' }
        }}>
          Welcome back! Here's what's happening with your business today.
        </Typography>
      </Box>
      {/* Stats Grid */}
      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: { xs: 3, sm: 4 } }}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatsCard
            title="Total Revenue"
            value={formatCurrency(15420.50)}
            trend={{ value: 20.1, isPositive: true }}
            icon={<DollarIcon />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatsCard
            title="Total Users"
            value="1,234"
            trend={{ value: 12.5, isPositive: true }}
            icon={<PeopleIcon />}
            color="secondary"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatsCard
            title="Service Requests"
            value="89"
            trend={{ value: 2.3, isPositive: false }}
            icon={<FileTextIcon />}
            color="error"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatsCard
            title="Active Providers"
            value="156"
            trend={{ value: 5.2, isPositive: true }}
            icon={<WrenchIcon />}
            color="success"
          />
        </Grid>
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: { xs: 3, sm: 4 } }}>
        <Grid item xs={12} lg={8}>
          <ContentCard
            title="Revenue Overview"
            subtitle="Monthly revenue and order trends for the past 6 months"
          >
            <Box sx={{ height: { xs: 250, sm: 300 } }}>
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
          </ContentCard>
        </Grid>

        <Grid item xs={12} lg={4}>
          <ContentCard
            title="Top Categories"
            subtitle="Best performing service categories"
          >
            <List dense>
              {topCategories.map((category, index) => (
                <ListItem key={category.name} sx={{ px: 0, py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        backgroundColor: category.color,
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={category.name}
                    secondary={`${formatCurrency(category.revenue)} • ${category.count} services`}
                    primaryTypographyProps={{
                      fontSize: { xs: '0.875rem', sm: '1rem' }
                    }}
                    secondaryTypographyProps={{
                      fontSize: { xs: '0.75rem', sm: '0.875rem' }
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </ContentCard>
        </Grid>
      </Grid>

      {/* Bottom Row */}
      <Grid container spacing={{ xs: 2, sm: 3 }}>
        <Grid item xs={12} lg={8}>
          <ContentCard
            title="Recent Activity"
            subtitle="Latest updates and notifications"
          >
            <List>
              {recentActivity.map((activity, index) => (
                <React.Fragment key={index}>
                  <ListItem sx={{ px: 0, py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
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
                      primaryTypographyProps={{
                        fontSize: { xs: '0.875rem', sm: '1rem' }
                      }}
                      secondaryTypographyProps={{
                        fontSize: { xs: '0.75rem', sm: '0.875rem' }
                      }}
                    />
                    <Chip
                      label={activity.type.replace('_', ' ')}
                      size="small"
                      variant="outlined"
                      sx={{ 
                        ml: 2,
                        fontSize: { xs: '0.75rem', sm: '0.875rem' }
                      }}
                    />
                  </ListItem>
                  {index < recentActivity.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </ContentCard>
        </Grid>

        <Grid item xs={12} lg={4}>
          <ContentCard
            title="Quick Stats"
            subtitle="Key performance indicators"
          >
            <List dense>
              <ListItem sx={{ px: 0, py: 0.5 }}>
                <ListItemText
                  primary="Avg. Order Value"
                  secondary={formatCurrency(285.75)}
                  primaryTypographyProps={{
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }}
                  secondaryTypographyProps={{
                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                  }}
                />
              </ListItem>
              <ListItem sx={{ px: 0, py: 0.5 }}>
                <ListItemText
                  primary="Conversion Rate"
                  secondary="12.5%"
                  primaryTypographyProps={{
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }}
                  secondaryTypographyProps={{
                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                  }}
                />
              </ListItem>
              <ListItem sx={{ px: 0, py: 0.5 }}>
                <ListItemText
                  primary="Customer Satisfaction"
                  secondary="4.8/5"
                  primaryTypographyProps={{
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }}
                  secondaryTypographyProps={{
                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                  }}
                />
              </ListItem>
              <ListItem sx={{ px: 0, py: 0.5 }}>
                <ListItemText
                  primary="Response Time"
                  secondary="2.3h"
                  primaryTypographyProps={{
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }}
                  secondaryTypographyProps={{
                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                  }}
                />
              </ListItem>
            </List>
          </ContentCard>
        </Grid>
      </Grid>
    </Box>
  )
}