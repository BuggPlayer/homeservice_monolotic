import React from 'react'
import {
  CircularProgress,
  LinearProgress,
  Skeleton,
  Box,
  Backdrop,
} from '@mui/material'
import { spacing } from '../tokens'

// Loading Spinner Component
export interface LoadingSpinnerProps {
  size?: number | 'small' | 'medium' | 'large'
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info'
  thickness?: number
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = 'primary',
  thickness = 4,
}) => {
  const getSizeValue = (size: string | number) => {
    if (typeof size === 'number') return size
    switch (size) {
      case 'small': return 20
      case 'large': return 60
      default: return 40
    }
  }

  return (
    <CircularProgress
      size={getSizeValue(size)}
      color={color}
      thickness={thickness}
    />
  )
}

// Loading Bar Component
export interface LoadingBarProps {
  variant?: 'determinate' | 'indeterminate' | 'buffer' | 'query'
  value?: number
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info'
  thickness?: number
}

export const LoadingBar: React.FC<LoadingBarProps> = ({
  variant = 'indeterminate',
  value = 0,
  color = 'primary',
  thickness = 4,
}) => {
  return (
    <LinearProgress
      variant={variant}
      value={value}
      color={color}
      thickness={thickness}
    />
  )
}

// Loading Overlay Component
export interface LoadingOverlayProps {
  open: boolean
  children?: React.ReactNode
  message?: string
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  open,
  children,
  message,
}) => {
  return (
    <Backdrop
      open={open}
      sx={{
        color: '#fff',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: spacing.md,
      }}
    >
      <LoadingSpinner size="large" color="inherit" />
      {message && (
        <Box sx={{ color: 'inherit', textAlign: 'center' }}>
          {message}
        </Box>
      )}
      {children}
    </Backdrop>
  )
}

// Skeleton Components
export interface SkeletonTextProps {
  lines?: number
  width?: string | number
  height?: number
}

export const SkeletonText: React.FC<SkeletonTextProps> = ({
  lines = 3,
  width = '100%',
  height = 20,
}) => {
  return (
    <Box>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          variant="text"
          width={index === lines - 1 ? '60%' : width}
          height={height}
          sx={{ marginBottom: index < lines - 1 ? spacing.sm : 0 }}
        />
      ))}
    </Box>
  )
}

export interface SkeletonCardProps {
  showAvatar?: boolean
  showActions?: boolean
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  showAvatar = false,
  showActions = false,
}) => {
  return (
    <Box sx={{ padding: spacing.md }}>
      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: spacing.md }}>
        {showAvatar && (
          <Skeleton
            variant="circular"
            width={40}
            height={40}
            sx={{ marginRight: spacing.sm }}
          />
        )}
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width="60%" height={24} />
          <Skeleton variant="text" width="40%" height={16} />
        </Box>
      </Box>
      
      <SkeletonText lines={2} />
      
      {showActions && (
        <Box sx={{ 
          display: 'flex', 
          gap: spacing.sm, 
          marginTop: spacing.md,
          justifyContent: 'flex-end'
        }}>
          <Skeleton variant="rectangular" width={80} height={32} />
          <Skeleton variant="rectangular" width={80} height={32} />
        </Box>
      )}
    </Box>
  )
}

// Loading Button Component
export interface LoadingButtonProps {
  loading?: boolean
  children: React.ReactNode
  size?: 'small' | 'medium' | 'large'
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info'
  variant?: 'text' | 'outlined' | 'contained'
  disabled?: boolean
  onClick?: () => void
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  loading = false,
  children,
  size = 'medium',
  color = 'primary',
  variant = 'contained',
  disabled = false,
  onClick,
}) => {
  return (
    <Box
      sx={{
        position: 'relative',
        display: 'inline-block',
      }}
    >
      <button
        onClick={onClick}
        disabled={disabled || loading}
        style={{
          padding: size === 'small' ? '6px 12px' : size === 'large' ? '12px 24px' : '8px 16px',
          borderRadius: 8,
          border: variant === 'outlined' ? '1px solid' : 'none',
          backgroundColor: variant === 'contained' ? 'var(--color-main)' : 'transparent',
          color: variant === 'contained' ? 'white' : 'var(--color-main)',
          cursor: disabled || loading ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.6 : 1,
          fontSize: size === 'small' ? '0.875rem' : size === 'large' ? '1rem' : '0.875rem',
          fontWeight: 600,
          textTransform: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: spacing.sm,
          minWidth: 80,
        }}
      >
        {loading && (
          <LoadingSpinner size="small" color="inherit" />
        )}
        {children}
      </button>
    </Box>
  )
}

// Export all loading components
export {
  CircularProgress as BaseCircularProgress,
  LinearProgress as BaseLinearProgress,
  Skeleton as BaseSkeleton,
  Backdrop as BaseBackdrop,
}
