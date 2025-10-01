import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/theme-context'
import { DataProvider } from './contexts/data-context'
import { MainLayout } from './components/layout/main-layout'
import { Dashboard } from './pages/dashboard'
import { Products } from './pages/products'
import { ServiceRequests } from './pages/service-requests'
import { Users } from './pages/users'

function App() {
  return (
    <ThemeProvider>
      <DataProvider>
        <Router>
          <MainLayout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/services" element={<div>Services Page - Coming Soon</div>} />
              <Route path="/requests" element={<ServiceRequests />} />
              <Route path="/quotes" element={<div>Quotes Page - Coming Soon</div>} />
              <Route path="/bookings" element={<div>Bookings Page - Coming Soon</div>} />
              <Route path="/users" element={<Users />} />
              <Route path="/providers" element={<div>Providers Page - Coming Soon</div>} />
              <Route path="/analytics" element={<div>Analytics Page - Coming Soon</div>} />
              <Route path="/messages" element={<div>Messages Page - Coming Soon</div>} />
              <Route path="/orders" element={<div>Orders Page - Coming Soon</div>} />
              <Route path="/settings" element={<div>Settings Page - Coming Soon</div>} />
            </Routes>
          </MainLayout>
        </Router>
      </DataProvider>
    </ThemeProvider>
  )
}

export default App