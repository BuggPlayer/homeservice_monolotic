import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Box,
  Typography,
  Divider,
  useTheme,
  useMediaQuery,
  Slide,
  Fade,
  Backdrop,
} from '@mui/material'
import {
  Close as CloseIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Print as PrintIcon,
  Share as ShareIcon,
} from '@mui/icons-material'
import { TransitionProps } from '@mui/material/transitions'

// Transition component for smooth modal animation
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />
})

export interface PreviewModalProps {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children: React.ReactNode
  actions?: React.ReactNode
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false
  fullScreen?: boolean
  showHeader?: boolean
  showActions?: boolean
  loading?: boolean
}

export function PreviewModal({
  open,
  onClose,
  title,
  subtitle,
  children,
  actions,
  maxWidth = 'md',
  fullScreen = false,
  showHeader = true,
  showActions = true,
  loading = false,
}: PreviewModalProps) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'))

  // Determine if we should use full screen
  const useFullScreen = fullScreen || isMobile

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={useFullScreen ? false : maxWidth}
      fullWidth
      fullScreen={useFullScreen}
      TransitionComponent={useFullScreen ? Transition : Fade}
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
        sx: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
        },
      }}
      PaperProps={{
        sx: {
          borderRadius: useFullScreen ? 0 : 3,
          boxShadow: theme.shadows[24],
          maxHeight: useFullScreen ? '100vh' : '90vh',
          margin: useFullScreen ? 0 : theme.spacing(2),
        },
      }}
    >
      {showHeader && (
        <>
          <DialogTitle
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              pb: 1,
              borderBottom: 1,
              borderColor: 'divider',
              backgroundColor: 'background.paper',
              position: 'sticky',
              top: 0,
              zIndex: 1,
            }}
          >
            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: '1.25rem', sm: '1.5rem' },
                  color: 'text.primary',
                }}
              >
                {title}
              </Typography>
              {subtitle && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  {subtitle}
                </Typography>
              )}
            </Box>
            <IconButton
              onClick={onClose}
              size="small"
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <Divider />
        </>
      )}

      <DialogContent
        sx={{
          p: { xs: 2, sm: 3 },
          backgroundColor: 'background.default',
          overflow: 'auto',
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
          },
        }}
      >
        {loading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: 200,
            }}
          >
            <Typography color="text.secondary">Loading...</Typography>
          </Box>
        ) : (
          children
        )}
      </DialogContent>

      {showActions && (actions || !useFullScreen) && (
        <>
          <Divider />
          <DialogActions
            sx={{
              p: { xs: 2, sm: 3 },
              backgroundColor: 'background.paper',
              position: 'sticky',
              bottom: 0,
              zIndex: 1,
              gap: 1,
            }}
          >
            {actions || (
              <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
                <IconButton
                  size="small"
                  sx={{
                    color: 'text.secondary',
                    '&:hover': { backgroundColor: 'action.hover' },
                  }}
                >
                  <PrintIcon />
                </IconButton>
                <IconButton
                  size="small"
                  sx={{
                    color: 'text.secondary',
                    '&:hover': { backgroundColor: 'action.hover' },
                  }}
                >
                  <ShareIcon />
                </IconButton>
                <Box sx={{ flexGrow: 1 }} />
                <IconButton
                  size="small"
                  sx={{
                    color: 'text.secondary',
                    '&:hover': { backgroundColor: 'action.hover' },
                  }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  size="small"
                  sx={{
                    color: 'error.main',
                    '&:hover': { backgroundColor: 'error.light' },
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            )}
          </DialogActions>
        </>
      )}
    </Dialog>
  )
}

export default PreviewModal
