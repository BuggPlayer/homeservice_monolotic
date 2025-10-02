import React, { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Divider,
  Link,
  Alert,
  useTheme,
  useMediaQuery,
  Stack,
  Container,
  Paper,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  Snackbar,
} from '@mui/material'
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Login as LoginIcon,
  Google as GoogleIcon,
  Apple as AppleIcon,
  Facebook as FacebookIcon,
  Security as SecurityIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
} from '@mui/icons-material'

interface LoginFormProps {
  onLogin: (credentials: { email: string; password: string; rememberMe: boolean }) => void
  isLoading?: boolean
  error?: string
}

export function LoginForm({ onLogin, isLoading = false, error }: LoginFormProps) {
  const [formData, setFormData] = useState({
    email: 'test@test.com',
    password: 'test123',
    rememberMe: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' as 'success' | 'error' | 'warning' | 'info' })

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    
    if (validateForm()) {
      onLogin(formData)
    }
  }

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }))
    }
  }

  const handleSocialLogin = (provider: string) => {
    setSnackbar({ open: true, message: `${provider} login coming soon`, severity: 'info' })
  }

  const handleForgotPassword = () => {
    setSnackbar({ open: true, message: 'Password reset feature coming soon', severity: 'info' })
  }

  return (
    <Container maxWidth="sm" sx={{ px: { xs: 1, sm: 2 } }}>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: { xs: 2, sm: 4 },
        }}
      >
        <Card sx={{ 
          width: '100%', 
          maxWidth: 480, 
          boxShadow: 3,
          borderRadius: { xs: 2, sm: 3 }
        }}>
          <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: { xs: 3, sm: 4 } }}>
              <Box
                sx={{
                  width: { xs: 48, sm: 64 },
                  height: { xs: 48, sm: 64 },
                  borderRadius: 2,
                  backgroundColor: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2,
                }}
              >
                <BusinessIcon sx={{ color: 'white', fontSize: { xs: 24, sm: 32 } }} />
              </Box>
              <Typography variant="h4" sx={{ 
                fontWeight: 700, 
                mb: 1,
                fontSize: { xs: '1.5rem', sm: '2rem' }
              }}>
                Welcome Back
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }}>
                Sign in to your Fixer Admin account
              </Typography>
            </Box>

            {/* Error Alert */}
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {/* Login Form */}
            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={{ xs: 2, sm: 3 }}>
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  error={!!errors.email}
                  helperText={errors.email}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  disabled={isLoading}
                />

                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  error={!!errors.password}
                  helperText={errors.password}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          disabled={isLoading}
                        >
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  disabled={isLoading}
                />

                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: { xs: 1, sm: 0 }
                }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.rememberMe}
                        onChange={(e) => setFormData(prev => ({ ...prev, rememberMe: e.target.checked }))}
                        disabled={isLoading}
                      />
                    }
                    label="Remember me"
                    sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                  />
                  <Link
                    component="button"
                    variant="body2"
                    onClick={handleForgotPassword}
                    sx={{ 
                      textDecoration: 'none',
                      fontSize: { xs: '0.875rem', sm: '1rem' }
                    }}
                    disabled={isLoading}
                  >
                    Forgot password?
                  </Link>
                </Box>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={isLoading}
                  startIcon={isLoading ? <CircularProgress size={20} /> : <LoginIcon />}
                  sx={{ 
                    py: { xs: 1.25, sm: 1.5 },
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>

                <Divider sx={{ my: { xs: 1.5, sm: 2 } }}>
                  <Typography variant="body2" color="text.secondary" sx={{
                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                  }}>
                    OR
                  </Typography>
                </Divider>

                {/* Social Login Buttons */}
                <Stack spacing={{ xs: 1.5, sm: 2 }}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<GoogleIcon />}
                    onClick={() => handleSocialLogin('Google')}
                    disabled={isLoading}
                    sx={{ 
                      py: { xs: 1.25, sm: 1.5 },
                      fontSize: { xs: '0.875rem', sm: '1rem' }
                    }}
                  >
                    Continue with Google
                  </Button>
                  
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<AppleIcon />}
                    onClick={() => handleSocialLogin('Apple')}
                    disabled={isLoading}
                    sx={{ 
                      py: { xs: 1.25, sm: 1.5 },
                      fontSize: { xs: '0.875rem', sm: '1rem' }
                    }}
                  >
                    Continue with Apple
                  </Button>
                  
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<FacebookIcon />}
                    onClick={() => handleSocialLogin('Facebook')}
                    disabled={isLoading}
                    sx={{ 
                      py: { xs: 1.25, sm: 1.5 },
                      fontSize: { xs: '0.875rem', sm: '1rem' }
                    }}
                  >
                    Continue with Facebook
                  </Button>
                </Stack>

                {/* Security Notice */}
                <Paper
                  sx={{
                    p: { xs: 1.5, sm: 2 },
                    backgroundColor: 'grey.50',
                    border: '1px solid',
                    borderColor: 'grey.200',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <SecurityIcon color="primary" fontSize="small" />
                    <Typography variant="subtitle2" sx={{ 
                      fontWeight: 600,
                      fontSize: { xs: '0.75rem', sm: '0.875rem' }
                    }}>
                      Secure Login
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{
                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                  }}>
                    Your data is protected with enterprise-grade security and encryption.
                  </Typography>
                </Paper>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  )
}
