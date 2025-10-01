# UI Components Library

A comprehensive collection of reusable Material-UI components for the Fixer Admin Panel.

## 📁 Component Structure

```
src/components/ui/
├── Button.tsx          # Button variants and interactions
├── Input.tsx           # Form input components
├── Card.tsx            # Card layouts and displays
├── DataDisplay.tsx     # Tables, lists, and data visualization
├── Feedback.tsx        # Alerts, dialogs, and user feedback
├── Navigation.tsx      # Navigation and routing components
├── Layout.tsx          # Layout and responsive components
├── Utility.tsx         # Utility and helper components
├── Form.tsx            # Form components and validation
├── index.ts            # Main export file
└── README.md           # This documentation
```

## 🚀 Quick Start

```tsx
import { Button, Card, TextInput, DataTable } from '@/components/ui'

function MyComponent() {
  return (
    <Card>
      <TextInput label="Name" placeholder="Enter your name" />
      <Button variant="contained" color="primary">
        Submit
      </Button>
    </Card>
  )
}
```

## 📦 Component Categories

### 1. Button Components (`Button.tsx`)

#### Button
```tsx
<Button
  variant="contained" // text | outlined | contained | gradient
  color="primary"     // primary | secondary | success | error | warning | info
  size="medium"       // small | medium | large
  loading={false}     // Show loading state
  leftIcon={<Icon />} // Icon before text
  rightIcon={<Icon />} // Icon after text
  disabled={false}
>
  Click me
</Button>
```

#### IconButton
```tsx
<IconButton
  color="primary"
  size="medium"
  variant="contained" // contained | outlined | text
  onClick={handleClick}
>
  <Icon />
</IconButton>
```

#### FloatingActionButton
```tsx
<FloatingActionButton
  color="primary"
  size="medium"
  variant="circular" // circular | extended
  onClick={handleClick}
>
  <Icon />
</FloatingActionButton>
```

### 2. Input Components (`Input.tsx`)

#### TextInput
```tsx
<TextInput
  label="Email"
  placeholder="Enter your email"
  type="email"
  required
  error={hasError}
  helperText="Enter a valid email address"
  leftIcon={<EmailIcon />}
  rightIcon={<CheckIcon />}
  fullWidth
/>
```

#### SelectInput
```tsx
<SelectInput
  label="Category"
  placeholder="Select a category"
  options={[
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' }
  ]}
  value={selectedValue}
  onChange={handleChange}
  multiple={false}
  fullWidth
/>
```

#### CheckboxInput
```tsx
<CheckboxInput
  label="I agree to terms"
  checked={agreed}
  onChange={handleChange}
  required
/>
```

#### SwitchInput
```tsx
<SwitchInput
  label="Enable notifications"
  checked={enabled}
  onChange={handleChange}
/>
```

#### SliderInput
```tsx
<SliderInput
  label="Price Range"
  value={priceRange}
  onChange={handleChange}
  min={0}
  max={1000}
  step={10}
  valueLabelDisplay="auto"
/>
```

#### AutocompleteInput
```tsx<AutocompleteInput
  label="Search"
  options={searchOptions}
  value={selectedValue}
  onChange={handleChange}
  getOptionLabel={(option) => option.name}
  isOptionEqualToValue={(option, value) => option.id === value.id}
  fullWidth
/>
```

#### ChipInput
```tsx
<ChipInput
  label="Tags"
  value={tags}
  onChange={setTags}
  options={['React', 'TypeScript', 'Material-UI']}
  placeholder="Add tags"
  maxChips={5}
  allowDuplicates={false}
/>
```

### 3. Card Components (`Card.tsx`)

#### Basic Card
```tsx
<Card variant="elevation" hover clickable>
  <CardContent>
    <Typography variant="h6">Card Title</Typography>
    <Typography variant="body2">Card content goes here</Typography>
  </CardContent>
</Card>
```

#### Card with Header
```tsx
<CardWithHeader
  title="Card Title"
  subtitle="Card subtitle"
  avatar={<Avatar>U</Avatar>}
  action={<IconButton><MoreIcon /></IconButton>}
>
  <CardContent>Content here</CardContent>
</CardWithHeader>
```

#### Stats Card
```tsx
<StatsCard
  title="Total Revenue"
  value="$12,345"
  subtitle="This month"
  icon={<TrendingUpIcon />}
  trend={{ value: 12.5, isPositive: true }}
  color="success"
/>
```

#### Info Card
```tsx
<InfoCard
  title="Information"
  description="This is an information card"
  icon={<InfoIcon />}
  action={<Button>Learn More</Button>}
  color="info"
>
  Additional content here
</InfoCard>
```

### 4. Data Display Components (`DataDisplay.tsx`)

#### Data Table
```tsx
<DataTable
  columns={[
    { id: 'name', label: 'Name', minWidth: 170 },
    { id: 'email', label: 'Email', minWidth: 200 },
    { id: 'status', label: 'Status', minWidth: 100 }
  ]}
  rows={tableData}
  pagination={{
    page: currentPage,
    rowsPerPage: rowsPerPage,
    totalRows: totalRows,
    onPageChange: handlePageChange,
    onRowsPerPageChange: handleRowsPerPageChange
  }}
  loading={isLoading}
  emptyMessage="No data available"
/>
```

#### Enhanced List
```tsx
<EnhancedList
  items={[
    {
      id: 1,
      primary: 'John Doe',
      secondary: 'john@example.com',
      icon: <PersonIcon />,
      avatar: '/avatar.jpg',
      action: <IconButton><MoreIcon /></IconButton>,
      onClick: handleItemClick
    }
  ]}
  subheader="Users"
  loading={isLoading}
  emptyMessage="No users found"
/>
```

#### Custom Avatar
```tsx
<CustomAvatar
  name="John Doe"
  size="large" // small | medium | large
  variant="circular" // circular | rounded | square
  color="primary"
  src="/avatar.jpg"
/>
```

#### Custom Badge
```tsx<CustomBadge
  badgeContent={4}
  color="primary"
  variant="standard" // standard | dot
  size="medium" // small | medium | large
>
  <IconButton>
    <NotificationsIcon />
  </IconButton>
</CustomBadge>
```

#### Custom Chip
```tsx
<CustomChip
  label="React"
  variant="filled" // filled | outlined
  color="primary"
  size="medium" // small | medium | large
  clickable
  deletable
  onDelete={handleDelete}
/>
```

### 5. Feedback Components (`Feedback.tsx`)

#### Alert
```tsx
<CustomAlert
  severity="success" // error | warning | info | success
  variant="filled" // filled | outlined | standard
  title="Success!"
  closable
  onClose={handleClose}
>
  Operation completed successfully
</CustomAlert>
```

#### Snackbar
```tsx
<CustomSnackbar
  message="Changes saved successfully"
  severity="success"
  open={snackbarOpen}
  onClose={handleClose}
  autoHideDuration={6000}
/>
```

#### Dialog
```tsx
<CustomDialog
  title="Confirm Action"
  content="Are you sure you want to proceed?"
  actions={
    <div>
      <Button onClick={handleCancel}>Cancel</Button>
      <Button onClick={handleConfirm} color="primary">Confirm</Button>
    </div>
  }
  open={dialogOpen}
  onClose={handleClose}
  maxWidth="sm"
  fullWidth
/>
```

#### Confirmation Dialog
```tsx
<ConfirmationDialog
  message="Are you sure you want to delete this item?"
  confirmText="Delete"
  cancelText="Cancel"
  onConfirm={handleConfirm}
  onCancel={handleCancel}
  open={dialogOpen}
  onClose={handleClose}
  loading={isDeleting}
/>
```

#### Loading Components
```tsx
<Loading size={40} color="primary" thickness={3.6} />

<LoadingOverlay open={isLoading} message="Loading data...">
  <CircularProgress />
</LoadingOverlay>
```

#### Skeleton
```tsx
<CustomSkeleton variant="text" width="100%" height={20} />
<CustomSkeleton variant="rectangular" width="100%" height={200} />
<CustomSkeleton variant="circular" width={40} height={40} />
```

### 6. Navigation Components (`Navigation.tsx`)

#### App Bar
```tsx
<CustomAppBar
  title="Admin Panel"
  logo={<Logo />}
  actions={<UserMenu />}
  position="fixed"
  elevation={1}
/>
```

#### Drawer
```tsx
<CustomDrawer
  open={drawerOpen}
  onClose={handleDrawerClose}
  variant="temporary"
  anchor="left"
  width={280}
>
  <NavigationList items={menuItems} />
</CustomDrawer>
```

#### Navigation List
```tsx
<NavigationList
  items={[
    {
      id: 1,
      label: 'Dashboard',
      icon: <DashboardIcon />,
      href: '/dashboard',
      active: true
    },
    {
      id: 2,
      label: 'Users',
      icon: <UsersIcon />,
      onClick: handleUsersClick,
      badge: '5'
    }
  ]}
  dense
  subheader="Main Menu"
/>
```

#### Breadcrumbs
```tsx
<CustomBreadcrumbs
  items={[
    { label: 'Home', href: '/' },
    { label: 'Users', href: '/users' },
    { label: 'Profile', active: true }
  ]}
  separator="/"
  maxItems={8}
/>
```

#### Pagination
```tsx
<CustomPagination
  page={currentPage}
  count={totalPages}
  onPageChange={handlePageChange}
  showFirstButton
  showLastButton
  size="medium"
  color="primary"
/>
```

### 7. Layout Components (`Layout.tsx`)

#### Container
```tsx
<CustomContainer maxWidth="lg" disableGutters={false}>
  <Typography variant="h4">Page Content</Typography>
</CustomContainer>
```

#### Grid
```tsx
<CustomGrid container spacing={2}>
  <CustomGrid item xs={12} md={6}>
    <Card>Content 1</Card>
  </CustomGrid>
  <CustomGrid item xs={12} md={6}>
    <Card>Content 2</Card>
  </CustomGrid>
</CustomGrid>
```

#### Stack
```tsx
<CustomStack
  direction="row"
  spacing={2}
  justifyContent="space-between"
  alignItems="center"
>
  <Typography variant="h6">Title</Typography>
  <Button>Action</Button>
</CustomStack>
```

#### Responsive
```tsx
<Responsive breakpoint="md" direction="up">
  <DesktopView />
</Responsive>

<Responsive breakpoint="md" direction="down" fallback={<MobileView />}>
  <DesktopView />
</Responsive>
```

### 8. Utility Components (`Utility.tsx`)

#### Empty State
```tsx
<EmptyState
  title="No data found"
  description="There are no items to display at the moment"
  icon={<InboxIcon />}
  action={<Button>Add Item</Button>}
  image="/empty-state.svg"
/>
```

#### Status Chip
```tsx
<StatusChip status="success" label="Active" />
<StatusChip status="error" label="Inactive" />
<StatusChip status="warning" label="Pending" />
```

#### Copy to Clipboard
```tsx
<CopyToClipboard text="Hello World" onCopy={handleCopy}>
  <Button>Copy Text</Button>
</CopyToClipboard>
```

#### Animations
```tsx
<FadeIn in={visible}>
  <Card>Fade in content</Card>
</FadeIn>

<GrowIn in={visible}>
  <Card>Grow in content</Card>
</GrowIn>

<SlideIn in={visible} direction="up">
  <Card>Slide in content</Card>
</SlideIn>
```

### 9. Form Components (`Form.tsx`)

#### Form Field
```tsx
<FormField
  label="Email"
  error={hasError}
  helperText="Enter a valid email"
  required
  fullWidth
>
  <TextInput
    type="email"
    value={email}
    onChange={handleChange}
  />
</FormField>
```

#### Radio Group
```tsx
<CustomRadioGroup
  options={[
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' }
  ]}
  value={selectedValue}
  onChange={handleChange}
  row
/>
```

#### Checkbox Group
```tsx
<CustomCheckboxGroup
  options={[
    { value: 'check1', label: 'Check 1' },
    { value: 'check2', label: 'Check 2' }
  ]}
  value={selectedValues}
  onChange={handleChange}
  row
/>
```

#### Rating
```tsx
<CustomRating
  label="Rating"
  value={rating}
  onChange={handleChange}
  precision={0.5}
  size="large"
/>
```

## 🎨 Theming

All components respect the Material-UI theme and can be customized using the theme provider:

```tsx
import { ThemeProvider } from '@mui/material/styles'
import { theme } from './theme'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <YourApp />
    </ThemeProvider>
  )
}
```

## 📱 Responsive Design

Components are built with responsive design in mind using Material-UI's breakpoint system:

```tsx
// Responsive grid
<CustomGrid container spacing={2}>
  <CustomGrid item xs={12} sm={6} md={4}>
    <Card>Mobile: 12, Tablet: 6, Desktop: 4</Card>
  </CustomGrid>
</CustomGrid>

// Responsive visibility
<Responsive breakpoint="md" direction="up">
  <DesktopOnlyComponent />
</Responsive>
```

## 🔧 Customization

All components accept standard Material-UI props and can be customized using the `sx` prop:

```tsx
<Button
  sx={{
    borderRadius: 2,
    textTransform: 'none',
    fontWeight: 600,
    '&:hover': {
      transform: 'translateY(-2px)',
    }
  }}
>
  Custom Button
</Button>
```

## 📚 Best Practices

1. **Consistent Spacing**: Use the theme's spacing system
2. **Accessibility**: Always provide proper labels and ARIA attributes
3. **Performance**: Use React.memo for expensive components
4. **TypeScript**: Leverage TypeScript for better development experience
5. **Testing**: Write unit tests for complex components

## 🚀 Examples

See the main admin panel pages for real-world usage examples:
- `src/pages/dashboard.tsx`
- `src/pages/products.tsx`
- `src/pages/users.tsx`
- `src/pages/service-requests.tsx`

## 🤝 Contributing

When adding new components:
1. Follow the existing naming conventions
2. Include TypeScript interfaces
3. Add comprehensive documentation
4. Include usage examples
5. Test responsiveness across breakpoints
