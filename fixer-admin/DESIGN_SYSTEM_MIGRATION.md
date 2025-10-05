# Design System Migration Guide

## Overview

This guide outlines the migration from inconsistent UI components to a centralized design system. The new design system provides:

- **Consistent Design Tokens**: Standardized spacing, colors, typography, and other design values
- **Reusable Components**: Pre-built components with consistent styling and behavior
- **Better Maintainability**: Single source of truth for all design decisions
- **Improved Developer Experience**: Type-safe components with clear APIs

## Key Changes

### 1. Design Tokens

All design values are now centralized in `src/design-system/tokens.ts`:

```typescript
// Before: Inconsistent values across components
sx={{ borderRadius: 2, padding: 16, margin: 24 }}

// After: Consistent design tokens
import { spacing, borderRadius } from '@/design-system'
sx={{ borderRadius: borderRadius.md, padding: spacing.md, margin: spacing.lg }}
```

### 2. Button Components

**Before:**
```typescript
import { Button } from '@mui/material'

<Button 
  variant="contained" 
  sx={{ 
    textTransform: 'none', 
    fontWeight: 600, 
    borderRadius: 8 
  }}
>
  Click me
</Button>
```

**After:**
```typescript
import { Button } from '@/design-system'

<Button variant="contained" color="primary">
  Click me
</Button>
```

### 3. Card Components

**Before:**
```typescript
import { Card, CardContent } from '@mui/material'

<Card sx={{ borderRadius: 12, boxShadow: 2 }}>
  <CardContent sx={{ padding: 3 }}>
    Content
  </CardContent>
</Card>
```

**After:**
```typescript
import { Card, StatsCard, InfoCard } from '@/design-system'

<Card padding="lg">
  Content
</Card>

<StatsCard 
  title="Total Revenue" 
  value="$12,345" 
  trend={{ value: 12, isPositive: true }}
/>
```

### 4. Typography

**Before:**
```typescript
<Typography 
  variant="h6" 
  sx={{ fontWeight: 600, fontSize: '1.25rem' }}
>
  Title
</Typography>
```

**After:**
```typescript
import { Typography, Heading } from '@/design-system'

<Heading level={2}>Title</Heading>
<Typography variant="h6" weight="semibold">Subtitle</Typography>
```

## Migration Steps

### Step 1: Update Imports

Replace MUI component imports with design system imports:

```typescript
// Before
import { Button, Card, Typography } from '@mui/material'

// After
import { Button, Card, Typography } from '@/design-system'
```

### Step 2: Remove Custom Styling

Remove inline `sx` props that are now handled by the design system:

```typescript
// Before
<Button sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 8 }}>

// After
<Button> // Styling is now consistent by default
```

### Step 3: Use Design Tokens

Replace hardcoded values with design tokens:

```typescript
// Before
sx={{ padding: 16, margin: 24, borderRadius: 8 }}

// After
import { spacing, borderRadius } from '@/design-system'
sx={{ padding: spacing.md, margin: spacing.lg, borderRadius: borderRadius.md }}
```

### Step 4: Update Component Props

Use the new component APIs:

```typescript
// Before
<Card sx={{ padding: 3, hover: true }}>

// After
<Card padding="lg" hover={true}>
```

## Component Mapping

| Old Component | New Component | Notes |
|---------------|---------------|-------|
| `Button` (MUI) | `Button` (Design System) | Consistent styling, loading states |
| `Card` (MUI) | `Card`, `StatsCard`, `InfoCard` | Specialized card variants |
| `Typography` (MUI) | `Typography`, `Heading`, `Text` | Consistent typography scale |
| `Chip` (MUI) | `StatusBadge`, `PriorityBadge` | Status-specific variants |
| `TextField` (MUI) | `FormField`, `SearchField` | Enhanced form components |
| `Table` (MUI) | `DataTable` | Consistent table styling |

## Benefits

1. **Consistency**: All components follow the same design patterns
2. **Maintainability**: Changes to design tokens affect all components
3. **Performance**: Reduced bundle size through component reuse
4. **Developer Experience**: Better TypeScript support and documentation
5. **Accessibility**: Consistent accessibility patterns across components

## Best Practices

1. **Always use design system components** instead of raw MUI components
2. **Use design tokens** for spacing, colors, and other design values
3. **Follow the component APIs** - don't override with custom styling
4. **Use semantic component names** (e.g., `StatsCard` instead of generic `Card`)
5. **Leverage TypeScript** for better development experience

## Common Patterns

### Page Layout
```typescript
import { PageLayout, SectionLayout, GridLayout } from '@/design-system'

<PageLayout title="Dashboard" subtitle="Welcome back!">
  <SectionLayout title="Statistics">
    <GridLayout columns={4}>
      <StatsCard title="Revenue" value="$12,345" />
      <StatsCard title="Users" value="1,234" />
      <StatsCard title="Orders" value="89" />
      <StatsCard title="Providers" value="156" />
    </GridLayout>
  </SectionLayout>
</PageLayout>
```

### Form Layout
```typescript
import { FormField, SelectField, Button } from '@/design-system'

<FormField label="Name" placeholder="Enter name" />
<SelectField 
  label="Category" 
  options={categories} 
  placeholder="Select category" 
/>
<Button variant="contained">Save</Button>
```

### Data Display
```typescript
import { DataTable, StatusBadge, ActionButtonGroup } from '@/design-system'

<DataTable
  columns={[
    { id: 'name', label: 'Name' },
    { id: 'status', label: 'Status', format: (value) => <StatusBadge status={value} /> },
    { id: 'actions', label: 'Actions', format: (value) => <ActionButtonGroup actions={value} /> }
  ]}
  rows={data}
/>
```

## Troubleshooting

### Common Issues

1. **Import Errors**: Make sure to import from `@/design-system` instead of `@mui/material`
2. **Styling Overrides**: Avoid using `sx` props to override design system styling
3. **Missing Props**: Check the component documentation for available props
4. **Type Errors**: Ensure you're using the correct TypeScript interfaces

### Getting Help

1. Check the component documentation in `src/design-system/components/`
2. Review the design tokens in `src/design-system/tokens.ts`
3. Look at existing implementations in the codebase
4. Refer to this migration guide for common patterns

## Next Steps

1. **Audit existing components** for design system compliance
2. **Update component imports** throughout the application
3. **Remove custom styling** that's now handled by the design system
4. **Test components** to ensure they work as expected
5. **Document any customizations** that are still needed

This migration will result in a more consistent, maintainable, and scalable design system across the entire application.
