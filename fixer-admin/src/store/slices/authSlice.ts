import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { AuthService } from '../../services/api'
import type { User } from '../../types'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  token: string | null
  refreshToken: string | null
  tokenExpiry: number | null
  error: string | null
  lastLogin: string | null
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  token: null,
  refreshToken: null,
  tokenExpiry: null,
  error: null,
  lastLogin: null,
}

// Async thunks for API calls
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: { email: string; password: string; rememberMe?: boolean }) => {
    const response = await AuthService.login(credentials)
    return response.data
  }
)

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData: any) => {
    const response = await AuthService.register(userData)
    return response.data
  }
)

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async () => {
    await AuthService.logout()
  }
)

export const refreshAuthToken = createAsyncThunk(
  'auth/refreshToken',
  async (refreshToken: string) => {
    const response = await AuthService.refreshToken(refreshToken)
    return response.data
  }
)

export const getUserProfile = createAsyncThunk(
  'auth/getProfile',
  async () => {
    const response = await AuthService.getProfile()
    return response.data
  }
)

export const updateUserProfile = createAsyncThunk(
  'auth/updateProfile',
  async (userData: any) => {
    const response = await AuthService.updateProfile(userData)
    return response.data
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string; refreshToken?: string }>) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.refreshToken = action.payload.refreshToken || null
      state.isAuthenticated = true
      state.error = null
      state.lastLogin = new Date().toISOString()
      
      // Set token expiry (assuming 1 hour for access token)
      if (action.payload.token) {
        state.tokenExpiry = Date.now() + (60 * 60 * 1000) // 1 hour
      }
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.refreshToken = null
      state.isAuthenticated = false
      state.tokenExpiry = null
      state.error = null
      state.lastLogin = null
    },
    clearError: (state) => {
      state.error = null
    },
    updateUser: (state, action: PayloadAction<any>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
      }
    },
    setTokens: (state, action: PayloadAction<{ token: string; refreshToken: string }>) => {
      state.token = action.payload.token
      state.refreshToken = action.payload.refreshToken
      state.tokenExpiry = Date.now() + (60 * 60 * 1000) // 1 hour
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user as any
        state.token = action.payload.token
        state.refreshToken = action.payload.refreshToken
        state.isAuthenticated = true
        state.error = null
        state.lastLogin = new Date().toISOString()
        state.tokenExpiry = Date.now() + (60 * 60 * 1000) // 1 hour
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Login failed'
      })
      
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user as any
        state.token = action.payload.token
        state.refreshToken = action.payload.refreshToken
        state.isAuthenticated = true
        state.error = null
        state.lastLogin = new Date().toISOString()
        state.tokenExpiry = Date.now() + (60 * 60 * 1000) // 1 hour
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Registration failed'
      })
      
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null
        state.token = null
        state.refreshToken = null
        state.isAuthenticated = false
        state.tokenExpiry = null
        state.error = null
        state.lastLogin = null
      })
      
      // Refresh token
      .addCase(refreshAuthToken.fulfilled, (state, action) => {
        state.token = action.payload.token
        state.tokenExpiry = Date.now() + (60 * 60 * 1000) // 1 hour
      })
      
      // Get profile
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.user = action.payload as any
      })
      
      // Update profile
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.user = action.payload as any
      })
  },
})

export const { 
  setCredentials, 
  logout, 
  clearError, 
  updateUser, 
  setTokens 
} = authSlice.actions
export default authSlice.reducer
