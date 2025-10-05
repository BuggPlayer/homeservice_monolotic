import React from 'react'
import { Box, Typography, Button } from '@mui/material'
import { spacing, typography } from '../tokens'

export interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
    variant?: 'text' | 'outlined' | 'contained'
    color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info'
  }
  size?: 'small' | 'medium' | 'large'
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  icon, 
  title, 
  description, 
  action, 
  size = 'medium' 
}) => {
  const getSizeConfig = (size: string) => {
    switch (size) {
      case 'small':
        return {
          iconSize: 48,
          titleFontSize: '1.125rem',
          descriptionFontSize: '0.875rem',
          padding: spacing.lg,
        }
      case 'large':
        return {
          iconSize: 96,
          titleFontSize: '1.5rem',
          descriptionFontSize: '1rem',
          padding: spacing.xxl,
        }
      default: // medium
        return {
          iconSize: 64,
          titleFontSize: '1.25rem',
          descriptionFontSize: '0.875rem',
          padding: spacing.xl,
        }
    }
  }

  const { iconSize, titleFontSize, descriptionFontSize, padding } = getSizeConfig(size)

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding,
        minHeight: 200,
      }}
    >
      {icon && (
        <Box
          sx={{
            color: 'text.secondary',
            marginBottom: spacing.md,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: iconSize,
            height: iconSize,
            borderRadius: '50%',
            backgroundColor: 'grey.50',
          }}
        >
          {icon}
        </Box>
      )}
      
      <Typography
        variant="h6"
        sx={{
          fontWeight: typography.fontWeight.semibold,
          marginBottom: spacing.sm,
          fontSize: titleFontSize,
          color: 'text.primary',
        }}
      >
        {title}
      </Typography>
      
      <Typography
        variant="body2"
        sx={{
          color: 'text.secondary',
          marginBottom: action ? spacing.lg : 0,
          fontSize: descriptionFontSize,
          lineHeight: 1.5,
          maxWidth: 400,
        }}
      >
        {description}
      </Typography>
      
      {action && (
        <Button
          variant={action.variant || 'contained'}
          color={action.color || 'primary'}
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      )}
    </Box>
  )
}
