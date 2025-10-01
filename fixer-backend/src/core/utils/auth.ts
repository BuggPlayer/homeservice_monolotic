import jwt from 'jsonwebtoken';
import { config } from '../../config';
import { JWTPayload, AuthTokens } from '@/types';

export class AuthUtils {
  /**
   * Generate JWT access token
   */
  static generateAccessToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
    return jwt.sign(payload, config.JWT.SECRET, {
      expiresIn: config.JWT.ACCESS_TOKEN_EXPIRATION,
    });
  }

  /**
   * Generate JWT refresh token
   */
  static generateRefreshToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
    return jwt.sign(payload, config.JWT.REFRESH_SECRET, {
      expiresIn: config.JWT.REFRESH_TOKEN_EXPIRATION,
    });
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
    try {
      return jwt.verify(token, config.JWT.SECRET) as JWTPayload;
    } catch (error) {
      throw new Error('Invalid or expired access token');
    }
  }

  /**
   * Verify JWT refresh token
   */
  static verifyRefreshToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, config.JWT.REFRESH_SECRET) as JWTPayload;
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