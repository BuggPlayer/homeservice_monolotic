import React from 'react'
import {
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
  IconButton as MuiIconButton,
  IconButtonProps as MuiIconButtonProps,
  Fab,
  FabProps as MuiFabProps,
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { styled } from '@mui/material/styles'

// Styled Button with custom variants
const StyledButton = styled(MuiButton)(({ theme, color = 'primary' }) => ({
  textTransform: 'none',
  fontWeight: 600,
  borderRadius: theme.shape.borderRadius,
  boxShadow: 'none',
  '&:hover': {
    boxShadow: theme.shadows[2],
  },
  '&.Mui-disabled': {
    opacity: 0.6,
  },
}))

// Styled IconButton
const StyledIconButton = styled(MuiIconButton)(({ theme }) => ({
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}))

// Styled FAB
const StyledFab = styled(Fab)(({ theme }) => ({
  boxShadow: theme.shadows[4],
  '&:hover': {
    boxShadow: theme.shadows[8],
  },
}))

// Button variants
export interface ButtonProps extends Omit<MuiButtonProps, 'color' | 'variant'> {
  variant?: 'text' | 'outlined' | 'contained'
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info'
  size?: 'small' | 'medium' | 'large'
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
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

// Icon Button
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
          border: `1px solid ${color}.main`,
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

// Floating Action Button
export interface FloatingActionButtonProps extends Omit<MuiFabProps, 'color'> {
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info'
  size?: 'small' | 'medium' | 'large'
  variant?: 'circular' | 'extended'
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  color = 'primary',
  size = 'medium',
  variant = 'circular',
  sx,
  ...props
}) => {
  return (
    <StyledFab
      color={color}
      size={size}
      variant={variant}
      sx={sx}
      {...props}
    />
  )
}

// Button Group
export { ButtonGroup } from '@mui/material'

// Export all button-related components
export {
  MuiButton as BaseButton,
  MuiIconButton as BaseIconButton,
  LoadingButton as BaseLoadingButton,
  Fab as BaseFab,
}