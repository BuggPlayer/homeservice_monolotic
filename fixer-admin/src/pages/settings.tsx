import React, { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Switch,
  FormControlLabel,
  Divider,
  Avatar,
  IconButton,
  useTheme,
  useMediaQuery,
  Stack,
  Alert,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
} from '@mui/material'
import {
  Save as SaveIcon,
  PhotoCamera as CameraIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Palette as PaletteIcon,
  Language as LanguageIcon,
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
} from '@mui/icons-material'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

export function Settings() {
  const [tabValue, setTabValue] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [settings, setSettings] = useState({
    // General Settings
    businessName: 'Fixer Admin',
    businessEmail: 'admin@fixer.com',
    businessPhone: '+1-555-0123',
    businessAddress: '123 Business St, City, State 12345',
    timezone: 'America/New_York',
    currency: 'USD',
    language: 'en',
    
    // Security Settings
    twoFactorAuth: true,
    sessionTimeout: 30,
    passwordExpiry: 90,
    loginAttempts: 5,
    
    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    orderNotifications: true,
    userNotifications: true,
    systemNotifications: true,
    
    // Appearance Settings
    theme: 'light',
    primaryColor: '#1976d2',
    sidebarCollapsed: false,
    compactMode: false,
  })

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings(prev => ({
      ...prev,
      [field]: event.target.value,
    }))
  }

  const handleSwitchChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings(prev => ({
      ...prev,
      [field]: event.target.checked,
    }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Saving settings:', settings)
    } catch (error) {
      console.error('Error saving settings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const GeneralSettings = () => (
    <Stack spacing={3}>
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Business Information
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Business Name"
                value={settings.businessName}
                onChange={handleInputChange('businessName')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Business Email"
                type="email"
                value={settings.businessEmail}
                onChange={handleInputChange('businessEmail')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Business Phone"
                value={settings.businessPhone}
                onChange={handleInputChange('businessPhone')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Timezone"
                select
                value={settings.timezone}
                onChange={handleInputChange('timezone')}
              >
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Chicago">Central Time</option>
                <option value="America/Denver">Mountain Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Business Address"
                multiline
                rows={2}
                value={settings.businessAddress}
                onChange={handleInputChange('businessAddress')}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Regional Settings
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Currency"
                select
                value={settings.currency}
                onChange={handleInputChange('currency')}
              >
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="CAD">CAD - Canadian Dollar</option>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Language"
                select
                value={settings.language}
                onChange={handleInputChange('language')}
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Stack>
  )

  const SecuritySettings = () => (
    <Stack spacing={3}>
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Authentication
          </Typography>
          <Stack spacing={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.twoFactorAuth}
                  onChange={handleSwitchChange('twoFactorAuth')}
                />
              }
              label="Enable Two-Factor Authentication"
            />
            <TextField
              fullWidth
              label="Session Timeout (minutes)"
              type="number"
              value={settings.sessionTimeout}
              onChange={handleInputChange('sessionTimeout')}
              helperText="Automatically log out after this many minutes of inactivity"
            />
            <TextField
              fullWidth
              label="Password Expiry (days)"
              type="number"
              value={settings.passwordExpiry}
              onChange={handleInputChange('passwordExpiry')}
              helperText="Force password change after this many days"
            />
            <TextField
              fullWidth
              label="Max Login Attempts"
              type="number"
              value={settings.loginAttempts}
              onChange={handleInputChange('loginAttempts')}
              helperText="Lock account after this many failed login attempts"
            />
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Password Management
          </Typography>
          <Stack spacing={2}>
            <Button variant="outlined" startIcon={<EditIcon />}>
              Change Password
            </Button>
            <Button variant="outlined" color="error" startIcon={<DeleteIcon />}>
              Reset All User Passwords
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  )

  const NotificationSettings = () => (
    <Stack spacing={3}>
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Notification Channels
          </Typography>
          <Stack spacing={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.emailNotifications}
                  onChange={handleSwitchChange('emailNotifications')}
                />
              }
              label="Email Notifications"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.pushNotifications}
                  onChange={handleSwitchChange('pushNotifications')}
                />
              }
              label="Push Notifications"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.smsNotifications}
                  onChange={handleSwitchChange('smsNotifications')}
                />
              }
              label="SMS Notifications"
            />
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Notification Types
          </Typography>
          <Stack spacing={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.orderNotifications}
                  onChange={handleSwitchChange('orderNotifications')}
                />
              }
              label="Order Notifications"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.userNotifications}
                  onChange={handleSwitchChange('userNotifications')}
                />
              }
              label="User Management Notifications"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.systemNotifications}
                  onChange={handleSwitchChange('systemNotifications')}
                />
              }
              label="System Notifications"
            />
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  )

  const AppearanceSettings = () => (
    <Stack spacing={3}>
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Theme Settings
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Theme"
                select
                value={settings.theme}
                onChange={handleInputChange('theme')}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto</option>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Primary Color"
                type="color"
                value={settings.primaryColor}
                onChange={handleInputChange('primaryColor')}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Layout Settings
          </Typography>
          <Stack spacing={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.sidebarCollapsed}
                  onChange={handleSwitchChange('sidebarCollapsed')}
                />
              }
              label="Collapsed Sidebar by Default"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.compactMode}
                  onChange={handleSwitchChange('compactMode')}
                />
              }
              label="Compact Mode"
            />
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  )

  const ProfileSettings = () => (
    <Stack spacing={3}>
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Profile Picture
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Avatar
              sx={{ width: 80, height: 80 }}
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400"
            />
            <Box>
              <Button
                variant="outlined"
                startIcon={<CameraIcon />}
                sx={{ mb: 1 }}
              >
                Change Photo
              </Button>
              <Typography variant="body2" color="text.secondary">
                JPG, PNG up to 2MB
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Personal Information
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                value="John"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                value="Admin"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value="admin@fixer.com"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                value="+1-555-0123"
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Stack>
  )

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your account settings and preferences
        </Typography>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="settings tabs">
          <Tab label="General" />
          <Tab label="Security" />
          <Tab label="Notifications" />
          <Tab label="Appearance" />
          <Tab label="Profile" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <GeneralSettings />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <SecuritySettings />
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <NotificationSettings />
      </TabPanel>
      <TabPanel value={tabValue} index={3}>
        <AppearanceSettings />
      </TabPanel>
      <TabPanel value={tabValue} index={4}>
        <ProfileSettings />
      </TabPanel>

      {/* Save Button */}
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleSave}
          disabled={isLoading}
          startIcon={<SaveIcon />}
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </Box>
    </Box>
  )
}
