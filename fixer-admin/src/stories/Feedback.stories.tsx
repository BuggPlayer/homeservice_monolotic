import type { Meta, StoryObj } from '@storybook/react'
import { 
  CustomAlert, 
  CustomSnackbar, 
  CustomDialog, 
  ConfirmationDialog, 
  Loading, 
  LoadingOverlay, 
  CustomSkeleton, 
  CustomStepper, 
  CustomAccordion, 
  CustomTabs, 
  CustomTabPanel 
} from '../components/ui/Feedback'
import { Button } from '../components/ui/button'
import { useState } from 'react'
import { 
  Info, 
  CheckCircle, 
  Warning, 
  Error, 
  Close, 
  Save, 
  Delete, 
  Edit 
} from '@mui/icons-material'

const meta: Meta<typeof CustomAlert> = {
  title: 'UI/Feedback',
  component: CustomAlert,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A collection of feedback components for user notifications and interactions.',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

// Alert Stories
export const AlertSuccess: Story = {
  args: {
    severity: 'success',
    title: 'Success!',
    children: 'Your changes have been saved successfully.',
  },
}

export const AlertError: Story = {
  args: {
    severity: 'error',
    title: 'Error!',
    children: 'Something went wrong. Please try again.',
  },
}

export const AlertWarning: Story = {
  args: {
    severity: 'warning',
    title: 'Warning!',
    children: 'Please review your input before proceeding.',
  },
}

export const AlertInfo: Story = {
  args: {
    severity: 'info',
    title: 'Information',
    children: 'Here is some helpful information for you.',
  },
}

export const AlertDismissible: Story = {
  args: {
    severity: 'info',
    title: 'Dismissible Alert',
    children: 'This alert can be dismissed.',
    dismissible: true,
  },
}

export const AlertWithAction: Story = {
  args: {
    severity: 'warning',
    title: 'Action Required',
    children: 'Please complete your profile to continue.',
    action: <Button size="small">Complete Profile</Button>,
  },
}

// Snackbar Stories
const SnackbarWrapper = () => {
  const [open, setOpen] = useState(false)
  
  return (
    <div>
      <Button onClick={() => setOpen(true)}>Show Snackbar</Button>
      <CustomSnackbar
        open={open}
        onClose={() => setOpen(false)}
        message="This is a snackbar message"
        severity="success"
      />
    </div>
  )
}

export const SnackbarBasic: Story = {
  render: () => <SnackbarWrapper />,
}

const SnackbarWithAction = () => {
  const [open, setOpen] = useState(false)
  
  return (
    <div>
      <Button onClick={() => setOpen(true)}>Show Snackbar with Action</Button>
      <CustomSnackbar
        open={open}
        onClose={() => setOpen(false)}
        message="Item added to cart"
        severity="success"
        action={
          <Button color="inherit" size="small" onClick={() => setOpen(false)}>
            UNDO
          </Button>
        }
      />
    </div>
  )
}

export const SnackbarWithActionButton: Story = {
  render: () => <SnackbarWithAction />,
}

// Dialog Stories
const DialogWrapper = () => {
  const [open, setOpen] = useState(false)
  
  return (
    <div>
      <Button onClick={() => setOpen(true)}>Open Dialog</Button>
      <CustomDialog
        open={open}
        onClose={() => setOpen(false)}
        title="Dialog Title"
        content="This is the dialog content. You can put any content here."
        actions={
          <div>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={() => setOpen(false)}>Confirm</Button>
          </div>
        }
      />
    </div>
  )
}

export const DialogBasic: Story = {
  render: () => <DialogWrapper />,
}

const ConfirmationDialogWrapper = () => {
  const [open, setOpen] = useState(false)
  
  return (
    <div>
      <Button color="error" onClick={() => setOpen(true)}>Delete Item</Button>
      <ConfirmationDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={() => {
          console.log('Item deleted')
          setOpen(false)
        }}
        title="Delete Item"
        content="Are you sure you want to delete this item? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  )
}

export const ConfirmationDialogExample: Story = {
  render: () => <ConfirmationDialogWrapper />,
}

// Loading Stories
const LoadingMeta: Meta<typeof Loading> = {
  title: 'UI/Feedback/Loading',
  component: Loading,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export const LoadingCircular: StoryObj<typeof Loading> = {
  args: {
    type: 'circular',
    size: 40,
  },
}

export const LoadingLinear: StoryObj<typeof Loading> = {
  args: {
    type: 'linear',
  },
}

export const LoadingWithText: StoryObj<typeof Loading> = {
  args: {
    type: 'circular',
    text: 'Loading...',
  },
}

// Loading Overlay Stories
const LoadingOverlayWrapper = () => {
  const [loading, setLoading] = useState(false)
  
  return (
    <div style={{ position: 'relative', width: '300px', height: '200px', border: '1px solid #ccc', padding: '20px' }}>
      <h3>Content behind overlay</h3>
      <p>This content is behind the loading overlay.</p>
      <Button onClick={() => setLoading(!loading)}>
        {loading ? 'Hide' : 'Show'} Loading Overlay
      </Button>
      <LoadingOverlay loading={loading} text="Processing..." />
    </div>
  )
}

export const LoadingOverlayExample: Story = {
  render: () => <LoadingOverlayWrapper />,
}

// Skeleton Stories
const SkeletonMeta: Meta<typeof CustomSkeleton> = {
  title: 'UI/Feedback/Skeleton',
  component: CustomSkeleton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export const SkeletonText: StoryObj<typeof CustomSkeleton> = {
  args: {
    variant: 'text',
    width: 200,
  },
}

export const SkeletonRect: StoryObj<typeof CustomSkeleton> = {
  args: {
    variant: 'rectangular',
    width: 200,
    height: 100,
  },
}

export const SkeletonCircle: StoryObj<typeof CustomSkeleton> = {
  args: {
    variant: 'circular',
    width: 40,
    height: 40,
  },
}

export const SkeletonCard: Story = {
  render: () => (
    <div style={{ width: '300px', padding: '16px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
        <CustomSkeleton variant="circular" width={40} height={40} />
        <div style={{ marginLeft: '12px', flex: 1 }}>
          <CustomSkeleton variant="text" width="60%" />
          <CustomSkeleton variant="text" width="40%" />
        </div>
      </div>
      <CustomSkeleton variant="rectangular" width="100%" height={100} />
      <div style={{ marginTop: '16px' }}>
        <CustomSkeleton variant="text" width="80%" />
        <CustomSkeleton variant="text" width="60%" />
      </div>
    </div>
  ),
}

// Stepper Stories
const StepperWrapper = () => {
  const [activeStep, setActiveStep] = useState(0)
  
  const steps = [
    'Select campaign settings',
    'Create an ad group',
    'Create an ad',
  ]
  
  return (
    <div style={{ width: '100%', maxWidth: '600px' }}>
      <CustomStepper
        activeStep={activeStep}
        steps={steps}
        onStepClick={setActiveStep}
      />
      <div style={{ marginTop: '20px' }}>
        <Button 
          disabled={activeStep === 0} 
          onClick={() => setActiveStep(activeStep - 1)}
          style={{ marginRight: '8px' }}
        >
          Back
        </Button>
        <Button 
          variant="contained" 
          onClick={() => setActiveStep(activeStep + 1)}
          disabled={activeStep === steps.length - 1}
        >
          Next
        </Button>
      </div>
    </div>
  )
}

export const StepperExample: Story = {
  render: () => <StepperWrapper />,
}

// Accordion Stories
const AccordionMeta: Meta<typeof CustomAccordion> = {
  title: 'UI/Feedback/Accordion',
  component: CustomAccordion,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export const AccordionBasic: StoryObj<typeof CustomAccordion> = {
  args: {
    title: 'Accordion Title',
    children: 'This is the accordion content. It can contain any React elements.',
  },
}

export const AccordionMultiple: Story = {
  render: () => (
    <div style={{ width: '400px' }}>
      <CustomAccordion title="Section 1" defaultExpanded>
        <p>Content for section 1</p>
      </CustomAccordion>
      <CustomAccordion title="Section 2">
        <p>Content for section 2</p>
      </CustomAccordion>
      <CustomAccordion title="Section 3">
        <p>Content for section 3</p>
      </CustomAccordion>
    </div>
  ),
}

// Tabs Stories
const TabsWrapper = () => {
  const [value, setValue] = useState(0)
  
  return (
    <div style={{ width: '500px' }}>
      <CustomTabs
        value={value}
        onChange={(_, newValue) => setValue(newValue)}
        tabs={[
          { label: 'Tab 1', content: 'Content for Tab 1' },
          { label: 'Tab 2', content: 'Content for Tab 2' },
          { label: 'Tab 3', content: 'Content for Tab 3' },
        ]}
      />
    </div>
  )
}

export const TabsExample: Story = {
  render: () => <TabsWrapper />,
}

// Complex Feedback Examples
export const NotificationCenter: Story = {
  render: () => (
    <div style={{ width: '400px' }}>
      <h3>Notifications</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <CustomAlert severity="success" dismissible>
          Profile updated successfully
        </CustomAlert>
        <CustomAlert severity="info" dismissible>
          New message received
        </CustomAlert>
        <CustomAlert severity="warning" dismissible>
          Storage space running low
        </CustomAlert>
        <CustomAlert severity="error" dismissible>
          Failed to save changes
        </CustomAlert>
      </div>
    </div>
  ),
}

export const LoadingStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
      <div>
        <h4>Circular Loading</h4>
        <Loading type="circular" size={40} text="Loading data..." />
      </div>
      
      <div style={{ width: '300px' }}>
        <h4>Linear Loading</h4>
        <Loading type="linear" text="Processing..." />
      </div>
      
      <div style={{ position: 'relative', width: '200px', height: '100px', border: '1px solid #ccc', padding: '20px' }}>
        <h4>Overlay Loading</h4>
        <p>Content behind overlay</p>
        <LoadingOverlay loading={true} text="Saving..." />
      </div>
    </div>
  ),
}
