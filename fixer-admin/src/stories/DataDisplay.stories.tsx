import type { Meta, StoryObj } from '@storybook/react'
import { 
  DataTable, 
  EnhancedList, 
  CustomAvatar, 
  CustomBadge, 
  CustomChip, 
  CustomTooltip, 
  CustomTypography 
} from '../components/ui/DataDisplay'
import { 
  Person, 
  Email, 
  Phone, 
  LocationOn, 
  Star, 
  CheckCircle, 
  Cancel, 
  Warning 
} from '@mui/icons-material'

const meta: Meta<typeof DataTable> = {
  title: 'UI/DataDisplay',
  component: DataTable,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A collection of data display components for showing information in various formats.',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

// Sample data for tables and lists
const sampleUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'Inactive' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'Moderator', status: 'Active' },
]

const sampleProducts = [
  { id: 1, name: 'Laptop', price: '$999', category: 'Electronics', stock: 15 },
  { id: 2, name: 'Mouse', price: '$29', category: 'Electronics', stock: 50 },
  { id: 3, name: 'Keyboard', price: '$79', category: 'Electronics', stock: 25 },
  { id: 4, name: 'Monitor', price: '$299', category: 'Electronics', stock: 8 },
]

// DataTable Stories
export const DataTableBasic: Story = {
  args: {
    columns: [
      { id: 'name', label: 'Name', minWidth: 170 },
      { id: 'email', label: 'Email', minWidth: 200 },
      { id: 'role', label: 'Role', minWidth: 100 },
      { id: 'status', label: 'Status', minWidth: 100 },
    ],
    rows: sampleUsers,
    title: 'Users Table',
  },
}

export const DataTableWithActions: Story = {
  args: {
    columns: [
      { id: 'name', label: 'Product', minWidth: 170 },
      { id: 'price', label: 'Price', minWidth: 100 },
      { id: 'category', label: 'Category', minWidth: 120 },
      { id: 'stock', label: 'Stock', minWidth: 100 },
    ],
    rows: sampleProducts,
    title: 'Products Table',
    actions: true,
  },
}

export const DataTableSortable: Story = {
  args: {
    columns: [
      { id: 'name', label: 'Name', minWidth: 170, sortable: true },
      { id: 'email', label: 'Email', minWidth: 200, sortable: true },
      { id: 'role', label: 'Role', minWidth: 100, sortable: true },
      { id: 'status', label: 'Status', minWidth: 100, sortable: true },
    ],
    rows: sampleUsers,
    title: 'Sortable Users Table',
    sortable: true,
  },
}

// EnhancedList Stories
const EnhancedListMeta: Meta<typeof EnhancedList> = {
  title: 'UI/DataDisplay/EnhancedList',
  component: EnhancedList,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export const EnhancedListBasic: StoryObj<typeof EnhancedList> = {
  args: {
    items: [
      { id: 1, primary: 'John Doe', secondary: 'john@example.com', icon: <Person /> },
      { id: 2, primary: 'Jane Smith', secondary: 'jane@example.com', icon: <Person /> },
      { id: 3, primary: 'Bob Johnson', secondary: 'bob@example.com', icon: <Person /> },
    ],
    title: 'User List',
  },
}

export const EnhancedListWithActions: StoryObj<typeof EnhancedList> = {
  args: {
    items: [
      { 
        id: 1, 
        primary: 'Product 1', 
        secondary: 'Description of product 1', 
        icon: <Star />,
        action: 'Edit'
      },
      { 
        id: 2, 
        primary: 'Product 2', 
        secondary: 'Description of product 2', 
        icon: <Star />,
        action: 'Edit'
      },
    ],
    title: 'Products List',
    showActions: true,
  },
}

// CustomAvatar Stories
const CustomAvatarMeta: Meta<typeof CustomAvatar> = {
  title: 'UI/DataDisplay/CustomAvatar',
  component: CustomAvatar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export const CustomAvatarBasic: StoryObj<typeof CustomAvatar> = {
  args: {
    src: 'https://via.placeholder.com/40x40/1976d2/ffffff?text=JD',
    alt: 'John Doe',
  },
}

export const CustomAvatarWithIcon: StoryObj<typeof CustomAvatar> = {
  args: {
    children: <Person />,
    color: 'primary',
  },
}

export const CustomAvatarWithText: StoryObj<typeof CustomAvatar> = {
  args: {
    children: 'AB',
    color: 'secondary',
  },
}

export const CustomAvatarSizes: StoryObj<typeof CustomAvatar> = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <CustomAvatar size="small" children="S" />
      <CustomAvatar size="medium" children="M" />
      <CustomAvatar size="large" children="L" />
    </div>
  ),
}

// CustomBadge Stories
const CustomBadgeMeta: Meta<typeof CustomBadge> = {
  title: 'UI/DataDisplay/CustomBadge',
  component: CustomBadge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export const CustomBadgeBasic: StoryObj<typeof CustomBadge> = {
  args: {
    badgeContent: 4,
    children: <Email />,
  },
}

export const CustomBadgeDot: StoryObj<typeof CustomBadge> = {
  args: {
    variant: 'dot',
    children: <Person />,
  },
}

export const CustomBadgeColors: StoryObj<typeof CustomBadge> = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <CustomBadge badgeContent={4} color="primary" children={<Email />} />
      <CustomBadge badgeContent={12} color="secondary" children={<Person />} />
      <CustomBadge badgeContent={99} color="error" children={<Star />} />
      <CustomBadge badgeContent={1000} color="warning" children={<Phone />} />
    </div>
  ),
}

// CustomChip Stories
const CustomChipMeta: Meta<typeof CustomChip> = {
  title: 'UI/DataDisplay/CustomChip',
  component: CustomChip,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export const CustomChipBasic: StoryObj<typeof CustomChip> = {
  args: {
    label: 'Basic Chip',
  },
}

export const CustomChipDeletable: StoryObj<typeof CustomChip> = {
  args: {
    label: 'Deletable Chip',
    onDelete: () => console.log('Deleted'),
  },
}

export const CustomChipColors: StoryObj<typeof CustomChip> = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <CustomChip label="Primary" color="primary" />
      <CustomChip label="Secondary" color="secondary" />
      <CustomChip label="Success" color="success" />
      <CustomChip label="Error" color="error" />
      <CustomChip label="Warning" color="warning" />
      <CustomChip label="Info" color="info" />
    </div>
  ),
}

export const CustomChipVariants: StoryObj<typeof CustomChip> = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <CustomChip label="Filled" variant="filled" />
      <CustomChip label="Outlined" variant="outlined" />
    </div>
  ),
}

// CustomTooltip Stories
const CustomTooltipMeta: Meta<typeof CustomTooltip> = {
  title: 'UI/DataDisplay/CustomTooltip',
  component: CustomTooltip,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export const CustomTooltipBasic: StoryObj<typeof CustomTooltip> = {
  args: {
    title: 'This is a tooltip',
    children: <button>Hover me</button>,
  },
}

export const CustomTooltipWithIcon: StoryObj<typeof CustomTooltip> = {
  args: {
    title: 'User information',
    children: <Person />,
  },
}

export const CustomTooltipPositions: StoryObj<typeof CustomTooltip> = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <CustomTooltip title="Top tooltip" placement="top">
        <button>Top</button>
      </CustomTooltip>
      <CustomTooltip title="Right tooltip" placement="right">
        <button>Right</button>
      </CustomTooltip>
      <CustomTooltip title="Bottom tooltip" placement="bottom">
        <button>Bottom</button>
      </CustomTooltip>
      <CustomTooltip title="Left tooltip" placement="left">
        <button>Left</button>
      </CustomTooltip>
    </div>
  ),
}

// CustomTypography Stories
const CustomTypographyMeta: Meta<typeof CustomTypography> = {
  title: 'UI/DataDisplay/CustomTypography',
  component: CustomTypography,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export const CustomTypographyBasic: StoryObj<typeof CustomTypography> = {
  args: {
    children: 'This is custom typography',
    variant: 'h4',
  },
}

export const CustomTypographyVariants: StoryObj<typeof CustomTypography> = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <CustomTypography variant="h1">Heading 1</CustomTypography>
      <CustomTypography variant="h2">Heading 2</CustomTypography>
      <CustomTypography variant="h3">Heading 3</CustomTypography>
      <CustomTypography variant="h4">Heading 4</CustomTypography>
      <CustomTypography variant="h5">Heading 5</CustomTypography>
      <CustomTypography variant="h6">Heading 6</CustomTypography>
      <CustomTypography variant="body1">Body 1 text</CustomTypography>
      <CustomTypography variant="body2">Body 2 text</CustomTypography>
      <CustomTypography variant="caption">Caption text</CustomTypography>
    </div>
  ),
}

export const CustomTypographyColors: StoryObj<typeof CustomTypography> = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <CustomTypography color="primary">Primary text</CustomTypography>
      <CustomTypography color="secondary">Secondary text</CustomTypography>
      <CustomTypography color="error">Error text</CustomTypography>
      <CustomTypography color="warning">Warning text</CustomTypography>
      <CustomTypography color="info">Info text</CustomTypography>
      <CustomTypography color="success">Success text</CustomTypography>
    </div>
  ),
}

// Complex Data Display Examples
export const UserProfileCard: Story = {
  render: () => (
    <div style={{ width: '300px', padding: '20px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
        <CustomAvatar 
          src="https://via.placeholder.com/60x60/1976d2/ffffff?text=JD" 
          size="large"
        />
        <div style={{ marginLeft: '12px' }}>
          <CustomTypography variant="h6">John Doe</CustomTypography>
          <CustomTypography variant="body2" color="text.secondary">
            Software Engineer
          </CustomTypography>
        </div>
      </div>
      
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
          <Email style={{ marginRight: '8px', fontSize: '16px' }} />
          <CustomTypography variant="body2">john@example.com</CustomTypography>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
          <Phone style={{ marginRight: '8px', fontSize: '16px' }} />
          <CustomTypography variant="body2">+1 (555) 123-4567</CustomTypography>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <LocationOn style={{ marginRight: '8px', fontSize: '16px' }} />
          <CustomTypography variant="body2">San Francisco, CA</CustomTypography>
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <CustomChip label="React" color="primary" size="small" />
        <CustomChip label="TypeScript" color="secondary" size="small" />
        <CustomChip label="Node.js" color="success" size="small" />
      </div>
    </div>
  ),
}

export const StatusDashboard: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', padding: '20px' }}>
      <div style={{ padding: '16px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
          <CheckCircle color="success" style={{ marginRight: '8px' }} />
          <CustomTypography variant="h6">Active Users</CustomTypography>
        </div>
        <CustomTypography variant="h4" color="success">1,234</CustomTypography>
        <CustomTypography variant="body2" color="text.secondary">
          +12% from last month
        </CustomTypography>
      </div>
      
      <div style={{ padding: '16px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
          <Warning color="warning" style={{ marginRight: '8px' }} />
          <CustomTypography variant="h6">Pending Orders</CustomTypography>
        </div>
        <CustomTypography variant="h4" color="warning">56</CustomTypography>
        <CustomTypography variant="body2" color="text.secondary">
          -5% from last week
        </CustomTypography>
      </div>
      
      <div style={{ padding: '16px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
          <Cancel color="error" style={{ marginRight: '8px' }} />
          <CustomTypography variant="h6">Failed Jobs</CustomTypography>
        </div>
        <CustomTypography variant="h4" color="error">3</CustomTypography>
        <CustomTypography variant="body2" color="text.secondary">
          -2 from yesterday
        </CustomTypography>
      </div>
    </div>
  ),
}
