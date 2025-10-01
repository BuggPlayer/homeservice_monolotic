import React from 'react'
import {
  TextField,
  TextFieldProps,
  InputAdornment,
  InputAdornmentProps,
  FormControl,
  FormControlProps,
  FormLabel,
  FormLabelProps,
  FormHelperText,
  FormHelperTextProps,
  Select,
  SelectProps,
  MenuItem,
  MenuItemProps,
  Checkbox,
  CheckboxProps,
  Radio,
  RadioProps,
  Switch,
  SwitchProps,
  Slider,
  SliderProps,
  Autocomplete,
  AutocompleteProps,
  Chip,
  ChipProps,
} from '@mui/material'
import { styled } from '@mui/material/styles'

// Styled TextField
const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.shape.borderRadius,
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.primary.main,
    },
  },
  '& .MuiInputLabel-root': {
    fontWeight: 500,
  },
}))

// Styled Select
const StyledSelect = styled(Select)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.primary.main,
  },
}))

// Text Input Component
export interface TextInputProps extends Omit<TextFieldProps, 'variant'> {
  variant?: 'outlined' | 'filled' | 'standard'
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  helperText?: string
  error?: boolean
  required?: boolean
  fullWidth?: boolean
}

export const TextInput: React.FC<TextInputProps> = ({
  variant = 'outlined',
  leftIcon,
  rightIcon,
  helperText,
  error = false,
  required = false,
  fullWidth = false,
  sx,
  ...props
}) => {
  return (
    <StyledTextField
      variant={variant}
      fullWidth={fullWidth}
      required={required}
      error={error}
      helperText={helperText}
      InputProps={{
        startAdornment: leftIcon ? (
          <InputAdornment position="start">{leftIcon}</InputAdornment>
        ) : undefined,
        endAdornment: rightIcon ? (
          <InputAdornment position="end">{rightIcon}</InputAdornment>
        ) : undefined,
      }}
      sx={sx}
      {...props}
    />
  )
}

// Select Input Component
export interface SelectInputProps extends Omit<SelectProps, 'variant'> {
  options: Array<{ value: string | number; label: string; disabled?: boolean }>
  placeholder?: string
  helperText?: string
  error?: boolean
  required?: boolean
  fullWidth?: boolean
  multiple?: boolean
}

export const SelectInput: React.FC<SelectInputProps> = ({
  options,
  placeholder,
  helperText,
  error = false,
  required = false,
  fullWidth = false,
  multiple = false,
  sx,
  ...props
}) => {
  return (
    <FormControl fullWidth={fullWidth} error={error} required={required}>
      <StyledSelect
        multiple={multiple}
        displayEmpty
        sx={sx}
        {...props}
      >
        {placeholder && (
          <MenuItem value="" disabled>
            {placeholder}
          </MenuItem>
        )}
        {options.map((option) => (
          <MenuItem
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </MenuItem>
        ))}
      </StyledSelect>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  )
}

// Checkbox Input Component
export interface CheckboxInputProps extends CheckboxProps {
  label?: string
  helperText?: string
  error?: boolean
  required?: boolean
}

export const CheckboxInput: React.FC<CheckboxInputProps> = ({
  label,
  helperText,
  error = false,
  required = false,
  sx,
  ...props
}) => {
  return (
    <FormControl error={error} required={required}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Checkbox sx={sx} {...props} />
        {label && <FormLabel>{label}</FormLabel>}
      </div>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  )
}

// Radio Input Component
export interface RadioInputProps extends RadioProps {
  label?: string
  helperText?: string
  error?: boolean
  required?: boolean
}

export const RadioInput: React.FC<RadioInputProps> = ({
  label,
  helperText,
  error = false,
  required = false,
  sx,
  ...props
}) => {
  return (
    <FormControl error={error} required={required}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Radio sx={sx} {...props} />
        {label && <FormLabel>{label}</FormLabel>}
      </div>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  )
}

// Switch Input Component
export interface SwitchInputProps extends SwitchProps {
  label?: string
  helperText?: string
  error?: boolean
  required?: boolean
}

export const SwitchInput: React.FC<SwitchInputProps> = ({
  label,
  helperText,
  error = false,
  required = false,
  sx,
  ...props
}) => {
  return (
    <FormControl error={error} required={required}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Switch sx={sx} {...props} />
        {label && <FormLabel>{label}</FormLabel>}
      </div>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  )
}

// Slider Input Component
export interface SliderInputProps extends SliderProps {
  label?: string
  helperText?: string
  error?: boolean
  required?: boolean
  valueLabelDisplay?: 'auto' | 'on' | 'off'
}

export const SliderInput: React.FC<SliderInputProps> = ({
  label,
  helperText,
  error = false,
  required = false,
  valueLabelDisplay = 'auto',
  sx,
  ...props
}) => {
  return (
    <FormControl error={error} required={required} fullWidth>
      {label && <FormLabel>{label}</FormLabel>}
      <Slider
        valueLabelDisplay={valueLabelDisplay}
        sx={sx}
        {...props}
      />
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  )
}

// Autocomplete Input Component
export interface AutocompleteInputProps extends Omit<AutocompleteProps<any, boolean, boolean, boolean>, 'renderInput'> {
  label?: string
  helperText?: string
  error?: boolean
  required?: boolean
  fullWidth?: boolean
  placeholder?: string
}

export const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
  label,
  helperText,
  error = false,
  required = false,
  fullWidth = false,
  placeholder,
  sx,
  ...props
}) => {
  return (
    <FormControl fullWidth={fullWidth} error={error} required={required}>
      <Autocomplete
        renderInput={(params) => (
          <TextInput
            {...params}
            label={label}
            placeholder={placeholder}
            error={error}
            required={required}
          />
        )}
        sx={sx}
        {...props}
      />
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  )
}

// Chip Input Component
export interface ChipInputProps {
  label?: string
  value: string[]
  onChange: (value: string[]) => void
  options?: string[]
  placeholder?: string
  helperText?: string
  error?: boolean
  required?: boolean
  fullWidth?: boolean
  maxChips?: number
  allowDuplicates?: boolean
}

export const ChipInput: React.FC<ChipInputProps> = ({
  label,
  value,
  onChange,
  options = [],
  placeholder,
  helperText,
  error = false,
  required = false,
  fullWidth = false,
  maxChips,
  allowDuplicates = false,
  sx,
}) => {
  const handleAddChip = (chipValue: string) => {
    if (maxChips && value.length >= maxChips) return
    if (!allowDuplicates && value.includes(chipValue)) return
    onChange([...value, chipValue])
  }

  const handleDeleteChip = (chipToDelete: string) => {
    onChange(value.filter((chip) => chip !== chipToDelete))
  }

  return (
    <FormControl fullWidth={fullWidth} error={error} required={required}>
      {label && <FormLabel>{label}</FormLabel>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 8 }}>
        {value.map((chip) => (
          <Chip
            key={chip}
            label={chip}
            onDelete={() => handleDeleteChip(chip)}
            color="primary"
            variant="outlined"
          />
        ))}
        {options.map((option) => (
          <Chip
            key={option}
            label={option}
            onClick={() => handleAddChip(option)}
            color="default"
            variant="outlined"
            style={{ cursor: 'pointer' }}
          />
        ))}
      </div>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  )
}

// Export all input-related components
export {
  InputAdornment,
  FormControl,
  FormLabel,
  FormHelperText,
  MenuItem,
  TextField as BaseTextField,
  Select as BaseSelect,
  Checkbox as BaseCheckbox,
  Radio as BaseRadio,
  Switch as BaseSwitch,
  Slider as BaseSlider,
  Autocomplete as BaseAutocomplete,
  Chip as BaseChip,
}