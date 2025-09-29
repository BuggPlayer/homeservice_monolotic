import { Request, Response } from 'express';
import { ServiceProviderModel } from '@/models/ServiceProvider';
import { UserModel } from '@/models/User';
import { validationSchemas } from '@/middleware/validation';
import { ApiResponse, PaginatedResponse } from '@/types';

export class ServiceProviderController {
  private serviceProviderModel: ServiceProviderModel;
  private userModel: UserModel;

  constructor() {
    this.serviceProviderModel = new ServiceProviderModel();
    this.userModel = new UserModel();
  }

  /**
   * Create or update provider profile
   */
  createOrUpdateProfile = async (req: Request, res: Response): Promise<void> => {
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

      // Check if user is a provider
      if (req.user?.userType !== 'provider') {
        const response: ApiResponse = {
          success: false,
          message: 'Only providers can create profiles',
        };
        res.status(403).json(response);
        return;
      }

      // Check if profile already exists
      const existingProfile = await this.serviceProviderModel.findByUserId(userId);
      
      let provider;
      if (existingProfile) {
        // Update existing profile
        provider = await this.serviceProviderModel.update(existingProfile.id, req.body);
      } else {
        // Create new profile
        provider = await this.serviceProviderModel.create({
          ...req.body,
          user_id: userId,
        });
      }

      if (!provider) {
        const response: ApiResponse = {
          success: false,
          message: 'Failed to create/update profile',
        };
        res.status(500).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        message: existingProfile ? 'Profile updated successfully' : 'Profile created successfully',
        data: { provider },
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to create/update profile',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(400).json(response);
    }
  };

  /**
   * Get provider profile
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

      const provider = await this.serviceProviderModel.findByUserId(userId);

      if (!provider) {
        const response: ApiResponse = {
          success: false,
          message: 'Provider profile not found',
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        message: 'Profile retrieved successfully',
        data: { provider },
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
   * Get providers with filters
   */
  getProviders = async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        service_type,
        service_area,
        verification_status,
        min_rating,
        page = 1,
        limit = 10,
      } = req.query;

      const filters = {
        service_type: service_type as string,
        service_area: service_area as string,
        verification_status: verification_status as string,
        min_rating: min_rating ? parseFloat(min_rating as string) : undefined,
        page: parseInt(page as string) || 1,
        limit: parseInt(limit as string) || 10,
      };

      const { providers, total } = await this.serviceProviderModel.findMany(filters);

      const response: PaginatedResponse<typeof providers[0]> = {
        data: providers,
        pagination: {
          page: filters.page,
          limit: filters.limit,
          total,
          totalPages: Math.ceil(total / filters.limit),
        },
      };

      res.json({
        success: true,
        message: 'Providers retrieved successfully',
        data: response,
      });
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve providers',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(500).json(response);
    }
  };

  /**
   * Get single provider by ID
   */
  getProvider = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const provider = await this.serviceProviderModel.findById(id);

      if (!provider) {
        const response: ApiResponse = {
          success: false,
          message: 'Provider not found',
        };
        res.status(404).json(response);
        return;
      }

      // Get user details
      const user = await this.userModel.findById(provider.user_id);
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
        message: 'Provider retrieved successfully',
        data: {
          provider: {
            ...provider,
            user: {
              id: user.id,
              first_name: user.first_name,
              last_name: user.last_name,
              email: user.email,
              phone: user.phone,
              profile_picture: user.profile_picture,
              is_verified: user.is_verified,
            },
          },
        },
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve provider',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(500).json(response);
    }
  };

  /**
   * Update verification status (admin only)
   */
  updateVerificationStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status || !['pending', 'verified', 'rejected'].includes(status)) {
        const response: ApiResponse = {
          success: false,
          message: 'Invalid status. Must be pending, verified, or rejected',
        };
        res.status(400).json(response);
        return;
      }

      const provider = await this.serviceProviderModel.updateVerificationStatus(id, status);

      if (!provider) {
        const response: ApiResponse = {
          success: false,
          message: 'Provider not found',
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        message: 'Verification status updated successfully',
        data: { provider },
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to update verification status',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(500).json(response);
    }
  };

  /**
   * Get providers by service type and location
   */
  getProvidersByServiceAndLocation = async (req: Request, res: Response): Promise<void> => {
    try {
      const { serviceType, city } = req.params;

      if (!serviceType || !city) {
        const response: ApiResponse = {
          success: false,
          message: 'Service type and city are required',
        };
        res.status(400).json(response);
        return;
      }

      const providers = await this.serviceProviderModel.findByServiceAndLocation(serviceType, city);

      const response: ApiResponse = {
        success: true,
        message: 'Providers retrieved successfully',
        data: { providers },
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve providers',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(500).json(response);
    }
  };
}
