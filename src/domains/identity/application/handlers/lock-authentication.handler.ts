// src/domains/identity/application/handlers/lock-authentication.handler.ts

import { Inject, Injectable } from '@nestjs/common';

import { CommandHandler } from '../../../../foundation/kernel/application/command-handler';
import type { EventPublisher } from '../../../../foundation/events/event-publisher.interface';

import {
  IDENTITY_AUTHENTICATION_REPOSITORY,
  IDENTITY_EVENT_PUBLISHER,
} from '../identity.tokens';

import { LockAuthenticationCommand } from '../commands/lock-authentication.command';

import { AuthenticationNotFoundException } from '../../domain/exceptions/authentication-not-found.exception';

import type { AuthenticationRepository } from '../../domain/repositories/authentication.repository';

@Injectable()
export class LockAuthenticationHandler implements CommandHandler<
  LockAuthenticationCommand,
  void
> {
  constructor(
    @Inject(IDENTITY_AUTHENTICATION_REPOSITORY)
    private readonly repository: AuthenticationRepository,

    @Inject(IDENTITY_EVENT_PUBLISHER)
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: LockAuthenticationCommand): Promise<void> {
    const authentication = await this.repository.findByIdentityId(
      command.identityId,
    );

    if (authentication === null) {
      throw new AuthenticationNotFoundException(command.identityId.value);
    }

    authentication.lock(
      command.lockedUntil,
      command.reason,
      command.lockedAt,
      command.correlationId,
    );

    await this.repository.save(authentication);

    await this.eventPublisher.publishAll(authentication.pullDomainEvents());
  }
}
