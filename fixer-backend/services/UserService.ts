import { UserModel } from '@/models/User';
import { AuthUtils } from '@/utils/auth';
import { User, AuthTokens } from '@/types';

export class UserService {
  private userModel: UserModel;

  constructor() {
    this.userModel = new UserModel();
  }

  /**
   * Register a new user
   */
  async register(userData: {
    email: string;
    phone: string;
    password: string;
    user_type: 'customer' | 'provider';
    first_name: string;
    last_name: string;
  }): Promise<{ user: User; tokens: AuthTokens }> {
    // Check if email already exists
    if (await this.userModel.emailExists(userData.email)) {
      throw new Error('Email already registered');
    }

    // Check if phone already exists
    if (await this.userModel.phoneExists(userData.phone)) {
      throw new Error('Phone number already registered');
    }

    // Hash password
    const password_hash = await AuthUtils.hashPassword(userData.password);

    // Create user
    const user = await this.userModel.create({
      ...userData,
      password_hash,
      is_verified: false,
    });

    // Generate tokens
    const tokens = AuthUtils.generateTokens({
      userId: user.id,
      email: user.email,
      userType: user.user_type as 'customer' | 'provider' | 'admin',
    });

    return { user, tokens };
  }

  /**
   * Login user
   */
  async login(email: string, password: string): Promise<{ user: User; tokens: AuthTokens }> {
    // Find user by email
    const user = await this.userModel.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isValidPassword = await AuthUtils.comparePassword(password, user.password_hash);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Generate tokens
    const tokens = AuthUtils.generateTokens({
      userId: user.id,
      email: user.email,
      userType: user.user_type as 'customer' | 'provider' | 'admin',
    });

    return { user, tokens };
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    try {
      const payload = AuthUtils.verifyRefreshToken(refreshToken);
      
      // Verify user still exists
      const user = await this.userModel.findById(payload.userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Generate new tokens
      return AuthUtils.generateTokens({
        userId: user.id,
        email: user.email,
        userType: user.user_type as 'customer' | 'provider' | 'admin',
      });
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  /**
   * Get user profile
   */
  async getProfile(userId: string): Promise<User | null> {
    return await this.userModel.findById(userId);
  }

  /**
   * Update user profile
   */
  async updateProfile(
    userId: string, 
    updates: Partial<{
      first_name: string;
      last_name: string;
      phone: string;
      profile_picture: string;
    }>
  ): Promise<User | null> {
    // Check if phone is being updated and if it's already taken
    if (updates.phone) {
      const existingUser = await this.userModel.findByPhone(updates.phone);
      if (existingUser && existingUser.id !== userId) {
        throw new Error('Phone number already in use');
      }
    }

    return await this.userModel.update(userId, updates);
  }

  /**
   * Change password
   */
  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<boolean> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Verify current password
    const isValidPassword = await AuthUtils.comparePassword(currentPassword, user.password_hash);
    if (!isValidPassword) {
      throw new Error('Current password is incorrect');
    }

    // Hash new password
    const newPasswordHash = await AuthUtils.hashPassword(newPassword);

    // Update password
    const updatedUser = await this.userModel.update(userId, { password_hash: newPasswordHash });
    return !!updatedUser;
  }

  /**
   * Verify user account
   */
  async verifyUser(userId: string): Promise<User | null> {
    return await this.userModel.verifyUser(userId);
  }

  /**
   * Delete user account
   */
  async deleteUser(userId: string): Promise<boolean> {
    return await this.userModel.delete(userId);
  }

  /**
   * Get users by type (admin only)
   */
  async getUsersByType(
    userType: string, 
    page: number = 1, 
    limit: number = 10
  ): Promise<{ users: User[]; total: number }> {
    return await this.userModel.findByType(userType, page, limit);
  }
}
