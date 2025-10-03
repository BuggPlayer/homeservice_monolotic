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
  Alert
} from '@mui/material'
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  ShoppingCart as ShoppingCartIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon
} from '@mui/icons-material'
import { PageHeader } from '../components/common/PageHeader'
import { OrderStatsCard } from '../components/common/OrderStatsCard'
import { OrderFilters } from '../components/common/OrderFilters'
import { OrderTable } from '../components/orders/OrderTable'
import { Pagination } from '../components/common/Pagination'
import { PreviewModal, OrderPreview } from '../components/common'
import { Order, OrderStats } from '../types'

// Mock data - in real app, this would come from API
const mockOrders: Order[] = [
  {
    id: 1,
    order_id: '#01766703570',
    customer: {
      id: 1,
      name: 'Muhammad Fateh',
      email: 'muhammad.fateh@email.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      type: 'Pro Customer'
    },
    product: {
      id: 1,
      name: 'Airpods Pro Max 2024',
      image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400',
      type: 'Electric Product'
    },
    amount: 10120.00,
    payment_method: 'Paid by Mastercard',
    status: 'accepted',
    order_date: '2024-01-01T00:00:00Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    order_id: '#01766707087',
    customer: {
      id: 2,
      name: 'Kazi Mukarram',
      email: 'kazi.mukarram@email.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
      type: 'Regular Customer'
    },
    product: {
      id: 2,
      name: 'Neaithy Beauty Cream',
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400',
      type: 'Beauty Product'
    },
    amount: 5180.00,
    payment_method: 'Cash on Delivery',
    status: 'accepted',
    order_date: '2024-02-24T00:00:00Z',
    created_at: '2024-02-24T00:00:00Z',
    updated_at: '2024-02-24T00:00:00Z'
  },
  {
    id: 3,
    order_id: '#01766701234',
    customer: {
      id: 3,
      name: 'Anderson Mark',
      email: 'anderson.mark@email.com',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
      type: 'VIP Customer'
    },
    product: {
      id: 3,
      name: 'Apple Watch Series 4 New',
      image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400',
      type: 'Smart Watch'
    },
    amount: 13145.00,
    payment_method: 'Paid by Visacard',
    status: 'pending',
    order_date: '2024-03-05T00:00:00Z',
    created_at: '2024-03-05T00:00:00Z',
    updated_at: '2024-03-05T00:00:00Z'
  },
  {
    id: 4,
    order_id: '#01766727267',
    customer: {
      id: 4,
      name: 'John Kales',
      email: 'john.kales@email.com',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400',
      type: 'Pro Customer'
    },
    product: {
      id: 4,
      name: 'iPhone 16 Pro Max Plus',
      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
      type: 'Smartphone'
    },
    amount: 50760.00,
    payment_method: 'Paid by Mastercard',
    status: 'completed',
    order_date: '2024-03-01T00:00:00Z',
    created_at: '2024-03-01T00:00:00Z',
    updated_at: '2024-03-01T00:00:00Z'
  },
  {
    id: 5,
    order_id: '#01766712323',
    customer: {
      id: 5,
      name: 'Saleh Ahmed',
      email: 'saleh.ahmed@email.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      type: 'Regular Customer'
    },
    product: {
      id: 5,
      name: 'Small Hi-Speed Fan',
      image: 'https://images.unsplash.com/photo-1581578731548-c6a0c3f2f4fb?w=400',
      type: 'Home Appliance'
    },
    amount: 10120.00,
    payment_method: 'Paid by Mastercard',
    status: 'rejected',
    order_date: '2024-04-01T00:00:00Z',
    created_at: '2024-04-01T00:00:00Z',
    updated_at: '2024-04-01T00:00:00Z'
  },
  {
    id: 6,
    order_id: '#01766712398',
    customer: {
      id: 6,
      name: 'Muhammad Salim',
      email: 'muhammad.salim@email.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
      type: 'Pro Customer'
    },
    product: {
      id: 6,
      name: 'MI Watch Pro X231 Max',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
      type: 'Smart Watch'
    },
    amount: 18190.00,
    payment_method: 'Cash on Delivery',
    status: 'accepted',
    order_date: '2024-05-25T00:00:00Z',
    created_at: '2024-05-25T00:00:00Z',
    updated_at: '2024-05-25T00:00:00Z'
  },
  {
    id: 7,
    order_id: '#01766712078',
    customer: {
      id: 7,
      name: 'Saad Makki',
      email: 'saad.makki@email.com',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
      type: 'VIP Customer'
    },
    product: {
      id: 7,
      name: 'Nike New Model Shoes',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400',
      type: 'Sports Shoes'
    },
    amount: 13760.00,
    payment_method: 'Paid by Mastercard',
    status: 'accepted',
    order_date: '2024-05-20T00:00:00Z',
    created_at: '2024-05-20T00:00:00Z',
    updated_at: '2024-05-20T00:00:00Z'
  },
  {
    id: 8,
    order_id: '#01766715677',
    customer: {
      id: 8,
      name: 'Jack Kalis',
      email: 'jack.kalis@email.com',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400',
      type: 'Regular Customer'
    },
    product: {
      id: 8,
      name: 'Man T-shirt Green Color',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
      type: 'Clothing'
    },
    amount: 9720.00,
    payment_method: 'Paid by Visacard',
    status: 'completed',
    order_date: '2024-05-15T00:00:00Z',
    created_at: '2024-05-15T00:00:00Z',
    updated_at: '2024-05-15T00:00:00Z'
  },
  {
    id: 9,
    order_id: '#01766712233',
    customer: {
      id: 9,
      name: 'Jhon Ken',
      email: 'jhon.ken@email.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      type: 'Pro Customer'
    },
    product: {
      id: 9,
      name: 'Fifa 2026 Football',
      image: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400',
      type: 'Sports Equipment'
    },
    amount: 90120.00,
    payment_method: 'Paid by Mastercard',
    status: 'rejected',
    order_date: '2024-05-10T00:00:00Z',
    created_at: '2024-05-10T00:00:00Z',
    updated_at: '2024-05-10T00:00:00Z'
  },
  {
    id: 10,
    order_id: '#01766712876',
    customer: {
      id: 10,
      name: 'Makkolam Benndon',
      email: 'makkolam.benndon@email.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
      type: 'Regular Customer'
    },
    product: {
      id: 10,
      name: 'Winter Cloth Siwtter',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
      type: 'Clothing'
    },
    amount: 40980.00,
    payment_method: 'Cash on Delivery',
    status: 'pending',
    order_date: '2024-05-05T00:00:00Z',
    created_at: '2024-05-05T00:00:00Z',
    updated_at: '2024-05-05T00:00:00Z'
  }
]

const mockStats: OrderStats = {
  total_orders: 240120,
  new_orders: 170190,
  completed_orders: 140530,
  cancelled_orders: 99349,
  total_revenue: 1542050.50,
  average_order_value: 285.75,
  period: 'Last 365 days'
}

export function Orders() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  
  // State management
  const [orders] = useState<Order[]>(mockOrders)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({
    start: new Date('2024-01-01'),
    end: new Date('2024-12-31')
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [moreActionsAnchor, setMoreActionsAnchor] = useState<null | HTMLElement>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null)
  const [snackbar, setSnackbar] = useState<{
    open: boolean
    message: string
    severity: 'success' | 'error' | 'warning' | 'info'
  }>({ open: false, message: '', severity: 'info' })
  const [orderPreviewOpen, setOrderPreviewOpen] = useState(false)
  const [selectedOrderForPreview, setSelectedOrderForPreview] = useState<Order | null>(null)

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = 
        order.product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.order_id.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter
      
      const matchesDateRange = (() => {
        if (!dateRange.start || !dateRange.end) return true
        const orderDate = new Date(order.order_date)
        return orderDate >= dateRange.start && orderDate <= dateRange.end
      })()
      
      return matchesSearch && matchesStatus && matchesDateRange
    })
  }, [orders, searchQuery, statusFilter, dateRange])

  // Paginated orders
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredOrders.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredOrders, currentPage, itemsPerPage])

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage)

  // Handlers
  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  const handleStatusChange = (status: string) => {
    setStatusFilter(status)
    setCurrentPage(1)
  }

  const handleDateRangeChange = (start: Date | null, end: Date | null) => {
    setDateRange({ start, end })
    setCurrentPage(1)
  }

  const handleClearFilters = () => {
    setSearchQuery('')
    setStatusFilter('all')
    setDateRange({ start: null, end: null })
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

  const handleViewOrder = (order: Order) => {
    setSelectedOrderForPreview(order)
    setOrderPreviewOpen(true)
  }

  const handleCloseOrderPreview = () => {
    setOrderPreviewOpen(false)
    setSelectedOrderForPreview(null)
  }

  const handleEditOrder = (order: Order) => {
    setSnackbar({
      open: true,
      message: `Editing order ${order.order_id}`,
      severity: 'info'
    })
  }

  const handleDeleteOrder = (order: Order) => {
    setOrderToDelete(order)
    setDeleteDialogOpen(true)
  }

  const handlePrintOrder = (order: Order) => {
    setSnackbar({
      open: true,
      message: `Printing order ${order.order_id}`,
      severity: 'info'
    })
  }

  const handleConfirmDelete = () => {
    if (orderToDelete) {
      setSnackbar({
        open: true,
        message: `Order ${orderToDelete.order_id} deleted successfully`,
        severity: 'success'
      })
    }
    setDeleteDialogOpen(false)
    setOrderToDelete(null)
  }

  const handleMoreActions = (event: React.MouseEvent<HTMLElement>) => {
    setMoreActionsAnchor(event.currentTarget)
  }

  const handleMoreActionsClose = () => {
    setMoreActionsAnchor(null)
  }

  const handleAddOrder = () => {
    setSnackbar({
      open: true,
      message: 'Add order feature coming soon!',
      severity: 'info'
    })
  }

  const handleExportOrders = () => {
    setSnackbar({
      open: true,
      message: 'Export orders feature coming soon!',
      severity: 'info'
    })
    handleMoreActionsClose()
  }

  const handleImportOrders = () => {
    setSnackbar({
      open: true,
      message: 'Import orders feature coming soon!',
      severity: 'info'
    })
    handleMoreActionsClose()
  }

  return (
    <Box sx={{ flexGrow: 1, p: { xs: 1, sm: 2, md: 3 } }}>
      {/* Page Header */}
      <PageHeader
        title="Orders List"
        subtitle="Here you can find all of your Orders"
        action={
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddOrder}
              sx={{ 
                borderRadius: 2,
                px: 3,
                py: 1,
                fontWeight: 600,
                textTransform: 'none'
              }}
            >
              + Add Order
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
            title="Total Orders"
            value={mockStats.total_orders.toLocaleString()}
            subtitle={mockStats.period}
            trend={{ value: 12.5, isPositive: true }}
            icon={<ShoppingCartIcon />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <OrderStatsCard
            title="New Orders"
            value={mockStats.new_orders.toLocaleString()}
            subtitle={mockStats.period}
            trend={{ value: 0, isPositive: false, isNeutral: true }}
            icon={<TrendingUpIcon />}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <OrderStatsCard
            title="Completed Orders"
            value={mockStats.completed_orders.toLocaleString()}
            subtitle={mockStats.period}
            trend={{ value: 8.2, isPositive: true }}
            icon={<CheckCircleIcon />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <OrderStatsCard
            title="Cancelled Orders"
            value={mockStats.cancelled_orders.toLocaleString()}
            subtitle={mockStats.period}
            trend={{ value: -5.3, isPositive: false }}
            icon={<CancelIcon />}
            color="error"
          />
        </Grid>
      </Grid>

      {/* Filters */}
      <OrderFilters
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        statusFilter={statusFilter}
        onStatusChange={handleStatusChange}
        dateRange={dateRange}
        onDateRangeChange={handleDateRangeChange}
        onClearFilters={handleClearFilters}
        onMoreFilters={handleMoreFilters}
      />

      {/* Orders Table */}
      <OrderTable
        orders={paginatedOrders}
        onViewOrder={handleViewOrder}
        onEditOrder={handleEditOrder}
        onDeleteOrder={handleDeleteOrder}
        onPrintOrder={handlePrintOrder}
      />

      {/* Pagination */}
      {filteredOrders.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredOrders.length}
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
        <MenuItem onClick={handleExportOrders}>
          Export Orders
        </MenuItem>
        <MenuItem onClick={handleImportOrders}>
          Import Orders
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Delete Order</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete order {orderToDelete?.order_id}? 
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

      {/* Order Preview Modal */}
      {selectedOrderForPreview && (
        <PreviewModal
          open={orderPreviewOpen}
          onClose={handleCloseOrderPreview}
          title={selectedOrderForPreview.order_id}
          subtitle="Order Details"
          maxWidth="lg"
        >
          <OrderPreview
            order={{
              id: selectedOrderForPreview.id.toString(),
              orderNumber: selectedOrderForPreview.order_id,
              status: selectedOrderForPreview.status as any,
              createdAt: selectedOrderForPreview.created_at,
              updatedAt: selectedOrderForPreview.updated_at,
              items: [{
                id: selectedOrderForPreview.product.id,
                name: selectedOrderForPreview.product.name,
                image: selectedOrderForPreview.product.image,
                category: selectedOrderForPreview.product.type,
                quantity: 1,
                price: selectedOrderForPreview.amount,
                total: selectedOrderForPreview.amount,
              }],
              customer: {
                id: selectedOrderForPreview.customer.id,
                name: selectedOrderForPreview.customer.name,
                email: selectedOrderForPreview.customer.email,
                phone: '(+1) 555-0123', // Default phone since not in mock data
                address: '123 Main Street, City, State 12345', // Default address
                avatar: selectedOrderForPreview.customer.avatar,
                type: selectedOrderForPreview.customer.type,
              },
              payment: {
                method: selectedOrderForPreview.payment_method,
                status: 'Confirmed',
                subtotal: selectedOrderForPreview.amount,
                shipping: 5.99,
                tax: selectedOrderForPreview.amount * 0.08,
                discount: 0,
                total: selectedOrderForPreview.amount + 5.99 + (selectedOrderForPreview.amount * 0.08),
              },
              shipping: {
                method: 'Standard',
                address: '123 Main Street, City, State 12345',
                trackingNumber: 'TRK' + selectedOrderForPreview.id.toString().padStart(6, '0'),
                estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
              },
              timeline: [
                {
                  id: '1',
                  title: 'Order Placed',
                  description: 'Order has been successfully placed by the customer',
                  completed: true,
                  active: false,
                  date: new Date(selectedOrderForPreview.created_at).toLocaleDateString(),
                  time: new Date(selectedOrderForPreview.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                },
                {
                  id: '2',
                  title: 'Payment Confirmed',
                  description: 'Payment has been successfully processed and verified.',
                  completed: true,
                  active: false,
                  date: new Date(selectedOrderForPreview.created_at).toLocaleDateString(),
                  time: new Date(selectedOrderForPreview.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                },
                {
                  id: '3',
                  title: 'Order Processed',
                  description: 'The order is being prepared (products are being packed)',
                  completed: selectedOrderForPreview.status === 'completed' || selectedOrderForPreview.status === 'accepted',
                  active: selectedOrderForPreview.status === 'pending' || selectedOrderForPreview.status === 'accepted',
                  date: selectedOrderForPreview.status === 'completed' || selectedOrderForPreview.status === 'accepted' ? new Date(selectedOrderForPreview.updated_at).toLocaleDateString() : undefined,
                  time: selectedOrderForPreview.status === 'completed' || selectedOrderForPreview.status === 'accepted' ? new Date(selectedOrderForPreview.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined,
                },
              ],
            }}
            onEdit={() => handleEditOrder(selectedOrderForPreview)}
            onDelete={() => handleDeleteOrder(selectedOrderForPreview)}
            onPrint={() => handlePrintOrder(selectedOrderForPreview)}
            onShare={() => console.log('Share order')}
          />
        </PreviewModal>
      )}

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
