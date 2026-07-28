// src/infrastructure/security/jwt-token.service.ts

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export interface AccessTokenPayload {
  sub: string;
  publicId: string;
  email: string;
  type: string;
}

export interface RefreshTokenPayload {
  sub: string;
  publicId: string;
  iat?: number;
  exp?: number;
  iss?: string;
}

@Injectable()
export class JwtTokenService {
  constructor(private readonly jwtService: JwtService) {}

  generateAccessToken(payload: AccessTokenPayload): string {
    return this.jwtService.sign(payload, {
      expiresIn: '15m',
    });
  }

  generateRefreshToken(
    payload: Pick<AccessTokenPayload, 'sub' | 'publicId'>,
  ): string {
    return this.jwtService.sign(payload, {
      expiresIn: '7d',
    });
  }

  verifyRefreshToken(token: string): RefreshTokenPayload {
    return this.jwtService.verify<RefreshTokenPayload>(token);
  }
}
