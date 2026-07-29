// src/domains/identity/application/handlers/login.handler.ts

import { Inject, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

import { CommandHandler } from '../../../../foundation/kernel/application/command-handler';
import type { PasswordHasher } from '../../../../foundation/security/password-hasher.interface';
import { JwtTokenService } from '../../../../infrastructure/security/jwt-token.service';

import {
  IDENTITY_REPOSITORY,
  IDENTITY_SESSION_REPOSITORY,
  IDENTITY_PASSWORD_HASHER,
} from '../identity.tokens';

import { LoginCommand } from '../commands/login.command';
import type { LoginResult } from '../contracts/login-result';

import { IdentityStatus } from '../../domain/aggregates/identity.aggregate';
import { SessionEntity } from '../../domain/entities/session.entity';

import { IdentityNotActiveException } from '../../domain/exceptions/identity-not-active.exception';
import { InvalidCredentialsException } from '../../domain/exceptions/invalid-credentials.exception';

import type { IdentityRepository } from '../../domain/repositories/identity.repository';
import type { SessionRepository } from '../../domain/repositories/session.repository';

import { Email } from '../../domain/value-objects/email.vo';

@Injectable()
export class LoginHandler implements CommandHandler<LoginCommand, LoginResult> {
  constructor(
    @Inject(IDENTITY_REPOSITORY)
    private readonly repository: IdentityRepository,

    @Inject(IDENTITY_SESSION_REPOSITORY)
    private readonly sessionRepository: SessionRepository,

    @Inject(IDENTITY_PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasher,

    private readonly jwtTokenService: JwtTokenService,
  ) {}

  async execute(command: LoginCommand): Promise<LoginResult> {
    const email = new Email(command.email);

    const identity = await this.repository.findByEmail(email);

    if (!identity) {
      throw new InvalidCredentialsException();
    }

    if (identity.status !== IdentityStatus.ACTIVE) {
      throw new IdentityNotActiveException();
    }

    const authentication = await this.repository.findAuthenticationByIdentityId(
      identity.id.value,
    );

    if (!authentication || !authentication.passwordHash) {
      throw new InvalidCredentialsException();
    }

    const isPasswordValid = await this.passwordHasher.compare(
      command.password,
      authentication.passwordHash,
    );

    if (!isPasswordValid) {
      throw new InvalidCredentialsException();
    }

    const accessToken = this.jwtTokenService.generateAccessToken({
      sub: identity.id.value,
      publicId: identity.publicId.value,
      email: identity.email.value,
      type: identity.type,
    });

    const refreshToken = this.jwtTokenService.generateRefreshToken({
      sub: identity.id.value,
      publicId: identity.publicId.value,
    });

    // Deterministically hash refresh token before persisting
    const refreshTokenHash = crypto
      .createHash('sha256')
      .update(refreshToken)
      .digest('hex');

    // Create session entity (30 days expiry)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const session = SessionEntity.create(
      identity.id.value,
      refreshTokenHash,
      expiresAt,
    );

    // Persist session
    await this.sessionRepository.save(session);

    return {
      accessToken,
      refreshToken,
      expiresIn: 900,
    };
  }
}
