import React from 'react'
import { Typography as MuiTypography, TypographyProps as MuiTypographyProps } from '@mui/material'
import { styled } from '@mui/material/styles'
import { typography } from '../tokens'

// Styled Typography with consistent design
const StyledTypography = styled(MuiTypography)(({ theme }) => ({
  fontFamily: typography.fontFamily,
  '&.MuiTypography-h1': {
    fontSize: typography.fontSize['4xl'],
    fontWeight: typography.fontWeight.bold,
    lineHeight: typography.lineHeight.tight,
  },
  '&.MuiTypography-h2': {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.semibold,
    lineHeight: typography.lineHeight.tight,
  },
  '&.MuiTypography-h3': {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.semibold,
    lineHeight: typography.lineHeight.normal,
  },
  '&.MuiTypography-h4': {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    lineHeight: typography.lineHeight.normal,
  },
  '&.MuiTypography-h5': {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    lineHeight: typography.lineHeight.normal,
  },
  '&.MuiTypography-h6': {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    lineHeight: typography.lineHeight.normal,
  },
  '&.MuiTypography-body1': {
    fontSize: typography.fontSize.base,
    lineHeight: typography.lineHeight.normal,
  },
  '&.MuiTypography-body2': {
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.normal,
  },
  '&.MuiTypography-caption': {
    fontSize: typography.fontSize.xs,
    lineHeight: typography.lineHeight.normal,
  },
}))

// Typography Component
export interface TypographyProps extends MuiTypographyProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2' | 'caption' | 'inherit'
  color?: 'primary' | 'secondary' | 'textPrimary' | 'textSecondary' | 'error' | 'warning' | 'info' | 'success'
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold'
  align?: 'left' | 'center' | 'right' | 'justify'
}

export const Typography: React.FC<TypographyProps> = ({
  variant = 'body1',
  color = 'textPrimary',
  weight,
  align,
  sx,
  ...props
}) => {
  const getWeightValue = (weight?: string) => {
    if (!weight) return undefined
    return typography.fontWeight[weight as keyof typeof typography.fontWeight]
  }

  return (
    <StyledTypography
      variant={variant}
      color={color}
      align={align}
      sx={{
        fontWeight: getWeightValue(weight),
        ...sx,
      }}
      {...props}
    />
  )
}

// Text Component for simple text
export interface TextProps {
  children: React.ReactNode
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold'
  color?: 'primary' | 'secondary' | 'textPrimary' | 'textSecondary' | 'error' | 'warning' | 'info' | 'success'
  align?: 'left' | 'center' | 'right' | 'justify'
  as?: 'p' | 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

export const Text: React.FC<TextProps> = ({
  children,
  size = 'base',
  weight = 'normal',
  color = 'textPrimary',
  align,
  as = 'p',
  ...props
}) => {
  const getVariant = (size: string) => {
    switch (size) {
      case 'xs': return 'caption'
      case 'sm': return 'body2'
      case 'base': return 'body1'
      case 'lg': return 'h6'
      case 'xl': return 'h5'
      case '2xl': return 'h4'
      case '3xl': return 'h3'
      case '4xl': return 'h2'
      default: return 'body1'
    }
  }

  return (
    <Typography
      component={as}
      variant={getVariant(size)}
      color={color}
      weight={weight}
      align={align}
      {...props}
    >
      {children}
    </Typography>
  )
}

// Heading Component
export interface HeadingProps {
  children: React.ReactNode
  level?: 1 | 2 | 3 | 4 | 5 | 6
  color?: 'primary' | 'secondary' | 'textPrimary' | 'textSecondary' | 'error' | 'warning' | 'info' | 'success'
  align?: 'left' | 'center' | 'right' | 'justify'
}

export const Heading: React.FC<HeadingProps> = ({
  children,
  level = 1,
  color = 'textPrimary',
  align,
  ...props
}) => {
  const variant = `h${level}` as const

  return (
    <Typography
      component={`h${level}`}
      variant={variant}
      color={color}
      align={align}
      {...props}
    >
      {children}
    </Typography>
  )
}

// Export all typography components
export {
  MuiTypography as BaseTypography,
}
