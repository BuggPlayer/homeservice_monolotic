import React from 'react'
import {
  TextField,
  TextFieldProps,
  Select,
  SelectProps,
  MenuItem,
  FormControl,
  FormControlProps,
  InputLabel,
  InputLabelProps,
  FormHelperText,
  FormHelperTextProps,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { borderRadius, commonProps } from '../tokens'

// Styled TextField with consistent design
const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    ...commonProps.input,
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.primary.main,
      borderWidth: 2,
    },
  },
}))

// Styled Select with consistent design
const StyledSelect = styled(Select)(({ theme }) => ({
  ...commonProps.input,
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.primary.main,
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.primary.main,
    borderWidth: 2,
  },
}))

// Form Field Component
export interface FormFieldProps extends Omit<TextFieldProps, 'variant'> {
  variant?: 'outlined' | 'filled' | 'standard'
  size?: 'small' | 'medium'
  fullWidth?: boolean
  required?: boolean
  error?: boolean
  helperText?: string
}

export const FormField: React.FC<FormFieldProps> = ({
  variant = 'outlined',
  size = 'medium',
  fullWidth = true,
  required = false,
  error = false,
  helperText,
  sx,
  ...props
}) => {
  return (
    <StyledTextField
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      required={required}
      error={error}
      helperText={helperText}
      sx={sx}
      {...props}
    />
  )
}

// Select Field Component
export interface SelectFieldProps extends Omit<SelectProps, 'variant'> {
  label?: string
  options: Array<{
    value: string | number
    label: string
    disabled?: boolean
  }>
  placeholder?: string
  size?: 'small' | 'medium'
  fullWidth?: boolean
  required?: boolean
  error?: boolean
  helperText?: string
}

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  options,
  placeholder,
  size = 'medium',
  fullWidth = true,
  required = false,
  error = false,
  helperText,
  sx,
  ...props
}) => {
  return (
    <FormControl fullWidth={fullWidth} required={required} error={error} size={size}>
      {label && <InputLabel>{label}</InputLabel>}
      <StyledSelect
        label={label}
        displayEmpty={!!placeholder}
        sx={sx}
        {...props}
      >
        {placeholder && (
          <MenuItem value="" disabled>
            {placeholder}
          </MenuItem>
        )}
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </MenuItem>
        ))}
      </StyledSelect>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  )
}

// Search Field Component
export interface SearchFieldProps extends Omit<TextFieldProps, 'variant'> {
  onSearch?: (value: string) => void
  placeholder?: string
  size?: 'small' | 'medium'
  fullWidth?: boolean
  debounceMs?: number
}

export const SearchField: React.FC<SearchFieldProps> = ({
  onSearch,
  placeholder = 'Search...',
  size = 'medium',
  fullWidth = true,
  debounceMs = 300,
  sx,
  ...props
}) => {
  const [searchValue, setSearchValue] = React.useState('')

  React.useEffect(() => {
    if (onSearch && debounceMs > 0) {
      const timer = setTimeout(() => {
        onSearch(searchValue)
      }, debounceMs)

      return () => clearTimeout(timer)
    } else if (onSearch) {
      onSearch(searchValue)
    }
  }, [searchValue, onSearch, debounceMs])

  return (
    <StyledTextField
      variant="outlined"
      size={size}
      fullWidth={fullWidth}
      placeholder={placeholder}
      value={searchValue}
      onChange={(e) => setSearchValue(e.target.value)}
      sx={sx}
      {...props}
    />
  )
}

// Export all form components
export {
  TextField as BaseTextField,
  Select as BaseSelect,
  FormControl as BaseFormControl,
  InputLabel as BaseInputLabel,
  FormHelperText as BaseFormHelperText,
}
