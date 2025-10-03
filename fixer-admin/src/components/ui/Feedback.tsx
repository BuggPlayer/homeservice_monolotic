import React from 'react'
import {
  Alert,
  AlertProps,
  AlertTitle,
  AlertTitleProps,
  Snackbar,
  SnackbarProps,
  Dialog,
  DialogProps,
  DialogTitle,
  DialogTitleProps,
  DialogContent,
  DialogContentProps,
  DialogActions,
  DialogActionsProps,
  DialogContentText,
  DialogContentTextProps,
  Backdrop,
  BackdropProps,
  CircularProgress,
  CircularProgressProps,
  LinearProgress,
  LinearProgressProps,
  Skeleton,
  SkeletonProps,
  Stepper,
  StepperProps,
  Step,
  StepProps,
  StepLabel,
  StepLabelProps,
  StepContent,
  StepContentProps,
  StepButton,
  StepButtonProps,
  Accordion,
  AccordionProps,
  AccordionSummary,
  AccordionSummaryProps,
  AccordionDetails,
  AccordionDetailsProps,
  Tabs,
  TabsProps,
  Tab,
  TabProps,
  Box,
} from '@mui/material'
import { styled } from '@mui/material/styles'

// Styled Alert
const StyledAlert = styled(Alert)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  '& .MuiAlert-icon': {
    fontSize: '1.25rem',
  },
  '& .MuiAlert-message': {
    fontSize: '0.875rem',
  },
}))

// Styled Snackbar
const StyledSnackbar = styled(Snackbar)(({ theme }) => ({
  '& .MuiSnackbarContent-root': {
    borderRadius: theme.shape.borderRadius,
  },
}))

// Styled Dialog
const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: (theme.shape.borderRadius as number) * 2,
    boxShadow: theme.shadows[24],
  },
}))

// Alert Component
export interface CustomAlertProps extends AlertProps {
  variant?: 'filled' | 'outlined' | 'standard'
  severity?: 'error' | 'warning' | 'info' | 'success'
  title?: string
  action?: React.ReactNode
  closable?: boolean
  onClose?: () => void
}

export const CustomAlert: React.FC<CustomAlertProps> = ({
  variant = 'standard',
  severity = 'info',
  title,
  action,
  closable = false,
  onClose,
  children,
  sx,
  ...props
}) => {
  return (
    <StyledAlert
      variant={variant}
      severity={severity}
      action={action}
      sx={sx}
      {...props}
    >
      {title && <AlertTitle>{title}</AlertTitle>}
      {children}
    </StyledAlert>
  )
}

// Snackbar Component
export interface CustomSnackbarProps extends SnackbarProps {
  message: string
  severity?: 'error' | 'warning' | 'info' | 'success'
  action?: React.ReactNode
  closable?: boolean
  onClose?: () => void
  autoHideDuration?: number
}

export const CustomSnackbar: React.FC<CustomSnackbarProps> = ({
  message,
  severity = 'info',
  action,
  closable = true,
  onClose,
  autoHideDuration = 6000,
  sx,
  ...props
}) => {
  return (
    <StyledSnackbar
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      sx={sx}
      {...props}
    >
      <Alert
        onClose={closable ? onClose : undefined}
        severity={severity}
        action={action}
        sx={{ width: '100%' }}
      >
        {message}
      </Alert>
    </StyledSnackbar>
  )
}

// Dialog Component
export interface CustomDialogProps extends DialogProps {
  title?: string
  content?: string
  actions?: React.ReactNode
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  fullWidth?: boolean
  dividers?: boolean
}

export const CustomDialog: React.FC<CustomDialogProps> = ({
  title,
  content,
  actions,
  maxWidth = 'sm',
  fullWidth = true,
  dividers = false,
  children,
  sx,
  ...props
}) => {
  return (
    <StyledDialog
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      sx={sx}
      {...props}
    >
      {title && <DialogTitle>{title}</DialogTitle>}
      <DialogContent dividers={dividers}>
        {content && <DialogContentText>{content}</DialogContentText>}
        {children}
      </DialogContent>
      {actions && <DialogActions>{actions}</DialogActions>}
    </StyledDialog>
  )
}

// Confirmation Dialog
export interface ConfirmationDialogProps extends Omit<CustomDialogProps, 'children'> {
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
  loading?: boolean
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  loading = false,
  ...props
}) => {
  return (
    <CustomDialog
      {...props}
      actions={
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={onCancel} disabled={loading}>
            {cancelText}
          </button>
          <button onClick={onConfirm} disabled={loading}>
            {loading ? 'Loading...' : confirmText}
          </button>
        </div>
      }
    >
      <DialogContentText>{message}</DialogContentText>
    </CustomDialog>
  )
}

// Loading Components
export interface LoadingProps {
  size?: number
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info'
  thickness?: number
}

export const Loading: React.FC<LoadingProps> = ({
  size = 40,
  color = 'primary',
  thickness = 3.6,
}) => {
  return (
    <CircularProgress
      size={size}
      color={color}
      thickness={thickness}
    />
  )
}

export interface LoadingOverlayProps extends BackdropProps {
  message?: string
  size?: number
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info'
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  message = 'Loading...',
  size = 40,
  color = 'primary',
  sx,
  ...props
}) => {
  return (
    <Backdrop
      sx={{
        color: '#fff',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        ...sx,
      }}
      {...props}
    >
      <CircularProgress size={size} color={color} />
      {message && <div>{message}</div>}
    </Backdrop>
  )
}

// Skeleton Component
export interface CustomSkeletonProps extends SkeletonProps {
  variant?: 'text' | 'rectangular' | 'circular'
  animation?: 'pulse' | 'wave' | false
  width?: number | string
  height?: number | string
}

export const CustomSkeleton: React.FC<CustomSkeletonProps> = ({
  variant = 'text',
  animation = 'pulse',
  width,
  height,
  sx,
  ...props
}) => {
  return (
    <Skeleton
      variant={variant}
      animation={animation}
      width={width}
      height={height}
      sx={sx}
      {...props}
    />
  )
}

// Stepper Component
export interface CustomStepperProps extends StepperProps {
  steps: Array<{
    label: string
    description?: string
    optional?: boolean
    completed?: boolean
    disabled?: boolean
  }>
  activeStep: number
  orientation?: 'horizontal' | 'vertical'
  alternativeLabel?: boolean
  nonLinear?: boolean
}

export const CustomStepper: React.FC<CustomStepperProps> = ({
  steps,
  activeStep,
  orientation = 'horizontal',
  alternativeLabel = false,
  nonLinear = false,
  sx,
  ...props
}) => {
  return (
    <Stepper
      activeStep={activeStep}
      orientation={orientation}
      alternativeLabel={alternativeLabel}
      nonLinear={nonLinear}
      sx={sx}
      {...props}
    >
      {steps.map((step, index) => (
        <Step key={step.label} completed={step.completed} disabled={step.disabled}>
          <StepLabel optional={step.optional}>
            {step.label}
          </StepLabel>
          {orientation === 'vertical' && step.description && (
            <StepContent>
              <div>{step.description}</div>
            </StepContent>
          )}
        </Step>
      ))}
    </Stepper>
  )
}

// Accordion Component
export interface CustomAccordionProps {
  title: string
  content: React.ReactNode
  expanded?: boolean
  onChange?: (event: React.SyntheticEvent, isExpanded: boolean) => void
  disabled?: boolean
  sx?: any
}

export const CustomAccordion: React.FC<CustomAccordionProps> = ({
  title,
  content,
  expanded = false,
  onChange,
  disabled = false,
  sx,
  ...props
}) => {
  return (
    <Accordion
      expanded={expanded}
      onChange={onChange}
      disabled={disabled}
      sx={sx}
      {...props}
    >
      <AccordionSummary expandIcon={<span>▼</span>}>
        {title}
      </AccordionSummary>
      <AccordionDetails>
        {content}
      </AccordionDetails>
    </Accordion>
  )
}

// Tabs Component
export interface CustomTabsProps extends TabsProps {
  tabs: Array<{
    label: string
    value: string | number
    disabled?: boolean
    icon?: React.ReactElement
  }>
  value: string | number
  onChange: (event: React.SyntheticEvent, newValue: string | number) => void
  orientation?: 'horizontal' | 'vertical'
  variant?: 'standard' | 'scrollable' | 'fullWidth'
}

export const CustomTabs: React.FC<CustomTabsProps> = ({
  tabs,
  value,
  onChange,
  orientation = 'horizontal',
  variant = 'standard',
  sx,
  ...props
}) => {
  return (
    <Tabs
      value={value}
      onChange={onChange}
      orientation={orientation}
      variant={variant}
      sx={sx}
      {...props}
    >
      {tabs.map((tab) => (
        <Tab
          key={tab.value}
          label={tab.label}
          value={tab.value}
          disabled={tab.disabled}
          icon={tab.icon}
        />
      ))}
    </Tabs>
  )
}

// Tab Panel Component
export interface CustomTabPanelProps {
  value: string | number
  index: string | number
  children: React.ReactNode
  sx?: any
}

export const CustomTabPanel: React.FC<CustomTabPanelProps> = ({
  value,
  index,
  children,
  sx,
  ...props
}) => {
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      sx={sx}
      {...props}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </Box>
  )
}

// Export all feedback components
export {
  Alert as BaseAlert,
  AlertTitle as BaseAlertTitle,
  Snackbar as BaseSnackbar,
  Dialog as BaseDialog,
  DialogTitle as BaseDialogTitle,
  DialogContent as BaseDialogContent,
  DialogActions as BaseDialogActions,
  DialogContentText as BaseDialogContentText,
  Backdrop as BaseBackdrop,
  CircularProgress as BaseCircularProgress,
  LinearProgress as BaseLinearProgress,
  Skeleton as BaseSkeleton,
  Stepper as BaseStepper,
  Step as BaseStep,
  StepLabel as BaseStepLabel,
  StepContent as BaseStepContent,
  StepButton as BaseStepButton,
  Accordion as BaseAccordion,
  AccordionSummary as BaseAccordionSummary,
  AccordionDetails as BaseAccordionDetails,
  Tabs as BaseTabs,
  Tab as BaseTab,
}
