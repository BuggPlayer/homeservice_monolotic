import React from 'react'
import {
  Skeleton,
  SkeletonProps,
  CircularProgress,
  CircularProgressProps,
  LinearProgress,
  LinearProgressProps,
  Backdrop,
  BackdropProps,
  Fade,
  FadeProps,
  Grow,
  GrowProps,
  Slide,
  SlideProps,
  Zoom,
  ZoomProps,
  Collapse,
  CollapseProps,
  Box,
  BoxProps,
  Typography,
  TypographyProps,
  Chip,
  ChipProps,
  Tooltip,
  TooltipProps,
  Popper,
  PopperProps,
  ClickAwayListener,
  ClickAwayListenerProps,
  Portal,
  PortalProps,
  NoSsr,
  NoSsrProps,
} from '@mui/material'
import { styled } from '@mui/material/styles'

// Loading Components
export const Loading: React.FC<CircularProgressProps> = (props) => (
  <CircularProgress {...props} />
)

export const LoadingOverlay: React.FC<BackdropProps> = ({
  children,
  ...props
}) => (
  <Backdrop {...props}>
    {children}
  </Backdrop>
)

// Skeleton Components
export const SkeletonText: React.FC<SkeletonProps> = ({
  variant = 'text',
  width = '100%',
  height = 20,
  ...props
}) => (
  <Skeleton
    variant={variant}
    width={width}
    height={height}
    {...props}
  />
)

export const SkeletonRect: React.FC<SkeletonProps> = ({
  variant = 'rectangular',
  width = '100%',
  height = 200,
  ...props
}) => (
  <Skeleton
    variant={variant}
    width={width}
    height={height}
    {...props}
  />
)

export const SkeletonCircle: React.FC<SkeletonProps> = ({
  variant = 'circular',
  width = 40,
  height = 40,
  ...props
}) => (
  <Skeleton
    variant={variant}
    width={width}
    height={height}
    {...props}
  />
)

// Animation Components
export const FadeIn: React.FC<FadeProps> = ({ children, ...props }) => (
  <Fade {...props}>
    <div>{children}</div>
  </Fade>
)

export const GrowIn: React.FC<GrowProps> = ({ children, ...props }) => (
  <Grow {...props}>
    <div>{children}</div>
  </Grow>
)

export const SlideIn: React.FC<SlideProps> = ({ children, ...props }) => (
  <Slide {...props}>
    <div>{children}</div>
  </Slide>
)

export const ZoomIn: React.FC<ZoomProps> = ({ children, ...props }) => (
  <Zoom {...props}>
    <div>{children}</div>
  </Zoom>
)

export const CollapseIn: React.FC<CollapseProps> = ({ children, ...props }) => (
  <Collapse {...props}>
    <div>{children}</div>
  </Collapse>
)

// Empty State Component
export interface EmptyStateProps {
  title: string
  description?: string
  icon?: React.ReactNode
  action?: React.ReactNode
  image?: string
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action,
  image,
}) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      py: 8,
      px: 2,
      textAlign: 'center',
    }}
  >
    {image && (
      <Box
        component="img"
        src={image}
        alt="Empty state"
        sx={{
          width: 200,
          height: 200,
          mb: 3,
          opacity: 0.6,
        }}
      />
    )}
    {icon && (
      <Box
        sx={{
          fontSize: 64,
          color: 'text.secondary',
          mb: 2,
        }}
      >
        {icon}
      </Box>
    )}
    <Typography variant="h6" gutterBottom>
      {title}
    </Typography>
    {description && (
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {description}
      </Typography>
    )}
    {action}
  </Box>
)

// Status Chip Component
export interface StatusChipProps extends ChipProps {
  status: 'success' | 'error' | 'warning' | 'info' | 'default'
  label: string
}

export const StatusChip: React.FC<StatusChipProps> = ({
  status,
  label,
  ...props
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'success'
      case 'error':
        return 'error'
      case 'warning':
        return 'warning'
      case 'info':
        return 'info'
      default:
        return 'default'
    }
  }

  return (
    <Chip
      label={label}
      color={getStatusColor(status)}
      size="small"
      {...props}
    />
  )
}

// Copy to Clipboard Component
export interface CopyToClipboardProps {
  text: string
  children: React.ReactNode
  onCopy?: () => void
}

export const CopyToClipboard: React.FC<CopyToClipboardProps> = ({
  text,
  children,
  onCopy,
}) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      onCopy?.()
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <Box onClick={handleCopy} sx={{ cursor: 'pointer' }}>
      {children}
    </Box>
  )
}

// Export all utility components
export {
  Skeleton as BaseSkeleton,
  CircularProgress as BaseCircularProgress,
  LinearProgress as BaseLinearProgress,
  Backdrop as BaseBackdrop,
  Fade as BaseFade,
  Grow as BaseGrow,
  Slide as BaseSlide,
  Zoom as BaseZoom,
  Collapse as BaseCollapse,
  Box as BaseBox,
  Typography as BaseTypography,
  Chip as BaseChip,
  Tooltip as BaseTooltip,
  Popper as BasePopper,
  ClickAwayListener as BaseClickAwayListener,
  Portal as BasePortal,
  NoSsr as BaseNoSsr,
}
