import React from 'react'
import {
  Container,
  ContainerProps,
  Grid,
  GridProps,
  Stack,
  StackProps,
  Box,
  BoxProps,
  Paper,
  PaperProps,
  Divider,
  DividerProps,
  useMediaQuery,
  useTheme,
  Breakpoint,
  SxProps,
  Theme,
} from '@mui/material'
import { styled } from '@mui/material/styles'

// Styled Container
const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
}))

// Styled Paper
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
}))

// Container Component
export interface CustomContainerProps extends ContainerProps {
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false
  disableGutters?: boolean
  fixed?: boolean
  children: React.ReactNode
}

export const CustomContainer: React.FC<CustomContainerProps> = ({
  maxWidth = 'lg',
  disableGutters = false,
  fixed = false,
  children,
  sx,
  ...props
}) => {
  return (
    <StyledContainer
      maxWidth={maxWidth}
      disableGutters={disableGutters}
      fixed={fixed}
      sx={sx}
      {...props}
    >
      {children}
    </StyledContainer>
  )
}

// Grid Component
export interface CustomGridProps extends GridProps {
  container?: boolean
  item?: boolean
  xs?: boolean | number
  sm?: boolean | number
  md?: boolean | number
  lg?: boolean | number
  xl?: boolean | number
  spacing?: number
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse'
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly'
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline'
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse'
  children: React.ReactNode
}

export const CustomGrid: React.FC<CustomGridProps> = ({
  container = false,
  item = false,
  xs,
  sm,
  md,
  lg,
  xl,
  spacing,
  direction,
  justifyContent,
  alignItems,
  wrap,
  children,
  sx,
  ...props
}) => {
  return (
    <Grid
      container={container}
      item={item}
      xs={xs}
      sm={sm}
      md={md}
      lg={lg}
      xl={xl}
      spacing={spacing}
      direction={direction}
      justifyContent={justifyContent}
      alignItems={alignItems}
      wrap={wrap}
      sx={sx}
      {...props}
    >
      {children}
    </Grid>
  )
}

// Grid2 Component (Simplified Grid System)
export interface CustomGrid2Props {
  xs?: number
  sm?: number
  md?: number
  lg?: number
  xl?: number
  spacing?: number
  container?: boolean
  item?: boolean
  children: React.ReactNode
  sx?: SxProps<Theme>
}

export const CustomGrid2: React.FC<CustomGrid2Props> = ({
  xs,
  sm,
  md,
  lg,
  xl,
  spacing,
  container = false,
  item = false,
  children,
  sx,
  ...props
}) => {
  return (
    <Grid
      xs={xs}
      sm={sm}
      md={md}
      lg={lg}
      xl={xl}
      spacing={spacing}
      container={container}
      item={item}
      sx={sx}
      {...props}
    >
      {children}
    </Grid>
  )
}

// Stack Component
export interface CustomStackProps extends StackProps {
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse'
  spacing?: number
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly'
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline'
  divider?: React.ReactNode
  children: React.ReactNode
}

export const CustomStack: React.FC<CustomStackProps> = ({
  direction = 'column',
  spacing = 1,
  justifyContent,
  alignItems,
  divider,
  children,
  sx,
  ...props
}) => {
  return (
    <Stack
      direction={direction}
      spacing={spacing}
      justifyContent={justifyContent}
      alignItems={alignItems}
      divider={divider}
      sx={sx}
      {...props}
    >
      {children}
    </Stack>
  )
}

// Box Component
export interface CustomBoxProps extends BoxProps {
  children: React.ReactNode
  component?: React.ElementType
  sx?: SxProps<Theme>
}

export const CustomBox: React.FC<CustomBoxProps> = ({
  children,
  component = 'div',
  sx,
  ...props
}) => {
  return (
    <Box
      component={component}
      sx={sx}
      {...props}
    >
      {children}
    </Box>
  )
}

// Paper Component
export interface CustomPaperProps extends PaperProps {
  variant?: 'elevation' | 'outlined' | 'filled'
  elevation?: number
  square?: boolean
  children: React.ReactNode
}

export const CustomPaper: React.FC<CustomPaperProps> = ({
  variant = 'elevation',
  elevation = 1,
  square = false,
  children,
  sx,
  ...props
}) => {
  return (
    <StyledPaper
      variant={variant}
      elevation={elevation}
      square={square}
      sx={sx}
      {...props}
    >
      {children}
    </StyledPaper>
  )
}

// Divider Component
export interface CustomDividerProps extends DividerProps {
  orientation?: 'horizontal' | 'vertical'
  variant?: 'fullWidth' | 'inset' | 'middle'
  flexItem?: boolean
  textAlign?: 'left' | 'center' | 'right'
  children?: React.ReactNode
}

export const CustomDivider: React.FC<CustomDividerProps> = ({
  orientation = 'horizontal',
  variant = 'fullWidth',
  flexItem = false,
  textAlign = 'center',
  children,
  sx,
  ...props
}) => {
  return (
    <Divider
      orientation={orientation}
      variant={variant}
      flexItem={flexItem}
      textAlign={textAlign}
      sx={sx}
      {...props}
    >
      {children}
    </Divider>
  )
}

// Spacer Component
export interface CustomSpacerProps {
  size?: number
  axis?: 'horizontal' | 'vertical'
}

export const CustomSpacer: React.FC<CustomSpacerProps> = ({
  size = 1,
  axis = 'vertical',
}) => {
  return (
    <Box
      sx={{
        [axis === 'horizontal' ? 'width' : 'height']: size,
      }}
    />
  )
}

// Hidden Component (Responsive visibility)
export interface CustomHiddenProps {
  xsUp?: boolean
  smUp?: boolean
  mdUp?: boolean
  lgUp?: boolean
  xlUp?: boolean
  xsDown?: boolean
  smDown?: boolean
  mdDown?: boolean
  lgDown?: boolean
  xlDown?: boolean
  children: React.ReactNode
}

export const CustomHidden: React.FC<CustomHiddenProps> = ({
  xsUp,
  smUp,
  mdUp,
  lgUp,
  xlUp,
  xsDown,
  smDown,
  mdDown,
  lgDown,
  xlDown,
  children,
}) => {
  const theme = useTheme()
  
  // Call all hooks at the top level
  const isXsUp = useMediaQuery(theme.breakpoints.up('xs'))
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'))
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'))
  const isLgUp = useMediaQuery(theme.breakpoints.up('lg'))
  const isXlUp = useMediaQuery(theme.breakpoints.up('xl'))
  const isXsDown = useMediaQuery(theme.breakpoints.down('xs'))
  const isSmDown = useMediaQuery(theme.breakpoints.down('sm'))
  const isMdDown = useMediaQuery(theme.breakpoints.down('md'))
  const isLgDown = useMediaQuery(theme.breakpoints.down('lg'))
  const isXlDown = useMediaQuery(theme.breakpoints.down('xl'))
  
  const shouldHide = () => {
    if (xsUp) return isXsUp
    if (smUp) return isSmUp
    if (mdUp) return isMdUp
    if (lgUp) return isLgUp
    if (xlUp) return isXlUp
    if (xsDown) return isXsDown
    if (smDown) return isSmDown
    if (mdDown) return isMdDown
    if (lgDown) return isLgDown
    if (xlDown) return isXlDown
    return false
  }

  return shouldHide() ? null : <>{children}</>
}

// Responsive Hook
export const useResponsive = (breakpoint?: Breakpoint, direction?: 'up' | 'down' | 'only') => {
  const theme = useTheme()
  
  // Always call all hooks at the top level
  const isXs = useMediaQuery(theme.breakpoints.only('xs'))
  const isSm = useMediaQuery(theme.breakpoints.only('sm'))
  const isMd = useMediaQuery(theme.breakpoints.only('md'))
  const isLg = useMediaQuery(theme.breakpoints.only('lg'))
  const isXl = useMediaQuery(theme.breakpoints.only('xl'))
  
  // For specific breakpoint queries
  const isXsUp = useMediaQuery(theme.breakpoints.up('xs'))
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'))
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'))
  const isLgUp = useMediaQuery(theme.breakpoints.up('lg'))
  const isXlUp = useMediaQuery(theme.breakpoints.up('xl'))
  
  const isXsDown = useMediaQuery(theme.breakpoints.down('xs'))
  const isSmDown = useMediaQuery(theme.breakpoints.down('sm'))
  const isMdDown = useMediaQuery(theme.breakpoints.down('md'))
  const isLgDown = useMediaQuery(theme.breakpoints.down('lg'))
  const isXlDown = useMediaQuery(theme.breakpoints.down('xl'))
  
  if (breakpoint && direction) {
    switch (direction) {
      case 'up':
        switch (breakpoint) {
          case 'xs': return isXsUp
          case 'sm': return isSmUp
          case 'md': return isMdUp
          case 'lg': return isLgUp
          case 'xl': return isXlUp
          default: return false
        }
      case 'down':
        switch (breakpoint) {
          case 'xs': return isXsDown
          case 'sm': return isSmDown
          case 'md': return isMdDown
          case 'lg': return isLgDown
          case 'xl': return isXlDown
          default: return false
        }
      case 'only':
        switch (breakpoint) {
          case 'xs': return isXs
          case 'sm': return isSm
          case 'md': return isMd
          case 'lg': return isLg
          case 'xl': return isXl
          default: return false
        }
      default:
        return false
    }
  }
  
  return {
    isXs,
    isSm,
    isMd,
    isLg,
    isXl,
  }
}

// Responsive Component
export interface ResponsiveProps {
  children: React.ReactNode
  breakpoint?: Breakpoint
  direction?: 'up' | 'down' | 'only'
  fallback?: React.ReactNode
}

export const Responsive: React.FC<ResponsiveProps> = ({
  children,
  breakpoint = 'md',
  direction = 'up',
  fallback = null,
}) => {
  const isVisible = useResponsive(breakpoint, direction)
  
  return isVisible ? <>{children}</> : <>{fallback}</>
}

// Export all layout components
export {
  Container as BaseContainer,
  Grid as BaseGrid,
  Stack as BaseStack,
  Box as BaseBox,
  Paper as BasePaper,
  Divider as BaseDivider,
  useMediaQuery,
  useTheme,
}
