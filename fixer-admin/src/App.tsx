import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/theme-context'
import { DataProvider } from './contexts/data-context'
import { MainLayout } from './components/layout/main-layout'
import { Dashboard } from './pages/dashboard'
import { Products } from './pages/products'
import { ServiceRequests } from './pages/service-requests'
import { Users } from './pages/users'
import { Auth } from './pages/auth'
import { AddProduct } from './pages/add-product'
import { Settings } from './pages/settings'
import { Analytics } from './pages/analytics'
import { Bookings } from './pages/bookings'
import { Quotes } from './pages/quotes'

function App() {
  return (
    <ThemeProvider>
      <DataProvider>
        <Router>
          <MainLayout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/add" element={<AddProduct />} />
              <Route path="/services" element={<div>Services Page - Coming Soon</div>} />
              <Route path="/requests" element={<ServiceRequests />} />
              <Route path="/quotes" element={<Quotes />} />
              <Route path="/bookings" element={<Bookings />} />
              <Route path="/users" element={<Users />} />
              <Route path="/providers" element={<div>Providers Page - Coming Soon</div>} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/messages" element={<div>Messages Page - Coming Soon</div>} />
              <Route path="/orders" element={<div>Orders Page - Coming Soon</div>} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </MainLayout>
        </Router>
      </DataProvider>
    </ThemeProvider>
  )
}

export default App