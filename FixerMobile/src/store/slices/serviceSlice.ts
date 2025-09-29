import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ServiceState, ServiceRequest, ServiceProvider, Booking, Quote, ServiceRequestForm, ProviderProfileForm } from '../../types';
import { serviceService } from '../../services/serviceService';

const initialState: ServiceState = {
  serviceRequests: [],
  providers: [],
  bookings: [],
  quotes: [],
  isLoading: false,
  error: null,
};

// Service Request Async Thunks
export const createServiceRequest = createAsyncThunk(
  'service/createServiceRequest',
  async (requestData: ServiceRequestForm, { rejectWithValue }) => {
    try {
      const response = await serviceService.createServiceRequest(requestData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create service request');
    }
  }
);

export const getServiceRequests = createAsyncThunk(
  'service/getServiceRequests',
  async (filters?: any, { rejectWithValue }) => {
    try {
      const response = await serviceService.getServiceRequests(filters);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get service requests');
    }
  }
);

export const getServiceRequestById = createAsyncThunk(
  'service/getServiceRequestById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await serviceService.getServiceRequestById(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get service request');
    }
  }
);

export const updateServiceRequest = createAsyncThunk(
  'service/updateServiceRequest',
  async ({ id, updates }: { id: string; updates: Partial<ServiceRequestForm> }, { rejectWithValue }) => {
    try {
      const response = await serviceService.updateServiceRequest(id, updates);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update service request');
    }
  }
);

// Provider Async Thunks
export const createProviderProfile = createAsyncThunk(
  'service/createProviderProfile',
  async (profileData: ProviderProfileForm, { rejectWithValue }) => {
    try {
      const response = await serviceService.createProviderProfile(profileData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create provider profile');
    }
  }
);

export const getProviderProfile = createAsyncThunk(
  'service/getProviderProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await serviceService.getProviderProfile();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get provider profile');
    }
  }
);

export const getProviders = createAsyncThunk(
  'service/getProviders',
  async (filters?: any, { rejectWithValue }) => {
    try {
      const response = await serviceService.getProviders(filters);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get providers');
    }
  }
);

export const getProviderById = createAsyncThunk(
  'service/getProviderById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await serviceService.getProviderById(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get provider');
    }
  }
);

export const getProvidersByServiceAndLocation = createAsyncThunk(
  'service/getProvidersByServiceAndLocation',
  async ({ serviceType, city }: { serviceType: string; city: string }, { rejectWithValue }) => {
    try {
      const response = await serviceService.getProvidersByServiceAndLocation(serviceType, city);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get providers');
    }
  }
);

// Booking Async Thunks
export const getBookings = createAsyncThunk(
  'service/getBookings',
  async (filters?: any, { rejectWithValue }) => {
    try {
      const response = await serviceService.getBookings(filters);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get bookings');
    }
  }
);

export const getBookingById = createAsyncThunk(
  'service/getBookingById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await serviceService.getBookingById(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get booking');
    }
  }
);

// Quote Async Thunks
export const submitQuote = createAsyncThunk(
  'service/submitQuote',
  async ({ requestId, quoteData }: { requestId: string; quoteData: any }, { rejectWithValue }) => {
    try {
      const response = await serviceService.submitQuote(requestId, quoteData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to submit quote');
    }
  }
);

export const acceptQuote = createAsyncThunk(
  'service/acceptQuote',
  async (quoteId: string, { rejectWithValue }) => {
    try {
      const response = await serviceService.acceptQuote(quoteId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to accept quote');
    }
  }
);

const serviceSlice = createSlice({
  name: 'service',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearServiceRequests: (state) => {
      state.serviceRequests = [];
    },
    clearProviders: (state) => {
      state.providers = [];
    },
    clearBookings: (state) => {
      state.bookings = [];
    },
    clearQuotes: (state) => {
      state.quotes = [];
    },
    updateServiceRequestInList: (state, action: PayloadAction<ServiceRequest>) => {
      const index = state.serviceRequests.findIndex(req => req.id === action.payload.id);
      if (index !== -1) {
        state.serviceRequests[index] = action.payload;
      }
    },
    updateBookingInList: (state, action: PayloadAction<Booking>) => {
      const index = state.bookings.findIndex(booking => booking.id === action.payload.id);
      if (index !== -1) {
        state.bookings[index] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Service Requests
      .addCase(createServiceRequest.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createServiceRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.serviceRequests.unshift(action.payload.serviceRequest);
        state.error = null;
      })
      .addCase(createServiceRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(getServiceRequests.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getServiceRequests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.serviceRequests = action.payload.data;
        state.error = null;
      })
      .addCase(getServiceRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(getServiceRequestById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getServiceRequestById.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.serviceRequests.findIndex(req => req.id === action.payload.serviceRequest.id);
        if (index !== -1) {
          state.serviceRequests[index] = action.payload.serviceRequest;
        } else {
          state.serviceRequests.unshift(action.payload.serviceRequest);
        }
        state.error = null;
      })
      .addCase(getServiceRequestById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateServiceRequest.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateServiceRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.serviceRequests.findIndex(req => req.id === action.payload.serviceRequest.id);
        if (index !== -1) {
          state.serviceRequests[index] = action.payload.serviceRequest;
        }
        state.error = null;
      })
      .addCase(updateServiceRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Providers
      .addCase(createProviderProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createProviderProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(createProviderProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(getProviderProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProviderProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(getProviderProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(getProviders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProviders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.providers = action.payload.data;
        state.error = null;
      })
      .addCase(getProviders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(getProviderById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProviderById.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.providers.findIndex(provider => provider.id === action.payload.provider.id);
        if (index !== -1) {
          state.providers[index] = action.payload.provider;
        } else {
          state.providers.unshift(action.payload.provider);
        }
        state.error = null;
      })
      .addCase(getProviderById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(getProvidersByServiceAndLocation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProvidersByServiceAndLocation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.providers = action.payload.providers;
        state.error = null;
      })
      .addCase(getProvidersByServiceAndLocation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Bookings
      .addCase(getBookings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getBookings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bookings = action.payload.data;
        state.error = null;
      })
      .addCase(getBookings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(getBookingById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getBookingById.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.bookings.findIndex(booking => booking.id === action.payload.booking.id);
        if (index !== -1) {
          state.bookings[index] = action.payload.booking;
        } else {
          state.bookings.unshift(action.payload.booking);
        }
        state.error = null;
      })
      .addCase(getBookingById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Quotes
      .addCase(submitQuote.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(submitQuote.fulfilled, (state, action) => {
        state.isLoading = false;
        state.quotes.unshift(action.payload.quote);
        state.error = null;
      })
      .addCase(submitQuote.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(acceptQuote.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(acceptQuote.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bookings.unshift(action.payload.booking);
        state.error = null;
      })
      .addCase(acceptQuote.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  clearServiceRequests,
  clearProviders,
  clearBookings,
  clearQuotes,
  updateServiceRequestInList,
  updateBookingInList,
} = serviceSlice.actions;

export default serviceSlice.reducer;
