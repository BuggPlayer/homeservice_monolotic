import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_BASE_URL } from '../constants';
import { store } from '../store';
import { clearCredentials } from '../store/slices/authSlice';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const state = store.getState();
        const token = state.auth.token;

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle token refresh
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const state = store.getState();
            const refreshToken = state.auth.refreshToken;

            if (refreshToken) {
              const response = await this.refreshToken(refreshToken);
              const newToken = response.data.tokens.accessToken;
              const newRefreshToken = response.data.tokens.refreshToken;

              // Update tokens in store
              store.dispatch({
                type: 'auth/setCredentials',
                payload: {
                  user: state.auth.user,
                  token: newToken,
                  refreshToken: newRefreshToken,
                },
              });

              // Retry original request with new token
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return this.api(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed, logout user
            store.dispatch(clearCredentials());
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Generic request methods
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.api.get<T>(url, config);
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.api.post<T>(url, data, config);
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.api.put<T>(url, data, config);
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.api.patch<T>(url, data, config);
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.api.delete<T>(url, config);
  }

  // File upload method
  async uploadFile<T>(url: string, file: FormData, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.api.post<T>(url, file, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers,
      },
    });
  }

  // Token refresh method
  private async refreshToken(refreshToken: string) {
    return this.api.post('/auth/refresh-token', { refreshToken });
  }

  // Set auth token manually
  setAuthToken(token: string) {
    this.api.defaults.headers.Authorization = `Bearer ${token}`;
  }

  // Clear auth token
  clearAuthToken() {
    delete this.api.defaults.headers.Authorization;
  }
}

export const apiService = new ApiService();
export default apiService;
