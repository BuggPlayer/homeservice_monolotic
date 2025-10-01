import type { Meta, StoryObj } from '@storybook/react'
import { 
  Container as MuiContainer,
  Grid,
  Stack,
  Box,
  Paper,
  Typography,
  Button,
  Card,
  CardContent
} from '@mui/material'

const meta: Meta<typeof MuiContainer> = {
  title: 'UI/Simple Layout',
  component: MuiContainer,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Container: Story = {
  render: () => (
    <MuiContainer maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Container Layout
      </Typography>
      <Typography variant="body1">
        This content is inside a container with max width of 'lg'.
      </Typography>
    </MuiContainer>
  ),
}

export const GridLayout: Story = {
  render: () => (
    <MuiContainer maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Grid Layout
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Card 1</Typography>
              <Typography variant="body2">
                This is the first card in the grid.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Card 2</Typography>
              <Typography variant="body2">
                This is the second card in the grid.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Card 3</Typography>
              <Typography variant="body2">
                This is the third card in the grid.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </MuiContainer>
  ),
}

export const StackLayout: Story = {
  render: () => (
    <MuiContainer maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Stack Layout
      </Typography>
      <Stack spacing={2}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">Item 1</Typography>
          <Typography variant="body2">
            First item in the stack with spacing.
          </Typography>
        </Paper>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">Item 2</Typography>
          <Typography variant="body2">
            Second item in the stack with spacing.
          </Typography>
        </Paper>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">Item 3</Typography>
          <Typography variant="body2">
            Third item in the stack with spacing.
          </Typography>
        </Paper>
      </Stack>
    </MuiContainer>
  ),
}

export const BoxLayout: Story = {
  render: () => (
    <MuiContainer maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Box Layout
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          p: 2,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
        }}
      >
        <Typography variant="h6">Box Container</Typography>
        <Typography variant="body2">
          This content is inside a Box component with custom styling.
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="contained">Action 1</Button>
          <Button variant="outlined">Action 2</Button>
        </Box>
      </Box>
    </MuiContainer>
  ),
}

export const PaperLayout: Story = {
  render: () => (
    <MuiContainer maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Paper Layout
      </Typography>
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Paper Component
        </Typography>
        <Typography variant="body1" paragraph>
          This content is inside a Paper component with elevation.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Paper components provide a surface for other components to be placed on.
        </Typography>
      </Paper>
    </MuiContainer>
  ),
}

export const ResponsiveGrid: Story = {
  render: () => (
    <MuiContainer maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Responsive Grid
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" color="primary">
                Small Card
              </Typography>
              <Typography variant="body2">
                xs=12, sm=6, md=3
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" color="secondary">
                Small Card
              </Typography>
              <Typography variant="body2">
                xs=12, sm=6, md=3
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" color="success.main">
                Small Card
              </Typography>
              <Typography variant="body2">
                xs=12, sm=6, md=3
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" color="error.main">
                Small Card
              </Typography>
              <Typography variant="body2">
                xs=12, sm=6, md=3
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </MuiContainer>
  ),
}
