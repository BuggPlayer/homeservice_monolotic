import { UserRepository } from '@/core/database/repositories';
import { User } from '@/core/types';
import { 
  GetUsersRequest, 
  GetUsersResponse, 
  GetUserResponse, 
  UpdateUserRequest, 
  UpdateUserResponse, 
  DeleteUserResponse 
} from '../types';

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  /**
   * Get all users with pagination and filtering
   */
  async getUsers(params: GetUsersRequest): Promise<GetUsersResponse> {
    const { page = 1, limit = 10, user_type, search } = params;

    let result;
    
    if (search) {
      result = await this.userRepository.search(search, page, limit);
    } else if (user_type) {
      result = await this.userRepository.findByUserType(user_type, page, limit);
    } else {
      result = await this.userRepository.findAll(page, limit);
    }

    const totalPages = Math.ceil(result.total / limit);

    return {
      users: result.data.map(user => this.sanitizeUser(user)),
      pagination: {
        page,
        limit,
        total: result.total,
        totalPages,
      },
    };
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<GetUserResponse> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    return {
      user: this.sanitizeUser(user),
    };
  }

  /**
   * Update user
   */
  async updateUser(userId: string, data: UpdateUserRequest): Promise<UpdateUserResponse> {
    // Check if phone is being updated and if it's already taken
    if (data.phone) {
      const existingUser = await this.userRepository.findByPhone(data.phone);
      if (existingUser && existingUser.id !== userId) {
        throw new Error('Phone number is already in use');
      }
    }

    const updatedUser = await this.userRepository.update(userId, data);
    if (!updatedUser) {
      throw new Error('User not found');
    }

    return {
      user: this.sanitizeUser(updatedUser),
      message: 'User updated successfully',
    };
  }

  /**
   * Delete user
   */
  async deleteUser(userId: string): Promise<DeleteUserResponse> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const deleted = await this.userRepository.delete(userId);
    if (!deleted) {
      throw new Error('Failed to delete user');
    }

    return {
      message: 'User deleted successfully',
    };
  }

  /**
   * Verify user email
   */
  async verifyUserEmail(userId: string): Promise<{ message: string }> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (user.is_verified) {
      throw new Error('User is already verified');
    }

    await this.userRepository.updateVerificationStatus(userId, true);

    return {
      message: 'User email verified successfully',
    };
  }

  /**
   * Get user statistics
   */
  async getUserStats() {
    const totalUsers = await this.userRepository.count();
    const customers = await this.userRepository.count('user_type = $1', ['customer']);
    const providers = await this.userRepository.count('user_type = $1', ['provider']);
    const admins = await this.userRepository.count('user_type = $1', ['admin']);
    const verifiedUsers = await this.userRepository.count('is_verified = $1', [true]);

    return {
      totalUsers,
      customers,
      providers,
      admins,
      verifiedUsers,
      unverifiedUsers: totalUsers - verifiedUsers,
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
