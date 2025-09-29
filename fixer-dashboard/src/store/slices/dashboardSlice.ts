import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { DashboardState, Analytics, EarningsData, PerformanceData, Booking, Quote, Message } from '../../types';
import { dashboardService } from '../../services/dashboardService';

const initialState: DashboardState = {
  isLoading: false,
  error: null,
  analytics: null,
  earningsData: [],
  performanceData: [],
  recentBookings: [],
  upcomingBookings: [],
  pendingQuotes: [],
  recentMessages: [],
};

// Async thunks
export const getAnalytics = createAsyncThunk(
  'dashboard/getAnalytics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await dashboardService.getAnalytics();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get analytics');
    }
  }
);

export const getEarningsData = createAsyncThunk(
  'dashboard/getEarningsData',
  async (timeRange: string, { rejectWithValue }) => {
    try {
      const response = await dashboardService.getEarningsData(timeRange);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get earnings data');
    }
  }
);

export const getPerformanceData = createAsyncThunk(
  'dashboard/getPerformanceData',
  async (timeRange: string, { rejectWithValue }) => {
    try {
      const response = await dashboardService.getPerformanceData(timeRange);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get performance data');
    }
  }
);

export const getRecentBookings = createAsyncThunk(
  'dashboard/getRecentBookings',
  async (limit: number = 5, { rejectWithValue }) => {
    try {
      const response = await dashboardService.getRecentBookings(limit);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get recent bookings');
    }
  }
);

export const getUpcomingBookings = createAsyncThunk(
  'dashboard/getUpcomingBookings',
  async (limit: number = 5, { rejectWithValue }) => {
    try {
      const response = await dashboardService.getUpcomingBookings(limit);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get upcoming bookings');
    }
  }
);

export const getPendingQuotes = createAsyncThunk(
  'dashboard/getPendingQuotes',
  async (limit: number = 5, { rejectWithValue }) => {
    try {
      const response = await dashboardService.getPendingQuotes(limit);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get pending quotes');
    }
  }
);

export const getRecentMessages = createAsyncThunk(
  'dashboard/getRecentMessages',
  async (limit: number = 5, { rejectWithValue }) => {
    try {
      const response = await dashboardService.getRecentMessages(limit);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get recent messages');
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateBooking: (state, action: PayloadAction<Booking>) => {
      const index = state.recentBookings.findIndex(booking => booking.id === action.payload.id);
      if (index !== -1) {
        state.recentBookings[index] = action.payload;
      }
      
      const upcomingIndex = state.upcomingBookings.findIndex(booking => booking.id === action.payload.id);
      if (upcomingIndex !== -1) {
        state.upcomingBookings[upcomingIndex] = action.payload;
      }
    },
    updateQuote: (state, action: PayloadAction<Quote>) => {
      const index = state.pendingQuotes.findIndex(quote => quote.id === action.payload.id);
      if (index !== -1) {
        state.pendingQuotes[index] = action.payload;
      }
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.recentMessages.unshift(action.payload);
      if (state.recentMessages.length > 5) {
        state.recentMessages.pop();
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Analytics
      .addCase(getAnalytics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAnalytics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.analytics = action.payload.analytics;
        state.error = null;
      })
      .addCase(getAnalytics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Get Earnings Data
      .addCase(getEarningsData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getEarningsData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.earningsData = action.payload.earningsData;
        state.error = null;
      })
      .addCase(getEarningsData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Get Performance Data
      .addCase(getPerformanceData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getPerformanceData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.performanceData = action.payload.performanceData;
        state.error = null;
      })
      .addCase(getPerformanceData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Get Recent Bookings
      .addCase(getRecentBookings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getRecentBookings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.recentBookings = action.payload.bookings;
        state.error = null;
      })
      .addCase(getRecentBookings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Get Upcoming Bookings
      .addCase(getUpcomingBookings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUpcomingBookings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.upcomingBookings = action.payload.bookings;
        state.error = null;
      })
      .addCase(getUpcomingBookings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Get Pending Quotes
      .addCase(getPendingQuotes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getPendingQuotes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pendingQuotes = action.payload.quotes;
        state.error = null;
      })
      .addCase(getPendingQuotes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Get Recent Messages
      .addCase(getRecentMessages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getRecentMessages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.recentMessages = action.payload.messages;
        state.error = null;
      })
      .addCase(getRecentMessages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, updateBooking, updateQuote, addMessage } = dashboardSlice.actions;
export default dashboardSlice.reducer;
