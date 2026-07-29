// src/domains/identity/application/handlers/logout-all-sessions.handler.ts

import { Inject, Injectable } from '@nestjs/common';

import { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import {
  IDENTITY_REPOSITORY,
  IDENTITY_SESSION_REPOSITORY,
} from '../identity.tokens';

import { LogoutAllSessionsCommand } from '../commands/logout-all-sessions.command';

import { InvalidCredentialsException } from '../../domain/exceptions/invalid-credentials.exception';

import type { IdentityRepository } from '../../domain/repositories/identity.repository';
import type { SessionRepository } from '../../domain/repositories/session.repository';

@Injectable()
export class LogoutAllSessionsHandler implements CommandHandler<
  LogoutAllSessionsCommand,
  void
> {
  constructor(
    @Inject(IDENTITY_REPOSITORY)
    private readonly identityRepository: IdentityRepository,

    @Inject(IDENTITY_SESSION_REPOSITORY)
    private readonly sessionRepository: SessionRepository,
  ) {}

  async execute(command: LogoutAllSessionsCommand): Promise<void> {
    const identity = await this.identityRepository.findByPublicId(
      command.identityId,
    );

    if (identity === null) {
      throw new InvalidCredentialsException();
    }

    await this.sessionRepository.revokeAllByIdentityId(identity.id.value);
  }
}
