import { User } from '../../core/types';

export interface GetUsersRequest {
  page?: number;
  limit?: number;
  user_type?: 'customer' | 'provider' | 'admin';
  search?: string;
}

export interface GetUsersResponse {
  users: Omit<User, 'password_hash'>[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface GetUserResponse {
  user: Omit<User, 'password_hash'>;
}

export interface UpdateUserRequest {
  first_name?: string;
  last_name?: string;
  phone?: string;
  profile_picture?: string;
  is_verified?: boolean;
}

export interface UpdateUserResponse {
  user: Omit<User, 'password_hash'>;
  message: string;
}

export interface DeleteUserResponse {
  message: string;
}
