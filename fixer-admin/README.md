# Fixer Admin Panel

A modern, responsive admin panel for the Fixer home services marketplace built with React, TypeScript, Tailwind CSS, and shadcn/ui components.

## Features

### 🎨 **Modern UI/UX**
- Clean, professional design with dark/light theme support
- Responsive layout that works on all devices
- Accessible components following WCAG guidelines
- Smooth animations and transitions

### 📊 **Dashboard & Analytics**
- Real-time dashboard with key metrics
- Revenue and order tracking
- Service category performance
- Recent activity feed
- Interactive charts and graphs

### 🛍️ **Product Management**
- Complete product catalog management
- Category organization with subcategories
- Inventory tracking and stock management
- Product images and specifications
- Search and filtering capabilities

### 🔧 **Service Management**
- Service request tracking and management
- Quote and booking management
- Provider verification and management
- Service type categorization
- Status tracking and updates

### 👥 **User Management**
- User account management
- Role-based access control (Admin, Provider, Customer)
- User verification and status tracking
- Contact information management

### 📱 **Responsive Design**
- Mobile-first approach
- Tablet and desktop optimized
- Touch-friendly interface
- Adaptive navigation

## Tech Stack

- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Routing**: React Router v6
- **Charts**: Recharts
- **Icons**: Lucide React
- **State Management**: React Context
- **Build Tool**: Create React App

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd fixer-admin
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run eject` - Ejects from Create React App

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (shadcn/ui)
│   └── layout/         # Layout components
├── contexts/           # React contexts
├── data/              # Static data and mock data
├── hooks/             # Custom React hooks
├── lib/               # Utility functions
├── pages/             # Page components
├── types/             # TypeScript type definitions
└── App.tsx            # Main app component
```

## Components

### UI Components (shadcn/ui)
- Button, Card, Input, Badge, Avatar
- Dialog, Dropdown, Select, Tabs
- Toast, Tooltip, Progress, Separator
- Switch, Table, Textarea

### Layout Components
- MainLayout - Main app layout with sidebar and header
- Sidebar - Navigation sidebar
- Header - Top header with search and user menu

### Page Components
- Dashboard - Analytics and overview
- Products - Product management
- ServiceRequests - Service request management
- Users - User management

## Data Management

The admin panel uses static JSON data for demonstration purposes. In a production environment, this would be replaced with API calls to your backend.

### Static Data Structure
- **Categories**: Product and service categories
- **Products**: Product catalog with specifications
- **Service Providers**: Service provider profiles
- **Service Requests**: Customer service requests
- **Users**: User accounts and profiles
- **Analytics**: Dashboard metrics and KPIs

## Customization

### Theming
The app uses CSS custom properties for theming. You can customize colors in `src/index.css`:

```css
:root {
  --primary: 221.2 83.2% 53.3%;
  --secondary: 210 40% 96%;
  /* ... other color variables */
}
```

### Adding New Pages
1. Create a new component in `src/pages/`
2. Add the route in `src/App.tsx`
3. Add navigation item in `src/components/layout/sidebar.tsx`

### Adding New Components
1. Create component in appropriate directory
2. Export from index file if needed
3. Import and use in pages

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.