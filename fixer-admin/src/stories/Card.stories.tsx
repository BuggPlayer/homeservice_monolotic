import type { Meta, StoryObj } from '@storybook/react'
import { 
  Card, 
  CardWithHeader, 
  CardWithMedia, 
  StatsCard, 
  InfoCard, 
  CustomPaper 
} from '../components/ui/card'
import { CardContent, CardActions, CardHeader } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { 
  TrendingUp, 
  People, 
  AttachMoney, 
  ShoppingCart,
  Info,
  Star,
  Settings
} from '@mui/icons-material'

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A collection of card components for displaying content in various layouts.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['elevation', 'outlined', 'filled'],
      description: 'The variant of the card',
    },
    hover: {
      control: { type: 'boolean' },
      description: 'Whether the card should have hover effects',
    },
    clickable: {
      control: { type: 'boolean' },
      description: 'Whether the card should be clickable',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Basic Card Stories
export const Basic: Story = {
  args: {
    children: (
      <CardContent>
        <h3>Basic Card</h3>
        <p>This is a basic card with some content.</p>
      </CardContent>
    ),
  },
}

export const Outlined: Story = {
  args: {
    variant: 'outlined',
    children: (
      <CardContent>
        <h3>Outlined Card</h3>
        <p>This card has an outlined border.</p>
      </CardContent>
    ),
  },
}

export const Filled: Story = {
  args: {
    variant: 'filled',
    children: (
      <CardContent>
        <h3>Filled Card</h3>
        <p>This card has a filled background.</p>
      </CardContent>
    ),
  },
}

export const Clickable: Story = {
  args: {
    clickable: true,
    children: (
      <CardContent>
        <h3>Clickable Card</h3>
        <p>This card is clickable and has hover effects.</p>
      </CardContent>
    ),
  },
}

export const NoHover: Story = {
  args: {
    hover: false,
    children: (
      <CardContent>
        <h3>No Hover Card</h3>
        <p>This card doesn't have hover effects.</p>
      </CardContent>
    ),
  },
}

// Card with Header
const CardWithHeaderMeta: Meta<typeof CardWithHeader> = {
  title: 'UI/Card/CardWithHeader',
  component: CardWithHeader,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export const WithHeader: StoryObj<typeof CardWithHeader> = {
  args: {
    title: 'Card Title',
    subtitle: 'Card subtitle with additional information',
    children: (
      <CardContent>
        <p>This card includes a header with title and subtitle.</p>
      </CardContent>
    ),
  },
}

export const WithHeaderAndAction: StoryObj<typeof CardWithHeader> = {
  args: {
    title: 'Card with Action',
    subtitle: 'This card has an action button',
    action: <Button size="small">Action</Button>,
    children: (
      <CardContent>
        <p>This card includes a header with an action button.</p>
      </CardContent>
    ),
  },
}

export const WithAvatar: StoryObj<typeof CardWithHeader> = {
  args: {
    title: 'User Profile',
    subtitle: 'john.doe@example.com',
    avatar: <People />,
    children: (
      <CardContent>
        <p>This card includes an avatar in the header.</p>
      </CardContent>
    ),
  },
}

// Card with Media
const CardWithMediaMeta: Meta<typeof CardWithMedia> = {
  title: 'UI/Card/CardWithMedia',
  component: CardWithMedia,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export const WithImage: StoryObj<typeof CardWithMedia> = {
  args: {
    image: 'https://via.placeholder.com/400x200/1976d2/ffffff?text=Sample+Image',
    alt: 'Sample image',
    children: (
      <CardContent>
        <h3>Card with Image</h3>
        <p>This card includes a media image at the top.</p>
      </CardContent>
    ),
  },
}

export const WithImageAndActions: StoryObj<typeof CardWithMedia> = {
  args: {
    image: 'https://via.placeholder.com/400x200/dc004e/ffffff?text=Product+Image',
    alt: 'Product image',
    children: (
      <>
        <CardContent>
          <h3>Product Card</h3>
          <p>This is a product card with image and actions.</p>
        </CardContent>
        <CardActions>
          <Button size="small">Add to Cart</Button>
          <Button size="small" variant="outlined">View Details</Button>
        </CardActions>
      </>
    ),
  },
}

// Stats Card
const StatsCardMeta: Meta<typeof StatsCard> = {
  title: 'UI/Card/StatsCard',
  component: StatsCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export const StatsCardBasic: StoryObj<typeof StatsCard> = {
  args: {
    title: 'Total Sales',
    value: '$12,345',
    subtitle: 'This month',
    icon: <AttachMoney />,
    color: 'success',
  },
}

export const StatsCardWithTrend: StoryObj<typeof StatsCard> = {
  args: {
    title: 'Active Users',
    value: '1,234',
    subtitle: 'Currently online',
    icon: <People />,
    trend: {
      value: 12.5,
      isPositive: true,
    },
    color: 'primary',
  },
}

export const StatsCardNegativeTrend: StoryObj<typeof StatsCard> = {
  args: {
    title: 'Bounce Rate',
    value: '45%',
    subtitle: 'Page visits',
    icon: <TrendingUp />,
    trend: {
      value: 5.2,
      isPositive: false,
    },
    color: 'error',
  },
}

// Info Card
const InfoCardMeta: Meta<typeof InfoCard> = {
  title: 'UI/Card/InfoCard',
  component: InfoCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export const InfoCardBasic: StoryObj<typeof InfoCard> = {
  args: {
    title: 'Information',
    description: 'This is an informational card with a description.',
    icon: <Info />,
    color: 'info',
  },
}

export const InfoCardWithAction: StoryObj<typeof InfoCard> = {
  args: {
    title: 'Settings',
    description: 'Configure your application settings.',
    icon: <Settings />,
    action: <Button size="small">Configure</Button>,
    color: 'primary',
  },
}

export const InfoCardWithChildren: StoryObj<typeof InfoCard> = {
  args: {
    title: 'Product Details',
    description: 'Manage your product information.',
    icon: <ShoppingCart />,
    color: 'secondary',
    children: (
      <div style={{ marginTop: '16px' }}>
        <Button size="small" variant="outlined" style={{ marginRight: '8px' }}>
          Edit
        </Button>
        <Button size="small" variant="outlined">
          Preview
        </Button>
      </div>
    ),
  },
}

// Custom Paper
const CustomPaperMeta: Meta<typeof CustomPaper> = {
  title: 'UI/Card/CustomPaper',
  component: CustomPaper,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export const PaperBasic: StoryObj<typeof CustomPaper> = {
  args: {
    children: (
      <div>
        <h3>Custom Paper</h3>
        <p>This is a custom paper component with padding.</p>
      </div>
    ),
  },
}

export const PaperOutlined: StoryObj<typeof CustomPaper> = {
  args: {
    variant: 'outlined',
    children: (
      <div>
        <h3>Outlined Paper</h3>
        <p>This paper has an outlined border.</p>
      </div>
    ),
  },
}

export const PaperFilled: StoryObj<typeof CustomPaper> = {
  args: {
    variant: 'filled',
    children: (
      <div>
        <h3>Filled Paper</h3>
        <p>This paper has a filled background.</p>
      </div>
    ),
  },
}

// Complex Card Examples
export const ComplexCard: Story = {
  render: () => (
    <Card style={{ maxWidth: 400 }}>
      <CardHeader
        title="User Profile"
        subheader="Software Engineer"
        avatar={<People />}
        action={<Button size="small">Edit</Button>}
      />
      <CardContent>
        <p>
          This is a complex card example with header, content, and actions.
          It demonstrates how multiple card components can be combined.
        </p>
      </CardContent>
      <CardActions>
        <Button size="small">View Profile</Button>
        <Button size="small" variant="outlined">Message</Button>
      </CardActions>
    </Card>
  ),
}

// Card Grid Layout
export const CardGrid: Story = {
  render: () => (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
      gap: '16px',
      padding: '20px'
    }}>
      <StatsCard
        title="Revenue"
        value="$45,678"
        subtitle="This month"
        icon={<AttachMoney />}
        color="success"
        trend={{ value: 8.2, isPositive: true }}
      />
      <StatsCard
        title="Users"
        value="2,456"
        subtitle="Active users"
        icon={<People />}
        color="primary"
        trend={{ value: 3.1, isPositive: true }}
      />
      <StatsCard
        title="Orders"
        value="1,234"
        subtitle="This week"
        icon={<ShoppingCart />}
        color="info"
        trend={{ value: 2.5, isPositive: false }}
      />
    </div>
  ),
}
