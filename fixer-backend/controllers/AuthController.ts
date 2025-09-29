import { Request, Response } from 'express';
import { UserService } from '@/services/UserService';
import { validationSchemas } from '@/middleware/validation';
import { ApiResponse } from '@/types';

export class AuthController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  /**
   * Register a new user
   */
  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { user, tokens } = await this.userService.register(req.body);

      const response: ApiResponse = {
        success: true,
        message: 'User registered successfully',
        data: {
          user: {
            id: user.id,
            email: user.email,
            phone: user.phone,
            user_type: user.user_type,
            first_name: user.first_name,
            last_name: user.last_name,
            is_verified: user.is_verified,
            created_at: user.created_at,
          },
          tokens,
        },
      };

      res.status(201).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Registration failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(400).json(response);
    }
  };

  /**
   * Login user
   */
  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      const { user, tokens } = await this.userService.login(email, password);

      const response: ApiResponse = {
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user.id,
            email: user.email,
            phone: user.phone,
            user_type: user.user_type,
            first_name: user.first_name,
            last_name: user.last_name,
            is_verified: user.is_verified,
            created_at: user.created_at,
          },
          tokens,
        },
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Login failed',
        error: error instanceof Error ? error.message : 'Invalid credentials',
      };

      res.status(401).json(response);
    }
  };

  /**
   * Refresh access token
   */
  refreshToken = async (req: Request, res: Response): Promise<void> => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        const response: ApiResponse = {
          success: false,
          message: 'Refresh token is required',
        };
        res.status(400).json(response);
        return;
      }

      const tokens = await this.userService.refreshToken(refreshToken);

      const response: ApiResponse = {
        success: true,
        message: 'Token refreshed successfully',
        data: { tokens },
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Token refresh failed',
        error: error instanceof Error ? error.message : 'Invalid refresh token',
      };

      res.status(401).json(response);
    }
  };

  /**
   * Logout user (client-side token removal)
   */
  logout = async (req: Request, res: Response): Promise<void> => {
    const response: ApiResponse = {
      success: true,
      message: 'Logout successful',
    };

    res.json(response);
  };

  /**
   * Get current user profile
   */
  getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        const response: ApiResponse = {
          success: false,
          message: 'User ID not found in token',
        };
        res.status(401).json(response);
        return;
      }

      const user = await this.userService.getProfile(userId);
      if (!user) {
        const response: ApiResponse = {
          success: false,
          message: 'User not found',
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        message: 'Profile retrieved successfully',
        data: {
          user: {
            id: user.id,
            email: user.email,
            phone: user.phone,
            user_type: user.user_type,
            first_name: user.first_name,
            last_name: user.last_name,
            profile_picture: user.profile_picture,
            is_verified: user.is_verified,
            created_at: user.created_at,
            updated_at: user.updated_at,
          },
        },
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve profile',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(500).json(response);
    }
  };

  /**
   * Update user profile
   */
  updateProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        const response: ApiResponse = {
          success: false,
          message: 'User ID not found in token',
        };
        res.status(401).json(response);
        return;
      }

      const user = await this.userService.updateProfile(userId, req.body);
      if (!user) {
        const response: ApiResponse = {
          success: false,
          message: 'User not found',
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        message: 'Profile updated successfully',
        data: {
          user: {
            id: user.id,
            email: user.email,
            phone: user.phone,
            user_type: user.user_type,
            first_name: user.first_name,
            last_name: user.last_name,
            profile_picture: user.profile_picture,
            is_verified: user.is_verified,
            updated_at: user.updated_at,
          },
        },
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to update profile',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(400).json(response);
    }
  };

  /**
   * Change password
   */
  changePassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        const response: ApiResponse = {
          success: false,
          message: 'User ID not found in token',
        };
        res.status(401).json(response);
        return;
      }

      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        const response: ApiResponse = {
          success: false,
          message: 'Current password and new password are required',
        };
        res.status(400).json(response);
        return;
      }

      await this.userService.changePassword(userId, currentPassword, newPassword);

      const response: ApiResponse = {
        success: true,
        message: 'Password changed successfully',
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to change password',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(400).json(response);
    }
  };
}
