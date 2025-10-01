import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '@mui/material'

const meta: Meta<typeof Button> = {
  title: 'UI/Working',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    variant: 'contained',
    color: 'primary',
    children: 'Click me',
  },
}

export const Secondary: Story = {
  args: {
    variant: 'outlined',
    color: 'secondary',
    children: 'Secondary Button',
  },
}
