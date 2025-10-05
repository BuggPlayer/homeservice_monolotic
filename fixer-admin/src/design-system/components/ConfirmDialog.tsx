import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogProps,
  Typography,
  Box,
  IconButton,
} from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'
import { Button } from './Button'
import { spacing } from '../tokens'

// Confirm Dialog Component
export interface ConfirmDialogProps extends Omit<DialogProps, 'open'> {
  open: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
  loading?: boolean
  severity?: 'error' | 'warning' | 'info' | 'success'
  confirmColor?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info'
  cancelColor?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info'
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  loading = false,
  severity = 'info',
  confirmColor = 'primary',
  cancelColor = 'primary',
  maxWidth = 'sm',
  fullWidth = true,
  ...props
}) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error':
        return 'error'
      case 'warning':
        return 'warning'
      case 'success':
        return 'success'
      default:
        return 'info'
    }
  }

  const getConfirmColor = (severity: string, confirmColor: string) => {
    if (severity === 'error') return 'error'
    if (severity === 'warning') return 'warning'
    if (severity === 'success') return 'success'
    return confirmColor
  }

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      {...props}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        paddingBottom: spacing.sm
      }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        <IconButton
          onClick={onCancel}
          size="small"
          sx={{ 
            color: 'text.secondary',
            '&:hover': {
              backgroundColor: 'action.hover',
            }
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ paddingTop: spacing.sm }}>
        <Typography variant="body1" color="text.secondary">
          {message}
        </Typography>
      </DialogContent>
      
      <DialogActions sx={{ 
        padding: spacing.md,
        gap: spacing.sm,
        justifyContent: 'flex-end'
      }}>
        <Button
          variant="outlined"
          color={cancelColor}
          onClick={onCancel}
          disabled={loading}
        >
          {cancelText}
        </Button>
        <Button
          variant="contained"
          color={getConfirmColor(severity, confirmColor)}
          onClick={onConfirm}
          loading={loading}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

// Alert Dialog Component
export interface AlertDialogProps extends Omit<DialogProps, 'open'> {
  open: boolean
  title: string
  message: string
  buttonText?: string
  onClose: () => void
  severity?: 'error' | 'warning' | 'info' | 'success'
  buttonColor?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info'
}

export const AlertDialog: React.FC<AlertDialogProps> = ({
  open,
  title,
  message,
  buttonText = 'OK',
  onClose,
  severity = 'info',
  buttonColor = 'primary',
  maxWidth = 'sm',
  fullWidth = true,
  ...props
}) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error':
        return 'error'
      case 'warning':
        return 'warning'
      case 'success':
        return 'success'
      default:
        return 'info'
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      {...props}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        paddingBottom: spacing.sm
      }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ 
            color: 'text.secondary',
            '&:hover': {
              backgroundColor: 'action.hover',
            }
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ paddingTop: spacing.sm }}>
        <Typography variant="body1" color="text.secondary">
          {message}
        </Typography>
      </DialogContent>
      
      <DialogActions sx={{ 
        padding: spacing.md,
        justifyContent: 'center'
      }}>
        <Button
          variant="contained"
          color={getSeverityColor(severity)}
          onClick={onClose}
        >
          {buttonText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

// Export all dialog components
export {
  Dialog as BaseDialog,
  DialogTitle as BaseDialogTitle,
  DialogContent as BaseDialogContent,
  DialogActions as BaseDialogActions,
}
