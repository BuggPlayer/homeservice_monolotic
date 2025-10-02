import * as jwt from 'jsonwebtoken';
import { config } from '../../config';
import { JWTPayload, AuthTokens } from '../../types';

export class AuthUtils {
  /**
   * Validate JWT configuration
   */
  private static validateJWTConfig(): void {
    if (!config.JWT.SECRET) {
      throw new Error('JWT_SECRET must be set in environment variables');
    }
    if (!config.JWT.REFRESH_SECRET) {
      throw new Error('JWT_REFRESH_SECRET must be set in environment variables');
    }
  }

  /**
   * Generate JWT access token
   */
  static generateAccessToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
    this.validateJWTConfig();
    
    const secret = config.JWT.SECRET;
    const expiresIn = config.JWT.ACCESS_TOKEN_EXPIRATION;
    
    if (!secret) {
      throw new Error('JWT secret is not configured');
    }
    
    return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
  }

  /**
   * Generate JWT refresh token
   */
  static generateRefreshToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
    this.validateJWTConfig();
    
    const secret = config.JWT.REFRESH_SECRET;
    const expiresIn = config.JWT.REFRESH_TOKEN_EXPIRATION;
    
    if (!secret) {
      throw new Error('JWT refresh secret is not configured');
    }
    
    return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
  }

  /**
   * Generate both access and refresh tokens
   */
  static generateTokens(payload: Omit<JWTPayload, 'iat' | 'exp'>): AuthTokens {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  /**
   * Verify JWT access token
   */
  static verifyAccessToken(token: string): JWTPayload {
    this.validateJWTConfig();
    
    const secret = config.JWT.SECRET;
    if (!secret) {
      throw new Error('JWT secret is not configured');
    }
    
    try {
      return jwt.verify(token, secret) as JWTPayload;
    } catch (error) {
      throw new Error('Invalid or expired access token');
    }
  }

  /**
   * Verify JWT refresh token
   */
  static verifyRefreshToken(token: string): JWTPayload {
    this.validateJWTConfig();
    
    const secret = config.JWT.REFRESH_SECRET;
    if (!secret) {
      throw new Error('JWT refresh secret is not configured');
    }
    
    try {
      return jwt.verify(token, secret) as JWTPayload;
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }
  }

  /**
   * Extract token from Authorization header
   */
  static extractTokenFromHeader(authHeader: string | undefined): string {
    if (!authHeader) {
      throw new Error('Authorization header is required');
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw new Error('Invalid authorization header format');
    }

    return parts[1];
  }
}