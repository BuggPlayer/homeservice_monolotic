import type { Meta, StoryObj } from '@storybook/react'
import { 
  TextInput, 
  SelectInput, 
  CheckboxInput, 
  RadioInput, 
  SwitchInput, 
  SliderInput, 
  AutocompleteInput, 
  ChipInput 
} from '../components/ui/input'
import { 
  Person, 
  Email, 
  Lock, 
  Visibility
} from '@mui/icons-material'
import { useState } from 'react'

const meta: Meta<typeof TextInput> = {
  title: 'UI/Input',
  component: TextInput,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A collection of input components for forms and data entry.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['outlined', 'filled', 'standard'],
      description: 'The variant of the input',
    },
    fullWidth: {
      control: { type: 'boolean' },
      description: 'Whether the input should take full width',
    },
    required: {
      control: { type: 'boolean' },
      description: 'Whether the input is required',
    },
    error: {
      control: { type: 'boolean' },
      description: 'Whether the input has an error state',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the input is disabled',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Text Input Stories
export const TextInputBasic: Story = {
  args: {
    label: 'Name',
    placeholder: 'Enter your name',
    fullWidth: true,
  },
}

export const TextInputWithIcon: Story = {
  args: {
    label: 'Email',
    placeholder: 'Enter your email',
    leftIcon: <Email />,
    fullWidth: true,
  },
}

export const TextInputPassword: Story = {
  args: {
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
    leftIcon: <Lock />,
    rightIcon: <Visibility />,
    fullWidth: true,
  },
}

export const TextInputError: Story = {
  args: {
    label: 'Email',
    placeholder: 'Enter your email',
    error: true,
    helperText: 'Please enter a valid email address',
    fullWidth: true,
  },
}

export const TextInputRequired: Story = {
  args: {
    label: 'Username',
    placeholder: 'Enter your username',
    required: true,
    fullWidth: true,
  },
}

export const TextInputDisabled: Story = {
  args: {
    label: 'Disabled Input',
    placeholder: 'This input is disabled',
    disabled: true,
    fullWidth: true,
  },
}

export const TextInputVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
      <TextInput
        label="Outlined"
        variant="outlined"
        placeholder="Outlined variant"
        fullWidth
      />
      <TextInput
        label="Filled"
        variant="filled"
        placeholder="Filled variant"
        fullWidth
      />
      <TextInput
        label="Standard"
        variant="standard"
        placeholder="Standard variant"
        fullWidth
      />
    </div>
  ),
}

// Select Input Stories

const selectOptions = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
  { value: 'option4', label: 'Option 4', disabled: true },
]

export const SelectInputBasic: StoryObj<typeof SelectInput> = {
  args: {
    label: 'Select Option',
    placeholder: 'Choose an option',
    options: selectOptions,
    fullWidth: true,
  },
}

export const SelectInputMultiple: StoryObj<typeof SelectInput> = {
  args: {
    label: 'Multiple Selection',
    placeholder: 'Choose multiple options',
    options: selectOptions,
    multiple: true,
    fullWidth: true,
  },
}

export const SelectInputError: StoryObj<typeof SelectInput> = {
  args: {
    label: 'Select with Error',
    placeholder: 'Choose an option',
    options: selectOptions,
    error: true,
    helperText: 'Please select an option',
    fullWidth: true,
  },
}

// Checkbox Input Stories

export const CheckboxInputBasic: StoryObj<typeof CheckboxInput> = {
  args: {
    label: 'I agree to the terms and conditions',
  },
}

export const CheckboxInputChecked: StoryObj<typeof CheckboxInput> = {
  args: {
    label: 'Remember me',
    defaultChecked: true,
  },
}

export const CheckboxInputError: StoryObj<typeof CheckboxInput> = {
  args: {
    label: 'Required checkbox',
    error: true,
    helperText: 'This field is required',
  },
}

// Radio Input Stories

export const RadioInputBasic: StoryObj<typeof RadioInput> = {
  args: {
    label: 'Option A',
    name: 'radio-group',
  },
}

export const RadioInputChecked: StoryObj<typeof RadioInput> = {
  args: {
    label: 'Option B',
    name: 'radio-group',
    defaultChecked: true,
  },
}

export const RadioInputError: StoryObj<typeof RadioInput> = {
  args: {
    label: 'Option C',
    name: 'radio-group',
    error: true,
    helperText: 'Please select an option',
  },
}

// Switch Input Stories

export const SwitchInputBasic: StoryObj<typeof SwitchInput> = {
  args: {
    label: 'Enable notifications',
  },
}

export const SwitchInputChecked: StoryObj<typeof SwitchInput> = {
  args: {
    label: 'Dark mode',
    defaultChecked: true,
  },
}

export const SwitchInputError: StoryObj<typeof SwitchInput> = {
  args: {
    label: 'Required switch',
    error: true,
    helperText: 'This field is required',
  },
}

// Slider Input Stories

export const SliderInputBasic: StoryObj<typeof SliderInput> = {
  args: {
    label: 'Volume',
    defaultValue: 30,
    min: 0,
    max: 100,
    step: 1,
  },
}

export const SliderInputRange: StoryObj<typeof SliderInput> = {
  args: {
    label: 'Price Range',
    defaultValue: [20, 80],
    min: 0,
    max: 100,
    step: 5,
    valueLabelDisplay: 'on',
  },
}

export const SliderInputError: StoryObj<typeof SliderInput> = {
  args: {
    label: 'Required slider',
    defaultValue: 0,
    min: 0,
    max: 100,
    error: true,
    helperText: 'Please select a value',
  },
}

// Autocomplete Input Stories

const autocompleteOptions = [
  { label: 'The Godfather', year: 1972 },
  { label: 'The Godfather: Part II', year: 1974 },
  { label: 'The Dark Knight', year: 2008 },
  { label: '12 Angry Men', year: 1957 },
  { label: "Schindler's List", year: 1993 },
  { label: 'Pulp Fiction', year: 1994 },
]

export const AutocompleteInputBasic: StoryObj<typeof AutocompleteInput> = {
  args: {
    label: 'Movie',
    placeholder: 'Search for a movie',
    options: autocompleteOptions,
    fullWidth: true,
  },
}

export const AutocompleteInputMultiple: StoryObj<typeof AutocompleteInput> = {
  args: {
    label: 'Tags',
    placeholder: 'Add tags',
    options: ['React', 'TypeScript', 'Material-UI', 'Storybook', 'JavaScript'],
    multiple: true,
    fullWidth: true,
  },
}

export const AutocompleteInputError: StoryObj<typeof AutocompleteInput> = {
  args: {
    label: 'Required Autocomplete',
    placeholder: 'Select an option',
    options: autocompleteOptions,
    error: true,
    helperText: 'Please select an option',
    fullWidth: true,
  },
}

// Chip Input Stories

const ChipInputWrapper = () => {
  const [chips, setChips] = useState<string[]>(['React', 'TypeScript'])
  
  return (
    <ChipInput
      label="Skills"
      value={chips}
      onChange={setChips}
      options={['JavaScript', 'Python', 'Java', 'C++', 'Go', 'Rust']}
      placeholder="Add skills"
      fullWidth
    />
  )
}

export const ChipInputBasic: StoryObj<typeof ChipInput> = {
  render: () => <ChipInputWrapper />,
}

const ChipInputWithMax = () => {
  const [chips, setChips] = useState<string[]>(['React'])
  
  return (
    <ChipInput
      label="Tags (Max 3)"
      value={chips}
      onChange={setChips}
      options={['Frontend', 'Backend', 'Full-stack', 'DevOps', 'Mobile']}
      maxChips={3}
      fullWidth
    />
  )
}

export const ChipInputWithMaxChips: StoryObj<typeof ChipInput> = {
  render: () => <ChipInputWithMax />,
}

// Form Examples
export const LoginForm: Story = {
  render: () => (
    <div style={{ width: '400px', padding: '20px' }}>
      <h2>Login Form</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <TextInput
          label="Email"
          type="email"
          placeholder="Enter your email"
          leftIcon={<Email />}
          fullWidth
          required
        />
        <TextInput
          label="Password"
          type="password"
          placeholder="Enter your password"
          leftIcon={<Lock />}
          rightIcon={<Visibility />}
          fullWidth
          required
        />
        <CheckboxInput
          label="Remember me"
        />
      </div>
    </div>
  ),
}

export const RegistrationForm: Story = {
  render: () => (
    <div style={{ width: '400px', padding: '20px' }}>
      <h2>Registration Form</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <TextInput
          label="Full Name"
          placeholder="Enter your full name"
          leftIcon={<Person />}
          fullWidth
          required
        />
        <TextInput
          label="Email"
          type="email"
          placeholder="Enter your email"
          leftIcon={<Email />}
          fullWidth
          required
        />
        <SelectInput
          label="Country"
          placeholder="Select your country"
          options={[
            { value: 'us', label: 'United States' },
            { value: 'ca', label: 'Canada' },
            { value: 'uk', label: 'United Kingdom' },
            { value: 'au', label: 'Australia' },
          ]}
          fullWidth
          required
        />
        <SwitchInput
          label="I agree to receive marketing emails"
        />
      </div>
    </div>
  ),
}
