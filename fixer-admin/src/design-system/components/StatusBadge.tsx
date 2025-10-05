import React from 'react'
import { Chip, ChipProps } from '@mui/material'
import { styled } from '@mui/material/styles'
import { borderRadius, typography } from '../tokens'

// Styled Chip with consistent design
const StyledChip = styled(Chip)(({ theme }) => ({
  borderRadius: borderRadius.sm,
  fontWeight: typography.fontWeight.medium,
  fontSize: typography.fontSize.xs,
  height: 24,
  '& .MuiChip-label': {
    paddingLeft: 8,
    paddingRight: 8,
  },
}))

// Status Badge Component
export interface StatusBadgeProps extends Omit<ChipProps, 'color'> {
  status: 'active' | 'inactive' | 'pending' | 'completed' | 'cancelled' | 'draft' | 'published' | 'archived'
  size?: 'small' | 'medium'
  variant?: 'filled' | 'outlined'
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'small',
  variant = 'filled',
  ...props
}) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active':
      case 'published':
      case 'completed':
        return {
          label: status.charAt(0).toUpperCase() + status.slice(1),
          color: 'success' as const,
        }
      case 'inactive':
      case 'cancelled':
      case 'archived':
        return {
          label: status.charAt(0).toUpperCase() + status.slice(1),
          color: 'error' as const,
        }
      case 'pending':
      case 'draft':
        return {
          label: status.charAt(0).toUpperCase() + status.slice(1),
          color: 'warning' as const,
        }
      default:
        return {
          label: status.charAt(0).toUpperCase() + status.slice(1),
          color: 'default' as const,
        }
    }
  }

  const { label, color } = getStatusConfig(status)

  return (
    <StyledChip
      label={label}
      color={color}
      size={size}
      variant={variant}
      {...props}
    />
  )
}

// Priority Badge Component
export interface PriorityBadgeProps extends Omit<ChipProps, 'color'> {
  priority: 'low' | 'medium' | 'high' | 'urgent'
  size?: 'small' | 'medium'
  variant?: 'filled' | 'outlined'
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({
  priority,
  size = 'small',
  variant = 'filled',
  ...props
}) => {
  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return {
          label: 'Urgent',
          color: 'error' as const,
        }
      case 'high':
        return {
          label: 'High',
          color: 'warning' as const,
        }
      case 'medium':
        return {
          label: 'Medium',
          color: 'info' as const,
        }
      case 'low':
        return {
          label: 'Low',
          color: 'success' as const,
        }
      default:
        return {
          label: priority.charAt(0).toUpperCase() + priority.slice(1),
          color: 'default' as const,
        }
    }
  }

  const { label, color } = getPriorityConfig(priority)

  return (
    <StyledChip
      label={label}
      color={color}
      size={size}
      variant={variant}
      {...props}
    />
  )
}

// Type Badge Component
export interface TypeBadgeProps extends Omit<ChipProps, 'color'> {
  type: string
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info' | 'default'
  size?: 'small' | 'medium'
  variant?: 'filled' | 'outlined'
}

export const TypeBadge: React.FC<TypeBadgeProps> = ({
  type,
  color = 'default',
  size = 'small',
  variant = 'outlined',
  ...props
}) => {
  return (
    <StyledChip
      label={type}
      color={color}
      size={size}
      variant={variant}
      {...props}
    />
  )
}

// Export all badge components
export {
  Chip as BaseChip,
}
