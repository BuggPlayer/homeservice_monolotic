import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import {
  Dashboard as DashboardIcon,
  Inventory as PackageIcon,
  Build as WrenchIcon,
  Assignment as FileTextIcon,
  AttachMoney as DollarSignIcon,
  Event as CalendarIcon,
  People as UsersIcon,
  Security as ShieldIcon,
  Analytics as BarChartIcon,
  Message as MessageIcon,
  ShoppingCart as ShoppingCartIcon,
  Settings as SettingsIcon,
  Home as HomeIcon,
} from '@mui/icons-material'

const drawerWidth = 280

const navigation = [
  { name: 'Dashboard', href: '/', icon: DashboardIcon },
  { name: 'Products', href: '/products', icon: PackageIcon },
  { name: 'Services', href: '/services', icon: WrenchIcon },
  { name: 'Service Requests', href: '/requests', icon: FileTextIcon },
  { name: 'Quotes', href: '/quotes', icon: DollarSignIcon },
  { name: 'Bookings', href: '/bookings', icon: CalendarIcon },
  { name: 'Users', href: '/users', icon: UsersIcon },
  { name: 'Providers', href: '/providers', icon: ShieldIcon },
  { name: 'Analytics', href: '/analytics', icon: BarChartIcon },
  { name: 'Messages', href: '/messages', icon: MessageIcon },
  { name: 'Orders', href: '/orders', icon: ShoppingCartIcon },
  { name: 'Settings', href: '/settings', icon: SettingsIcon },
]

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo */}
      <Box
        sx={{
          p: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            bgcolor: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <HomeIcon sx={{ color: 'white', fontSize: 24 }} />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
          Fixer Admin
        </Typography>
      </Box>

      {/* Navigation */}
      <List sx={{ flex: 1, px: 1, py: 2 }}>
        {navigation.map((item) => {
          const isActive = location.pathname === item.href
          return (
            <ListItem key={item.name} disablePadding>
              <ListItemButton
                component={Link}
                to={item.href}
                onClick={isMobile ? onClose : undefined}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  backgroundColor: isActive ? 'primary.main' : 'transparent',
                  color: isActive ? 'primary.contrastText' : 'text.primary',
                  '&:hover': {
                    backgroundColor: isActive ? 'primary.dark' : 'action.hover',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? 'primary.contrastText' : 'text.secondary',
                    minWidth: 40,
                  }}
                >
                  <item.icon />
                </ListItemIcon>
                <ListItemText
                  primary={item.name}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 600 : 400,
                    fontSize: '0.875rem',
                  }}
                />
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>

      <Divider />
      
      {/* Footer */}
      <Box sx={{ p: 2 }}>
        <Typography variant="caption" color="text.secondary" align="center" display="block">
          Fixer Admin Panel v1.0
        </Typography>
      </Box>
    </Box>
  )

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
          },
        }}
      >
        {drawerContent}
      </Drawer>
    )
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: 'none', md: 'block' },
        '& .MuiDrawer-paper': {
          boxSizing: 'border-box',
          width: drawerWidth,
        },
      }}
      open
    >
      {drawerContent}
    </Drawer>
  )
}