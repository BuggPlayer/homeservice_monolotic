import type { Meta, StoryObj } from '@storybook/react'
import { Button, Card, CardContent, Typography } from '@mui/material'

const meta: Meta<typeof Button> = {
  title: 'UI/Minimal',
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

export const CardExample: Story = {
  render: () => (
    <Card sx={{ maxWidth: 345 }}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Simple Card
        </Typography>
        <Typography variant="body2" color="text.secondary">
          This is a simple card example using Material-UI components.
        </Typography>
      </CardContent>
    </Card>
  ),
}
