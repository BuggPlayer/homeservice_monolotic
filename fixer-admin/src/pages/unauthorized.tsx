import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Button,
  Paper,
  Stack,
  Divider
} from '@mui/material'
import {
  Lock as LockIcon,
  Home as HomeIcon,
  ArrowBack as ArrowBackIcon,
  ContactSupport as ContactSupportIcon
} from '@mui/icons-material'
import { usePermissions } from '../hooks/usePermissions'

export function Unauthorized() {
  const location = useLocation()
  const navigate = useNavigate()
  const { userRole } = usePermissions()
  
  const state = location.state as {
    from?: { pathname: string }
    requiredPermissions?: string[]
    userRole?: string
  } | null

  const attemptedPath = state?.from?.pathname || 'this page'
  const requiredPermissions = state?.requiredPermissions || []

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        bgcolor: 'background.default',
        p: 3
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: { xs: 3, sm: 5 },
          textAlign: 'center',
          maxWidth: 600,
          width: '100%'
        }}
      >
        <LockIcon
          sx={{
            fontSize: { xs: 80, sm: 120 },
            color: 'error.main',
            mb: 3
          }}
        />
        
        <Typography
          variant="h3"
          sx={{
            mb: 2,
            fontWeight: 700,
            fontSize: { xs: '2rem', sm: '3rem' }
          }}
        >
          403
        </Typography>
        
        <Typography
          variant="h5"
          sx={{
            mb: 2,
            fontWeight: 600,
            color: 'text.primary'
          }}
        >
          Access Denied
        </Typography>
        
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 3 }}
        >
          You don't have permission to access {attemptedPath}.
        </Typography>

        {requiredPermissions.length > 0 && (
          <>
            <Divider sx={{ my: 3 }} />
            <Box sx={{ textAlign: 'left', mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Required Permissions:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {requiredPermissions.map((permission, index) => (
                  <Box
                    key={index}
                    sx={{
                      px: 2,
                      py: 0.5,
                      bgcolor: 'error.light',
                      color: 'error.contrastText',
                      borderRadius: 1,
                      fontSize: '0.875rem'
                    }}
                  >
                    {permission}
                  </Box>
                ))}
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Your role: <strong>{userRole}</strong>
              </Typography>
            </Box>
          </>
        )}

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 4 }}
        >
          If you believe this is an error, please contact your system administrator
          or try logging in with a different account.
        </Typography>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          justifyContent="center"
        >
          <Button
            variant="contained"
            startIcon={<HomeIcon />}
            onClick={() => navigate('/')}
            size="large"
            sx={{ minWidth: 150 }}
          >
            Go Home
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            size="large"
            sx={{ minWidth: 150 }}
          >
            Go Back
          </Button>
          
          <Button
            variant="text"
            startIcon={<ContactSupportIcon />}
            onClick={() => navigate('/settings')}
            size="large"
            sx={{ minWidth: 150 }}
          >
            Contact Support
          </Button>
        </Stack>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ textAlign: 'left' }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            What you can do:
          </Typography>
          <Typography variant="body2" color="text.secondary" component="ul" sx={{ pl: 2 }}>
            <li>Request access from your administrator</li>
            <li>Check if you're using the correct account</li>
            <li>Return to the dashboard and try another action</li>
            <li>Contact support if you need immediate access</li>
          </Typography>
        </Box>
      </Paper>
    </Box>
  )
}

export default Unauthorized
