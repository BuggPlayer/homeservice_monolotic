import type { Meta, StoryObj } from '@storybook/react'
import { 
  SkeletonText, 
  SkeletonRect, 
  SkeletonCircle, 
  FadeIn, 
  GrowIn, 
  SlideIn, 
  ZoomIn, 
  CollapseIn, 
  EmptyState, 
  StatusChip, 
  CopyToClipboard 
} from '../components/ui/Utility'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { useState } from 'react'
import { 
  Search, 
  Add, 
  Refresh, 
  CheckCircle, 
  Error, 
  Warning, 
  Info 
} from '@mui/icons-material'

const meta: Meta<typeof SkeletonText> = {
  title: 'UI/Utility',
  component: SkeletonText,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A collection of utility components for loading states, animations, and common UI patterns.',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

// Skeleton Stories
export const SkeletonTextBasic: Story = {
  args: {
    width: 200,
  },
}

export const SkeletonRectBasic: Story = {
  args: {
    width: 200,
    height: 100,
  },
}

export const SkeletonCircleBasic: Story = {
  args: {
    width: 40,
    height: 40,
  },
}

export const SkeletonCard: Story = {
  render: () => (
    <Card style={{ width: '300px', padding: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
        <SkeletonCircle width={40} height={40} />
        <div style={{ marginLeft: '12px', flex: 1 }}>
          <SkeletonText width="60%" />
          <SkeletonText width="40%" />
        </div>
      </div>
      <SkeletonRect width="100%" height={100} />
      <div style={{ marginTop: '16px' }}>
        <SkeletonText width="80%" />
        <SkeletonText width="60%" />
      </div>
    </Card>
  ),
}

export const SkeletonList: Story = {
  render: () => (
    <div style={{ width: '400px' }}>
      {[1, 2, 3, 4, 5].map((item) => (
        <div key={item} style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
          <SkeletonCircle width={32} height={32} />
          <div style={{ marginLeft: '12px', flex: 1 }}>
            <SkeletonText width="70%" />
            <SkeletonText width="50%" />
          </div>
        </div>
      ))}
    </div>
  ),
}

// Animation Stories
const AnimationWrapper = ({ children, animation }: { children: React.ReactNode, animation: string }) => {
  const [show, setShow] = useState(false)
  
  return (
    <div style={{ textAlign: 'center' }}>
      <Button onClick={() => setShow(!show)} style={{ marginBottom: '20px' }}>
        {show ? 'Hide' : 'Show'} {animation}
      </Button>
      <div style={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {children}
      </div>
    </div>
  )
}

export const FadeInAnimation: Story = {
  render: () => (
    <AnimationWrapper animation="Fade In">
      <FadeIn in={true}>
        <Card style={{ padding: '20px', width: '200px' }}>
          <h3>Fade In</h3>
          <p>This content fades in smoothly.</p>
        </Card>
      </FadeIn>
    </AnimationWrapper>
  ),
}

export const GrowInAnimation: Story = {
  render: () => (
    <AnimationWrapper animation="Grow In">
      <GrowIn in={true}>
        <Card style={{ padding: '20px', width: '200px' }}>
          <h3>Grow In</h3>
          <p>This content grows in from the center.</p>
        </Card>
      </GrowIn>
    </AnimationWrapper>
  ),
}

export const SlideInAnimation: Story = {
  render: () => (
    <AnimationWrapper animation="Slide In">
      <SlideIn in={true} direction="up">
        <Card style={{ padding: '20px', width: '200px' }}>
          <h3>Slide In</h3>
          <p>This content slides in from below.</p>
        </Card>
      </SlideIn>
    </AnimationWrapper>
  ),
}

export const ZoomInAnimation: Story = {
  render: () => (
    <AnimationWrapper animation="Zoom In">
      <ZoomIn in={true}>
        <Card style={{ padding: '20px', width: '200px' }}>
          <h3>Zoom In</h3>
          <p>This content zooms in with scale effect.</p>
        </Card>
      </ZoomIn>
    </AnimationWrapper>
  ),
}

export const CollapseInAnimation: Story = {
  render: () => (
    <AnimationWrapper animation="Collapse In">
      <CollapseIn in={true}>
        <Card style={{ padding: '20px', width: '200px' }}>
          <h3>Collapse In</h3>
          <p>This content collapses in vertically.</p>
        </Card>
      </CollapseIn>
    </AnimationWrapper>
  ),
}

// Empty State Stories

export const EmptyStateBasic: StoryObj<typeof EmptyState> = {
  args: {
    icon: <Search />,
    title: 'No Results Found',
    description: 'Try adjusting your search criteria or filters.',
    action: <Button variant="contained">Clear Filters</Button>,
  },
}

export const EmptyStateNoAction: StoryObj<typeof EmptyState> = {
  args: {
    icon: <Add />,
    title: 'No Items Yet',
    description: 'Get started by creating your first item.',
  },
}

export const EmptyStateCustom: StoryObj<typeof EmptyState> = {
  args: {
    icon: <Refresh />,
    title: 'Something went wrong',
    description: 'We encountered an error while loading your data.',
    action: (
      <div style={{ display: 'flex', gap: '8px' }}>
        <Button variant="outlined">Cancel</Button>
        <Button variant="contained">Retry</Button>
      </div>
    ),
  },
}

// Status Chip Stories

export const StatusChipSuccess: StoryObj<typeof StatusChip> = {
  args: {
    status: 'success',
    label: 'Active',
  },
}

export const StatusChipError: StoryObj<typeof StatusChip> = {
  args: {
    status: 'error',
    label: 'Failed',
  },
}

export const StatusChipWarning: StoryObj<typeof StatusChip> = {
  args: {
    status: 'warning',
    label: 'Pending',
  },
}

export const StatusChipInfo: StoryObj<typeof StatusChip> = {
  args: {
    status: 'info',
    label: 'Processing',
  },
}

export const StatusChipNeutral: StoryObj<typeof StatusChip> = {
  args: {
    status: 'default',
    label: 'Draft',
  },
}

export const StatusChipWithIcon: StoryObj<typeof StatusChip> = {
  args: {
    status: 'success',
    label: 'Completed',
    icon: <CheckCircle />,
  },
}

export const StatusChipVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <StatusChip status="success" label="Success" />
      <StatusChip status="error" label="Error" />
      <StatusChip status="warning" label="Warning" />
      <StatusChip status="info" label="Info" />
      <StatusChip status="default" label="Neutral" />
    </div>
  ),
}

// Copy to Clipboard Stories

export const CopyToClipboardBasic: StoryObj<typeof CopyToClipboard> = {
  args: {
    text: 'Hello, World!',
    children: <Button>Copy Text</Button>,
  },
}

export const CopyToClipboardWithFeedback: StoryObj<typeof CopyToClipboard> = {
  args: {
    text: 'https://example.com/very-long-url-that-should-be-copied',
    children: <Button variant="outlined">Copy URL</Button>,
  },
}

export const CopyToClipboardCustomFeedback: StoryObj<typeof CopyToClipboard> = {
  args: {
    text: 'Custom feedback message',
    children: <Button variant="contained">Copy with Custom Feedback</Button>,
  },
}

// Complex Utility Examples
export const LoadingStates: Story = {
  render: () => {
    const [loading, setLoading] = useState(true)
    
    return (
      <div style={{ width: '400px' }}>
        <div style={{ marginBottom: '20px' }}>
          <Button onClick={() => setLoading(!loading)}>
            {loading ? 'Show Content' : 'Show Loading'}
          </Button>
        </div>
        
        {loading ? (
          <Card>
            <div style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                <SkeletonCircle width={40} height={40} />
                <div style={{ marginLeft: '12px', flex: 1 }}>
                  <SkeletonText width="60%" />
                  <SkeletonText width="40%" />
                </div>
              </div>
              <SkeletonRect width="100%" height={100} />
              <div style={{ marginTop: '16px' }}>
                <SkeletonText width="80%" />
                <SkeletonText width="60%" />
              </div>
            </div>
          </Card>
        ) : (
          <Card>
            <div style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '50%', 
                  backgroundColor: '#1976d2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold'
                }}>
                  JD
                </div>
                <div style={{ marginLeft: '12px' }}>
                  <h3 style={{ margin: 0 }}>John Doe</h3>
                  <p style={{ margin: 0, color: '#666' }}>Software Engineer</p>
                </div>
              </div>
              <div style={{ 
                height: '100px', 
                backgroundColor: '#f5f5f5', 
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#666'
              }}>
                Profile Image
              </div>
              <div style={{ marginTop: '16px' }}>
                <p>This is the actual content that loads after the skeleton.</p>
                <p>It shows how the skeleton matches the final layout.</p>
              </div>
            </div>
          </Card>
        )}
      </div>
    )
  },
}

export const AnimatedCard: Story = {
  render: () => {
    const [show, setShow] = useState(false)
    
    return (
      <div style={{ textAlign: 'center' }}>
        <Button 
          onClick={() => setShow(!show)} 
          style={{ marginBottom: '20px' }}
        >
          {show ? 'Hide' : 'Show'} Animated Card
        </Button>
        
        <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <FadeIn in={show}>
            <GrowIn in={show}>
              <Card style={{ padding: '20px', width: '250px' }}>
                <h3>Animated Card</h3>
                <p>This card combines multiple animations for a smooth effect.</p>
                <div style={{ marginTop: '16px' }}>
                  <Button size="small" variant="outlined">
                    Action
                  </Button>
                </div>
              </Card>
            </GrowIn>
          </FadeIn>
        </div>
      </div>
    )
  },
}

export const StatusDashboard: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', padding: '20px' }}>
      <Card>
        <div style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
            <CheckCircle color="success" style={{ marginRight: '8px' }} />
            <h4 style={{ margin: 0 }}>Active Users</h4>
          </div>
          <StatusChip status="success" label="1,234 Active" />
        </div>
      </Card>
      
      <Card>
        <div style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
            <Warning color="warning" style={{ marginRight: '8px' }} />
            <h4 style={{ margin: 0 }}>Pending Orders</h4>
          </div>
          <StatusChip status="warning" label="56 Pending" />
        </div>
      </Card>
      
      <Card>
        <div style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
            <Error color="error" style={{ marginRight: '8px' }} />
            <h4 style={{ margin: 0 }}>Failed Jobs</h4>
          </div>
          <StatusChip status="error" label="3 Failed" />
        </div>
      </Card>
      
      <Card>
        <div style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
            <Info color="info" style={{ marginRight: '8px' }} />
            <h4 style={{ margin: 0 }}>Processing</h4>
          </div>
          <StatusChip status="info" label="12 Processing" />
        </div>
      </Card>
    </div>
  ),
}
