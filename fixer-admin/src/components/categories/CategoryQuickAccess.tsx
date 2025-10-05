import React from 'react'
import {
  Button,
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Avatar,
  Chip,
  useTheme,
} from '@mui/material'
import {
  Category as CategoryIcon,
  Add as AddIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { styled } from '@mui/material/styles'

const QuickAccessCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  color: theme.palette.primary.contrastText,
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[8],
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[16],
  },
}))

interface CategoryQuickAccessProps {
  categoryCount?: number
  activeCategoryCount?: number
  onQuickAdd?: () => void
}

export const CategoryQuickAccess: React.FC<CategoryQuickAccessProps> = ({
  categoryCount = 0,
  activeCategoryCount = 0,
  onQuickAdd,
}) => {
  const navigate = useNavigate()
  const theme = useTheme()

  const handleManageCategories = () => {
    navigate('/categories')
  }

  const handleQuickAdd = () => {
    if (onQuickAdd) {
      onQuickAdd()
    } else {
      navigate('/categories')
    }
  }

  return (
    <QuickAccessCard>
      <CardContent sx={{ pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Avatar
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              width: 48,
              height: 48,
            }}
          >
            <CategoryIcon sx={{ fontSize: 28 }} />
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight={600}>
              Category Management
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Organize your product categories
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Chip
            icon={<TrendingUpIcon />}
            label={`${categoryCount} Total`}
            size="small"
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              '& .MuiChip-icon': {
                color: 'white',
              },
            }}
          />
          <Chip
            label={`${activeCategoryCount} Active`}
            size="small"
            sx={{
              backgroundColor: 'rgba(76, 175, 80, 0.3)',
              color: 'white',
            }}
          />
        </Box>
      </CardContent>

      <CardActions sx={{ pt: 0, px: 2, pb: 2 }}>
        <Button
          variant="contained"
          startIcon={<CategoryIcon />}
          onClick={handleManageCategories}
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
            },
          }}
        >
          Manage Categories
        </Button>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleQuickAdd}
          sx={{
            borderColor: 'rgba(255, 255, 255, 0.5)',
            color: 'white',
            '&:hover': {
              borderColor: 'white',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          Add Category
        </Button>
      </CardActions>
    </QuickAccessCard>
  )
}

export default CategoryQuickAccess
