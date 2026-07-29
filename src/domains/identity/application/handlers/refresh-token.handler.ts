// src/domains/identity/application/handlers/refresh-token.handler.ts

import { Inject, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

import { CommandHandler } from '../../../../foundation/kernel/application/command-handler';
import { JwtTokenService } from '../../../../infrastructure/security/jwt-token.service';

import {
  IDENTITY_REPOSITORY,
  IDENTITY_SESSION_REPOSITORY,
} from '../identity.tokens';

import { RefreshTokenCommand } from '../commands/refresh-token.command';
import type { LoginResult } from '../contracts/login-result';

import {
  SessionEntity,
  SessionRevocationReason,
} from '../../domain/entities/session.entity';

import { InvalidCredentialsException } from '../../domain/exceptions/invalid-credentials.exception';

import type { IdentityRepository } from '../../domain/repositories/identity.repository';
import type { SessionRepository } from '../../domain/repositories/session.repository';

import { IdentityId } from '../../domain/value-objects/identity-id.vo';

@Injectable()
export class RefreshTokenHandler implements CommandHandler<
  RefreshTokenCommand,
  LoginResult
> {
  constructor(
    @Inject(IDENTITY_REPOSITORY)
    private readonly identityRepository: IdentityRepository,

    @Inject(IDENTITY_SESSION_REPOSITORY)
    private readonly sessionRepository: SessionRepository,

    private readonly jwtTokenService: JwtTokenService,
  ) {}

  async execute(command: RefreshTokenCommand): Promise<LoginResult> {
    let payload: { sub: string };

    // Verify and decode refresh token safely
    try {
      payload = this.jwtTokenService.verifyRefreshToken(command.refreshToken);
    } catch {
      throw new InvalidCredentialsException();
    }

    const identity = await this.identityRepository.findById(
      new IdentityId(payload.sub),
    );

    if (!identity) {
      throw new InvalidCredentialsException();
    }

    // Deterministically hash the incoming refresh token
    const refreshTokenHash = crypto
      .createHash('sha256')
      .update(command.refreshToken)
      .digest('hex');

    // Find the exact session by refresh token hash
    const matchedSession =
      await this.sessionRepository.findByRefreshTokenHash(refreshTokenHash);

    if (!matchedSession) {
      throw new InvalidCredentialsException();
    }

    // Reject reused, revoked, or expired tokens
    if (matchedSession.isRevoked() || matchedSession.isExpired()) {
      throw new InvalidCredentialsException();
    }

    // Revoke the old session immediately
    matchedSession.revoke(SessionRevocationReason.TOKEN_REUSE);

    await this.sessionRepository.update(matchedSession);

    // Generate new access token
    const accessToken = this.jwtTokenService.generateAccessToken({
      sub: identity.id.value,
      publicId: identity.publicId.value,
      email: identity.email.value,
      type: identity.type,
    });

    // Generate new refresh token
    const refreshToken = this.jwtTokenService.generateRefreshToken({
      sub: identity.id.value,
      publicId: identity.publicId.value,
    });

    // Hash and persist the new refresh token
    const newRefreshTokenHash = crypto
      .createHash('sha256')
      .update(refreshToken)
      .digest('hex');

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const newSession = SessionEntity.create(
      identity.id.value,
      newRefreshTokenHash,
      expiresAt,
    );

    await this.sessionRepository.save(newSession);

    return {
      accessToken,
      refreshToken,
      expiresIn: 900,
    };
  }
}
