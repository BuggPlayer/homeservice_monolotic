import React from 'react'
import { Box, Container, Typography, Breadcrumbs, Link } from '@mui/material'
import { styled } from '@mui/material/styles'
import { CategoryList } from '../components/categories'
import { useNavigate } from 'react-router-dom'

// Enhanced page styling
const PageContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  minHeight: '100vh',
}))

const PageHeader = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  padding: theme.spacing(3),
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  borderRadius: theme.spacing(2),
  color: theme.palette.primary.contrastText,
  position: 'relative',
  overflow: 'hidden',
  
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
    animation: 'float 20s ease-in-out infinite',
  },
  
  '@keyframes float': {
    '0%, 100%': { transform: 'translateY(0px)' },
    '50%': { transform: 'translateY(-10px)' },
  },
}))

const BreadcrumbContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}))

export function CategoriesPage() {
  const navigate = useNavigate()

  const handleCategorySelect = (category: any) => {
    // Navigate to category details or products in this category
    navigate(`/categories/${category.id}`)
  }

  return (
    <PageContainer maxWidth={false}>
      <BreadcrumbContainer>
        <Breadcrumbs aria-label="breadcrumb">
          <Link 
            color="inherit" 
            href="/dashboard"
            onClick={(e) => {
              e.preventDefault()
              navigate('/dashboard')
            }}
            sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
          >
            Dashboard
          </Link>
          <Typography color="text.primary">Categories</Typography>
        </Breadcrumbs>
      </BreadcrumbContainer>

      <PageHeader>
        <Typography variant="h3" fontWeight={700} sx={{ mb: 1, position: 'relative', zIndex: 1 }}>
          Category Management
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9, position: 'relative', zIndex: 1 }}>
          Organize and manage your product categories with advanced filtering and bulk operations
        </Typography>
      </PageHeader>

      <CategoryList
        onCategorySelect={handleCategorySelect}
        showStats={true}
        allowSelection={false}
      />
    </PageContainer>
  )
}

export default CategoriesPage
