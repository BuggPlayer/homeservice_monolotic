import { UserRepository } from '../../../core/database/repositories';
import { AuthUtils, BcryptUtils } from '../../../core/utils';
import { User, JWTPayload } from '../../../core/types';
import { 
  LoginRequest, 
  RegisterRequest, 
  RefreshTokenRequest, 
  ChangePasswordRequest, 
  UpdateProfileRequest,
  LoginResponse,
  RegisterResponse,
  RefreshTokenResponse,
  ChangePasswordResponse,
  UpdateProfileResponse
} from '../types';

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  /**
   * Register a new user
   */
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    // Check if user already exists
    const existingUserByEmail = await this.userRepository.findByEmail(data.email);
    if (existingUserByEmail) {
      throw new Error('User with this email already exists');
    }

    const existingUserByPhone = await this.userRepository.findByPhone(data.phone);
    if (existingUserByPhone) {
      throw new Error('User with this phone number already exists');
    }

    // Hash password
    const passwordHash = await BcryptUtils.hashPassword(data.password);

    // Create user
    const userData = {
      email: data.email,
      password_hash: passwordHash,
      phone: data.phone,
      user_type: data.user_type,
      first_name: data.first_name,
      last_name: data.last_name,
      is_verified: false,
    };

    const user = await this.userRepository.create(userData);

    // Generate tokens
    const payload: Omit<JWTPayload, 'iat' | 'exp'> = {
      userId: user.id,
      email: user.email,
      userType: user.user_type as 'customer' | 'provider' | 'admin',
    };

    const tokens = AuthUtils.generateTokens(payload);

    return {
      user: this.sanitizeUser(user),
      tokens,
    };
  }

  /**
   * Login user
   */
  async login(data: LoginRequest): Promise<LoginResponse> {
    // Find user by email
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isValidPassword = await BcryptUtils.comparePassword(data.password, user.password_hash);
    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    // Generate tokens
    const payload: Omit<JWTPayload, 'iat' | 'exp'> = {
      userId: user.id,
      email: user.email,
      userType: user.user_type as 'customer' | 'provider' | 'admin',
    };

    const tokens = AuthUtils.generateTokens(payload);

    return {
      user: this.sanitizeUser(user),
      tokens,
    };
  }

  /**
   * Refresh access token
   */
  async refreshToken(data: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    // Verify refresh token
    const payload = AuthUtils.verifyRefreshToken(data.refreshToken);

    // Get user to ensure they still exist
    const user = await this.userRepository.findById(payload.userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Generate new tokens
    const newPayload: Omit<JWTPayload, 'iat' | 'exp'> = {
      userId: user.id,
      email: user.email,
      userType: user.user_type as 'customer' | 'provider' | 'admin',
    };

    const tokens = AuthUtils.generateTokens(newPayload);

    return { tokens };
  }

  /**
   * Change user password
   */
  async changePassword(userId: string, data: ChangePasswordRequest): Promise<ChangePasswordResponse> {
    // Get user
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Verify current password
    const isValidPassword = await BcryptUtils.comparePassword(data.currentPassword, user.password_hash);
    if (!isValidPassword) {
      throw new Error('Current password is incorrect');
    }

    // Hash new password
    const newPasswordHash = await BcryptUtils.hashPassword(data.newPassword);

    // Update password
    await this.userRepository.updatePassword(userId, newPasswordHash);

    return {
      message: 'Password changed successfully',
    };
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, data: UpdateProfileRequest): Promise<UpdateProfileResponse> {
    // Check if phone is being updated and if it's already taken
    if (data.phone) {
      const existingUser = await this.userRepository.findByPhone(data.phone);
      if (existingUser && existingUser.id !== userId) {
        throw new Error('Phone number is already in use');
      }
    }

    // Update user
    const updatedUser = await this.userRepository.update(userId, data);
    if (!updatedUser) {
      throw new Error('User not found');
    }

    return {
      user: this.sanitizeUser(updatedUser),
      message: 'Profile updated successfully',
    };
  }

  /**
   * Get user profile
   */
  async getProfile(userId: string): Promise<Omit<User, 'password_hash'>> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    return this.sanitizeUser(user);
  }

  /**
   * Verify user email
   */
  async verifyEmail(userId: string): Promise<{ message: string }> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (user.is_verified) {
      throw new Error('Email is already verified');
    }

    await this.userRepository.updateVerificationStatus(userId, true);

    return {
      message: 'Email verified successfully',
    };
  }

  /**
   * Sanitize user object by removing sensitive data
   */
  private sanitizeUser(user: User): Omit<User, 'password_hash'> {
    const { password_hash, ...sanitizedUser } = user;
    return sanitizedUser;
  }
}
