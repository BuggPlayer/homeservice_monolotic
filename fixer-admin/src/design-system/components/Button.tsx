import React from 'react'
import {
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
  IconButton as MuiIconButton,
  IconButtonProps as MuiIconButtonProps,
  LoadingButton,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { spacing, borderRadius, shadows, typography, sizes, commonProps } from '../tokens'

// Styled Button with consistent design
const StyledButton = styled(MuiButton)(({ theme, color = 'primary' }) => ({
  ...commonProps.button,
  boxShadow: 'none',
  '&:hover': {
    boxShadow: shadows.lg,
    transform: 'translateY(-1px)',
  },
  '&:active': {
    transform: 'translateY(0)',
  },
  '&.Mui-disabled': {
    opacity: 0.6,
    transform: 'none',
  },
  // Size-specific styles
  '&.MuiButton-sizeSmall': {
    ...sizes.button.sm,
  },
  '&.MuiButton-sizeMedium': {
    ...sizes.button.md,
  },
  '&.MuiButton-sizeLarge': {
    ...sizes.button.lg,
  },
}))

// Styled IconButton
const StyledIconButton = styled(MuiIconButton)(({ theme }) => ({
  borderRadius: borderRadius.md,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    transform: 'scale(1.05)',
  },
  '&:active': {
    transform: 'scale(0.95)',
  },
}))

// Main Button Component
export interface ButtonProps extends Omit<MuiButtonProps, 'color' | 'variant'> {
  variant?: 'text' | 'outlined' | 'contained' | 'gradient'
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info'
  size?: 'small' | 'medium' | 'large'
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  loading = false,
  leftIcon,
  rightIcon,
  children,
  disabled,
  sx,
  ...props
}) => {
  if (loading) {
    return (
      <LoadingButton
        variant={variant}
        color={color}
        size={size}
        loading={loading}
        disabled={disabled || loading}
        sx={sx}
        {...props}
      >
        {children}
      </LoadingButton>
    )
  }

  return (
    <StyledButton
      variant={variant}
      color={color}
      size={size}
      disabled={disabled}
      startIcon={leftIcon}
      endIcon={rightIcon}
      sx={sx}
      {...props}
    >
      {children}
    </StyledButton>
  )
}

// Icon Button Component
export interface IconButtonProps extends MuiIconButtonProps {
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info'
  size?: 'small' | 'medium' | 'large'
  variant?: 'contained' | 'outlined' | 'text'
}

export const IconButton: React.FC<IconButtonProps> = ({
  color = 'primary',
  size = 'medium',
  variant = 'text',
  sx,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'contained':
        return {
          backgroundColor: `${color}.main`,
          color: `${color}.contrastText`,
          '&:hover': {
            backgroundColor: `${color}.dark`,
          },
        }
      case 'outlined':
        return {
          border: `1px solid`,
          borderColor: `${color}.main`,
          color: `${color}.main`,
          '&:hover': {
            backgroundColor: `${color}.main`,
            color: `${color}.contrastText`,
          },
        }
      default:
        return {}
    }
  }

  return (
    <StyledIconButton
      size={size}
      sx={{
        ...getVariantStyles(),
        ...sx,
      }}
      {...props}
    />
  )
}

// Action Button Group
export interface ActionButtonProps extends ButtonProps {
  actions?: Array<{
    label: string
    onClick: () => void
    icon?: React.ReactNode
    variant?: 'text' | 'outlined' | 'contained'
    color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info'
  }>
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  actions = [],
  ...buttonProps
}) => {
  if (actions.length === 0) {
    return <Button {...buttonProps} />
  }

  return (
    <div style={{ display: 'flex', gap: spacing.sm }}>
      {actions.map((action, index) => (
        <Button
          key={index}
          variant={action.variant || 'outlined'}
          color={action.color || 'primary'}
          size="small"
          startIcon={action.icon}
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      ))}
    </div>
  )
}

// Export all button components
export {
  MuiButton as BaseButton,
  MuiIconButton as BaseIconButton,
  LoadingButton as BaseLoadingButton,
}
