import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { ApiResponse } from '@/core/types';
import { 
  GetUsersRequest, 
  UpdateUserRequest 
} from '../types';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  /**
   * Get all users
   */
  getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const params: GetUsersRequest = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        user_type: req.query.user_type as 'customer' | 'provider' | 'admin',
        search: req.query.search as string,
      };

      const result = await this.userService.getUsers(params);

      const response: ApiResponse = {
        success: true,
        message: 'Users retrieved successfully',
        data: result,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve users',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(500).json(response);
    }
  };

  /**
   * Get user by ID
   */
  getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.userService.getUserById(id);

      const response: ApiResponse = {
        success: true,
        message: 'User retrieved successfully',
        data: result,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve user',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(404).json(response);
    }
  };

  /**
   * Update user
   */
  updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const data: UpdateUserRequest = req.body;
      const result = await this.userService.updateUser(id, data);

      const response: ApiResponse = {
        success: true,
        message: result.message,
        data: result,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to update user',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(400).json(response);
    }
  };

  /**
   * Delete user
   */
  deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.userService.deleteUser(id);

      const response: ApiResponse = {
        success: true,
        message: result.message,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to delete user',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(400).json(response);
    }
  };

  /**
   * Verify user email
   */
  verifyUserEmail = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.userService.verifyUserEmail(id);

      const response: ApiResponse = {
        success: true,
        message: result.message,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to verify user email',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(400).json(response);
    }
  };

  /**
   * Get user statistics
   */
  getUserStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.userService.getUserStats();

      const response: ApiResponse = {
        success: true,
        message: 'User statistics retrieved successfully',
        data: result,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve user statistics',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(500).json(response);
    }
  };
}
