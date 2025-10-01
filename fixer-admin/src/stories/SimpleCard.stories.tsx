import type { Meta, StoryObj } from '@storybook/react'
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardActions, 
  CardMedia,
  Typography,
  Button,
  Avatar
} from '@mui/material'
import { Person, Star } from '@mui/icons-material'

const meta: Meta<typeof Card> = {
  title: 'UI/Simple Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['elevation', 'outlined'],
    },
    raised: {
      control: { type: 'boolean' },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Basic: Story = {
  render: () => (
    <Card sx={{ maxWidth: 345 }}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Basic Card
        </Typography>
        <Typography variant="body2" color="text.secondary">
          This is a basic card with some content. It can contain any type of content.
        </Typography>
      </CardContent>
    </Card>
  ),
}

export const WithHeader: Story = {
  render: () => (
    <Card sx={{ maxWidth: 345 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            <Person />
          </Avatar>
        }
        title="Card with Header"
        subheader="September 14, 2016"
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          This card has a header with an avatar, title, and subtitle.
        </Typography>
      </CardContent>
    </Card>
  ),
}

export const WithMedia: Story = {
  render: () => (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        component="img"
        height="140"
        image="https://via.placeholder.com/345x140"
        alt="Card image"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Card with Image
        </Typography>
        <Typography variant="body2" color="text.secondary">
          This card includes an image at the top.
        </Typography>
      </CardContent>
    </Card>
  ),
}

export const WithActions: Story = {
  render: () => (
    <Card sx={{ maxWidth: 345 }}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Card with Actions
        </Typography>
        <Typography variant="body2" color="text.secondary">
          This card has action buttons at the bottom.
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Share</Button>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  ),
}

export const Outlined: Story = {
  render: () => (
    <Card variant="outlined" sx={{ maxWidth: 345 }}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Outlined Card
        </Typography>
        <Typography variant="body2" color="text.secondary">
          This card uses the outlined variant.
        </Typography>
      </CardContent>
    </Card>
  ),
}

export const Raised: Story = {
  render: () => (
    <Card raised sx={{ maxWidth: 345 }}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Raised Card
        </Typography>
        <Typography variant="body2" color="text.secondary">
          This card has a raised appearance with more shadow.
        </Typography>
      </CardContent>
    </Card>
  ),
}

export const StatsCard: Story = {
  render: () => (
    <Card sx={{ maxWidth: 345, textAlign: 'center' }}>
      <CardContent>
        <Avatar sx={{ bgcolor: 'success.main', mx: 'auto', mb: 2 }}>
          <Star />
        </Avatar>
        <Typography variant="h4" component="div" color="primary">
          4.8
        </Typography>
        <Typography variant="h6" component="div" gutterBottom>
          Average Rating
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Based on 1,234 reviews
        </Typography>
      </CardContent>
    </Card>
  ),
}
