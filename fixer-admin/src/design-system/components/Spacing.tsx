import React from 'react'
import { Box, BoxProps } from '@mui/material'
import { spacing } from '../tokens'

// Spacer Component for consistent spacing
export interface SpacerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
  direction?: 'vertical' | 'horizontal'
}

export const Spacer: React.FC<SpacerProps> = ({
  size = 'md',
  direction = 'vertical',
}) => {
  const sizeValue = spacing[size]
  
  return (
    <Box
      sx={{
        [direction === 'vertical' ? 'height' : 'width']: sizeValue,
        [direction === 'vertical' ? 'width' : 'height']: 1,
      }}
    />
  )
}

// Stack Component for consistent spacing between elements
export interface StackProps extends BoxProps {
  children: React.ReactNode
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
  direction?: 'row' | 'column'
  align?: 'start' | 'center' | 'end' | 'stretch'
  justify?: 'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly'
  wrap?: boolean
}

export const Stack: React.FC<StackProps> = ({
  children,
  spacing: spacingProp = 'md',
  direction = 'column',
  align = 'stretch',
  justify = 'start',
  wrap = false,
  sx,
  ...props
}) => {
  const spacingValue = spacing[spacingProp]

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: direction,
        gap: spacingValue,
        alignItems: align,
        justifyContent: justify,
        flexWrap: wrap ? 'wrap' : 'nowrap',
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  )
}

// Inline Component for horizontal layouts
export interface InlineProps extends BoxProps {
  children: React.ReactNode
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
  align?: 'start' | 'center' | 'end' | 'stretch'
  justify?: 'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly'
  wrap?: boolean
}

export const Inline: React.FC<InlineProps> = ({
  children,
  spacing: spacingProp = 'sm',
  align = 'center',
  justify = 'start',
  wrap = false,
  sx,
  ...props
}) => {
  const spacingValue = spacing[spacingProp]

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: spacingValue,
        alignItems: align,
        justifyContent: justify,
        flexWrap: wrap ? 'wrap' : 'nowrap',
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  )
}

// VStack Component for vertical layouts
export interface VStackProps extends BoxProps {
  children: React.ReactNode
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
  align?: 'start' | 'center' | 'end' | 'stretch'
  justify?: 'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly'
}

export const VStack: React.FC<VStackProps> = ({
  children,
  spacing: spacingProp = 'md',
  align = 'stretch',
  justify = 'start',
  sx,
  ...props
}) => {
  const spacingValue = spacing[spacingProp]

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
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

// HStack Component for horizontal layouts
export interface HStackProps extends BoxProps {
  children: React.ReactNode
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
  align?: 'start' | 'center' | 'end' | 'stretch'
  justify?: 'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly'
  wrap?: boolean
}

export const HStack: React.FC<HStackProps> = ({
  children,
  spacing: spacingProp = 'sm',
  align = 'center',
  justify = 'start',
  wrap = false,
  sx,
  ...props
}) => {
  const spacingValue = spacing[spacingProp]

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: spacingValue,
        alignItems: align,
        justifyContent: justify,
        flexWrap: wrap ? 'wrap' : 'nowrap',
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  )
}

// Center Component for centering content
export interface CenterProps extends BoxProps {
  children: React.ReactNode
  direction?: 'row' | 'column'
}

export const Center: React.FC<CenterProps> = ({
  children,
  direction = 'column',
  sx,
  ...props
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: direction,
        alignItems: 'center',
        justifyContent: 'center',
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  )
}

// Export all spacing components
export {
  Box as BaseBox,
}
