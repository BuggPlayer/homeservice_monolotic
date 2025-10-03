import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Fade,
  Slide,
  Chip,
  IconButton,
  Tooltip,
  alpha,
} from '@mui/material'
import {
  BusinessCenter,
  Engineering,
  Build,
  ElectricalServices,
  Plumbing,
  CleaningServices,
  Security,
  DirectionsCar,
  Computer,
  Phone,
  Email,
  LocationOn,
  Star,
  TrendingUp,
  People,
  Schedule,
  Notifications,
} from '@mui/icons-material'
import { PageHeader } from '../components/common/PageHeader'
import { EmptyState } from '../components/common/EmptyState'
import { CustomAlert } from '../components/ui/Feedback'

interface ProviderCategory {
  id: string
  name: string
  icon: React.ReactNode
  description: string
  count: number
  color: string
}

interface FeatureCard {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  color: string
}

export function Providers() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'))
  
  const [showContent, setShowContent] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 300)
    return () => clearTimeout(timer)
  }, [])

  const providerCategories: ProviderCategory[] = [
    {
      id: 'plumbing',
      name: 'Plumbing',
      icon: <Plumbing />,
      description: 'Professional plumbing services',
      count: 45,
      color: theme.palette.primary.main,
    },
    {
      id: 'electrical',
      name: 'Electrical',
      icon: <ElectricalServices />,
      description: 'Certified electrical contractors',
      count: 32,
      color: theme.palette.warning.main,
    },
    {
      id: 'hvac',
      name: 'HVAC',
      icon: <Build />,
      description: 'Heating and cooling specialists',
      count: 28,
      color: theme.palette.info.main,
    },
    {
      id: 'cleaning',
      name: 'Cleaning',
      icon: <CleaningServices />,
      description: 'Professional cleaning services',
      count: 67,
      color: theme.palette.success.main,
    },
    {
      id: 'security',
      name: 'Security',
      icon: <Security />,
      description: 'Security system installation',
      count: 19,
      color: theme.palette.error.main,
    },
    {
      id: 'automotive',
      name: 'Automotive',
      icon: <DirectionsCar />,
      description: 'Vehicle maintenance and repair',
      count: 41,
      color: theme.palette.secondary.main,
    },
    {
      id: 'it',
      name: 'IT Services',
      icon: <Computer />,
      description: 'Technology support and setup',
      count: 23,
      color: theme.palette.primary.dark,
    },
    {
      id: 'general',
      name: 'General Contractors',
      icon: <Engineering />,
      description: 'Multi-service contractors',
      count: 54,
      color: theme.palette.grey[600],
    },
  ]

  const upcomingFeatures: FeatureCard[] = [
    {
      id: 'provider-management',
      title: 'Provider Management',
      description: 'Comprehensive provider profiles with ratings, reviews, and service history',
      icon: <People />,
      color: theme.palette.primary.main,
    },
    {
      id: 'scheduling',
      title: 'Smart Scheduling',
      description: 'Advanced scheduling system with real-time availability and booking',
      icon: <Schedule />,
      color: theme.palette.success.main,
    },
    {
      id: 'analytics',
      title: 'Performance Analytics',
      description: 'Detailed analytics and insights for provider performance tracking',
      icon: <TrendingUp />,
      color: theme.palette.info.main,
    },
    {
      id: 'notifications',
      title: 'Smart Notifications',
      description: 'Automated notifications and communication system for providers',
      icon: <Notifications />,
      color: theme.palette.warning.main,
    },
  ]

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(selectedCategory === categoryId ? null : categoryId)
  }

  const handleGetNotified = () => {
    // This would typically open a modal or navigate to a notification signup
    console.log('Get notified clicked')
  }

  return (
    <Box sx={{ flexGrow: 1, p: { xs: 1, sm: 2, md: 3 } }}>
      <Fade in={showContent} timeout={800}>
        <Box>
          <PageHeader
            title="Service Providers"
            subtitle="Connect with trusted professionals for all your home service needs"
            action={
              <Button
                variant="contained"
                size="large"
                onClick={handleGetNotified}
                startIcon={<Notifications />}
                sx={{
                  borderRadius: 2,
                  px: 3,
                  py: 1.5,
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  fontWeight: 600,
                }}
              >
                Get Notified
              </Button>
            }
          />

          {/* Coming Soon Alert */}
          <Slide direction="down" in={showContent} timeout={1000}>
            <Box sx={{ mb: 4 }}>
              <CustomAlert
                severity="info"
                variant="outlined"
                title="🚀 Coming Soon!"
                sx={{
                  borderRadius: 2,
                  border: `2px solid ${alpha(theme.palette.info.main, 0.2)}`,
                  backgroundColor: alpha(theme.palette.info.main, 0.05),
                  '& .MuiAlert-message': {
                    fontSize: '1rem',
                    fontWeight: 500,
                  },
                }}
              >
                We're building an amazing provider management system that will revolutionize how you connect with service professionals. Stay tuned for updates!
              </CustomAlert>
            </Box>
          </Slide>

          {/* Provider Categories Grid */}
          <Slide direction="up" in={showContent} timeout={1200}>
            <Box sx={{ mb: 6 }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  mb: 3,
                  fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
                  color: 'text.primary',
                }}
              >
                Service Categories
              </Typography>
              
              <Grid container spacing={3}>
                {providerCategories.map((category, index) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={category.id}>
                    <Fade in={showContent} timeout={1400 + index * 100}>
                      <Card
                        sx={{
                          height: '100%',
                          cursor: 'pointer',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          border: selectedCategory === category.id 
                            ? `2px solid ${category.color}` 
                            : '2px solid transparent',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: theme.shadows[8],
                            border: `2px solid ${category.color}`,
                          },
                        }}
                        onClick={() => handleCategorySelect(category.id)}
                      >
                        <CardContent sx={{ p: 3, textAlign: 'center' }}>
                          <Box
                            sx={{
                              width: 64,
                              height: 64,
                              borderRadius: '50%',
                              backgroundColor: alpha(category.color, 0.1),
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              mx: 'auto',
                              mb: 2,
                              color: category.color,
                              fontSize: '2rem',
                            }}
                          >
                            {category.icon}
                          </Box>
                          
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 600,
                              mb: 1,
                              fontSize: { xs: '1rem', sm: '1.125rem' },
                            }}
                          >
                            {category.name}
                          </Typography>
                          
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 2, fontSize: '0.875rem' }}
                          >
                            {category.description}
                          </Typography>
                          
                          <Chip
                            label={`${category.count} Providers`}
                            size="small"
                            sx={{
                              backgroundColor: alpha(category.color, 0.1),
                              color: category.color,
                              fontWeight: 600,
                            }}
                          />
                        </CardContent>
                      </Card>
                    </Fade>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Slide>

          {/* Upcoming Features */}
          <Slide direction="up" in={showContent} timeout={1600}>
            <Box sx={{ mb: 6 }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  mb: 3,
                  fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
                  color: 'text.primary',
                }}
              >
                What's Coming
              </Typography>
              
              <Grid container spacing={3}>
                {upcomingFeatures.map((feature, index) => (
                  <Grid item xs={12} md={6} key={feature.id}>
                    <Fade in={showContent} timeout={1800 + index * 100}>
                      <Paper
                        sx={{
                          p: 3,
                          height: '100%',
                          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                          borderRadius: 2,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            boxShadow: theme.shadows[4],
                            transform: 'translateY(-2px)',
                          },
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                          <Box
                            sx={{
                              width: 48,
                              height: 48,
                              borderRadius: 2,
                              backgroundColor: alpha(feature.color, 0.1),
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: feature.color,
                              fontSize: '1.5rem',
                              flexShrink: 0,
                            }}
                          >
                            {feature.icon}
                          </Box>
                          
                          <Box sx={{ flex: 1 }}>
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: 600,
                                mb: 1,
                                fontSize: { xs: '1rem', sm: '1.125rem' },
                              }}
                            >
                              {feature.title}
                            </Typography>
                            
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ fontSize: '0.875rem', lineHeight: 1.6 }}
                            >
                              {feature.description}
                            </Typography>
                          </Box>
                        </Box>
                      </Paper>
                    </Fade>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Slide>

          {/* Call to Action */}
          <Slide direction="up" in={showContent} timeout={2000}>
            <Box>
              <EmptyState
                icon={
                  <Box
                    sx={{
                      fontSize: 96,
                      color: theme.palette.primary.main,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <BusinessCenter />
                  </Box>
                }
                title="Ready to Transform Your Service Management?"
                description="Be the first to know when our comprehensive provider management system launches. Get early access and exclusive features."
                action={{
                  label: 'Get Early Access',
                  onClick: handleGetNotified,
                }}
                size="large"
              />
            </Box>
          </Slide>

          {/* Contact Information */}
          <Slide direction="up" in={showContent} timeout={2200}>
            <Box sx={{ mt: 6, textAlign: 'center' }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 3,
                  color: 'text.primary',
                }}
              >
                Questions? We're Here to Help
              </Typography>
              
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 4,
                  flexWrap: 'wrap',
                  mb: 4,
                }}
              >
                <Tooltip title="Call us">
                  <IconButton
                    sx={{
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main,
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.2),
                      },
                    }}
                  >
                    <Phone />
                  </IconButton>
                </Tooltip>
                
                <Tooltip title="Email us">
                  <IconButton
                    sx={{
                      backgroundColor: alpha(theme.palette.success.main, 0.1),
                      color: theme.palette.success.main,
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.success.main, 0.2),
                      },
                    }}
                  >
                    <Email />
                  </IconButton>
                </Tooltip>
                
                <Tooltip title="Visit us">
                  <IconButton
                    sx={{
                      backgroundColor: alpha(theme.palette.warning.main, 0.1),
                      color: theme.palette.warning.main,
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.warning.main, 0.2),
                      },
                    }}
                  >
                    <LocationOn />
                  </IconButton>
                </Tooltip>
              </Box>
              
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: '0.875rem' }}
              >
                © 2024 HomeService Platform. All rights reserved.
              </Typography>
            </Box>
          </Slide>
        </Box>
      </Fade>
    </Box>
  )
}
