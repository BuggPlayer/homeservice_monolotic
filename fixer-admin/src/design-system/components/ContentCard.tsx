import React from 'react'
import { Card, CardWithHeader, InfoCard, StatsCard } from './Card'
import { spacing } from '../tokens'

// Re-export card components with consistent naming
export { Card, CardWithHeader, InfoCard, StatsCard }

// Content Card Component
export interface ContentCardProps {
  title?: string
  subtitle?: string
  actions?: React.ReactNode
  children: React.ReactNode
  padding?: 'sm' | 'md' | 'lg'
  hover?: boolean
  clickable?: boolean
}

export const ContentCard: React.FC<ContentCardProps> = ({
  title,
  subtitle,
  actions,
  children,
  padding = 'md',
  hover = true,
  clickable = false,
}) => {
  return (
    <Card padding={padding} hover={hover} clickable={clickable}>
      {(title || subtitle || actions) && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: spacing.md,
          flexDirection: 'column',
          gap: spacing.sm,
        }}>
          <div>
            {title && (
              <h3 style={{
                margin: 0,
                fontSize: '1.125rem',
                fontWeight: 600,
                color: 'text.primary',
                lineHeight: 1.3,
              }}>
                {title}
              </h3>
            )}
            {subtitle && (
              <p style={{
                margin: 0,
                fontSize: '0.875rem',
                color: 'text.secondary',
                lineHeight: 1.5,
                marginTop: spacing.xs,
              }}>
                {subtitle}
              </p>
            )}
          </div>
          {actions && (
            <div style={{
              display: 'flex',
              gap: spacing.sm,
              flexWrap: 'wrap',
            }}>
              {actions}
            </div>
          )}
        </div>
      )}
      {children}
    </Card>
  )
}
