// src/domains/identity/application/handlers/logout.handler.ts

import { Inject, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

import { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import { IDENTITY_SESSION_REPOSITORY } from '../identity.tokens';

import { LogoutCommand } from '../commands/logout.command';

import { SessionRevocationReason } from '../../domain/entities/session.entity';
import { InvalidCredentialsException } from '../../domain/exceptions/invalid-credentials.exception';

import type { SessionRepository } from '../../domain/repositories/session.repository';

@Injectable()
export class LogoutHandler implements CommandHandler<LogoutCommand, void> {
  constructor(
    @Inject(IDENTITY_SESSION_REPOSITORY)
    private readonly sessionRepository: SessionRepository,
  ) {}

  async execute(command: LogoutCommand): Promise<void> {
    // Deterministically hash the refresh token
    const refreshTokenHash = crypto
      .createHash('sha256')
      .update(command.refreshToken)
      .digest('hex');

    // Find the matching session
    const session =
      await this.sessionRepository.findByRefreshTokenHash(refreshTokenHash);

    if (!session) {
      throw new InvalidCredentialsException();
    }

    // Reject already revoked or expired sessions
    if (session.isRevoked() || session.isExpired()) {
      throw new InvalidCredentialsException();
    }

    // Revoke the session only once
    session.revoke(SessionRevocationReason.USER_LOGOUT);

    await this.sessionRepository.update(session);
  }
}
