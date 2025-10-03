import React from 'react'
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
  ListItemAvatar,
  Divider,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Payment as PaymentIcon,
  LocalShipping as ShippingIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Receipt as ReceiptIcon,
  Timeline as TimelineIcon,
  ShoppingCart as ShoppingCartIcon,
} from '@mui/icons-material'
import { formatCurrency, formatDate, safeFormatDate } from '../../lib/utils'

export interface OrderItem {
  id: string | number
  name: string
  image: string
  category: string
  quantity: number
  price: number
  total: number
}

export interface OrderTimelineStep {
  id: string
  title: string
  description: string
  completed: boolean
  active: boolean
  date?: string
  time?: string
}

export interface CustomerInfo {
  id: string | number
  name: string
  email: string
  phone: string
  address?: string
  avatar?: string
  type?: string
}

export interface OrderPreviewData {
  id: string
  orderNumber: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned'
  createdAt: string
  updatedAt: string
  items: OrderItem[]
  customer: CustomerInfo
  payment: {
    method: string
    status: string
    subtotal: number
    shipping: number
    tax: number
    discount: number
    total: number
  }
  shipping: {
    method: string
    address: string
    trackingNumber?: string
    estimatedDelivery?: string
  }
  timeline: OrderTimelineStep[]
}

interface OrderPreviewProps {
  order: OrderPreviewData
  onEdit?: () => void
  onDelete?: () => void
  onPrint?: () => void
  onShare?: () => void
}

export function OrderPreview({ 
  order, 
  onEdit, 
  onDelete, 
  onPrint, 
  onShare 
}: OrderPreviewProps) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'))

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'success'
      case 'shipped':
        return 'info'
      case 'processing':
        return 'warning'
      case 'pending':
        return 'default'
      case 'cancelled':
        return 'error'
      case 'returned':
        return 'secondary'
      default:
        return 'default'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'Delivered'
      case 'shipped':
        return 'Shipped'
      case 'processing':
        return 'Processing'
      case 'pending':
        return 'Pending'
      case 'cancelled':
        return 'Cancelled'
      case 'returned':
        return 'Returned'
      default:
        return status
    }
  }

  return (
    <Box sx={{ maxWidth: '100%', mx: 'auto' }}>
      {/* Order Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
            {order.orderNumber}
          </Typography>
          <Chip
            label={getStatusLabel(order.status)}
            color={getStatusColor(order.status) as any}
            size="large"
            sx={{ fontWeight: 600 }}
          />
        </Box>
        <Typography variant="body2" color="text.secondary">
          Created on {safeFormatDate(order.createdAt)} • Last updated {safeFormatDate(order.updatedAt)}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Left Column - Items and Timeline */}
        <Grid item xs={12} lg={8}>
          {/* Order Items */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ShoppingCartIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Order Items ({order.items.length})
                </Typography>
              </Box>
              <List>
                {order.items.map((item, index) => (
                  <React.Fragment key={item.id}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar
                          src={item.image}
                          alt={item.name}
                          variant="rounded"
                          sx={{ width: 56, height: 56 }}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                              {item.name}
                            </Typography>
                            <Chip
                              label={item.category}
                              size="small"
                              variant="outlined"
                              color="primary"
                            />
                          </Box>
                        }
                        secondary={
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                              Quantity: {item.quantity} • Price: {formatCurrency(item.price)}
                            </Typography>
                          </Box>
                        }
                      />
                      <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                        {formatCurrency(item.total)}
                      </Typography>
                    </ListItem>
                    {index < order.items.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>

          {/* Order Timeline */}
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TimelineIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Order Timeline
                </Typography>
              </Box>
              <Stepper orientation="vertical" sx={{ pl: 0 }}>
                {order.timeline.map((step, index) => (
                  <Step key={step.id} completed={step.completed} active={step.active}>
                    <StepLabel
                      StepIconComponent={({ completed, active }) => (
                        <Box
                          sx={{
                            width: 24,
                            height: 24,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: completed
                              ? 'success.main'
                              : active
                              ? 'primary.main'
                              : 'grey.300',
                            color: completed || active ? 'white' : 'grey.600',
                          }}
                        >
                          {completed ? (
                            <CheckCircleIcon sx={{ fontSize: 16 }} />
                          ) : (
                            <Typography variant="caption" sx={{ fontWeight: 600 }}>
                              {index + 1}
                            </Typography>
                          )}
                        </Box>
                      )}
                    >
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {step.title}
                      </Typography>
                    </StepLabel>
                    <StepContent>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {step.description}
                      </Typography>
                      {step.date && (
                        <Typography variant="caption" color="text.secondary">
                          {step.date} {step.time && `• ${step.time}`}
                        </Typography>
                      )}
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column - Customer Info, Payment, Shipping */}
        <Grid item xs={12} lg={4}>
          {/* Customer Information */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Customer Information
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar
                  src={order.customer.avatar}
                  sx={{ width: 48, height: 48, mr: 2 }}
                >
                  {order.customer.name.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {order.customer.name}
                  </Typography>
                  {order.customer.type && (
                    <Chip
                      label={order.customer.type}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  )}
                </Box>
              </Box>
              <List dense>
                <ListItem sx={{ px: 0 }}>
                  <EmailIcon sx={{ mr: 2, color: 'text.secondary', fontSize: 20 }} />
                  <ListItemText
                    primary={order.customer.email}
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <PhoneIcon sx={{ mr: 2, color: 'text.secondary', fontSize: 20 }} />
                  <ListItemText
                    primary={order.customer.phone}
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
                {order.customer.address && (
                  <ListItem sx={{ px: 0 }}>
                    <LocationIcon sx={{ mr: 2, color: 'text.secondary', fontSize: 20 }} />
                    <ListItemText
                      primary={order.customer.address}
                      primaryTypographyProps={{ variant: 'body2' }}
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PaymentIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Payment Summary
                </Typography>
              </Box>
              <List dense>
                <ListItem sx={{ px: 0, justifyContent: 'space-between' }}>
                  <ListItemText primary="Subtotal" />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {formatCurrency(order.payment.subtotal)}
                  </Typography>
                </ListItem>
                <ListItem sx={{ px: 0, justifyContent: 'space-between' }}>
                  <ListItemText primary="Shipping" />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {formatCurrency(order.payment.shipping)}
                  </Typography>
                </ListItem>
                <ListItem sx={{ px: 0, justifyContent: 'space-between' }}>
                  <ListItemText primary="Tax" />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {formatCurrency(order.payment.tax)}
                  </Typography>
                </ListItem>
                {order.payment.discount > 0 && (
                  <ListItem sx={{ px: 0, justifyContent: 'space-between' }}>
                    <ListItemText primary="Discount" />
                    <Typography variant="body2" sx={{ fontWeight: 500, color: 'success.main' }}>
                      -{formatCurrency(order.payment.discount)}
                    </Typography>
                  </ListItem>
                )}
                <Divider sx={{ my: 1 }} />
                <ListItem sx={{ px: 0, justifyContent: 'space-between' }}>
                  <ListItemText 
                    primary="Total" 
                    primaryTypographyProps={{ variant: 'subtitle1', fontWeight: 600 }}
                  />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {formatCurrency(order.payment.total)}
                  </Typography>
                </ListItem>
              </List>
              <Box sx={{ mt: 2, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Payment Method: {order.payment.method}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Status: {order.payment.status}
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Shipping Information */}
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ShippingIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Shipping Details
                </Typography>
              </Box>
              <List dense>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText
                    primary="Shipping Method"
                    secondary={order.shipping.method}
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText
                    primary="Delivery Address"
                    secondary={order.shipping.address}
                  />
                </ListItem>
                {order.shipping.trackingNumber && (
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary="Tracking Number"
                      secondary={order.shipping.trackingNumber}
                    />
                  </ListItem>
                )}
                {order.shipping.estimatedDelivery && (
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary="Estimated Delivery"
                      secondary={order.shipping.estimatedDelivery}
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default OrderPreview
