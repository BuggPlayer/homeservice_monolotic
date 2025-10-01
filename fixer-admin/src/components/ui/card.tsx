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
  Divider,
  DividerProps,
} from '@mui/material'
import { styled } from '@mui/material/styles'

// Styled Card
const StyledCard = styled(MuiCard)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 1.5,
  boxShadow: theme.shadows[1],
  transition: theme.transitions.create(['box-shadow', 'transform'], {
    duration: theme.transitions.duration.short,
  }),
  '&:hover': {
    boxShadow: theme.shadows[4],
    transform: 'translateY(-2px)',
  },
}))

// Styled Paper
const StyledPaper = styled(Paper)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
}))

// Basic Card Component
export interface CardProps extends MuiCardProps {
  variant?: 'elevation' | 'outlined' | 'filled'
  hover?: boolean
  clickable?: boolean
}

export const Card: React.FC<CardProps> = ({
  variant = 'elevation',
  hover = true,
  clickable = false,
  sx,
  ...props
}) => {
  return (
    <StyledCard
      variant={variant}
      sx={{
        cursor: clickable ? 'pointer' : 'default',
        '&:hover': hover ? undefined : 'none',
        ...sx,
      }}
      {...props}
    />
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

// Card with Media
export interface CardWithMediaProps extends CardProps {
  image?: string
  alt?: string
  height?: number | string
  mediaProps?: CardMediaProps
}

export const CardWithMedia: React.FC<CardWithMediaProps> = ({
  image,
  alt = '',
  height = 200,
  mediaProps,
  children,
  ...cardProps
}) => {
  return (
    <Card {...cardProps}>
      {image && (
        <CardMedia
          component="img"
          height={height}
          image={image}
          alt={alt}
          {...mediaProps}
        />
      )}
      {children}
    </Card>
  )
}

// Stats Card
export interface StatsCardProps extends CardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <h6 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 500, color: 'text.secondary' }}>
              {title}
            </h6>
            <h3 style={{ margin: 0, fontSize: '2rem', fontWeight: 700, color: 'text.primary' }}>
              {value}
            </h3>
            {subtitle && (
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'text.secondary' }}>
                {subtitle}
              </p>
            )}
          </div>
          {icon && (
            <div style={{ color: `${color}.main` }}>
              {icon}
            </div>
          )}
        </div>
        {trend && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ 
              color: trend.isPositive ? 'success.main' : 'error.main',
              fontSize: '0.875rem',
              fontWeight: 600
            }}>
              {trend.isPositive ? '+' : ''}{trend.value}%
            </span>
            <span style={{ fontSize: '0.75rem', color: 'text.secondary' }}>
              from last month
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Info Card
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
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
          {icon && (
            <div style={{ color: `${color}.main`, marginTop: 4 }}>
              {icon}
            </div>
          )}
          <div style={{ flex: 1 }}>
            <h6 style={{ margin: '0 0 8px 0', fontSize: '1rem', fontWeight: 600 }}>
              {title}
            </h6>
            {description && (
              <p style={{ margin: '0 0 16px 0', fontSize: '0.875rem', color: 'text.secondary' }}>
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

// Custom Paper Component
export interface CustomPaperProps extends PaperProps {
  variant?: 'elevation' | 'outlined' | 'filled'
  padding?: number | string
}

export const CustomPaper: React.FC<CustomPaperProps> = ({
  variant = 'elevation',
  padding = 16,
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
  Divider,
  MuiCard as BaseCard,
}