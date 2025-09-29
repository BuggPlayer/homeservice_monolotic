import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  isLoading: boolean;
  loadingMessage: string;
  isModalVisible: boolean;
  modalType: string | null;
  modalData: any;
  toast: {
    visible: boolean;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
  };
  theme: 'light' | 'dark';
  language: string;
  onboardingCompleted: boolean;
  locationPermissionGranted: boolean;
  cameraPermissionGranted: boolean;
  notificationPermissionGranted: boolean;
}

const initialState: UIState = {
  isLoading: false,
  loadingMessage: '',
  isModalVisible: false,
  modalType: null,
  modalData: null,
  toast: {
    visible: false,
    message: '',
    type: 'info',
  },
  theme: 'light',
  language: 'en',
  onboardingCompleted: false,
  locationPermissionGranted: false,
  cameraPermissionGranted: false,
  notificationPermissionGranted: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<{ isLoading: boolean; message?: string }>) => {
      state.isLoading = action.payload.isLoading;
      state.loadingMessage = action.payload.message || '';
    },
    showModal: (state, action: PayloadAction<{ type: string; data?: any }>) => {
      state.isModalVisible = true;
      state.modalType = action.payload.type;
      state.modalData = action.payload.data;
    },
    hideModal: (state) => {
      state.isModalVisible = false;
      state.modalType = null;
      state.modalData = null;
    },
    showToast: (state, action: PayloadAction<{ message: string; type: 'success' | 'error' | 'info' | 'warning' }>) => {
      state.toast = {
        visible: true,
        message: action.payload.message,
        type: action.payload.type,
      };
    },
    hideToast: (state) => {
      state.toast.visible = false;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    setOnboardingCompleted: (state, action: PayloadAction<boolean>) => {
      state.onboardingCompleted = action.payload;
    },
    setLocationPermission: (state, action: PayloadAction<boolean>) => {
      state.locationPermissionGranted = action.payload;
    },
    setCameraPermission: (state, action: PayloadAction<boolean>) => {
      state.cameraPermissionGranted = action.payload;
    },
    setNotificationPermission: (state, action: PayloadAction<boolean>) => {
      state.notificationPermissionGranted = action.payload;
    },
    resetUI: (state) => {
      return { ...initialState };
    },
  },
});

export const {
  setLoading,
  showModal,
  hideModal,
  showToast,
  hideToast,
  setTheme,
  setLanguage,
  setOnboardingCompleted,
  setLocationPermission,
  setCameraPermission,
  setNotificationPermission,
  resetUI,
} = uiSlice.actions;

export default uiSlice.reducer;
