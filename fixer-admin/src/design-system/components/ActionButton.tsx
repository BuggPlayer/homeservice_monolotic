import React from 'react'
import { Button, IconButton } from './Button'
import { spacing } from '../tokens'

// Action Button Group Component
export interface ActionButtonGroupProps {
  actions: Array<{
    label: string
    onClick: () => void
    icon?: React.ReactNode
    variant?: 'text' | 'outlined' | 'contained'
    color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info'
    disabled?: boolean
    loading?: boolean
  }>
  size?: 'small' | 'medium' | 'large'
  direction?: 'row' | 'column'
  spacing?: 'xs' | 'sm' | 'md' | 'lg'
}

export const ActionButtonGroup: React.FC<ActionButtonGroupProps> = ({
  actions,
  size = 'small',
  direction = 'row',
  spacing: spacingProp = 'sm',
}) => {
  const spacingValue = spacing[spacingProp]

  return (
    <div style={{
      display: 'flex',
      flexDirection: direction,
      gap: spacingValue,
      flexWrap: 'wrap',
    }}>
      {actions.map((action, index) => (
        <Button
          key={index}
          variant={action.variant || 'outlined'}
          color={action.color || 'primary'}
          size={size}
          startIcon={action.icon}
          onClick={action.onClick}
          disabled={action.disabled}
          loading={action.loading}
        >
          {action.label}
        </Button>
      ))}
    </div>
  )
}

// Icon Action Button Group Component
export interface IconActionButtonGroupProps {
  actions: Array<{
    icon: React.ReactNode
    onClick: () => void
    tooltip?: string
    color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info'
    variant?: 'contained' | 'outlined' | 'text'
    disabled?: boolean
  }>
  size?: 'small' | 'medium' | 'large'
  direction?: 'row' | 'column'
  spacing?: 'xs' | 'sm' | 'md' | 'lg'
}

export const IconActionButtonGroup: React.FC<IconActionButtonGroupProps> = ({
  actions,
  size = 'small',
  direction = 'row',
  spacing: spacingProp = 'sm',
}) => {
  const spacingValue = spacing[spacingProp]

  return (
    <div style={{
      display: 'flex',
      flexDirection: direction,
      gap: spacingValue,
    }}>
      {actions.map((action, index) => (
        <IconButton
          key={index}
          color={action.color || 'primary'}
          size={size}
          variant={action.variant || 'text'}
          onClick={action.onClick}
          disabled={action.disabled}
          title={action.tooltip}
        >
          {action.icon}
        </IconButton>
      ))}
    </div>
  )
}

// Quick Actions Component
export interface QuickActionsProps {
  primary?: {
    label: string
    onClick: () => void
    icon?: React.ReactNode
    loading?: boolean
    disabled?: boolean
  }
  secondary?: Array<{
    label: string
    onClick: () => void
    icon?: React.ReactNode
    variant?: 'text' | 'outlined' | 'contained'
    color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info'
    disabled?: boolean
  }>
  size?: 'small' | 'medium' | 'large'
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  primary,
  secondary = [],
  size = 'medium',
}) => {
  return (
    <div style={{
      display: 'flex',
      gap: spacing.sm,
      alignItems: 'center',
      flexWrap: 'wrap',
    }}>
      {primary && (
        <Button
          variant="contained"
          color="primary"
          size={size}
          startIcon={primary.icon}
          onClick={primary.onClick}
          loading={primary.loading}
          disabled={primary.disabled}
        >
          {primary.label}
        </Button>
      )}
      
      {secondary.map((action, index) => (
        <Button
          key={index}
          variant={action.variant || 'outlined'}
          color={action.color || 'primary'}
          size={size}
          startIcon={action.icon}
          onClick={action.onClick}
          disabled={action.disabled}
        >
          {action.label}
        </Button>
      ))}
    </div>
  )
}

// Floating Action Button Component
export interface FloatingActionButtonProps {
  icon: React.ReactNode
  onClick: () => void
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info'
  size?: 'small' | 'medium' | 'large'
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  tooltip?: string
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  icon,
  onClick,
  color = 'primary',
  size = 'medium',
  position = 'bottom-right',
  tooltip,
}) => {
  const getPositionStyles = (position: string) => {
    switch (position) {
      case 'bottom-left':
        return { bottom: 24, left: 24 }
      case 'top-right':
        return { top: 24, right: 24 }
      case 'top-left':
        return { top: 24, left: 24 }
      default: // bottom-right
        return { bottom: 24, right: 24 }
    }
  }

  const getSizeStyles = (size: string) => {
    switch (size) {
      case 'small':
        return { width: 40, height: 40 }
      case 'large':
        return { width: 64, height: 64 }
      default: // medium
        return { width: 56, height: 56 }
    }
  }

  return (
    <button
      onClick={onClick}
      title={tooltip}
      style={{
        position: 'fixed',
        ...getPositionStyles(position),
        ...getSizeStyles(size),
        borderRadius: '50%',
        border: 'none',
        backgroundColor: `var(--color-${color})`,
        color: 'white',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        zIndex: 1000,
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'scale(1.1)',
          boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
        },
      }}
    >
      {icon}
    </button>
  )
}
