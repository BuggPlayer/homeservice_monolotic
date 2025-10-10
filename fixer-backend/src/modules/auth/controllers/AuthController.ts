import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { ApiResponse } from '../../../core/types';
import { 
  LoginRequest, 
  RegisterRequest, 
  RefreshTokenRequest, 
  ChangePasswordRequest, 
  UpdateProfileRequest 
} from '../types';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * Register a new user
   */
  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const data: RegisterRequest = req.body;
      const result = await this.authService.register(data);

      const response: ApiResponse = {
        success: true,
        message: result.message || 'User registered successfully',
        data: result,
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
   * Register a new admin user (admin-only)
   */
  registerAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
      const data: RegisterRequest = req.body;
      const requestedBy = (req as any).user.userId;
      const result = await this.authService.register(data, requestedBy);

      const response: ApiResponse = {
        success: true,
        message: 'Admin user registered successfully',
        data: result,
      };

      res.status(201).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Admin registration failed',
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
      const data: LoginRequest = req.body;
      const result = await this.authService.login(data);

      const response: ApiResponse = {
        success: true,
        message: 'Login successful',
        data: result,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Login failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(401).json(response);
    }
  };

  /**
   * Refresh access token
   */
  refreshToken = async (req: Request, res: Response): Promise<void> => {
    try {
      const data: RefreshTokenRequest = req.body;
      const result = await this.authService.refreshToken(data);

      const response: ApiResponse = {
        success: true,
        message: 'Token refreshed successfully',
        data: result,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Token refresh failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(401).json(response);
    }
  };

  /**
   * Change password
   */
  changePassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.userId;
      const data: ChangePasswordRequest = req.body;
      const result = await this.authService.changePassword(userId, data);

      const response: ApiResponse = {
        success: true,
        message: result.message,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Password change failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(400).json(response);
    }
  };

  /**
   * Update profile
   */
  updateProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.userId;
      const data: UpdateProfileRequest = req.body;
      const result = await this.authService.updateProfile(userId, data);

      const response: ApiResponse = {
        success: true,
        message: result.message,
        data: result,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Profile update failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(400).json(response);
    }
  };

  /**
   * Get user profile
   */
  getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.userId;
      const result = await this.authService.getProfile(userId);

      const response: ApiResponse = {
        success: true,
        message: 'Profile retrieved successfully',
        data: result,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve profile',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(404).json(response);
    }
  };

  /**
   * Verify email
   */
  verifyEmail = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.userId;
      const result = await this.authService.verifyEmail(userId);

      const response: ApiResponse = {
        success: true,
        message: result.message,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Email verification failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(400).json(response);
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
}
