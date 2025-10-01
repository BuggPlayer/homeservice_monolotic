import React from 'react'
import {
  AppBar,
  AppBarProps,
  Toolbar,
  ToolbarProps,
  Drawer,
  DrawerProps,
  List,
  ListProps,
  ListItem,
  ListItemProps,
  ListItemButton,
  ListItemButtonProps,
  ListItemIcon,
  ListItemIconProps,
  ListItemText,
  ListItemTextProps,
  Breadcrumbs,
  BreadcrumbsProps,
  Link,
  LinkProps,
  Pagination,
  PaginationProps,
  Menu,
  MenuProps,
  MenuItem,
  MenuItemProps,
  MenuList,
  MenuListProps,
  Tabs,
  TabsProps,
  Tab,
  TabProps,
  BottomNavigation,
  BottomNavigationProps,
  BottomNavigationAction,
  BottomNavigationActionProps,
  Stepper,
  StepperProps,
  Step,
  StepProps,
  StepLabel,
  StepLabelProps,
  StepButton,
  StepButtonProps,
  StepContent,
  StepContentProps,
  Paper,
  PaperProps,
  Box,
  BoxProps,
  Divider,
  DividerProps,
} from '@mui/material'
import { styled } from '@mui/material/styles'

// Styled AppBar
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  boxShadow: theme.shadows[1],
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  borderBottom: `1px solid ${theme.palette.divider}`,
}))

// Styled Drawer
const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    borderRight: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
  },
}))

// Styled Breadcrumbs
const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  '& .MuiBreadcrumbs-separator': {
    color: theme.palette.text.secondary,
  },
}))

// App Bar Component
export interface CustomAppBarProps extends AppBarProps {
  title?: string
  logo?: React.ReactNode
  actions?: React.ReactNode
  position?: 'fixed' | 'absolute' | 'sticky' | 'static' | 'relative'
  elevation?: number
  color?: 'inherit' | 'primary' | 'secondary' | 'transparent'
}

export const CustomAppBar: React.FC<CustomAppBarProps> = ({
  title,
  logo,
  actions,
  position = 'fixed',
  elevation = 1,
  color = 'inherit',
  children,
  sx,
  ...props
}) => {
  return (
    <StyledAppBar
      position={position}
      elevation={elevation}
      color={color}
      sx={sx}
      {...props}
    >
      <Toolbar>
        {logo && <Box sx={{ mr: 2 }}>{logo}</Box>}
        {title && (
          <Box component="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
            {title}
          </Box>
        )}
        {actions && <Box sx={{ ml: 'auto' }}>{actions}</Box>}
        {children}
      </Toolbar>
    </StyledAppBar>
  )
}

// Drawer Component
export interface CustomDrawerProps extends DrawerProps {
  open: boolean
  onClose: () => void
  variant?: 'permanent' | 'persistent' | 'temporary'
  anchor?: 'left' | 'right' | 'top' | 'bottom'
  width?: number | string
  children: React.ReactNode
}

export const CustomDrawer: React.FC<CustomDrawerProps> = ({
  open,
  onClose,
  variant = 'temporary',
  anchor = 'left',
  width = 280,
  children,
  sx,
  ...props
}) => {
  return (
    <StyledDrawer
      open={open}
      onClose={onClose}
      variant={variant}
      anchor={anchor}
      sx={{
        '& .MuiDrawer-paper': {
          width,
          ...sx,
        },
      }}
      {...props}
    >
      {children}
    </StyledDrawer>
  )
}

// Navigation List Component
export interface NavigationListProps extends ListProps {
  items: Array<{
    id: string | number
    label: string
    icon?: React.ReactNode
    href?: string
    onClick?: () => void
    active?: boolean
    disabled?: boolean
    badge?: string | number
    children?: Array<{
      id: string | number
      label: string
      icon?: React.ReactNode
      href?: string
      onClick?: () => void
      active?: boolean
      disabled?: boolean
    }>
  }>
  dense?: boolean
  subheader?: string
}

export const NavigationList: React.FC<NavigationListProps> = ({
  items,
  dense = false,
  subheader,
  sx,
  ...props
}) => {
  return (
    <List dense={dense} subheader={subheader ? <div>{subheader}</div> : undefined} sx={sx} {...props}>
      {items.map((item) => (
        <React.Fragment key={item.id}>
          <ListItem disablePadding>
            <ListItemButton
              href={item.href}
              onClick={item.onClick}
              disabled={item.disabled}
              selected={item.active}
              sx={{
                borderRadius: 1,
                mx: 1,
                mb: 0.5,
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                },
              }}
            >
              {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
              <ListItemText primary={item.label} />
              {item.badge && (
                <Box
                  sx={{
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    borderRadius: '50%',
                    minWidth: 20,
                    height: 20,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                  }}
                >
                  {item.badge}
                </Box>
              )}
            </ListItemButton>
          </ListItem>
          {item.children && (
            <Box sx={{ pl: 2 }}>
              {item.children.map((child) => (
                <ListItem key={child.id} disablePadding>
                  <ListItemButton
                    href={child.href}
                    onClick={child.onClick}
                    disabled={child.disabled}
                    selected={child.active}
                    sx={{
                      borderRadius: 1,
                      mx: 1,
                      mb: 0.5,
                      pl: 4,
                      '&.Mui-selected': {
                        backgroundColor: 'primary.main',
                        color: 'primary.contrastText',
                      },
                    }}
                  >
                    {child.icon && <ListItemIcon>{child.icon}</ListItemIcon>}
                    <ListItemText primary={child.label} />
                  </ListItemButton>
                </ListItem>
              ))}
            </Box>
          )}
        </React.Fragment>
      ))}
    </List>
  )
}

// Breadcrumbs Component
export interface CustomBreadcrumbsProps extends BreadcrumbsProps {
  items: Array<{
    label: string
    href?: string
    onClick?: () => void
    active?: boolean
  }>
  separator?: React.ReactNode
  maxItems?: number
}

export const CustomBreadcrumbs: React.FC<CustomBreadcrumbsProps> = ({
  items,
  separator = '/',
  maxItems = 8,
  sx,
  ...props
}) => {
  return (
    <StyledBreadcrumbs
      separator={separator}
      maxItems={maxItems}
      sx={sx}
      {...props}
    >
      {items.map((item, index) => (
        <Link
          key={index}
          href={item.href}
          onClick={item.onClick}
          color={item.active ? 'text.primary' : 'text.secondary'}
          sx={{
            textDecoration: 'none',
            fontWeight: item.active ? 600 : 400,
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          {item.label}
        </Link>
      ))}
    </StyledBreadcrumbs>
  )
}

// Pagination Component
export interface CustomPaginationProps extends PaginationProps {
  page: number
  count: number
  onPageChange: (event: React.ChangeEvent<unknown>, page: number) => void
  showFirstButton?: boolean
  showLastButton?: boolean
  showPrevButton?: boolean
  showNextButton?: boolean
  size?: 'small' | 'medium' | 'large'
  color?: 'primary' | 'secondary' | 'standard'
  shape?: 'rounded' | 'circular'
}

export const CustomPagination: React.FC<CustomPaginationProps> = ({
  page,
  count,
  onPageChange,
  showFirstButton = true,
  showLastButton = true,
  showPrevButton = true,
  showNextButton = true,
  size = 'medium',
  color = 'primary',
  shape = 'rounded',
  sx,
  ...props
}) => {
  return (
    <Pagination
      page={page}
      count={count}
      onChange={onPageChange}
      showFirstButton={showFirstButton}
      showLastButton={showLastButton}
      showPrevButton={showPrevButton}
      showNextButton={showNextButton}
      size={size}
      color={color}
      shape={shape}
      sx={sx}
      {...props}
    />
  )
}

// Menu Component
export interface CustomMenuProps extends MenuProps {
  items: Array<{
    label: string
    icon?: React.ReactNode
    onClick?: () => void
    disabled?: boolean
    divider?: boolean
  }>
  anchorEl: HTMLElement | null
  onClose: () => void
  open: boolean
}

export const CustomMenu: React.FC<CustomMenuProps> = ({
  items,
  anchorEl,
  onClose,
  open,
  sx,
  ...props
}) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      sx={sx}
      {...props}
    >
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <MenuItem
            onClick={() => {
              item.onClick?.()
              onClose()
            }}
            disabled={item.disabled}
          >
            {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
            <ListItemText>{item.label}</ListItemText>
          </MenuItem>
          {item.divider && <Divider />}
        </React.Fragment>
      ))}
    </Menu>
  )
}

// Bottom Navigation Component
export interface CustomBottomNavigationProps extends BottomNavigationProps {
  items: Array<{
    label: string
    icon: React.ReactNode
    value: string | number
    disabled?: boolean
  }>
  value: string | number
  onChange: (event: React.SyntheticEvent, newValue: string | number) => void
  showLabels?: boolean
}

export const CustomBottomNavigation: React.FC<CustomBottomNavigationProps> = ({
  items,
  value,
  onChange,
  showLabels = true,
  sx,
  ...props
}) => {
  return (
    <BottomNavigation
      value={value}
      onChange={onChange}
      showLabels={showLabels}
      sx={sx}
      {...props}
    >
      {items.map((item) => (
        <BottomNavigationAction
          key={item.value}
          label={item.label}
          icon={item.icon}
          value={item.value}
          disabled={item.disabled}
        />
      ))}
    </BottomNavigation>
  )
}

// Stepper Component
export interface CustomStepperProps extends StepperProps {
  steps: Array<{
    label: string
    description?: string
    optional?: boolean
    completed?: boolean
    disabled?: boolean
  }>
  activeStep: number
  orientation?: 'horizontal' | 'vertical'
  alternativeLabel?: boolean
  nonLinear?: boolean
}

export const CustomStepper: React.FC<CustomStepperProps> = ({
  steps,
  activeStep,
  orientation = 'horizontal',
  alternativeLabel = false,
  nonLinear = false,
  sx,
  ...props
}) => {
  return (
    <Stepper
      activeStep={activeStep}
      orientation={orientation}
      alternativeLabel={alternativeLabel}
      nonLinear={nonLinear}
      sx={sx}
      {...props}
    >
      {steps.map((step, index) => (
        <Step key={step.label} completed={step.completed} disabled={step.disabled}>
          <StepLabel optional={step.optional}>
            {step.label}
          </StepLabel>
          {orientation === 'vertical' && step.description && (
            <StepContent>
              <div>{step.description}</div>
            </StepContent>
          )}
        </Step>
      ))}
    </Stepper>
  )
}

// Export all navigation components
export {
  AppBar as BaseAppBar,
  Toolbar as BaseToolbar,
  Drawer as BaseDrawer,
  List as BaseList,
  ListItem as BaseListItem,
  ListItemButton as BaseListItemButton,
  ListItemIcon as BaseListItemIcon,
  ListItemText as BaseListItemText,
  Breadcrumbs as BaseBreadcrumbs,
  Link as BaseLink,
  Pagination as BasePagination,
  Menu as BaseMenu,
  MenuItem as BaseMenuItem,
  MenuList as BaseMenuList,
  Tabs as BaseTabs,
  Tab as BaseTab,
  BottomNavigation as BaseBottomNavigation,
  BottomNavigationAction as BaseBottomNavigationAction,
  Stepper as BaseStepper,
  Step as BaseStep,
  StepLabel as BaseStepLabel,
  StepButton as BaseStepButton,
  StepContent as BaseStepContent,
  Paper as BasePaper,
  Box as BaseBox,
  Divider as BaseDivider,
}
