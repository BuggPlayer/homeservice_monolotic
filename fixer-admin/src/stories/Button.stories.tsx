import type { Meta, StoryObj } from '@storybook/react'
import { Button, IconButton, FloatingActionButton } from '../components/ui/button'
import { Add, Edit, Delete, Save, Search } from '@mui/icons-material'

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A customizable button component with multiple variants, sizes, and states.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['text', 'outlined', 'contained', 'gradient'],
      description: 'The variant of the button',
    },
    color: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'success', 'error', 'warning', 'info'],
      description: 'The color of the button',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'The size of the button',
    },
    loading: {
      control: { type: 'boolean' },
      description: 'Whether the button is in loading state',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the button is disabled',
    },
    fullWidth: {
      control: { type: 'boolean' },
      description: 'Whether the button should take full width',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Basic Button Stories
export const Primary: Story = {
  args: {
    children: 'Primary Button',
    variant: 'contained',
    color: 'primary',
  },
}

export const Secondary: Story = {
  args: {
    children: 'Secondary Button',
    variant: 'contained',
    color: 'secondary',
  },
}

export const Outlined: Story = {
  args: {
    children: 'Outlined Button',
    variant: 'outlined',
    color: 'primary',
  },
}

export const Text: Story = {
  args: {
    children: 'Text Button',
    variant: 'text',
    color: 'primary',
  },
}

// Size Variants
export const Small: Story = {
  args: {
    children: 'Small Button',
    size: 'small',
    variant: 'contained',
  },
}

export const Medium: Story = {
  args: {
    children: 'Medium Button',
    size: 'medium',
    variant: 'contained',
  },
}

export const Large: Story = {
  args: {
    children: 'Large Button',
    size: 'large',
    variant: 'contained',
  },
}

// Color Variants
export const Success: Story = {
  args: {
    children: 'Success Button',
    color: 'success',
    variant: 'contained',
  },
}

export const Error: Story = {
  args: {
    children: 'Error Button',
    color: 'error',
    variant: 'contained',
  },
}

export const Warning: Story = {
  args: {
    children: 'Warning Button',
    color: 'warning',
    variant: 'contained',
  },
}

export const Info: Story = {
  args: {
    children: 'Info Button',
    color: 'info',
    variant: 'contained',
  },
}

// States
export const Loading: Story = {
  args: {
    children: 'Loading Button',
    loading: true,
    variant: 'contained',
  },
}

export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    disabled: true,
    variant: 'contained',
  },
}

// With Icons
export const WithLeftIcon: Story = {
  args: {
    children: 'Save',
    leftIcon: <Save />,
    variant: 'contained',
  },
}

export const WithRightIcon: Story = {
  args: {
    children: 'Search',
    rightIcon: <Search />,
    variant: 'contained',
  },
}

export const WithBothIcons: Story = {
  args: {
    children: 'Edit',
    leftIcon: <Edit />,
    rightIcon: <Add />,
    variant: 'contained',
  },
}

// Full Width
export const FullWidth: Story = {
  args: {
    children: 'Full Width Button',
    fullWidth: true,
    variant: 'contained',
  },
}

// Button Group
export const ButtonGroup: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px' }}>
      <Button variant="contained" color="primary">Save</Button>
      <Button variant="outlined" color="primary">Cancel</Button>
      <Button variant="text" color="error">Delete</Button>
    </div>
  ),
}

// Icon Button Stories
const IconButtonMeta: Meta<typeof IconButton> = {
  title: 'UI/Button/IconButton',
  component: IconButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export const IconButtonPrimary: StoryObj<typeof IconButton> = {
  args: {
    children: <Edit />,
    color: 'primary',
    variant: 'contained',
  },
}

export const IconButtonOutlined: StoryObj<typeof IconButton> = {
  args: {
    children: <Delete />,
    color: 'error',
    variant: 'outlined',
  },
}

export const IconButtonText: StoryObj<typeof IconButton> = {
  args: {
    children: <Add />,
    color: 'primary',
    variant: 'text',
  },
}

// Floating Action Button Stories
const FabMeta: Meta<typeof FloatingActionButton> = {
  title: 'UI/Button/FloatingActionButton',
  component: FloatingActionButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export const FabCircular: StoryObj<typeof FloatingActionButton> = {
  args: {
    children: <Add />,
    color: 'primary',
    variant: 'circular',
  },
}

export const FabExtended: StoryObj<typeof FloatingActionButton> = {
  args: {
    children: 'Add Item',
    color: 'primary',
    variant: 'extended',
  },
}

// All Variants Showcase
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '20px' }}>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <Button variant="contained" color="primary">Primary</Button>
        <Button variant="contained" color="secondary">Secondary</Button>
        <Button variant="contained" color="success">Success</Button>
        <Button variant="contained" color="error">Error</Button>
        <Button variant="contained" color="warning">Warning</Button>
        <Button variant="contained" color="info">Info</Button>
      </div>
      
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <Button variant="outlined" color="primary">Primary</Button>
        <Button variant="outlined" color="secondary">Secondary</Button>
        <Button variant="outlined" color="success">Success</Button>
        <Button variant="outlined" color="error">Error</Button>
        <Button variant="outlined" color="warning">Warning</Button>
        <Button variant="outlined" color="info">Info</Button>
      </div>
      
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <Button variant="text" color="primary">Primary</Button>
        <Button variant="text" color="secondary">Secondary</Button>
        <Button variant="text" color="success">Success</Button>
        <Button variant="text" color="error">Error</Button>
        <Button variant="text" color="warning">Warning</Button>
        <Button variant="text" color="info">Info</Button>
      </div>
    </div>
  ),
}
