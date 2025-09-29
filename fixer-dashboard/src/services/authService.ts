import { apiService } from './api';
import { User, ApiResponse } from '../types';

class AuthService {
  async login(credentials: { email: string; password: string }): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await apiService.post('/auth/login', credentials);
    return response.data;
  }

  async getProfile(): Promise<ApiResponse<{ user: User }>> {
    const response = await apiService.get('/auth/profile');
    return response.data;
  }

  async updateProfile(profileData: Partial<User>): Promise<ApiResponse<{ user: User }>> {
    const response = await apiService.put('/auth/profile', profileData);
    return response.data;
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse> {
    const response = await apiService.put('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  }

  async logout(): Promise<ApiResponse> {
    const response = await apiService.post('/auth/logout');
    return response.data;
  }
}

export const authService = new AuthService();
export default authService;
