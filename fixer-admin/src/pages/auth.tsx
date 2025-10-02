import React, { useState, useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { Box, Container, Typography, Paper, Stack } from '@mui/material'
import { LoginForm } from '../components/auth/LoginForm'
import { useAppSelector, useAppDispatch } from '../store/hooks'
import { setCredentials, setLoading } from '../store/slices/authSlice'
import { addToast } from '../store/slices/uiSlice'
import { AuthService } from '../services/api'

export function Auth() {
  const dispatch = useAppDispatch()
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth)
  const [error, setError] = useState<string>('')
  const location = useLocation()

  // Redirect if already authenticated
  if (isAuthenticated) {
    const from = location.state?.from?.pathname || '/'
    return <Navigate to={from} replace />
  }

  const handleLogin = async (credentials: { email: string; password: string; rememberMe: boolean }) => {
    try {
      setError('')
      dispatch(setLoading(true))
      
      const response = await AuthService.login(credentials)
      
      // Store credentials in Redux
      dispatch(setCredentials({
        user: response.data.user,
        token: response.data.token
      }))
      
      // Store in localStorage if remember me is checked
      if (credentials.rememberMe) {
        localStorage.setItem('user', JSON.stringify(response.data.user))
        localStorage.setItem('token', response.data.token)
      }
      
    } catch (err: any) {
      setError(err?.message || 'Login failed')
    } finally {
      dispatch(setLoading(false))
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 1, sm: 2 },
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 1, sm: 2 } }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: { xs: 3, sm: 6 },
            flexDirection: { xs: 'column', lg: 'row' },
          }}
        >
          {/* Features Section */}
          <Paper
            sx={{
              p: { xs: 3, sm: 4 },
              maxWidth: { xs: '100%', lg: 400 },
              width: '100%',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
              order: { xs: 2, lg: 1 },
            }}
          >
            <Typography variant="h4" sx={{
              fontWeight: 700,
              mb: 3,
              fontSize: { xs: '1.5rem', sm: '2rem' }
            }}>
              Manage Your Business with Ease
            </Typography>
            <Stack spacing={{ xs: 2, sm: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    width: { xs: 40, sm: 48 },
                    height: { xs: 40, sm: 48 },
                    borderRadius: 2,
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h6" sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>📊</Typography>
                </Box>
                <Box>
                  <Typography variant="h6" sx={{
                    fontWeight: 600,
                    fontSize: { xs: '1rem', sm: '1.25rem' }
                  }}>
                    Complete Dashboard
                  </Typography>
                  <Typography variant="body2" sx={{
                    opacity: 0.8,
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }}>
                    Track revenue, orders, and customer satisfaction
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    width: { xs: 40, sm: 48 },
                    height: { xs: 40, sm: 48 },
                    borderRadius: 2,
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h6" sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>👥</Typography>
                </Box>
                <Box>
                  <Typography variant="h6" sx={{
                    fontWeight: 600,
                    fontSize: { xs: '1rem', sm: '1.25rem' }
                  }}>
                    User Management
                  </Typography>
                  <Typography variant="body2" sx={{
                    opacity: 0.8,
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }}>
                    Manage customers, providers, and admin accounts
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    width: { xs: 40, sm: 48 },
                    height: { xs: 40, sm: 48 },
                    borderRadius: 2,
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h6" sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>🔒</Typography>
                </Box>
                <Box>
                  <Typography variant="h6" sx={{
                    fontWeight: 600,
                    fontSize: { xs: '1rem', sm: '1.25rem' }
                  }}>
                    Secure & Reliable
                  </Typography>
                  <Typography variant="body2" sx={{
                    opacity: 0.8,
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }}>
                    Enterprise-grade security for your business data
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </Paper>

          {/* Login Form */}
          <LoginForm onLogin={handleLogin} isLoading={isLoading} error={error} />
        </Box>
      </Container>
    </Box>
  )
}