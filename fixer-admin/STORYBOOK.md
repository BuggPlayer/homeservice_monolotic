# Storybook Documentation

This project uses Storybook to document and showcase all UI components. Storybook provides an isolated environment for developing and testing components.

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

Storybook has already been installed and configured. If you need to reinstall:

```bash
npm install
```

### Running Storybook

To start the Storybook development server:

```bash
npm run storybook
```

This will start Storybook on `http://localhost:6006` by default.

### Building Storybook

To build a static version of Storybook:

```bash
npm run build-storybook
```

The built files will be in the `storybook-static` directory.

## Component Documentation

### UI Components

Our Storybook includes comprehensive documentation for all UI components:

#### 1. Button Components (`/ui/Button`)
- **Button**: Primary button component with multiple variants
- **IconButton**: Button with icon support
- **FloatingActionButton**: Floating action button
- **ButtonGroup**: Group of buttons

**Variants**: `text`, `outlined`, `contained`, `gradient`
**Colors**: `primary`, `secondary`, `success`, `error`, `warning`, `info`
**Sizes**: `small`, `medium`, `large`

#### 2. Card Components (`/ui/Card`)
- **Card**: Basic card component
- **CardWithHeader**: Card with title and subtitle
- **CardWithMedia**: Card with image support
- **StatsCard**: Card for displaying statistics
- **InfoCard**: Card for informational content
- **CustomPaper**: Custom paper component

#### 3. Input Components (`/ui/Input`)
- **TextInput**: Text input with various configurations
- **SelectInput**: Dropdown select input
- **CheckboxInput**: Checkbox input
- **RadioInput**: Radio button input
- **SwitchInput**: Toggle switch input
- **SliderInput**: Range slider input
- **AutocompleteInput**: Autocomplete input
- **ChipInput**: Chip-based input

#### 4. Data Display Components (`/ui/DataDisplay`)
- **DataTable**: Table component with sorting and actions
- **EnhancedList**: List component with icons and actions
- **CustomAvatar**: Avatar component
- **CustomBadge**: Badge component
- **CustomChip**: Chip component
- **CustomTooltip**: Tooltip component
- **CustomTypography**: Typography component

#### 5. Feedback Components (`/ui/Feedback`)
- **CustomAlert**: Alert component for notifications
- **CustomSnackbar**: Snackbar for temporary messages
- **CustomDialog**: Modal dialog component
- **ConfirmationDialog**: Confirmation dialog
- **Loading**: Loading indicators
- **LoadingOverlay**: Loading overlay
- **CustomSkeleton**: Skeleton loading components
- **CustomStepper**: Step-by-step process component
- **CustomAccordion**: Collapsible content component
- **CustomTabs**: Tabbed content component

#### 6. Layout Components (`/ui/Layout`)
- **CustomContainer**: Container component
- **CustomGrid**: Grid layout component
- **CustomGrid2**: New Grid2 component
- **CustomStack**: Stack layout component
- **CustomBox**: Box component
- **CustomPaper**: Paper component
- **CustomDivider**: Divider component
- **CustomSpacer**: Spacer component
- **CustomHidden**: Responsive visibility component
- **Responsive**: Responsive utilities

#### 7. Utility Components (`/ui/Utility`)
- **SkeletonText**: Text skeleton loader
- **SkeletonRect**: Rectangular skeleton loader
- **SkeletonCircle**: Circular skeleton loader
- **FadeIn**: Fade in animation
- **GrowIn**: Grow in animation
- **SlideIn**: Slide in animation
- **ZoomIn**: Zoom in animation
- **CollapseIn**: Collapse in animation
- **EmptyState**: Empty state component
- **StatusChip**: Status indicator chip
- **CopyToClipboard**: Copy to clipboard utility

#### 8. Form Components (`/ui/Form`)
- **FormField**: Form field wrapper
- **CustomFormGroup**: Form group component
- **CustomFormControlLabel**: Form control label
- **CustomRadioGroup**: Radio button group
- **CustomCheckboxGroup**: Checkbox group
- **CustomSwitchGroup**: Switch group
- **CustomRating**: Rating component
- **CustomSlider**: Slider component
- **CustomAutocomplete**: Autocomplete component
- **CustomSelect**: Select component

## Storybook Features

### Addons

The following addons are configured:

- **@storybook/addon-essentials**: Core addons including controls, actions, docs, viewport, and backgrounds
- **@storybook/addon-controls**: Interactive controls for component props
- **@storybook/addon-actions**: Action logging for event handlers
- **@storybook/addon-viewport**: Viewport testing for responsive design
- **@storybook/addon-backgrounds**: Background color testing
- **@storybook/addon-toolbars**: Custom toolbar items
- **@storybook/addon-measure**: Measure elements
- **@storybook/addon-outline**: Outline elements for layout debugging

### Configuration

Storybook is configured with:

- **Material-UI Theme Provider**: All components are wrapped with Material-UI theme
- **TypeScript Support**: Full TypeScript support with proper type checking
- **Responsive Design**: Multiple viewport sizes for testing
- **Dark/Light Themes**: Background switching for theme testing
- **Auto-documentation**: Automatic prop documentation from TypeScript interfaces

### Viewport Testing

Pre-configured viewports:
- **Mobile**: 375x667px
- **Tablet**: 768x1024px
- **Desktop**: 1024x768px

### Background Testing

Pre-configured backgrounds:
- **Light**: #ffffff
- **Dark**: #333333
- **Paper**: #f5f5f5

## Usage Examples

### Basic Component Story

```typescript
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '../components/ui/button'

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
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
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    children: 'Primary Button',
    variant: 'contained',
  },
}
```

### Complex Story with State

```typescript
const InteractiveExample = () => {
  const [value, setValue] = useState(0)
  
  return (
    <div>
      <Button onClick={() => setValue(value + 1)}>
        Count: {value}
      </Button>
    </div>
  )
}

export const Interactive: Story = {
  render: () => <InteractiveExample />,
}
```

## Best Practices

### Story Organization

1. **Group by Feature**: Group related components together
2. **Use Descriptive Names**: Clear, descriptive story names
3. **Include Variants**: Show all component variants
4. **Add Interactions**: Include interactive examples
5. **Document Props**: Use argTypes for prop documentation

### Component Documentation

1. **Add JSDoc Comments**: Document component props and usage
2. **Include Examples**: Show real-world usage examples
3. **Add Descriptions**: Explain when and how to use components
4. **Show States**: Include loading, error, and disabled states

### Testing

1. **Visual Testing**: Use Storybook for visual regression testing
2. **Interaction Testing**: Test user interactions
3. **Accessibility Testing**: Ensure components are accessible
4. **Responsive Testing**: Test on different screen sizes

## Troubleshooting

### Common Issues

1. **Import Errors**: Ensure all imports are correct and components are exported
2. **Theme Issues**: Check that Material-UI theme is properly configured
3. **TypeScript Errors**: Verify prop types match component interfaces
4. **Build Errors**: Check for missing dependencies or configuration issues

### Getting Help

1. Check the Storybook documentation: https://storybook.js.org/docs
2. Review component source code for proper usage
3. Check the browser console for error messages
4. Verify all dependencies are installed correctly

## Contributing

When adding new components:

1. Create corresponding story files in `src/stories/`
2. Follow the existing naming conventions
3. Include comprehensive examples and variants
4. Add proper TypeScript types
5. Test all interactive features
6. Update this documentation

## Deployment

To deploy Storybook:

1. Build the static files: `npm run build-storybook`
2. Deploy the `storybook-static` directory to your hosting service
3. Configure your hosting service to serve the static files

For continuous deployment, consider using services like:
- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront
