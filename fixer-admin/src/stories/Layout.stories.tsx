import type { Meta, StoryObj } from '@storybook/react'
import { 
  CustomContainer, 
  CustomGrid, 
  CustomGrid2, 
  CustomStack, 
  CustomBox, 
  CustomPaper, 
  CustomDivider, 
  CustomSpacer, 
  CustomHidden, 
  useResponsive 
} from '../components/ui/Layout'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'

const meta: Meta<typeof CustomContainer> = {
  title: 'UI/Layout',
  component: CustomContainer,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A collection of layout components for structuring page content.',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

// Container Stories
export const ContainerBasic: Story = {
  args: {
    children: (
      <div style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '200px' }}>
        <h2>Container Content</h2>
        <p>This content is inside a container with default max width.</p>
      </div>
    ),
  },
}

export const ContainerMaxWidth: Story = {
  args: {
    maxWidth: 'sm',
    children: (
      <div style={{ padding: '20px', backgroundColor: '#e3f2fd', minHeight: '200px' }}>
        <h2>Small Container</h2>
        <p>This container has a small max width.</p>
      </div>
    ),
  },
}

export const ContainerFluid: Story = {
  args: {
    maxWidth: false,
    children: (
      <div style={{ padding: '20px', backgroundColor: '#f3e5f5', minHeight: '200px' }}>
        <h2>Fluid Container</h2>
        <p>This container takes full width without max width constraints.</p>
      </div>
    ),
  },
}

// Grid Stories

export const GridBasic: StoryObj<typeof CustomGrid> = {
  render: () => (
    <CustomContainer>
      <CustomGrid container spacing={2}>
        <CustomGrid item xs={12} sm={6} md={4}>
          <Card>
            <div style={{ padding: '16px' }}>
              <h3>Item 1</h3>
              <p>This is a grid item with responsive breakpoints.</p>
            </div>
          </Card>
        </CustomGrid>
        <CustomGrid item xs={12} sm={6} md={4}>
          <Card>
            <div style={{ padding: '16px' }}>
              <h3>Item 2</h3>
              <p>This is another grid item.</p>
            </div>
          </Card>
        </CustomGrid>
        <CustomGrid item xs={12} sm={6} md={4}>
          <Card>
            <div style={{ padding: '16px' }}>
              <h3>Item 3</h3>
              <p>This is the third grid item.</p>
            </div>
          </Card>
        </CustomGrid>
      </CustomGrid>
    </CustomContainer>
  ),
}

export const GridResponsive: StoryObj<typeof CustomGrid> = {
  render: () => (
    <CustomContainer>
      <h2>Responsive Grid</h2>
      <CustomGrid container spacing={3}>
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <CustomGrid key={item} item xs={12} sm={6} md={4} lg={3}>
            <Card>
              <div style={{ padding: '16px', textAlign: 'center' }}>
                <h3>Item {item}</h3>
                <p>xs=12, sm=6, md=4, lg=3</p>
              </div>
            </Card>
          </CustomGrid>
        ))}
      </CustomGrid>
    </CustomContainer>
  ),
}

// Grid2 Stories

export const Grid2Basic: StoryObj<typeof CustomGrid2> = {
  render: () => (
    <CustomContainer>
      <CustomGrid2 container spacing={2}>
        <CustomGrid2 xs={12} sm={6} md={4}>
          <Card>
            <div style={{ padding: '16px' }}>
              <h3>Grid2 Item 1</h3>
              <p>This uses the new Grid2 component.</p>
            </div>
          </Card>
        </CustomGrid2>
        <CustomGrid2 xs={12} sm={6} md={4}>
          <Card>
            <div style={{ padding: '16px' }}>
              <h3>Grid2 Item 2</h3>
              <p>Grid2 provides better performance.</p>
            </div>
          </Card>
        </CustomGrid2>
        <CustomGrid2 xs={12} sm={6} md={4}>
          <Card>
            <div style={{ padding: '16px' }}>
              <h3>Grid2 Item 3</h3>
              <p>Simplified API compared to Grid.</p>
            </div>
          </Card>
        </CustomGrid2>
      </CustomGrid2>
    </CustomContainer>
  ),
}

// Stack Stories

export const StackVertical: StoryObj<typeof CustomStack> = {
  args: {
    direction: 'column',
    spacing: 2,
    children: (
      <>
        <Button variant="contained">Button 1</Button>
        <Button variant="outlined">Button 2</Button>
        <Button variant="text">Button 3</Button>
      </>
    ),
  },
}

export const StackHorizontal: StoryObj<typeof CustomStack> = {
  args: {
    direction: 'row',
    spacing: 2,
    children: (
      <>
        <Button variant="contained">Button 1</Button>
        <Button variant="outlined">Button 2</Button>
        <Button variant="text">Button 3</Button>
      </>
    ),
  },
}

export const StackWrap: StoryObj<typeof CustomStack> = {
  args: {
    direction: 'row',
    spacing: 2,
    flexWrap: 'wrap',
    children: (
      <>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
          <Button key={item} variant="outlined" size="small">
            Item {item}
          </Button>
        ))}
      </>
    ),
  },
}

// Box Stories

export const BoxBasic: StoryObj<typeof CustomBox> = {
  args: {
    sx: {
      width: 200,
      height: 100,
      backgroundColor: 'primary.main',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 1,
    },
    children: 'Custom Box',
  },
}

export const BoxResponsive: StoryObj<typeof CustomBox> = {
  args: {
    sx: {
      width: { xs: '100%', sm: '50%', md: '33%' },
      height: 100,
      backgroundColor: 'secondary.main',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 1,
    },
    children: 'Responsive Box',
  },
}

// Paper Stories

export const PaperBasic: StoryObj<typeof CustomPaper> = {
  args: {
    elevation: 2,
    sx: { p: 2 },
    children: 'This is a paper component with elevation.',
  },
}

export const PaperVariants: StoryObj<typeof CustomPaper> = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px' }}>
      <CustomPaper variant="elevation" sx={{ p: 2, width: 150 }}>
        <h4>Elevation</h4>
        <p>Paper with elevation</p>
      </CustomPaper>
      <CustomPaper variant="outlined" sx={{ p: 2, width: 150 }}>
        <h4>Outlined</h4>
        <p>Paper with border</p>
      </CustomPaper>
      <CustomPaper variant="filled" sx={{ p: 2, width: 150 }}>
        <h4>Filled</h4>
        <p>Paper with background</p>
      </CustomPaper>
    </div>
  ),
}

// Divider Stories

export const DividerBasic: StoryObj<typeof CustomDivider> = {
  args: {
    children: 'Divider with text',
  },
}

export const DividerVariants: StoryObj<typeof CustomDivider> = {
  render: () => (
    <div style={{ width: '300px' }}>
      <p>Content above</p>
      <CustomDivider />
      <p>Content below</p>
      <CustomDivider variant="middle">OR</CustomDivider>
      <p>More content</p>
      <CustomDivider variant="inset" />
      <p>Final content</p>
    </div>
  ),
}

// Spacer Stories

export const SpacerBasic: StoryObj<typeof CustomSpacer> = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '200px' }}>
      <div style={{ backgroundColor: 'lightblue', padding: '8px' }}>Top content</div>
      <CustomSpacer />
      <div style={{ backgroundColor: 'lightgreen', padding: '8px' }}>Bottom content</div>
    </div>
  ),
}

// Hidden Stories

export const HiddenResponsive: StoryObj<typeof CustomHidden> = {
  render: () => (
    <div>
      <div style={{ padding: '8px', backgroundColor: 'lightblue' }}>
        This content is always visible
      </div>
      <CustomHidden smDown>
        <div style={{ padding: '8px', backgroundColor: 'lightcoral' }}>
          Hidden on small screens and down
        </div>
      </CustomHidden>
      <CustomHidden mdUp>
        <div style={{ padding: '8px', backgroundColor: 'lightgreen' }}>
          Hidden on medium screens and up
        </div>
      </CustomHidden>
    </div>
  ),
}

// Responsive Hook Example
const ResponsiveExample = () => {
  const isMobile = useResponsive('sm', 'down')
  const isTablet = useResponsive('md', 'only')
  const isDesktop = useResponsive('md', 'up')
  
  return (
    <div style={{ padding: '20px' }}>
      <h3>Responsive Breakpoint Detection</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ 
          padding: '8px', 
          backgroundColor: isMobile ? 'lightcoral' : 'lightgray',
          borderRadius: '4px'
        }}>
          Mobile: {isMobile ? 'Yes' : 'No'}
        </div>
        <div style={{ 
          padding: '8px', 
          backgroundColor: isTablet ? 'lightblue' : 'lightgray',
          borderRadius: '4px'
        }}>
          Tablet: {isTablet ? 'Yes' : 'No'}
        </div>
        <div style={{ 
          padding: '8px', 
          backgroundColor: isDesktop ? 'lightgreen' : 'lightgray',
          borderRadius: '4px'
        }}>
          Desktop: {isDesktop ? 'Yes' : 'No'}
        </div>
      </div>
    </div>
  )
}

export const ResponsiveHook: Story = {
  render: () => <ResponsiveExample />,
}

// Complex Layout Examples
export const DashboardLayout: Story = {
  render: () => (
    <CustomContainer maxWidth="xl">
      <CustomBox sx={{ mb: 3 }}>
        <h1>Dashboard Layout</h1>
        <CustomDivider />
      </CustomBox>
      
      <CustomGrid container spacing={3}>
        <CustomGrid item xs={12} md={8}>
          <CustomStack spacing={2}>
            <Card>
              <div style={{ padding: '20px' }}>
                <h3>Main Content Area</h3>
                <p>This is the main content area that takes up most of the space.</p>
              </div>
            </Card>
            <Card>
              <div style={{ padding: '20px' }}>
                <h3>Secondary Content</h3>
                <p>Additional content goes here.</p>
              </div>
            </Card>
          </CustomStack>
        </CustomGrid>
        
        <CustomGrid item xs={12} md={4}>
          <CustomStack spacing={2}>
            <Card>
              <div style={{ padding: '20px' }}>
                <h3>Sidebar</h3>
                <p>Sidebar content goes here.</p>
              </div>
            </Card>
            <Card>
              <div style={{ padding: '20px' }}>
                <h3>Widget</h3>
                <p>Widget content goes here.</p>
              </div>
            </Card>
          </CustomStack>
        </CustomGrid>
      </CustomGrid>
    </CustomContainer>
  ),
}

export const CardGridLayout: Story = {
  render: () => (
    <CustomContainer>
      <h2>Card Grid Layout</h2>
      <CustomGrid2 container spacing={2}>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
          <CustomGrid2 key={item} xs={12} sm={6} md={4} lg={3}>
            <Card>
              <div style={{ padding: '16px' }}>
                <h3>Card {item}</h3>
                <p>This is card number {item} in the grid.</p>
                <Button size="small" variant="outlined">
                  Action
                </Button>
              </div>
            </Card>
          </CustomGrid2>
        ))}
      </CustomGrid2>
    </CustomContainer>
  ),
}
