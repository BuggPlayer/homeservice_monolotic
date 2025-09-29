# Fixer Provider Dashboard

A comprehensive React web dashboard for Fixer service providers, built with TypeScript and Ant Design for enterprise-grade functionality.

## Features

### 🏢 Provider Onboarding
- Business registration and verification
- Service area setup
- Document upload and management
- Profile completion workflow

### 📋 Service Management
- Service request inbox with filtering
- Quote management and submission
- Booking calendar and scheduling
- Job status tracking and updates

### 💬 Customer Communication
- Real-time messaging interface
- Call history and integration
- Customer profiles and history
- Review and rating management

### 💰 Financial Dashboard
- Earnings analytics and reporting
- Payment tracking and history
- Expense management
- Tax calculation tools

### 🛠️ Business Tools
- Availability calendar management
- Service pricing configuration
- Performance analytics
- Marketing and promotion tools

## Tech Stack

- **Framework**: React 18 with TypeScript
- **UI Library**: Ant Design 5.x
- **State Management**: Redux Toolkit + Redux Persist
- **Routing**: React Router v6
- **Charts**: Recharts
- **Calendar**: React Big Calendar
- **Forms**: React Hook Form + Yup validation
- **HTTP Client**: Axios
- **Date Handling**: Day.js

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout/         # Layout components (Header, Sidebar, etc.)
│   ├── Charts/         # Chart components
│   ├── Tables/         # Data table components
│   ├── Cards/          # Card components
│   └── Auth/           # Authentication components
├── pages/              # Page components
│   ├── Dashboard/      # Dashboard page
│   ├── ServiceRequests/ # Service requests management
│   ├── Quotes/         # Quote management
│   ├── Bookings/       # Booking management
│   ├── Customers/      # Customer management
│   ├── Messages/       # Messaging interface
│   ├── Analytics/      # Analytics and reports
│   ├── Profile/        # Profile management
│   └── Settings/       # Settings page
├── store/              # Redux store and slices
├── services/           # API services
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── hooks/              # Custom React hooks
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running on localhost:3000

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fixer-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file:
   ```env
   REACT_APP_API_URL=http://localhost:3000/api
   REACT_APP_WS_URL=ws://localhost:3000
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

The application will be available at `http://localhost:3000`

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## Key Features Implementation

### 1. Dashboard Overview
- Real-time analytics and metrics
- Earnings and performance charts
- Recent bookings and quotes
- Quick action cards

### 2. Service Request Management
- Inbox with filtering and search
- Request details and customer info
- Quote submission workflow
- Status tracking

### 3. Quote Management
- Quote creation and editing
- Pricing tools and calculators
- Quote tracking and analytics
- Template management

### 4. Booking Calendar
- Interactive calendar view
- Schedule management
- Availability settings
- Job status updates

### 5. Customer Communication
- Real-time messaging
- Call integration
- Customer profiles
- Communication history

### 6. Financial Management
- Earnings dashboard
- Payment tracking
- Expense management
- Tax reporting

### 7. Analytics & Reporting
- Performance metrics
- Earnings reports
- Customer insights
- Service analytics

## Desktop-First Design

### Enterprise UI Features
- Complex data tables with sorting and filtering
- Multi-tab interfaces for data organization
- Keyboard shortcuts for power users
- Print-friendly reports and exports
- Responsive design for different screen sizes

### Ant Design Components
- Data tables with advanced features
- Form components with validation
- Modal dialogs and drawers
- Navigation and layout components
- Charts and data visualization

## State Management

Uses Redux Toolkit for predictable state management:

- **Auth Slice**: User authentication and profile
- **Dashboard Slice**: Dashboard data and analytics
- **Provider Slice**: Provider-specific data
- **UI Slice**: UI state and notifications

## API Integration

The dashboard integrates with the Fixer backend API:

- **Authentication**: Login, profile management
- **Service Requests**: CRUD operations, filtering
- **Quotes**: Creation, editing, tracking
- **Bookings**: Calendar integration, status updates
- **Customers**: Profile management, communication
- **Analytics**: Performance metrics, reporting

## Development

### Code Structure
- TypeScript for type safety
- Functional components with hooks
- Custom hooks for reusable logic
- Service layer for API calls
- Redux for state management

### Styling
- Ant Design theme customization
- CSS-in-JS with styled-components
- Responsive design principles
- Dark mode support (future)

### Testing
- Jest for unit testing
- React Testing Library for component testing
- Cypress for e2e testing (future)

## Building for Production

```bash
# Build the app
npm run build

# The build folder contains the production build
# Deploy the contents of the build folder to your web server
```

## Deployment

### Environment Setup
1. Set production API URL
2. Configure authentication
3. Set up CDN for static assets
4. Configure environment variables

### Deployment Options
- **Vercel**: Easy deployment with zero config
- **Netlify**: Static site hosting
- **AWS S3 + CloudFront**: Scalable hosting
- **Docker**: Containerized deployment

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## Roadmap

### Phase 1 (Current)
- ✅ Basic dashboard structure
- ✅ Authentication system
- ✅ Core navigation
- ✅ Dashboard overview

### Phase 2 (Next)
- Service request management
- Quote system
- Booking calendar
- Customer communication

### Phase 3 (Future)
- Advanced analytics
- Mobile responsiveness
- Real-time features
- Advanced reporting