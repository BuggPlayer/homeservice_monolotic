import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '@mui/material'
import { Add, Save, Delete } from '@mui/icons-material'

const meta: Meta<typeof Button> = {
  title: 'UI/Simple Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['text', 'outlined', 'contained'],
    },
    color: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'success', 'error', 'warning', 'info'],
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
    disabled: {
      control: { type: 'boolean' },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    variant: 'contained',
    color: 'primary',
    children: 'Primary Button',
  },
}

export const Secondary: Story = {
  args: {
    variant: 'outlined',
    color: 'secondary',
    children: 'Secondary Button',
  },
}

export const WithIcon: Story = {
  args: {
    variant: 'contained',
    color: 'primary',
    startIcon: <Add />,
    children: 'Add Item',
  },
}

export const WithEndIcon: Story = {
  args: {
    variant: 'outlined',
    color: 'success',
    endIcon: <Save />,
    children: 'Save Changes',
  },
}

export const Error: Story = {
  args: {
    variant: 'contained',
    color: 'error',
    startIcon: <Delete />,
    children: 'Delete',
  },
}

export const Disabled: Story = {
  args: {
    variant: 'contained',
    color: 'primary',
    disabled: true,
    children: 'Disabled Button',
  },
}

export const Small: Story = {
  args: {
    variant: 'contained',
    color: 'primary',
    size: 'small',
    children: 'Small Button',
  },
}

export const Large: Story = {
  args: {
    variant: 'contained',
    color: 'primary',
    size: 'large',
    children: 'Large Button',
  },
}
