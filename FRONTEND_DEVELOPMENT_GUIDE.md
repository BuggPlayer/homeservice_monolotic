# 🎨 Fixer Marketplace - Frontend Development Guide

This comprehensive guide covers frontend development for the Fixer Marketplace admin dashboard and customer interface.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Development Setup](#development-setup)
- [Component Architecture](#component-architecture)
- [State Management](#state-management)
- [API Integration](#api-integration)
- [Styling and Theming](#styling-and-theming)
- [Routing and Navigation](#routing-and-navigation)
- [Form Handling](#form-handling)
- [Error Handling](#error-handling)
- [Testing](#testing)
- [Performance Optimization](#performance-optimization)
- [Deployment](#deployment)
- [Best Practices](#best-practices)

## 🎯 Project Overview

The Fixer Marketplace frontend is a React-based admin dashboard that provides comprehensive management tools for the home services platform. It includes:

- **Admin Dashboard**: Complete platform management
- **User Management**: Customer and provider management
- **Service Management**: Service requests and bookings
- **Product Management**: E-commerce functionality
- **Analytics**: Reporting and insights
- **Real-time Features**: Chat and notifications

## 🛠️ Technology Stack

### Core Technologies
- **React 19.1.1** - UI framework
- **TypeScript 4.9.5** - Type safety
- **Redux Toolkit 2.9.0** - State management
- **React Router 7.9.3** - Routing
- **Material-UI 7.3.2** - UI component library

### Development Tools
- **Create React App** - Build tooling
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Jest** - Testing framework
- **Storybook** - Component development

### Additional Libraries
- **Axios** - HTTP client
- **React Query** - Data fetching
- **React Hook Form** - Form handling
- **Date-fns** - Date manipulation
- **Recharts** - Data visualization

## 📁 Project Structure

```
fixer-admin/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable components
│   │   ├── auth/          # Authentication components
│   │   ├── common/        # Shared components
│   │   ├── forms/         # Form components
│   │   ├── layout/        # Layout components
│   │   ├── orders/        # Order-specific components
│   │   ├── products/      # Product components
│   │   ├── providers/     # Provider components
│   │   └── ui/            # Base UI components
│   ├── contexts/          # React contexts
│   ├── hooks/             # Custom hooks
│   ├── pages/             # Page components
│   ├── services/          # API services
│   ├── store/             # Redux store
│   ├── types/             # TypeScript types
│   ├── utils/             # Utility functions
│   ├── theme/             # Theme configuration
│   └── App.tsx            # Main app component
├── package.json
├── tsconfig.json
└── README.md
```

## 🚀 Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Installation
```bash
# Clone repository
git clone <repository-url>
cd fixer-admin

# Install dependencies
npm install

# Start development server
npm start
```

### Environment Configuration
Create `.env` file:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_WS_URL=ws://localhost:5000
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...
REACT_APP_RAZORPAY_KEY_ID=rzp_test_...
REACT_APP_DEBUG=true
```

## 🏗️ Component Architecture

### Component Hierarchy

```
App
├── ThemeProvider
├── DataProvider
├── Router
│   ├── ProtectedRoute
│   └── MainLayout
│       ├── Header
│       ├── Sidebar
│       └── Main Content
│           ├── Dashboard
│           ├── Products
│           ├── Users
│           └── ...
├── ToastProvider
└── LoadingProvider
```

### Component Types

#### 1. Layout Components
```typescript
// MainLayout.tsx
interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  return (
    <Box sx={{ display: 'flex' }}>
      <Header onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {children}
      </Box>
    </Box>
  );
}
```

#### 2. Page Components
```typescript
// Products.tsx
export function Products() {
  const { data: products, loading, error } = useProducts();
  const [filters, setFilters] = useState<ProductFilters>({});
  
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return (
    <Box>
      <PageHeader title="Products" />
      <ProductFilters filters={filters} onChange={setFilters} />
      <ProductTable products={products} />
    </Box>
  );
}
```

#### 3. Form Components
```typescript
// AddProductForm.tsx
interface AddProductFormProps {
  onSubmit: (data: CreateProductRequest) => void;
  loading?: boolean;
}

export function AddProductForm({ onSubmit, loading }: AddProductFormProps) {
  const { control, handleSubmit, formState: { errors } } = useForm<CreateProductRequest>();
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormField
        name="name"
        control={control}
        label="Product Name"
        rules={{ required: 'Name is required' }}
        error={errors.name?.message}
      />
      <FormField
        name="price"
        control={control}
        label="Price"
        type="number"
        rules={{ required: 'Price is required', min: 0 }}
        error={errors.price?.message}
      />
      <Button type="submit" loading={loading}>
        Add Product
      </Button>
    </form>
  );
}
```

#### 4. UI Components
```typescript
// Button.tsx
interface ButtonProps {
  variant?: 'contained' | 'outlined' | 'text';
  color?: 'primary' | 'secondary' | 'error';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

export function Button({ 
  variant = 'contained', 
  color = 'primary', 
  size = 'medium',
  loading = false,
  children,
  onClick 
}: ButtonProps) {
  return (
    <MuiButton
      variant={variant}
      color={color}
      size={size}
      disabled={loading}
      onClick={onClick}
      startIcon={loading ? <CircularProgress size={16} /> : undefined}
    >
      {children}
    </MuiButton>
  );
}
```

## 🔄 State Management

### Redux Store Structure

```typescript
// store/index.ts
export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    ui: uiSlice.reducer,
    data: dataSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### Auth Slice
```typescript
// store/slices/authSlice.ts
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  } as AuthState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});
```

### Data Slice
```typescript
// store/slices/dataSlice.ts
interface DataState {
  products: Product[];
  users: User[];
  serviceRequests: ServiceRequest[];
  loading: boolean;
  error: string | null;
}

const dataSlice = createSlice({
  name: 'data',
  initialState: {
    products: [],
    users: [],
    serviceRequests: [],
    loading: false,
    error: null,
  } as DataState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    },
    addProduct: (state, action: PayloadAction<Product>) => {
      state.products.push(action.payload);
    },
    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.products.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.products[index] = action.payload;
      }
    },
    deleteProduct: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter(p => p.id !== action.payload);
    },
  },
});
```

### Custom Hooks
```typescript
// hooks/useAuth.ts
export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, loading, error } = useAppSelector(state => state.auth);
  
  const login = useCallback(async (credentials: LoginRequest) => {
    try {
      dispatch(loginStart());
      const response = await authService.login(credentials);
      dispatch(loginSuccess(response.user));
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
    } catch (error) {
      dispatch(loginFailure(error.message));
      throw error;
    }
  }, [dispatch]);
  
  const logout = useCallback(() => {
    dispatch(logout());
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }, [dispatch]);
  
  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
  };
}
```

## 🌐 API Integration

### API Client Setup
```typescript
// services/apiClient.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 10000,
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Try to refresh token
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const response = await authService.refreshToken({ refreshToken });
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('refreshToken', response.refreshToken);
          
          // Retry original request
          return apiClient.request(error.config);
        } catch (refreshError) {
          // Redirect to login
          window.location.href = '/auth';
        }
      }
    }
    return Promise.reject(error);
  }
);
```

### Service Layer
```typescript
// services/api/products.service.ts
export class ProductsService {
  async getProducts(params?: GetProductsParams): Promise<PaginatedResponse<Product>> {
    const response = await apiClient.get('/products', { params });
    return response.data;
  }
  
  async getProduct(id: string): Promise<Product> {
    const response = await apiClient.get(`/products/${id}`);
    return response.data.data;
  }
  
  async createProduct(data: CreateProductRequest): Promise<Product> {
    const response = await apiClient.post('/products', data);
    return response.data.data;
  }
  
  async updateProduct(id: string, data: UpdateProductRequest): Promise<Product> {
    const response = await apiClient.put(`/products/${id}`, data);
    return response.data.data;
  }
  
  async deleteProduct(id: string): Promise<void> {
    await apiClient.delete(`/products/${id}`);
  }
}

export const productsService = new ProductsService();
```

### Custom API Hook
```typescript
// hooks/useApi.ts
export function useApi() {
  const dispatch = useAppDispatch();
  
  const apiCall = useCallback(async <T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> => {
    try {
      dispatch(setLoading(true));
      const response = await apiClient.request<T>(endpoint, options);
      return response.data;
    } catch (error) {
      dispatch(setError(error.message));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);
  
  return { apiCall };
}
```

## 🎨 Styling and Theming

### Material-UI Theme
```typescript
// theme/index.ts
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});
```

### Custom Styled Components
```typescript
// components/ui/styled.ts
import { styled } from '@mui/material/styles';
import { Box, Paper, Button } from '@mui/material';

export const StyledCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(1),
  boxShadow: theme.shadows[2],
  '&:hover': {
    boxShadow: theme.shadows[4],
  },
}));

export const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  textTransform: 'none',
  fontWeight: 600,
  padding: theme.spacing(1, 2),
}));

export const FlexBox = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 16,
});
```

### Responsive Design
```typescript
// hooks/useBreakpoints.ts
export function useBreakpoints() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  
  return { isMobile, isTablet, isDesktop };
}

// Usage in component
export function ResponsiveComponent() {
  const { isMobile, isDesktop } = useBreakpoints();
  
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      gap: isMobile ? 2 : 4,
    }}>
      <Box sx={{ flex: isDesktop ? 2 : 1 }}>
        {/* Content */}
      </Box>
      <Box sx={{ flex: 1 }}>
        {/* Sidebar */}
      </Box>
    </Box>
  );
}
```

## 🧭 Routing and Navigation

### Route Configuration
```typescript
// App.tsx
function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <DataProvider>
          <Router>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/*" element={
                <ProtectedRoute>
                  <MainLayout>
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/products" element={<Products />} />
                      <Route path="/products/add" element={<AddProduct />} />
                      <Route path="/products/:id/edit" element={<EditProduct />} />
                      <Route path="/users" element={<Users />} />
                      <Route path="/requests" element={<ServiceRequests />} />
                      <Route path="/bookings" element={<Bookings />} />
                      <Route path="/analytics" element={<Analytics />} />
                      <Route path="/settings" element={<Settings />} />
                    </Routes>
                  </MainLayout>
                </ProtectedRoute>
              } />
            </Routes>
          </Router>
        </DataProvider>
      </ThemeProvider>
    </Provider>
  );
}
```

### Protected Routes
```typescript
// components/auth/ProtectedRoute.tsx
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return <>{children}</>;
}
```

### Navigation Component
```typescript
// components/layout/sidebar.tsx
const navigationItems = [
  { path: '/', label: 'Dashboard', icon: <DashboardIcon /> },
  { path: '/products', label: 'Products', icon: <InventoryIcon /> },
  { path: '/users', label: 'Users', icon: <PeopleIcon /> },
  { path: '/requests', label: 'Service Requests', icon: <RequestPageIcon /> },
  { path: '/bookings', label: 'Bookings', icon: <EventIcon /> },
  { path: '/analytics', label: 'Analytics', icon: <AnalyticsIcon /> },
  { path: '/settings', label: 'Settings', icon: <SettingsIcon /> },
];

export function Sidebar({ open, onClose }: SidebarProps) {
  const location = useLocation();
  
  return (
    <Drawer open={open} onClose={onClose}>
      <Box sx={{ width: 250 }}>
        <List>
          {navigationItems.map((item) => (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                component={Link}
                to={item.path}
                selected={location.pathname === item.path}
                onClick={onClose}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}
```

## 📝 Form Handling

### React Hook Form Integration
```typescript
// components/forms/ProductForm.tsx
interface ProductFormProps {
  initialData?: Partial<Product>;
  onSubmit: (data: CreateProductRequest) => void;
  loading?: boolean;
}

export function ProductForm({ initialData, onSubmit, loading }: ProductFormProps) {
  const { control, handleSubmit, formState: { errors }, reset } = useForm<CreateProductRequest>({
    defaultValues: initialData || {
      name: '',
      description: '',
      price: 0,
      stock: 0,
    },
  });
  
  const handleFormSubmit = (data: CreateProductRequest) => {
    onSubmit(data);
    reset();
  };
  
  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormField
            name="name"
            control={control}
            label="Product Name"
            rules={{ required: 'Name is required' }}
            error={errors.name?.message}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormField
            name="price"
            control={control}
            label="Price"
            type="number"
            rules={{ 
              required: 'Price is required',
              min: { value: 0, message: 'Price must be positive' }
            }}
            error={errors.price?.message}
          />
        </Grid>
        <Grid item xs={12}>
          <FormField
            name="description"
            control={control}
            label="Description"
            multiline
            rows={4}
            rules={{ required: 'Description is required' }}
            error={errors.description?.message}
          />
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" loading={loading}>
            {initialData ? 'Update Product' : 'Add Product'}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
```

### Custom Form Field Component
```typescript
// components/forms/FormField.tsx
interface FormFieldProps {
  name: string;
  control: Control<any>;
  label: string;
  type?: string;
  multiline?: boolean;
  rows?: number;
  rules?: RegisterOptions;
  error?: string;
  options?: { value: string; label: string }[];
}

export function FormField({
  name,
  control,
  label,
  type = 'text',
  multiline = false,
  rows = 1,
  rules,
  error,
  options,
}: FormFieldProps) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => (
        <TextField
          {...field}
          label={label}
          type={type}
          multiline={multiline}
          rows={rows}
          fullWidth
          error={!!error}
          helperText={error}
          variant="outlined"
        />
      )}
    />
  );
}
```

### File Upload Component
```typescript
// components/forms/ImageUploadField.tsx
export function ImageUploadField({ onUpload }: { onUpload: (files: File[]) => void }) {
  const [dragActive, setDragActive] = useState(false);
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const files = Array.from(e.dataTransfer.files);
    onUpload(files);
  };
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    onUpload(files);
  };
  
  return (
    <Box
      onDrop={handleDrop}
      onDragOver={(e) => {
        e.preventDefault();
        setDragActive(true);
      }}
      onDragLeave={() => setDragActive(false)}
      sx={{
        border: '2px dashed',
        borderColor: dragActive ? 'primary.main' : 'grey.300',
        borderRadius: 2,
        p: 3,
        textAlign: 'center',
        cursor: 'pointer',
        '&:hover': {
          borderColor: 'primary.main',
        },
      }}
    >
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        id="image-upload"
      />
      <label htmlFor="image-upload">
        <CloudUploadIcon sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          Drop images here or click to select
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Supports JPG, PNG, GIF up to 10MB
        </Typography>
      </label>
    </Box>
  );
}
```

## ❌ Error Handling

### Error Boundary
```typescript
// components/common/ErrorBoundary.tsx
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<PropsWithChildren<{}>, ErrorBoundaryState> {
  constructor(props: PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Log to error reporting service
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <ErrorIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Something went wrong
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            We're sorry, but something unexpected happened.
          </Typography>
          <Button
            variant="contained"
            onClick={() => window.location.reload()}
          >
            Reload Page
          </Button>
        </Box>
      );
    }
    
    return this.props.children;
  }
}
```

### Global Error Handler
```typescript
// hooks/useErrorHandler.ts
export function useErrorHandler() {
  const dispatch = useAppDispatch();
  
  const handleError = useCallback((error: Error, context?: string) => {
    console.error(`Error in ${context}:`, error);
    
    // Show toast notification
    dispatch(showToast({
      message: error.message || 'An unexpected error occurred',
      type: 'error',
    }));
    
    // Log to error reporting service
    // errorReportingService.log(error, context);
  }, [dispatch]);
  
  return { handleError };
}
```

### API Error Handling
```typescript
// services/api/error-handler.ts
export function handleApiError(error: any): string {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return data.message || 'Invalid request';
      case 401:
        return 'Authentication required';
      case 403:
        return 'Access denied';
      case 404:
        return 'Resource not found';
      case 422:
        return data.message || 'Validation failed';
      case 429:
        return 'Too many requests, please try again later';
      case 500:
        return 'Internal server error';
      default:
        return data.message || 'An error occurred';
    }
  } else if (error.request) {
    // Network error
    return 'Network error, please check your connection';
  } else {
    // Other error
    return error.message || 'An unexpected error occurred';
  }
}
```

## 🧪 Testing

### Component Testing
```typescript
// __tests__/components/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
  
  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  
  it('shows loading state', () => {
    render(<Button loading>Click me</Button>);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
  
  it('is disabled when loading', () => {
    render(<Button loading>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### Hook Testing
```typescript
// __tests__/hooks/useAuth.test.tsx
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../useAuth';
import { Provider } from 'react-redux';
import { store } from '../store';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <Provider store={store}>{children}</Provider>
);

describe('useAuth', () => {
  it('should login successfully', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    await act(async () => {
      await result.current.login({
        email: 'test@example.com',
        password: 'password123',
      });
    });
    
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toBeDefined();
  });
});
```

### Integration Testing
```typescript
// __tests__/pages/Products.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { Products } from '../Products';
import { Provider } from 'react-redux';
import { store } from '../store';

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <Provider store={store}>
      {component}
    </Provider>
  );
};

describe('Products Page', () => {
  it('renders products list', async () => {
    renderWithProviders(<Products />);
    
    await waitFor(() => {
      expect(screen.getByText('Products')).toBeInTheDocument();
    });
  });
});
```

## ⚡ Performance Optimization

### Code Splitting
```typescript
// Lazy load components
const Dashboard = lazy(() => import('./pages/dashboard'));
const Products = lazy(() => import('./pages/products'));
const Users = lazy(() => import('./pages/users'));

// Wrap with Suspense
<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    <Route path="/" element={<Dashboard />} />
    <Route path="/products" element={<Products />} />
    <Route path="/users" element={<Users />} />
  </Routes>
</Suspense>
```

### Memoization
```typescript
// Memoize expensive components
export const ExpensiveComponent = memo(({ data }: { data: any[] }) => {
  const processedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      processed: expensiveOperation(item),
    }));
  }, [data]);
  
  return (
    <div>
      {processedData.map(item => (
        <ItemComponent key={item.id} item={item} />
      ))}
    </div>
  );
});

// Memoize callbacks
export function ParentComponent() {
  const [count, setCount] = useState(0);
  
  const handleClick = useCallback(() => {
    setCount(prev => prev + 1);
  }, []);
  
  return (
    <div>
      <ExpensiveComponent onClick={handleClick} />
    </div>
  );
}
```

### Virtual Scrolling
```typescript
// For large lists
import { FixedSizeList as List } from 'react-window';

export function VirtualizedList({ items }: { items: any[] }) {
  const Row = ({ index, style }: { index: number; style: any }) => (
    <div style={style}>
      <ItemComponent item={items[index]} />
    </div>
  );
  
  return (
    <List
      height={600}
      itemCount={items.length}
      itemSize={80}
      width="100%"
    >
      {Row}
    </List>
  );
}
```

## 🚀 Deployment

### Build Configuration
```json
// package.json
{
  "scripts": {
    "build": "react-scripts build",
    "build:prod": "NODE_ENV=production react-scripts build",
    "analyze": "npm run build && npx bundle-analyzer build/static/js/*.js"
  }
}
```

### Environment Variables
```env
# Production
REACT_APP_API_URL=https://api.fixer.com/api
REACT_APP_WS_URL=wss://api.fixer.com
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_...
REACT_APP_RAZORPAY_KEY_ID=rzp_live_...
REACT_APP_DEBUG=false
```

### Docker Configuration
```dockerfile
# Dockerfile
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 📋 Best Practices

### Code Organization
1. **Component Structure**: Keep components small and focused
2. **File Naming**: Use PascalCase for components, camelCase for utilities
3. **Import Order**: Group imports (React, third-party, local)
4. **TypeScript**: Use strict typing, avoid `any`

### Performance
1. **Bundle Size**: Monitor bundle size, use code splitting
2. **Re-renders**: Minimize unnecessary re-renders with memoization
3. **API Calls**: Use caching and debouncing
4. **Images**: Optimize images, use lazy loading

### Accessibility
1. **Semantic HTML**: Use proper HTML elements
2. **ARIA Labels**: Add appropriate ARIA attributes
3. **Keyboard Navigation**: Ensure keyboard accessibility
4. **Color Contrast**: Maintain proper contrast ratios

### Security
1. **Input Validation**: Validate all user inputs
2. **XSS Prevention**: Sanitize user-generated content
3. **HTTPS**: Use HTTPS in production
4. **Token Storage**: Store tokens securely

### Testing
1. **Test Coverage**: Maintain high test coverage
2. **Test Types**: Write unit, integration, and E2E tests
3. **Mocking**: Mock external dependencies
4. **CI/CD**: Run tests in CI pipeline

---

**Happy coding!** 🎉

This guide provides a comprehensive foundation for frontend development in the Fixer Marketplace platform. For additional help, refer to the API documentation and backend development guide.
