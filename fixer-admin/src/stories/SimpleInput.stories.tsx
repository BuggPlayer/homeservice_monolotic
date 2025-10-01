import type { Meta, StoryObj } from '@storybook/react'
import { 
  TextField as MuiTextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Switch,
  Slider,
  Autocomplete,
  Chip,
  Box,
  Typography
} from '@mui/material'
import { useState } from 'react'

const meta: Meta<typeof MuiTextField> = {
  title: 'UI/Simple Input',
  component: MuiTextField,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['outlined', 'filled', 'standard'],
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium'],
    },
    disabled: {
      control: { type: 'boolean' },
    },
    error: {
      control: { type: 'boolean' },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const TextField: Story = {
  args: {
    label: 'Text Field',
    variant: 'outlined',
    placeholder: 'Enter text here',
  },
}

export const TextFieldWithError: Story = {
  args: {
    label: 'Text Field with Error',
    variant: 'outlined',
    error: true,
    helperText: 'This field is required',
  },
}

export const TextFieldDisabled: Story = {
  args: {
    label: 'Disabled Text Field',
    variant: 'outlined',
    disabled: true,
    value: 'This field is disabled',
  },
}

export const PasswordField: Story = {
  args: {
    label: 'Password',
    type: 'password',
    variant: 'outlined',
  },
}

export const MultilineField: Story = {
  args: {
    label: 'Multiline Text',
    multiline: true,
    rows: 4,
    variant: 'outlined',
    placeholder: 'Enter multiple lines of text...',
  },
}

export const SelectField: Story = {
  render: () => {
    const [value, setValue] = useState('')
    
    return (
      <FormControl fullWidth>
        <InputLabel>Select Option</InputLabel>
        <Select
          value={value}
          label="Select Option"
          onChange={(e) => setValue(e.target.value)}
        >
          <MenuItem value="option1">Option 1</MenuItem>
          <MenuItem value="option2">Option 2</MenuItem>
          <MenuItem value="option3">Option 3</MenuItem>
        </Select>
      </FormControl>
    )
  },
}

export const CheckboxField: Story = {
  render: () => {
    const [checked, setChecked] = useState(false)
    
    return (
      <FormControlLabel
        control={
          <Checkbox
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
          />
        }
        label="I agree to the terms and conditions"
      />
    )
  },
}

export const SwitchField: Story = {
  render: () => {
    const [enabled, setEnabled] = useState(false)
    
    return (
      <FormControlLabel
        control={
          <Switch
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
          />
        }
        label="Enable notifications"
      />
    )
  },
}

export const SliderField: Story = {
  render: () => {
    const [value, setValue] = useState(30)
    
    return (
      <Box sx={{ width: 300 }}>
        <Typography gutterBottom>Volume: {value}</Typography>
        <Slider
          value={value}
          onChange={(_, newValue) => setValue(newValue as number)}
          min={0}
          max={100}
          step={1}
        />
      </Box>
    )
  },
}

export const AutocompleteField: Story = {
  render: () => {
    const [value, setValue] = useState(null)
    const options = [
      { label: 'The Godfather', year: 1972 },
      { label: 'The Godfather: Part II', year: 1974 },
      { label: 'The Dark Knight', year: 2008 },
      { label: '12 Angry Men', year: 1957 },
      { label: 'Schindler\'s List', year: 1993 },
    ]
    
    return (
      <Autocomplete
        options={options}
        getOptionLabel={(option) => option.label}
        value={value}
        onChange={(_, newValue) => setValue(newValue)}
        renderInput={(params) => (
          <TextField {...params} label="Movie" variant="outlined" />
        )}
        sx={{ width: 300 }}
      />
    )
  },
}

export const ChipInput: Story = {
  render: () => {
    const [chips, setChips] = useState(['React', 'TypeScript'])
    
    const handleDelete = (chipToDelete: string) => {
      setChips((chips) => chips.filter((chip) => chip !== chipToDelete))
    }
    
    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, width: 300 }}>
        {chips.map((chip) => (
          <Chip
            key={chip}
            label={chip}
            onDelete={() => handleDelete(chip)}
            variant="outlined"
          />
        ))}
      </Box>
    )
  },
}
