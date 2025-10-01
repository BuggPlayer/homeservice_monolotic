import React from 'react'
import {
  FormControl,
  FormControlProps,
  FormLabel,
  FormLabelProps,
  FormGroup,
  FormGroupProps,
  FormControlLabel,
  FormControlLabelProps,
  FormHelperText,
  FormHelperTextProps,
  RadioGroup,
  RadioGroupProps,
  Checkbox,
  CheckboxProps,
  Radio,
  RadioProps,
  Switch,
  SwitchProps,
  Slider,
  SliderProps,
  Rating,
  RatingProps,
  Autocomplete,
  AutocompleteProps,
  TextField,
  TextFieldProps,
  Select,
  SelectProps,
  MenuItem,
  MenuItemProps,
  InputLabel,
  InputLabelProps,
  FormControl as MuiFormControl,
  InputAdornment,
  InputAdornmentProps,
} from '@mui/material'
import { styled } from '@mui/material/styles'

// Form Field Component
export interface FormFieldProps {
  label?: string
  error?: boolean
  helperText?: string
  required?: boolean
  fullWidth?: boolean
  children: React.ReactNode
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error = false,
  helperText,
  required = false,
  fullWidth = false,
  children,
}) => (
  <FormControl fullWidth={fullWidth} error={error} required={required}>
    {label && <FormLabel>{label}</FormLabel>}
    {children}
    {helperText && <FormHelperText>{helperText}</FormHelperText>}
  </FormControl>
)

// Form Group Component
export interface CustomFormGroupProps extends FormGroupProps {
  children: React.ReactNode
}

export const CustomFormGroup: React.FC<CustomFormGroupProps> = ({
  children,
  ...props
}) => (
  <FormGroup {...props}>
    {children}
  </FormGroup>
)

// Form Control Label Component
export interface CustomFormControlLabelProps extends FormControlLabelProps {
  label: string
  control: React.ReactElement
  value?: any
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void
}

export const CustomFormControlLabel: React.FC<CustomFormControlLabelProps> = ({
  label,
  control,
  value,
  onChange,
  ...props
}) => (
  <FormControlLabel
    label={label}
    control={control}
    value={value}
    onChange={onChange}
    {...props}
  />
)

// Radio Group Component
export interface CustomRadioGroupProps extends RadioGroupProps {
  options: Array<{
    value: string | number
    label: string
    disabled?: boolean
  }>
  value: string | number
  onChange: (event: React.ChangeEvent<HTMLInputElement>, value: string) => void
  row?: boolean
}

export const CustomRadioGroup: React.FC<CustomRadioGroupProps> = ({
  options,
  value,
  onChange,
  row = false,
  ...props
}) => (
  <RadioGroup value={value} onChange={onChange} row={row} {...props}>
    {options.map((option) => (
      <FormControlLabel
        key={option.value}
        value={option.value}
        control={<Radio />}
        label={option.label}
        disabled={option.disabled}
      />
    ))}
  </RadioGroup>
)

// Checkbox Group Component
export interface CustomCheckboxGroupProps extends FormGroupProps {
  options: Array<{
    value: string | number
    label: string
    disabled?: boolean
  }>
  value: (string | number)[]
  onChange: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void
  row?: boolean
}

export const CustomCheckboxGroup: React.FC<CustomCheckboxGroupProps> = ({
  options,
  value,
  onChange,
  row = false,
  ...props
}) => (
  <FormGroup row={row} {...props}>
    {options.map((option) => (
      <FormControlLabel
        key={option.value}
        control={
          <Checkbox
            checked={value.includes(option.value)}
            onChange={onChange}
            value={option.value}
          />
        }
        label={option.label}
        disabled={option.disabled}
      />
    ))}
  </FormGroup>
)

// Switch Group Component
export interface CustomSwitchGroupProps extends FormGroupProps {
  options: Array<{
    value: string | number
    label: string
    disabled?: boolean
  }>
  value: (string | number)[]
  onChange: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void
  row?: boolean
}

export const CustomSwitchGroup: React.FC<CustomSwitchGroupProps> = ({
  options,
  value,
  onChange,
  row = false,
  ...props
}) => (
  <FormGroup row={row} {...props}>
    {options.map((option) => (
      <FormControlLabel
        key={option.value}
        control={
          <Switch
            checked={value.includes(option.value)}
            onChange={onChange}
            value={option.value}
          />
        }
        label={option.label}
        disabled={option.disabled}
      />
    ))}
  </FormGroup>
)

// Rating Component
export interface CustomRatingProps extends RatingProps {
  label?: string
  helperText?: string
  error?: boolean
  required?: boolean
}

export const CustomRating: React.FC<CustomRatingProps> = ({
  label,
  helperText,
  error = false,
  required = false,
  ...props
}) => (
  <FormControl error={error} required={required}>
    {label && <FormLabel>{label}</FormLabel>}
    <Rating {...props} />
    {helperText && <FormHelperText>{helperText}</FormHelperText>}
  </FormControl>
)

// Slider Component
export interface CustomSliderProps extends SliderProps {
  label?: string
  helperText?: string
  error?: boolean
  required?: boolean
  valueLabelDisplay?: 'auto' | 'on' | 'off'
}

export const CustomSlider: React.FC<CustomSliderProps> = ({
  label,
  helperText,
  error = false,
  required = false,
  valueLabelDisplay = 'auto',
  ...props
}) => (
  <FormControl error={error} required={required} fullWidth>
    {label && <FormLabel>{label}</FormLabel>}
    <Slider valueLabelDisplay={valueLabelDisplay} {...props} />
    {helperText && <FormHelperText>{helperText}</FormHelperText>}
  </FormControl>
)

// Autocomplete Component
export interface CustomAutocompleteProps extends Omit<AutocompleteProps<any, boolean, boolean, boolean>, 'renderInput'> {
  label?: string
  helperText?: string
  error?: boolean
  required?: boolean
  fullWidth?: boolean
  placeholder?: string
  options: any[]
  getOptionLabel?: (option: any) => string
  isOptionEqualToValue?: (option: any, value: any) => boolean
}

export const CustomAutocomplete: React.FC<CustomAutocompleteProps> = ({
  label,
  helperText,
  error = false,
  required = false,
  fullWidth = false,
  placeholder,
  options,
  getOptionLabel,
  isOptionEqualToValue,
  ...props
}) => (
  <FormControl fullWidth={fullWidth} error={error} required={required}>
    <Autocomplete
      options={options}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={isOptionEqualToValue}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          error={error}
          required={required}
        />
      )}
      {...props}
    />
    {helperText && <FormHelperText>{helperText}</FormHelperText>}
  </FormControl>
)

// Select Component
export interface CustomSelectProps extends SelectProps {
  label?: string
  helperText?: string
  error?: boolean
  required?: boolean
  fullWidth?: boolean
  options: Array<{
    value: string | number
    label: string
    disabled?: boolean
  }>
  placeholder?: string
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  label,
  helperText,
  error = false,
  required = false,
  fullWidth = false,
  options,
  placeholder,
  ...props
}) => (
  <FormControl fullWidth={fullWidth} error={error} required={required}>
    {label && <InputLabel>{label}</InputLabel>}
    <Select
      label={label}
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
    </Select>
    {helperText && <FormHelperText>{helperText}</FormHelperText>}
  </FormControl>
)

// Export all form components
export {
  FormControl as BaseFormControl,
  FormLabel as BaseFormLabel,
  FormGroup as BaseFormGroup,
  FormControlLabel as BaseFormControlLabel,
  FormHelperText as BaseFormHelperText,
  RadioGroup as BaseRadioGroup,
  Checkbox as BaseCheckbox,
  Radio as BaseRadio,
  Switch as BaseSwitch,
  Slider as BaseSlider,
  Rating as BaseRating,
  Autocomplete as BaseAutocomplete,
  TextField as BaseTextField,
  Select as BaseSelect,
  MenuItem as BaseMenuItem,
  InputLabel as BaseInputLabel,
  InputAdornment as BaseInputAdornment,
}
