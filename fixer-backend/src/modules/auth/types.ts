import { User, JWTPayload, AuthTokens } from '../../core/types';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  phone: string;
  user_type: 'customer' | 'provider' | 'admin';
  first_name: string;
  last_name: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateProfileRequest {
  first_name?: string;
  last_name?: string;
  phone?: string;
  profile_picture?: string;
}

export interface AuthResponse {
  user: Omit<User, 'password_hash'>;
  tokens: AuthTokens;
}

export interface LoginResponse extends AuthResponse {}

export interface RegisterResponse {
  user: Omit<User, 'password_hash'>;
  tokens: AuthTokens | null;
  requiresApproval?: boolean;
  message?: string;
}

export interface RefreshTokenResponse {
  tokens: AuthTokens;
}

export interface ChangePasswordResponse {
  message: string;
}

export interface UpdateProfileResponse {
  user: Omit<User, 'password_hash'>;
  message: string;
}
