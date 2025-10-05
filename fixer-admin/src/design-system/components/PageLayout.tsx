import React from 'react'
import { Box, BoxProps, Container, ContainerProps } from '@mui/material'
import { styled } from '@mui/material/styles'
import { spacing, breakpoints } from '../tokens'

// Styled Container with consistent spacing
const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: spacing.lg,
  paddingBottom: spacing.lg,
  [theme.breakpoints.down('sm')]: {
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
}))

// Page Layout Component
export interface PageLayoutProps extends BoxProps {
  title?: string
  subtitle?: string
  actions?: React.ReactNode
  children: React.ReactNode
  maxWidth?: ContainerProps['maxWidth']
  disableGutters?: boolean
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  title,
  subtitle,
  actions,
  children,
  maxWidth = 'xl',
  disableGutters = false,
  sx,
  ...props
}) => {
  return (
    <Box sx={{ flexGrow: 1, ...sx }} {...props}>
      <StyledContainer maxWidth={maxWidth} disableGutters={disableGutters}>
        {/* Page Header */}
        {(title || subtitle || actions) && (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start',
            marginBottom: spacing.lg,
            flexDirection: { xs: 'column', sm: 'row' },
            gap: spacing.md
          }}>
            <Box>
              {title && (
                <h1 style={{
                  margin: 0,
                  fontSize: '2rem',
                  fontWeight: 700,
                  color: 'text.primary',
                  lineHeight: 1.2,
                  marginBottom: spacing.xs
                }}>
                  {title}
                </h1>
              )}
              {subtitle && (
                <p style={{
                  margin: 0,
                  fontSize: '1rem',
                  color: 'text.secondary',
                  lineHeight: 1.5
                }}>
                  {subtitle}
                </p>
              )}
            </Box>
            {actions && (
              <Box sx={{ 
                display: 'flex', 
                gap: spacing.sm,
                flexWrap: 'wrap'
              }}>
                {actions}
              </Box>
            )}
          </Box>
        )}
        
        {/* Page Content */}
        {children}
      </StyledContainer>
    </Box>
  )
}

// Section Layout Component
export interface SectionLayoutProps extends BoxProps {
  title?: string
  subtitle?: string
  actions?: React.ReactNode
  children: React.ReactNode
}

export const SectionLayout: React.FC<SectionLayoutProps> = ({
  title,
  subtitle,
  actions,
  children,
  sx,
  ...props
}) => {
  return (
    <Box sx={{ marginBottom: spacing.lg, ...sx }} {...props}>
      {/* Section Header */}
      {(title || subtitle || actions) && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          marginBottom: spacing.md,
          flexDirection: { xs: 'column', sm: 'row' },
          gap: spacing.sm
        }}>
          <Box>
            {title && (
              <h2 style={{
                margin: 0,
                fontSize: '1.5rem',
                fontWeight: 600,
                color: 'text.primary',
                lineHeight: 1.3,
                marginBottom: spacing.xs
              }}>
                {title}
              </h2>
            )}
            {subtitle && (
              <p style={{
                margin: 0,
                fontSize: '0.875rem',
                color: 'text.secondary',
                lineHeight: 1.5
              }}>
                {subtitle}
              </p>
            )}
          </Box>
          {actions && (
            <Box sx={{ 
              display: 'flex', 
              gap: spacing.sm,
              flexWrap: 'wrap'
            }}>
              {actions}
            </Box>
          )}
        </Box>
      )}
      
      {/* Section Content */}
      {children}
    </Box>
  )
}

// Grid Layout Component
export interface GridLayoutProps extends BoxProps {
  children: React.ReactNode
  columns?: 1 | 2 | 3 | 4
  gap?: 'sm' | 'md' | 'lg'
}

export const GridLayout: React.FC<GridLayoutProps> = ({
  children,
  columns = 3,
  gap = 'md',
  sx,
  ...props
}) => {
  const gapValue = gap === 'sm' ? spacing.sm : gap === 'lg' ? spacing.lg : spacing.md

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: columns >= 2 ? 'repeat(2, 1fr)' : '1fr',
          md: `repeat(${columns}, 1fr)`,
        },
        gap: gapValue,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  )
}

// Stack Layout Component
export interface StackLayoutProps extends BoxProps {
  children: React.ReactNode
  direction?: 'row' | 'column'
  spacing?: 'sm' | 'md' | 'lg'
  align?: 'start' | 'center' | 'end' | 'stretch'
  justify?: 'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly'
}

export const StackLayout: React.FC<StackLayoutProps> = ({
  children,
  direction = 'column',
  spacing: spacingProp = 'md',
  align = 'stretch',
  justify = 'start',
  sx,
  ...props
}) => {
  const spacingValue = spacingProp === 'sm' ? spacing.sm : spacingProp === 'lg' ? spacing.lg : spacing.md

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: direction,
        gap: spacingValue,
        alignItems: align,
        justifyContent: justify,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  )
}

// Export all layout components
export {
  Box as BaseBox,
  Container as BaseContainer,
}
