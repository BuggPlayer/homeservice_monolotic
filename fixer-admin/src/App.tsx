import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ThemeProvider } from './contexts/theme-context'
import { DataProvider } from './contexts/data-context'
import { store } from './store'
import { MainLayout } from './components/layout/main-layout'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { RoleBasedRoute } from './components/auth/RoleBasedRoute'
import { ToastProvider } from './components/providers/ToastProvider'
import { LoadingProvider } from './components/providers/LoadingProvider'
import { Dashboard } from './pages/dashboard'
import { Products } from './pages/products'
import { ServiceRequests } from './pages/service-requests'
import { Users } from './pages/users'
import { Auth } from './pages/auth'
import { Signup } from './pages/signup'
import { AddProduct } from './pages/add-product'
import Categories from './pages/categories'
import { Settings } from './pages/settings'
import { Analytics } from './pages/analytics'
import { Bookings } from './pages/bookings'
import { Quotes } from './pages/quotes'
import { Orders } from './pages/orders'
import { Services } from './pages/services'
import { Providers } from './pages/providers'
import { Messages } from './pages/messages'
import { PreviewDemo } from './pages/preview-demo'
import Unauthorized from './pages/unauthorized'

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <DataProvider>
          <Router>
            <Routes>
              {/* Public routes */}
              <Route path="/auth" element={<Auth />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              
              {/* Protected routes with RBAC */}
              <Route path="/*" element={
                <ProtectedRoute>
                  <MainLayout>
                    <Routes>
                      {/* Dashboard - accessible by most roles */}
                      <Route 
                        path="/" 
                        element={
                          <RoleBasedRoute permissions={['view_dashboard']}>
                            <Dashboard />
                          </RoleBasedRoute>
                        } 
                      />
                      
                      {/* Products */}
                      <Route 
                        path="/products" 
                        element={
                          <RoleBasedRoute permissions={['view_products']}>
                            <Products />
                          </RoleBasedRoute>
                        } 
                      />
                      <Route 
                        path="/products/add" 
                        element={
                          <RoleBasedRoute permissions={['create_products']}>
                            <AddProduct />
                          </RoleBasedRoute>
                        } 
                      />
                      
                      {/* Categories */}
                      <Route 
                        path="/categories" 
                        element={
                          <RoleBasedRoute permissions={['view_categories']}>
                            <Categories />
                          </RoleBasedRoute>
                        } 
                      />
                      
                      {/* Services */}
                      <Route 
                        path="/services" 
                        element={
                          <RoleBasedRoute permissions={['view_services']}>
                            <Services />
                          </RoleBasedRoute>
                        } 
                      />
                      
                      {/* Service Requests */}
                      <Route 
                        path="/requests" 
                        element={
                          <RoleBasedRoute permissions={['view_dashboard']}>
                            <ServiceRequests />
                          </RoleBasedRoute>
                        } 
                      />
                      
                      {/* Quotes */}
                      <Route 
                        path="/quotes" 
                        element={
                          <RoleBasedRoute permissions={['view_quotes']}>
                            <Quotes />
                          </RoleBasedRoute>
                        } 
                      />
                      
                      {/* Bookings */}
                      <Route 
                        path="/bookings" 
                        element={
                          <RoleBasedRoute permissions={['view_bookings']}>
                            <Bookings />
                          </RoleBasedRoute>
                        } 
                      />
                      
                      {/* Users - Admin only */}
                      <Route 
                        path="/users" 
                        element={
                          <RoleBasedRoute permissions={['view_users']}>
                            <Users />
                          </RoleBasedRoute>
                        } 
                      />
                      
                      {/* Providers */}
                      <Route 
                        path="/providers" 
                        element={
                          <RoleBasedRoute permissions={['view_providers']}>
                            <Providers />
                          </RoleBasedRoute>
                        } 
                      />
                      
                      {/* Analytics - Manager and above */}
                      <Route 
                        path="/analytics" 
                        element={
                          <RoleBasedRoute permissions={['view_analytics']}>
                            <Analytics />
                          </RoleBasedRoute>
                        } 
                      />
                      
                      {/* Messages */}
                      <Route 
                        path="/messages" 
                        element={
                          <RoleBasedRoute permissions={['view_messages']}>
                            <Messages />
                          </RoleBasedRoute>
                        } 
                      />
                      
                      {/* Orders */}
                      <Route 
                        path="/orders" 
                        element={
                          <RoleBasedRoute permissions={['view_orders']}>
                            <Orders />
                          </RoleBasedRoute>
                        } 
                      />
                      
                      {/* Settings */}
                      <Route 
                        path="/settings" 
                        element={
                          <RoleBasedRoute permissions={['view_settings']}>
                            <Settings />
                          </RoleBasedRoute>
                        } 
                      />
                      
                      {/* Preview Demo - No restrictions */}
                      <Route path="/preview-demo" element={<PreviewDemo />} />
                    </Routes>
                  </MainLayout>
                </ProtectedRoute>
              } />
            </Routes>
          </Router>
          <ToastProvider />
          <LoadingProvider />
        </DataProvider>
      </ThemeProvider>
    </Provider>
  )
}

export default App