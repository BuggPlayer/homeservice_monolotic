import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ProviderState, ServiceProvider, ServiceRequest, Quote, Booking, User, Review, ProviderProfileForm, QuoteForm } from '../../types';
import { providerService } from '../../services/providerService';

const initialState: ProviderState = {
  profile: null,
  serviceRequests: [],
  quotes: [],
  bookings: [],
  customers: [],
  reviews: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const getProviderProfile = createAsyncThunk(
  'provider/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await providerService.getProfile();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get provider profile');
    }
  }
);

export const updateProviderProfile = createAsyncThunk(
  'provider/updateProfile',
  async (profileData: ProviderProfileForm, { rejectWithValue }) => {
    try {
      const response = await providerService.updateProfile(profileData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update provider profile');
    }
  }
);

export const getServiceRequests = createAsyncThunk(
  'provider/getServiceRequests',
  async (filters?: any, { rejectWithValue }) => {
    try {
      const response = await providerService.getServiceRequests(filters);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get service requests');
    }
  }
);

export const getQuotes = createAsyncThunk(
  'provider/getQuotes',
  async (filters?: any, { rejectWithValue }) => {
    try {
      const response = await providerService.getQuotes(filters);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get quotes');
    }
  }
);

export const submitQuote = createAsyncThunk(
  'provider/submitQuote',
  async ({ requestId, quoteData }: { requestId: string; quoteData: QuoteForm }, { rejectWithValue }) => {
    try {
      const response = await providerService.submitQuote(requestId, quoteData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to submit quote');
    }
  }
);

export const updateQuote = createAsyncThunk(
  'provider/updateQuote',
  async ({ quoteId, updates }: { quoteId: string; updates: Partial<QuoteForm> }, { rejectWithValue }) => {
    try {
      const response = await providerService.updateQuote(quoteId, updates);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update quote');
    }
  }
);

export const getBookings = createAsyncThunk(
  'provider/getBookings',
  async (filters?: any, { rejectWithValue }) => {
    try {
      const response = await providerService.getBookings(filters);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get bookings');
    }
  }
);

export const updateBookingStatus = createAsyncThunk(
  'provider/updateBookingStatus',
  async ({ bookingId, status }: { bookingId: string; status: string }, { rejectWithValue }) => {
    try {
      const response = await providerService.updateBookingStatus(bookingId, status);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update booking status');
    }
  }
);

export const getCustomers = createAsyncThunk(
  'provider/getCustomers',
  async (filters?: any, { rejectWithValue }) => {
    try {
      const response = await providerService.getCustomers(filters);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get customers');
    }
  }
);

export const getReviews = createAsyncThunk(
  'provider/getReviews',
  async (filters?: any, { rejectWithValue }) => {
    try {
      const response = await providerService.getReviews(filters);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get reviews');
    }
  }
);

const providerSlice = createSlice({
  name: 'provider',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateServiceRequest: (state, action: PayloadAction<ServiceRequest>) => {
      const index = state.serviceRequests.findIndex(req => req.id === action.payload.id);
      if (index !== -1) {
        state.serviceRequests[index] = action.payload;
      }
    },
    updateQuoteInList: (state, action: PayloadAction<Quote>) => {
      const index = state.quotes.findIndex(quote => quote.id === action.payload.id);
      if (index !== -1) {
        state.quotes[index] = action.payload;
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
      // Get Provider Profile
      .addCase(getProviderProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProviderProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload.provider;
        state.error = null;
      })
      .addCase(getProviderProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update Provider Profile
      .addCase(updateProviderProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProviderProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload.provider;
        state.error = null;
      })
      .addCase(updateProviderProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Get Service Requests
      .addCase(getServiceRequests.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getServiceRequests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.serviceRequests = action.payload.serviceRequests;
        state.error = null;
      })
      .addCase(getServiceRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Get Quotes
      .addCase(getQuotes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getQuotes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.quotes = action.payload.quotes;
        state.error = null;
      })
      .addCase(getQuotes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Submit Quote
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
      // Update Quote
      .addCase(updateQuote.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateQuote.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.quotes.findIndex(quote => quote.id === action.payload.quote.id);
        if (index !== -1) {
          state.quotes[index] = action.payload.quote;
        }
        state.error = null;
      })
      .addCase(updateQuote.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Get Bookings
      .addCase(getBookings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getBookings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bookings = action.payload.bookings;
        state.error = null;
      })
      .addCase(getBookings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update Booking Status
      .addCase(updateBookingStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.bookings.findIndex(booking => booking.id === action.payload.booking.id);
        if (index !== -1) {
          state.bookings[index] = action.payload.booking;
        }
        state.error = null;
      })
      .addCase(updateBookingStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Get Customers
      .addCase(getCustomers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCustomers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.customers = action.payload.customers;
        state.error = null;
      })
      .addCase(getCustomers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Get Reviews
      .addCase(getReviews.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = action.payload.reviews;
        state.error = null;
      })
      .addCase(getReviews.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, updateServiceRequest, updateQuoteInList, updateBookingInList } = providerSlice.actions;
export default providerSlice.reducer;
