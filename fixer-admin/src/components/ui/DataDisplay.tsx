import React from 'react'
import {
  Table,
  TableProps,
  TableBody,
  TableBodyProps,
  TableCell,
  TableCellProps,
  TableContainer,
  TableContainerProps,
  TableHead,
  TableHeadProps,
  TableRow,
  TableRowProps,
  TablePagination,
  TablePaginationProps,
  List,
  ListProps,
  ListItem,
  ListItemProps,
  ListItemText,
  ListItemTextProps,
  ListItemIcon,
  ListItemIconProps,
  ListItemButton,
  ListItemButtonProps,
  ListItemAvatar,
  ListItemAvatarProps,
  ListSubheader,
  ListSubheaderProps,
  Avatar,
  AvatarProps,
  Badge,
  BadgeProps,
  Chip,
  ChipProps,
  Tooltip,
  TooltipProps,
  Typography,
  TypographyProps,
  Box,
  BoxProps,
} from '@mui/material'
import { styled } from '@mui/material/styles'

// Styled Table
const StyledTable = styled(Table)(({ theme }) => ({
  '& .MuiTableCell-head': {
    backgroundColor: theme.palette.grey[50],
    fontWeight: 600,
    color: theme.palette.text.primary,
  },
  '& .MuiTableRow-root:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}))

// Styled List
const StyledList = styled(List)(({ theme }) => ({
  '& .MuiListItem-root': {
    borderRadius: theme.shape.borderRadius,
    marginBottom: theme.spacing(0.5),
  },
}))

// Data Table Component
export interface DataTableProps extends TableProps {
  columns: Array<{
    id: string
    label: string
    minWidth?: number
    align?: 'left' | 'right' | 'center'
    format?: (value: any) => React.ReactNode
  }>
  rows: Array<Record<string, any>>
  pagination?: {
    page: number
    rowsPerPage: number
    totalRows: number
    onPageChange: (page: number) => void
    onRowsPerPageChange: (rowsPerPage: number) => void
  }
  loading?: boolean
  emptyMessage?: string
}

export const DataTable: React.FC<DataTableProps> = ({
  columns,
  rows,
  pagination,
  loading = false,
  emptyMessage = 'No data available',
  sx,
  ...props
}) => {
  return (
    <TableContainer sx={{ maxHeight: 440, ...sx }}>
      <StyledTable stickyHeader {...props}>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.id}
                align={column.align}
                style={{ minWidth: column.minWidth }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={columns.length} align="center">
                Loading...
              </TableCell>
            </TableRow>
          ) : rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} align="center">
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <TableCell key={column.id} align={column.align}>
                    {column.format ? column.format(row[column.id]) : row[column.id]}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </StyledTable>
      {pagination && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={pagination.totalRows}
          rowsPerPage={pagination.rowsPerPage}
          page={pagination.page}
          onPageChange={(_, newPage) => pagination.onPageChange(newPage)}
          onRowsPerPageChange={(event) => pagination.onRowsPerPageChange(parseInt(event.target.value, 10))}
        />
      )}
    </TableContainer>
  )
}

// Enhanced List Component
export interface EnhancedListProps extends ListProps {
  items: Array<{
    id: string | number
    primary: string
    secondary?: string
    icon?: React.ReactNode
    avatar?: string
    action?: React.ReactNode
    onClick?: () => void
  }>
  subheader?: string
  loading?: boolean
  emptyMessage?: string
}

export const EnhancedList: React.FC<EnhancedListProps> = ({
  items,
  subheader,
  loading = false,
  emptyMessage = 'No items available',
  sx,
  ...props
}) => {
  return (
    <StyledList subheader={subheader ? <ListSubheader>{subheader}</ListSubheader> : undefined} sx={sx} {...props}>
      {loading ? (
        <ListItem>
          <ListItemText primary="Loading..." />
        </ListItem>
      ) : items.length === 0 ? (
        <ListItem>
          <ListItemText primary={emptyMessage} />
        </ListItem>
      ) : (
        items.map((item) => (
          <ListItem key={item.id} disablePadding>
            <ListItemButton onClick={item.onClick}>
              {item.avatar && (
                <ListItemAvatar>
                  <Avatar src={item.avatar} />
                </ListItemAvatar>
              )}
              {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
              <ListItemText
                primary={item.primary}
                secondary={item.secondary}
              />
              {item.action}
            </ListItemButton>
          </ListItem>
        ))
      )}
    </StyledList>
  )
}

// Avatar Component
export interface CustomAvatarProps extends AvatarProps {
  name?: string
  size?: 'small' | 'medium' | 'large'
  variant?: 'circular' | 'rounded' | 'square'
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info'
}

export const CustomAvatar: React.FC<CustomAvatarProps> = ({
  name,
  size = 'medium',
  variant = 'circular',
  color = 'primary',
  sx,
  ...props
}) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const sizeMap = {
    small: 32,
    medium: 40,
    large: 56,
  }

  return (
    <Avatar
      variant={variant}
      sx={{
        width: sizeMap[size],
        height: sizeMap[size],
        backgroundColor: `${color}.main`,
        ...sx,
      }}
      {...props}
    >
      {name ? getInitials(name) : props.children}
    </Avatar>
  )
}

// Badge Component
export interface CustomBadgeProps extends BadgeProps {
  variant?: 'standard' | 'dot'
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info'
  size?: 'small' | 'medium' | 'large'
}

export const CustomBadge: React.FC<CustomBadgeProps> = ({
  variant = 'standard',
  color = 'primary',
  size = 'medium',
  sx,
  ...props
}) => {
  const sizeMap = {
    small: 16,
    medium: 20,
    large: 24,
  }

  return (
    <Badge
      variant={variant}
      color={color}
      sx={{
        '& .MuiBadge-badge': {
          fontSize: sizeMap[size] * 0.6,
          height: sizeMap[size],
          minWidth: sizeMap[size],
        },
        ...sx,
      }}
      {...props}
    />
  )
}

// Chip Component
export interface CustomChipProps extends ChipProps {
  variant?: 'filled' | 'outlined'
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info' | 'default'
  size?: 'small' | 'medium' | 'large'
  clickable?: boolean
  deletable?: boolean
  onDelete?: () => void
}

export const CustomChip: React.FC<CustomChipProps> = ({
  variant = 'filled',
  color = 'default',
  size = 'medium',
  clickable = false,
  deletable = false,
  onDelete,
  sx,
  ...props
}) => {
  const sizeMap = {
    small: { height: 24, fontSize: '0.75rem' },
    medium: { height: 32, fontSize: '0.875rem' },
    large: { height: 40, fontSize: '1rem' },
  }

  return (
    <Chip
      variant={variant}
      color={color}
      clickable={clickable}
      onDelete={deletable ? onDelete : undefined}
      sx={{
        height: sizeMap[size].height,
        fontSize: sizeMap[size].fontSize,
        ...sx,
      }}
      {...props}
    />
  )
}

// Tooltip Component
export interface CustomTooltipProps extends TooltipProps {
  title: string
  placement?: 'top' | 'bottom' | 'left' | 'right'
  arrow?: boolean
  interactive?: boolean
}

export const CustomTooltip: React.FC<CustomTooltipProps> = ({
  title,
  placement = 'top',
  arrow = true,
  interactive = false,
  sx,
  ...props
}) => {
  return (
    <Tooltip
      title={title}
      placement={placement}
      arrow={arrow}
      interactive={interactive}
      sx={sx}
      {...props}
    />
  )
}

// Typography Component
export interface CustomTypographyProps extends TypographyProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2' | 'caption' | 'overline'
  color?: 'primary' | 'secondary' | 'textPrimary' | 'textSecondary' | 'error' | 'warning' | 'info' | 'success'
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold'
  align?: 'left' | 'center' | 'right' | 'justify'
  noWrap?: boolean
  truncate?: boolean
  maxLines?: number
}

export const CustomTypography: React.FC<CustomTypographyProps> = ({
  variant = 'body1',
  color = 'textPrimary',
  weight = 'normal',
  align = 'left',
  noWrap = false,
  truncate = false,
  maxLines,
  sx,
  ...props
}) => {
  const weightMap = {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  }

  return (
    <Typography
      variant={variant}
      color={color}
      align={align}
      noWrap={noWrap}
      sx={{
        fontWeight: weightMap[weight],
        ...(truncate && {
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }),
        ...(maxLines && {
          display: '-webkit-box',
          WebkitLineClamp: maxLines,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }),
        ...sx,
      }}
      {...props}
    />
  )
}

// Export all data display components
export {
  Table as BaseTable,
  TableBody as BaseTableBody,
  TableCell as BaseTableCell,
  TableContainer as BaseTableContainer,
  TableHead as BaseTableHead,
  TableRow as BaseTableRow,
  TablePagination as BaseTablePagination,
  List as BaseList,
  ListItem as BaseListItem,
  ListItemText as BaseListItemText,
  ListItemIcon as BaseListItemIcon,
  ListItemButton as BaseListItemButton,
  ListItemAvatar as BaseListItemAvatar,
  ListSubheader as BaseListSubheader,
  Avatar as BaseAvatar,
  Badge as BaseBadge,
  Chip as BaseChip,
  Tooltip as BaseTooltip,
  Typography as BaseTypography,
  Box as BaseBox,
}
