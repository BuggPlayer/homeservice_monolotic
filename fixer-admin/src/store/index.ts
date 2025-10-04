import { configureStore } from '@reduxjs/toolkit'
import authSlice from './slices/authSlice'
import uiSlice from './slices/uiSlice'
import dataSlice from './slices/dataSlice'

export const store = configureStore({
  reducer: {
    auth: authSlice,
    ui: uiSlice,
    data: dataSlice,
  },
  devTools: process.env.NODE_ENV !== 'production',
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
