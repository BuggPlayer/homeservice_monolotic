import React from 'react'
import {
  Container,
  ContainerProps,
  Grid,
  GridProps,
  Grid2,
  Grid2Props,
  Stack,
  StackProps,
  Box,
  BoxProps,
  Paper,
  PaperProps,
  Divider,
  DividerProps,
  Spacer,
  SpacerProps,
  Hidden,
  HiddenProps,
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

// Grid2 Component (MUI v5.2+)
export interface CustomGrid2Props extends Grid2Props {
  xs?: number
  sm?: number
  md?: number
  lg?: number
  xl?: number
  spacing?: number
  children: React.ReactNode
}

export const CustomGrid2: React.FC<CustomGrid2Props> = ({
  xs,
  sm,
  md,
  lg,
  xl,
  spacing,
  children,
  sx,
  ...props
}) => {
  return (
    <Grid2
      xs={xs}
      sm={sm}
      md={md}
      lg={lg}
      xl={xl}
      spacing={spacing}
      sx={sx}
      {...props}
    >
      {children}
    </Grid2>
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
export interface CustomSpacerProps extends SpacerProps {
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

// Hidden Component
export interface CustomHiddenProps extends HiddenProps {
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
  ...props
}) => {
  return (
    <Hidden
      xsUp={xsUp}
      smUp={smUp}
      mdUp={mdUp}
      lgUp={lgUp}
      xlUp={xlUp}
      xsDown={xsDown}
      smDown={smDown}
      mdDown={mdDown}
      lgDown={lgDown}
      xlDown={xlDown}
      {...props}
    >
      {children}
    </Hidden>
  )
}

// Responsive Hook
export const useResponsive = () => {
  const theme = useTheme()
  
  const isXs = useMediaQuery(theme.breakpoints.only('xs'))
  const isSm = useMediaQuery(theme.breakpoints.only('sm'))
  const isMd = useMediaQuery(theme.breakpoints.only('md'))
  const isLg = useMediaQuery(theme.breakpoints.only('lg'))
  const isXl = useMediaQuery(theme.breakpoints.only('xl'))
  
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
  
  return {
    isXs,
    isSm,
    isMd,
    isLg,
    isXl,
    isXsUp,
    isSmUp,
    isMdUp,
    isLgUp,
    isXlUp,
    isXsDown,
    isSmDown,
    isMdDown,
    isLgDown,
    isXlDown,
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
  const theme = useTheme()
  const isVisible = useMediaQuery(
    direction === 'up'
      ? theme.breakpoints.up(breakpoint)
      : direction === 'down'
      ? theme.breakpoints.down(breakpoint)
      : theme.breakpoints.only(breakpoint)
  )
  
  return isVisible ? <>{children}</> : <>{fallback}</>
}

// Export all layout components
export {
  Container as BaseContainer,
  Grid as BaseGrid,
  Grid2 as BaseGrid2,
  Stack as BaseStack,
  Box as BaseBox,
  Paper as BasePaper,
  Divider as BaseDivider,
  Spacer as BaseSpacer,
  Hidden as BaseHidden,
  useMediaQuery,
  useTheme,
}
