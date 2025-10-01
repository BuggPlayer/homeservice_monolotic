import type { Meta, StoryObj } from '@storybook/react'
import { 
  FormField, 
  CustomFormGroup, 
  CustomFormControlLabel, 
  CustomRadioGroup, 
  CustomCheckboxGroup, 
  CustomSwitchGroup, 
  CustomRating, 
  CustomSlider, 
  CustomAutocomplete, 
  CustomSelect 
} from '../components/ui/Form'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { useState } from 'react'
import { 
  Person, 
  Email, 
  Lock, 
  Phone, 
  LocationOn, 
  Star 
} from '@mui/icons-material'

const meta: Meta<typeof FormField> = {
  title: 'UI/Form',
  component: FormField,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A collection of form components for building complex forms and data collection.',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

// Form Field Stories
export const FormFieldBasic: Story = {
  args: {
    label: 'Username',
    required: true,
    children: <input placeholder="Enter username" style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', width: '200px' }} />,
  },
}

export const FormFieldWithError: Story = {
  args: {
    label: 'Email',
    error: true,
    helperText: 'Please enter a valid email address',
    children: <input placeholder="Enter email" style={{ padding: '8px', border: '1px solid #f44336', borderRadius: '4px', width: '200px' }} />,
  },
}

export const FormFieldWithHelper: Story = {
  args: {
    label: 'Password',
    helperText: 'Password must be at least 8 characters long',
    children: <input type="password" placeholder="Enter password" style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', width: '200px' }} />,
  },
}

// Form Group Stories
const FormGroupMeta: Meta<typeof CustomFormGroup> = {
  title: 'UI/Form/FormGroup',
  component: CustomFormGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export const FormGroupBasic: StoryObj<typeof CustomFormGroup> = {
  args: {
    children: (
      <>
        <label>
          <input type="checkbox" /> Option 1
        </label>
        <label>
          <input type="checkbox" /> Option 2
        </label>
        <label>
          <input type="checkbox" /> Option 3
        </label>
      </>
    ),
  },
}

export const FormGroupWithLabel: StoryObj<typeof CustomFormGroup> = {
  args: {
    label: 'Select Options',
    children: (
      <>
        <label>
          <input type="checkbox" /> Option 1
        </label>
        <label>
          <input type="checkbox" /> Option 2
        </label>
        <label>
          <input type="checkbox" /> Option 3
        </label>
      </>
    ),
  },
}

// Form Control Label Stories
const FormControlLabelMeta: Meta<typeof CustomFormControlLabel> = {
  title: 'UI/Form/FormControlLabel',
  component: CustomFormControlLabel,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export const FormControlLabelBasic: StoryObj<typeof CustomFormControlLabel> = {
  args: {
    control: <input type="checkbox" />,
    label: 'I agree to the terms and conditions',
  },
}

export const FormControlLabelDisabled: StoryObj<typeof CustomFormControlLabel> = {
  args: {
    control: <input type="checkbox" disabled />,
    label: 'Disabled option',
  },
}

// Radio Group Stories
const RadioGroupMeta: Meta<typeof CustomRadioGroup> = {
  title: 'UI/Form/RadioGroup',
  component: CustomRadioGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

const RadioGroupWrapper = () => {
  const [value, setValue] = useState('option1')
  
  return (
    <CustomRadioGroup
      value={value}
      onChange={(e) => setValue(e.target.value)}
      options={[
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' },
      ]}
    />
  )
}

export const RadioGroupBasic: StoryObj<typeof CustomRadioGroup> = {
  render: () => <RadioGroupWrapper />,
}

export const RadioGroupWithLabel: StoryObj<typeof CustomRadioGroup> = {
  render: () => (
    <div>
      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
        Select an option:
      </label>
      <RadioGroupWrapper />
    </div>
  ),
}

// Checkbox Group Stories
const CheckboxGroupMeta: Meta<typeof CustomCheckboxGroup> = {
  title: 'UI/Form/CheckboxGroup',
  component: CustomCheckboxGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

const CheckboxGroupWrapper = () => {
  const [values, setValues] = useState<string[]>(['option1'])
  
  return (
    <CustomCheckboxGroup
      values={values}
      onChange={setValues}
      options={[
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' },
      ]}
    />
  )
}

export const CheckboxGroupBasic: StoryObj<typeof CustomCheckboxGroup> = {
  render: () => <CheckboxGroupWrapper />,
}

// Switch Group Stories
const SwitchGroupMeta: Meta<typeof CustomSwitchGroup> = {
  title: 'UI/Form/SwitchGroup',
  component: CustomSwitchGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

const SwitchGroupWrapper = () => {
  const [values, setValues] = useState<Record<string, boolean>>({
    notifications: true,
    darkMode: false,
    autoSave: true,
  })
  
  return (
    <CustomSwitchGroup
      values={values}
      onChange={setValues}
      options={[
        { key: 'notifications', label: 'Email Notifications' },
        { key: 'darkMode', label: 'Dark Mode' },
        { key: 'autoSave', label: 'Auto Save' },
      ]}
    />
  )
}

export const SwitchGroupBasic: StoryObj<typeof CustomSwitchGroup> = {
  render: () => <SwitchGroupWrapper />,
}

// Rating Stories
const RatingMeta: Meta<typeof CustomRating> = {
  title: 'UI/Form/Rating',
  component: CustomRating,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

const RatingWrapper = () => {
  const [value, setValue] = useState<number | null>(3)
  
  return (
    <CustomRating
      value={value}
      onChange={(_, newValue) => setValue(newValue)}
      precision={0.5}
    />
  )
}

export const RatingBasic: StoryObj<typeof CustomRating> = {
  render: () => <RatingWrapper />,
}

export const RatingReadOnly: StoryObj<typeof CustomRating> = {
  args: {
    value: 4.5,
    readOnly: true,
  },
}

export const RatingWithLabel: StoryObj<typeof CustomRating> = {
  render: () => (
    <div>
      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
        Rate this product:
      </label>
      <RatingWrapper />
    </div>
  ),
}

// Slider Stories
const SliderMeta: Meta<typeof CustomSlider> = {
  title: 'UI/Form/Slider',
  component: CustomSlider,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

const SliderWrapper = () => {
  const [value, setValue] = useState<number>(30)
  
  return (
    <CustomSlider
      value={value}
      onChange={(_, newValue) => setValue(newValue as number)}
      min={0}
      max={100}
      step={1}
      valueLabelDisplay="auto"
    />
  )
}

export const SliderBasic: StoryObj<typeof CustomSlider> = {
  render: () => <SliderWrapper />,
}

export const SliderRange: StoryObj<typeof CustomSlider> = {
  render: () => {
    const [value, setValue] = useState<number[]>([20, 80])
    
    return (
      <CustomSlider
        value={value}
        onChange={(_, newValue) => setValue(newValue as number[])}
        min={0}
        max={100}
        step={5}
        valueLabelDisplay="auto"
      />
    )
  },
}

// Autocomplete Stories
const AutocompleteMeta: Meta<typeof CustomAutocomplete> = {
  title: 'UI/Form/Autocomplete',
  component: CustomAutocomplete,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

const autocompleteOptions = [
  { label: 'The Godfather', year: 1972 },
  { label: 'The Godfather: Part II', year: 1974 },
  { label: 'The Dark Knight', year: 2008 },
  { label: '12 Angry Men', year: 1957 },
  { label: "Schindler's List", year: 1993 },
  { label: 'Pulp Fiction', year: 1994 },
]

const AutocompleteWrapper = () => {
  const [value, setValue] = useState<typeof autocompleteOptions[0] | null>(null)
  
  return (
    <CustomAutocomplete
      value={value}
      onChange={(_, newValue) => setValue(newValue)}
      options={autocompleteOptions}
      getOptionLabel={(option) => option.label}
      renderInput={(params) => (
        <input
          {...params}
          placeholder="Search for a movie"
          style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', width: '200px' }}
        />
      )}
    />
  )
}

export const AutocompleteBasic: StoryObj<typeof CustomAutocomplete> = {
  render: () => <AutocompleteWrapper />,
}

// Select Stories
const SelectMeta: Meta<typeof CustomSelect> = {
  title: 'UI/Form/Select',
  component: CustomSelect,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

const SelectWrapper = () => {
  const [value, setValue] = useState('')
  
  return (
    <CustomSelect
      value={value}
      onChange={(e) => setValue(e.target.value)}
      options={[
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' },
      ]}
      placeholder="Select an option"
    />
  )
}

export const SelectBasic: StoryObj<typeof CustomSelect> = {
  render: () => <SelectWrapper />,
}

// Complex Form Examples
export const UserRegistrationForm: Story = {
  render: () => {
    const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      country: '',
      interests: [] as string[],
      notifications: true,
      rating: 0,
    })
    
    return (
      <Card style={{ width: '500px', padding: '24px' }}>
        <h2>User Registration</h2>
        <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <FormField label="First Name" required>
              <input
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="Enter first name"
                style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', width: '100%' }}
              />
            </FormField>
            <FormField label="Last Name" required>
              <input
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                placeholder="Enter last name"
                style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', width: '100%' }}
              />
            </FormField>
          </div>
          
          <FormField label="Email" required>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter email"
              style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', width: '100%' }}
            />
          </FormField>
          
          <FormField label="Phone">
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Enter phone number"
              style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', width: '100%' }}
            />
          </FormField>
          
          <FormField label="Country">
            <CustomSelect
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              options={[
                { value: 'us', label: 'United States' },
                { value: 'ca', label: 'Canada' },
                { value: 'uk', label: 'United Kingdom' },
                { value: 'au', label: 'Australia' },
              ]}
              placeholder="Select country"
            />
          </FormField>
          
          <CustomCheckboxGroup
            label="Interests"
            values={formData.interests}
            onChange={(values) => setFormData({ ...formData, interests: values })}
            options={[
              { value: 'technology', label: 'Technology' },
              { value: 'sports', label: 'Sports' },
              { value: 'music', label: 'Music' },
              { value: 'travel', label: 'Travel' },
            ]}
          />
          
          <CustomSwitchGroup
            label="Preferences"
            values={{ notifications: formData.notifications }}
            onChange={(values) => setFormData({ ...formData, notifications: values.notifications })}
            options={[
              { key: 'notifications', label: 'Email Notifications' },
            ]}
          />
          
          <FormField label="Rate your experience">
            <CustomRating
              value={formData.rating}
              onChange={(_, newValue) => setFormData({ ...formData, rating: newValue || 0 })}
            />
          </FormField>
          
          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            <Button variant="outlined" type="button">
              Cancel
            </Button>
            <Button variant="contained" type="submit">
              Register
            </Button>
          </div>
        </form>
      </Card>
    )
  },
}

export const SettingsForm: Story = {
  render: () => {
    const [settings, setSettings] = useState({
      theme: 'light',
      language: 'en',
      notifications: {
        email: true,
        push: false,
        sms: false,
      },
      privacy: {
        profile: 'public',
        data: 'private',
      },
      volume: 50,
      rating: 4,
    })
    
    return (
      <Card style={{ width: '600px', padding: '24px' }}>
        <h2>Settings</h2>
        <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h3>Appearance</h3>
            <CustomRadioGroup
              value={settings.theme}
              onChange={(e) => setSettings({ ...settings, theme: e.target.value })}
              options={[
                { value: 'light', label: 'Light Theme' },
                { value: 'dark', label: 'Dark Theme' },
                { value: 'auto', label: 'Auto' },
              ]}
            />
          </div>
          
          <div>
            <h3>Language</h3>
            <CustomSelect
              value={settings.language}
              onChange={(e) => setSettings({ ...settings, language: e.target.value })}
              options={[
                { value: 'en', label: 'English' },
                { value: 'es', label: 'Spanish' },
                { value: 'fr', label: 'French' },
                { value: 'de', label: 'German' },
              ]}
            />
          </div>
          
          <div>
            <h3>Notifications</h3>
            <CustomSwitchGroup
              values={settings.notifications}
              onChange={(values) => setSettings({ ...settings, notifications: values })}
              options={[
                { key: 'email', label: 'Email Notifications' },
                { key: 'push', label: 'Push Notifications' },
                { key: 'sms', label: 'SMS Notifications' },
              ]}
            />
          </div>
          
          <div>
            <h3>Privacy</h3>
            <CustomRadioGroup
              value={settings.privacy.profile}
              onChange={(e) => setSettings({ 
                ...settings, 
                privacy: { ...settings.privacy, profile: e.target.value }
              })}
              options={[
                { value: 'public', label: 'Public Profile' },
                { value: 'private', label: 'Private Profile' },
                { value: 'friends', label: 'Friends Only' },
              ]}
            />
          </div>
          
          <div>
            <h3>Volume: {settings.volume}%</h3>
            <CustomSlider
              value={settings.volume}
              onChange={(_, newValue) => setSettings({ ...settings, volume: newValue as number })}
              min={0}
              max={100}
              step={1}
              valueLabelDisplay="auto"
            />
          </div>
          
          <div>
            <h3>App Rating</h3>
            <CustomRating
              value={settings.rating}
              onChange={(_, newValue) => setSettings({ ...settings, rating: newValue || 0 })}
            />
          </div>
          
          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            <Button variant="outlined">
              Reset
            </Button>
            <Button variant="contained">
              Save Settings
            </Button>
          </div>
        </form>
      </Card>
    )
  },
}
