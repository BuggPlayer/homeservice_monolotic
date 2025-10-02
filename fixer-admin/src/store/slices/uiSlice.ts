import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Toast {
  id: string
  message: string
  severity: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}

interface UIState {
  isLoading: boolean
  loadingMessage: string
  toasts: Toast[]
  sidebarOpen: boolean
  theme: 'light' | 'dark'
}

const initialState: UIState = {
  isLoading: false,
  loadingMessage: 'Loading...',
  toasts: [],
  sidebarOpen: true,
  theme: 'light',
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<{ isLoading: boolean; message?: string }>) => {
      state.isLoading = action.payload.isLoading
      if (action.payload.message) {
        state.loadingMessage = action.payload.message
      }
    },
    addToast: (state, action: PayloadAction<Omit<Toast, 'id'>>) => {
      const toast: Toast = {
        ...action.payload,
        id: Math.random().toString(36).substr(2, 9),
      }
      state.toasts.push(toast)
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter(toast => toast.id !== action.payload)
    },
    clearToasts: (state) => {
      state.toasts = []
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload
    },
  },
})

export const {
  setLoading,
  addToast,
  removeToast,
  clearToasts,
  setSidebarOpen,
  setTheme,
} = uiSlice.actions

export default uiSlice.reducer
