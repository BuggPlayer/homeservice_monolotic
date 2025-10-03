import React, { useState } from 'react'
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
  Collapse,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
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
  ExpandLess,
  ExpandMore,
  Business as BusinessIcon,
  Support as SupportIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
} from '@mui/icons-material'

const drawerWidth = 280

// Navigation groups with collapsible sections
const navigationGroups = [
  {
    title: 'Main Menu',
    items: [
      { name: 'Dashboard', href: '/', icon: DashboardIcon },
      { 
        name: 'Business Management', 
        icon: BusinessIcon, 
        hasSubmenu: true,
        subItems: [
          { name: 'Products', href: '/products', icon: PackageIcon },
          { name: 'Services', href: '/services', icon: WrenchIcon },
          { name: 'Providers', href: '/providers', icon: ShieldIcon },
        ]
      },
      { 
        name: 'Operations', 
        icon: ShoppingCartIcon, 
        hasSubmenu: true,
        subItems: [
          { name: 'Orders', href: '/orders', icon: ShoppingCartIcon },
          { name: 'Service Requests', href: '/requests', icon: FileTextIcon },
          { name: 'Quotes', href: '/quotes', icon: DollarSignIcon },
          { name: 'Bookings', href: '/bookings', icon: CalendarIcon },
        ]
      },
      { name: 'Analytics', href: '/analytics', icon: BarChartIcon },
      { name: 'Messages', href: '/messages', icon: MessageIcon },
    ]
  },
  {
    title: 'Management',
    items: [
      { name: 'Users', href: '/users', icon: UsersIcon },
      { name: 'Settings', href: '/settings', icon: SettingsIcon },
    ]
  },
  {
    title: 'Support',
    items: [
      { name: 'Help & Support', href: '/support', icon: SupportIcon },
      { name: 'Notifications', href: '/notifications', icon: NotificationsIcon },
    ]
  }
]

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [openSubmenus, setOpenSubmenus] = useState<{ [key: string]: boolean }>({
    'Business Management': true,
    'Operations': true,
  })
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null)

  const handleSubmenuToggle = (menuName: string) => {
    setOpenSubmenus(prev => ({
      ...prev,
      [menuName]: !prev[menuName]
    }))
  }

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget)
  }

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null)
  }

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

      {/* Navigation Groups */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {navigationGroups.map((group, groupIndex) => (
          <Box key={group.title} sx={{ mb: groupIndex < navigationGroups.length - 1 ? 3 : 0 }}>
            {/* Group Header */}
            <Box sx={{ px: 3, py: 1 }}>
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  fontSize: '0.75rem',
                }}
              >
                {group.title}
              </Typography>
            </Box>

            {/* Group Items */}
            <List sx={{ px: 1 }}>
              {group.items.map((item) => {
                const isActive = location.pathname === item.href
                const hasSubmenu = item.hasSubmenu
                const isSubmenuOpen = openSubmenus[item.name] || false

                return (
                  <Box key={item.name}>
                    <ListItem disablePadding>
                      <ListItemButton
                        onClick={hasSubmenu ? () => handleSubmenuToggle(item.name) : undefined}
                        component={hasSubmenu ? 'div' : Link}
                        to={hasSubmenu ? undefined : item.href}
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
                        {hasSubmenu && (
                          <Box sx={{ ml: 1 }}>
                            {isSubmenuOpen ? <ExpandLess /> : <ExpandMore />}
                          </Box>
                        )}
                      </ListItemButton>
                    </ListItem>

                    {/* Submenu Items */}
                    {hasSubmenu && (
                      <Collapse in={isSubmenuOpen} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding sx={{ pl: 2 }}>
                          {item.subItems?.map((subItem) => {
                            const isSubActive = location.pathname === subItem.href
                            return (
                              <ListItem key={subItem.name} disablePadding>
                                <ListItemButton
                                  component={Link}
                                  to={subItem.href}
                                  onClick={isMobile ? onClose : undefined}
                                  sx={{
                                    borderRadius: 2,
                                    mb: 0.5,
                                    backgroundColor: isSubActive ? 'primary.main' : 'transparent',
                                    color: isSubActive ? 'primary.contrastText' : 'text.primary',
                                    '&:hover': {
                                      backgroundColor: isSubActive ? 'primary.dark' : 'action.hover',
                                    },
                                  }}
                                >
                                  <ListItemIcon
                                    sx={{
                                      color: isSubActive ? 'primary.contrastText' : 'text.secondary',
                                      minWidth: 32,
                                    }}
                                  >
                                    <subItem.icon />
                                  </ListItemIcon>
                                  <ListItemText
                                    primary={subItem.name}
                                    primaryTypographyProps={{
                                      fontWeight: isSubActive ? 600 : 400,
                                      fontSize: '0.8rem',
                                    }}
                                  />
                                </ListItemButton>
                              </ListItem>
                            )
                          })}
                        </List>
                      </Collapse>
                    )}
                  </Box>
                )
              })}
            </List>
          </Box>
        ))}
      </Box>

      <Divider />
      
      {/* User Profile Section */}
      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            p: 1.5,
            borderRadius: 2,
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          }}
          onClick={handleUserMenuOpen}
        >
          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: 'primary.main',
              fontSize: '1rem',
            }}
          >
            <PersonIcon />
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                fontSize: '0.875rem',
                color: 'text.primary',
                lineHeight: 1.2,
              }}
            >
              Admin User
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                fontSize: '0.75rem',
                lineHeight: 1.2,
              }}
            >
              Super Admin
            </Typography>
          </Box>
          <IconButton size="small" sx={{ color: 'text.secondary' }}>
            <ExpandMore />
          </IconButton>
        </Box>

        {/* User Menu */}
        <Menu
          anchorEl={userMenuAnchor}
          open={Boolean(userMenuAnchor)}
          onClose={handleUserMenuClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
        >
          <MenuItem onClick={handleUserMenuClose}>
            <ListItemIcon>
              <AccountCircleIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Profile</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleUserMenuClose}>
            <ListItemIcon>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Settings</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleUserMenuClose}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Logout</ListItemText>
          </MenuItem>
        </Menu>
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