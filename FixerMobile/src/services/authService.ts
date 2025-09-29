import { apiService } from './api';
import { API_ENDPOINTS } from '../constants';
import { LoginForm, RegisterForm, User, ApiResponse, AuthTokens } from '../types';

class AuthService {
  async login(credentials: LoginForm): Promise<ApiResponse<{ user: User; tokens: AuthTokens }>> {
    const response = await apiService.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
    return response.data;
  }

  async register(userData: RegisterForm): Promise<ApiResponse<{ user: User; tokens: AuthTokens }>> {
    const response = await apiService.post(API_ENDPOINTS.AUTH.REGISTER, userData);
    return response.data;
  }

  async refreshToken(refreshToken: string): Promise<ApiResponse<{ tokens: AuthTokens }>> {
    const response = await apiService.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN, { refreshToken });
    return response.data;
  }

  async getProfile(): Promise<ApiResponse<{ user: User }>> {
    const response = await apiService.get(API_ENDPOINTS.AUTH.PROFILE);
    return response.data;
  }

  async updateProfile(profileData: Partial<User>): Promise<ApiResponse<{ user: User }>> {
    const response = await apiService.put(API_ENDPOINTS.AUTH.PROFILE, profileData);
    return response.data;
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse> {
    const response = await apiService.put(API_ENDPOINTS.AUTH.PROFILE, {
      currentPassword,
      newPassword,
    });
    return response.data;
  }

  async logout(): Promise<ApiResponse> {
    const response = await apiService.post(API_ENDPOINTS.AUTH.LOGOUT);
    return response.data;
  }

  async verifyOTP(phone: string, otp: string): Promise<ApiResponse<{ user: User; tokens: AuthTokens }>> {
    const response = await apiService.post('/auth/verify-otp', { phone, otp });
    return response.data;
  }

  async resendOTP(phone: string): Promise<ApiResponse> {
    const response = await apiService.post('/auth/resend-otp', { phone });
    return response.data;
  }
}

export const authService = new AuthService();
export default authService;
