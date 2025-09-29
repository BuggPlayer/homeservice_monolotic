import { apiService } from './api';
import { Analytics, EarningsData, PerformanceData, Booking, Quote, Message, ApiResponse } from '../types';

class DashboardService {
  async getAnalytics(): Promise<ApiResponse<{ analytics: Analytics }>> {
    const response = await apiService.get('/dashboard/analytics');
    return response.data;
  }

  async getEarningsData(timeRange: string): Promise<ApiResponse<{ earningsData: EarningsData[] }>> {
    const response = await apiService.get('/dashboard/earnings', {
      params: { timeRange }
    });
    return response.data;
  }

  async getPerformanceData(timeRange: string): Promise<ApiResponse<{ performanceData: PerformanceData[] }>> {
    const response = await apiService.get('/dashboard/performance', {
      params: { timeRange }
    });
    return response.data;
  }

  async getRecentBookings(limit: number = 5): Promise<ApiResponse<{ bookings: Booking[] }>> {
    const response = await apiService.get('/dashboard/recent-bookings', {
      params: { limit }
    });
    return response.data;
  }

  async getUpcomingBookings(limit: number = 5): Promise<ApiResponse<{ bookings: Booking[] }>> {
    const response = await apiService.get('/dashboard/upcoming-bookings', {
      params: { limit }
    });
    return response.data;
  }

  async getPendingQuotes(limit: number = 5): Promise<ApiResponse<{ quotes: Quote[] }>> {
    const response = await apiService.get('/dashboard/pending-quotes', {
      params: { limit }
    });
    return response.data;
  }

  async getRecentMessages(limit: number = 5): Promise<ApiResponse<{ messages: Message[] }>> {
    const response = await apiService.get('/dashboard/recent-messages', {
      params: { limit }
    });
    return response.data;
  }

  async getCalendarEvents(startDate: string, endDate: string): Promise<ApiResponse<{ events: any[] }>> {
    const response = await apiService.get('/dashboard/calendar-events', {
      params: { startDate, endDate }
    });
    return response.data;
  }

  async getNotifications(): Promise<ApiResponse<{ notifications: any[] }>> {
    const response = await apiService.get('/dashboard/notifications');
    return response.data;
  }

  async markNotificationAsRead(notificationId: string): Promise<ApiResponse> {
    const response = await apiService.put(`/dashboard/notifications/${notificationId}/read`);
    return response.data;
  }
}

export const dashboardService = new DashboardService();
export default dashboardService;
