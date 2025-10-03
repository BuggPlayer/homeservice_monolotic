import React from 'react'
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  IconButton,
  useTheme,
  useMediaQuery,
  Stack,
  Chip
} from '@mui/material'
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

interface OrderFiltersProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  statusFilter: string
  onStatusChange: (status: string) => void
  dateRange: {
    start: Date | null
    end: Date | null
  }
  onDateRangeChange: (start: Date | null, end: Date | null) => void
  onClearFilters: () => void
  onMoreFilters: () => void
}

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'completed', label: 'Completed' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'cancelled', label: 'Cancelled' }
]

export const OrderFilters: React.FC<OrderFiltersProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  dateRange,
  onDateRangeChange,
  onClearFilters,
  onMoreFilters
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ mb: 3 }}>
        <Stack 
          direction={{ xs: 'column', md: 'row' }} 
          spacing={2} 
          alignItems={{ xs: 'stretch', md: 'center' }}
        >
          {/* Search Field */}
          <TextField
            fullWidth={isMobile}
            placeholder="Search by name, Order ID..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
              endAdornment: searchQuery && (
                <IconButton
                  size="small"
                  onClick={() => onSearchChange('')}
                  sx={{ mr: -1 }}
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              )
            }}
            sx={{ 
              minWidth: { xs: '100%', md: 300 },
              '& .MuiOutlinedInput-root': {
                borderRadius: 2
              }
            }}
          />

          {/* Status Filter */}
          <FormControl sx={{ minWidth: { xs: '100%', md: 150 } }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => onStatusChange(e.target.value)}
              label="Status"
              sx={{ borderRadius: 2 }}
            >
              {statusOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Date Range Picker */}
          <Box sx={{ display: 'flex', gap: 1, minWidth: { xs: '100%', md: 300 } }}>
            <DatePicker
              label="Start Date"
              value={dateRange.start}
              onChange={(date) => onDateRangeChange(date, dateRange.end)}
              slotProps={{
                textField: {
                  size: 'small',
                  sx: { 
                    flex: 1,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2
                    }
                  }
                }
              }}
            />
            <DatePicker
              label="End Date"
              value={dateRange.end}
              onChange={(date) => onDateRangeChange(dateRange.start, date)}
              slotProps={{
                textField: {
                  size: 'small',
                  sx: { 
                    flex: 1,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2
                    }
                  }
                }
              }}
            />
          </Box>

          {/* Action Buttons */}
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<FilterIcon />}
              onClick={onMoreFilters}
              sx={{ 
                borderRadius: 2,
                px: 2,
                whiteSpace: 'nowrap'
              }}
            >
              More Filter
            </Button>
            
            {(searchQuery || statusFilter !== 'all' || dateRange.start || dateRange.end) && (
              <Button
                variant="text"
                startIcon={<ClearIcon />}
                onClick={onClearFilters}
                sx={{ 
                  borderRadius: 2,
                  px: 2,
                  whiteSpace: 'nowrap'
                }}
              >
                Clear
              </Button>
            )}
          </Stack>
        </Stack>

        {/* Active Filters Display */}
        {(searchQuery || statusFilter !== 'all' || dateRange.start || dateRange.end) && (
          <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {searchQuery && (
              <Chip
                label={`Search: "${searchQuery}"`}
                onDelete={() => onSearchChange('')}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
            {statusFilter !== 'all' && (
              <Chip
                label={`Status: ${statusOptions.find(opt => opt.value === statusFilter)?.label}`}
                onDelete={() => onStatusChange('all')}
                size="small"
                color="secondary"
                variant="outlined"
              />
            )}
            {dateRange.start && (
              <Chip
                label={`From: ${dateRange.start.toLocaleDateString()}`}
                onDelete={() => onDateRangeChange(null, dateRange.end)}
                size="small"
                color="info"
                variant="outlined"
              />
            )}
            {dateRange.end && (
              <Chip
                label={`To: ${dateRange.end.toLocaleDateString()}`}
                onDelete={() => onDateRangeChange(dateRange.start, null)}
                size="small"
                color="info"
                variant="outlined"
              />
            )}
          </Box>
        )}
      </Box>
    </LocalizationProvider>
  )
}
