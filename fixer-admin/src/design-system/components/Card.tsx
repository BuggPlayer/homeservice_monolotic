import React from 'react'
import {
  Card as MuiCard,
  CardProps as MuiCardProps,
  CardContent,
  CardContentProps,
  CardHeader,
  CardHeaderProps,
  CardActions,
  CardActionsProps,
  CardMedia,
  CardMediaProps,
  Paper,
  PaperProps,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { spacing, borderRadius, shadows, commonProps } from '../tokens'

// Styled Card with consistent design
const StyledCard = styled(MuiCard)(({ theme }) => ({
  ...commonProps.card,
  '&:hover': {
    boxShadow: shadows.lg,
    transform: 'translateY(-2px)',
  },
  '&.clickable': {
    cursor: 'pointer',
    '&:hover': {
      boxShadow: shadows.lg,
      transform: 'translateY(-2px)',
    },
  },
}))

// Styled Paper
const StyledPaper = styled(Paper)(({ theme }) => ({
  borderRadius: borderRadius.md,
  backgroundImage: 'none',
}))

// Basic Card Component
export interface CardProps extends Omit<MuiCardProps, 'variant'> {
  variant?: 'elevation' | 'outlined'
  hover?: boolean
  clickable?: boolean
  padding?: 'sm' | 'md' | 'lg'
}

export const Card: React.FC<CardProps> = ({
  variant = 'elevation',
  hover = true,
  clickable = false,
  padding = 'md',
  sx,
  children,
  ...props
}) => {
  const paddingValue = padding === 'sm' ? spacing.sm : padding === 'lg' ? spacing.lg : spacing.md

  return (
    <StyledCard
      variant={variant}
      className={clickable ? 'clickable' : ''}
      sx={{
        '&:hover': hover ? undefined : 'none',
        '& .MuiCardContent-root': {
          padding: paddingValue,
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </StyledCard>
  )
}

// Card with Header
export interface CardWithHeaderProps extends CardProps {
  title?: string
  subtitle?: string
  avatar?: React.ReactNode
  action?: React.ReactNode
  headerProps?: CardHeaderProps
}

export const CardWithHeader: React.FC<CardWithHeaderProps> = ({
  title,
  subtitle,
  avatar,
  action,
  headerProps,
  children,
  ...cardProps
}) => {
  return (
    <Card {...cardProps}>
      {(title || subtitle || avatar || action) && (
        <CardHeader
          title={title}
          subheader={subtitle}
          avatar={avatar}
          action={action}
          {...headerProps}
        />
      )}
      {children}
    </Card>
  )
}

// Stats Card Component
export interface StatsCardProps extends CardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
    label?: string
  }
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info'
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = 'primary',
  ...cardProps
}) => {
  return (
    <Card {...cardProps}>
      <CardContent>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          marginBottom: spacing.md 
        }}>
          <div>
            <h6 style={{ 
              margin: 0, 
              fontSize: '0.875rem', 
              fontWeight: 500, 
              color: 'text.secondary',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              {title}
            </h6>
            <h3 style={{ 
              margin: 0, 
              fontSize: '2rem', 
              fontWeight: 700, 
              color: 'text.primary',
              lineHeight: 1.2
            }}>
              {value}
            </h3>
            {subtitle && (
              <p style={{ 
                margin: 0, 
                fontSize: '0.75rem', 
                color: 'text.secondary',
                marginTop: spacing.xs
              }}>
                {subtitle}
              </p>
            )}
          </div>
          {icon && (
            <div style={{ 
              color: `${color}.main`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 48,
              height: 48,
              borderRadius: borderRadius.md,
              backgroundColor: `${color}.main`,
              color: `${color}.contrastText`,
              opacity: 0.1
            }}>
              {icon}
            </div>
          )}
        </div>
        {trend && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: spacing.xs,
            marginTop: spacing.sm
          }}>
            <span style={{ 
              color: trend.isPositive ? 'success.main' : 'error.main',
              fontSize: '0.875rem',
              fontWeight: 600
            }}>
              {trend.isPositive ? '+' : ''}{trend.value}%
            </span>
            <span style={{ 
              fontSize: '0.75rem', 
              color: 'text.secondary' 
            }}>
              {trend.label || 'from last month'}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Info Card Component
export interface InfoCardProps extends CardProps {
  title: string
  description?: string
  icon?: React.ReactNode
  action?: React.ReactNode
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info'
}

export const InfoCard: React.FC<InfoCardProps> = ({
  title,
  description,
  icon,
  action,
  color = 'primary',
  children,
  ...cardProps
}) => {
  return (
    <Card {...cardProps}>
      <CardContent>
        <div style={{ 
          display: 'flex', 
          alignItems: 'flex-start', 
          gap: spacing.md 
        }}>
          {icon && (
            <div style={{ 
              color: `${color}.main`, 
              marginTop: spacing.xs,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: borderRadius.md,
              backgroundColor: `${color}.main`,
              color: `${color}.contrastText`,
              opacity: 0.1
            }}>
              {icon}
            </div>
          )}
          <div style={{ flex: 1 }}>
            <h6 style={{ 
              margin: '0 0 8px 0', 
              fontSize: '1rem', 
              fontWeight: 600,
              color: 'text.primary'
            }}>
              {title}
            </h6>
            {description && (
              <p style={{ 
                margin: '0 0 16px 0', 
                fontSize: '0.875rem', 
                color: 'text.secondary',
                lineHeight: 1.5
              }}>
                {description}
              </p>
            )}
            {children}
          </div>
          {action && (
            <div>
              {action}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Content Card for general content
export interface ContentCardProps extends CardProps {
  title?: string
  subtitle?: string
  actions?: React.ReactNode
  children: React.ReactNode
}

export const ContentCard: React.FC<ContentCardProps> = ({
  title,
  subtitle,
  actions,
  children,
  ...cardProps
}) => {
  return (
    <Card {...cardProps}>
      {(title || subtitle || actions) && (
        <CardHeader
          title={title}
          subheader={subtitle}
          action={actions}
          sx={{
            '& .MuiCardHeader-title': {
              fontSize: '1.125rem',
              fontWeight: 600,
            },
            '& .MuiCardHeader-subheader': {
              fontSize: '0.875rem',
              color: 'text.secondary',
            },
          }}
        />
      )}
      <CardContent>
        {children}
      </CardContent>
    </Card>
  )
}

// Custom Paper Component
export interface CustomPaperProps extends Omit<PaperProps, 'variant'> {
  variant?: 'elevation' | 'outlined'
  padding?: number | string
}

export const CustomPaper: React.FC<CustomPaperProps> = ({
  variant = 'elevation',
  padding = spacing.md,
  sx,
  ...props
}) => {
  return (
    <StyledPaper
      variant={variant}
      sx={{
        padding,
        ...sx,
      }}
      {...props}
    />
  )
}

// Export all card-related components
export {
  CardContent,
  CardHeader,
  CardActions,
  CardMedia,
  Paper as BasePaper,
  MuiCard as BaseCard,
}
