// src/domains/identity/application/handlers/expire-password.handler.ts

import { Inject, Injectable } from '@nestjs/common';

import { CommandHandler } from '../../../../foundation/kernel/application/command-handler';
import type { EventPublisher } from '../../../../foundation/events/event-publisher.interface';

import {
  IDENTITY_AUTHENTICATION_REPOSITORY,
  IDENTITY_EVENT_PUBLISHER,
} from '../identity.tokens';

import { ExpirePasswordCommand } from '../commands/expire-password.command';

import { AuthenticationNotFoundException } from '../../domain/exceptions/authentication-not-found.exception';

import type { AuthenticationRepository } from '../../domain/repositories/authentication.repository';

@Injectable()
export class ExpirePasswordHandler implements CommandHandler<
  ExpirePasswordCommand,
  void
> {
  constructor(
    @Inject(IDENTITY_AUTHENTICATION_REPOSITORY)
    private readonly authenticationRepository: AuthenticationRepository,

    @Inject(IDENTITY_EVENT_PUBLISHER)
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: ExpirePasswordCommand): Promise<void> {
    // ------------------------------------------------------------------
    // Load Authentication Aggregate
    // ------------------------------------------------------------------

    const aggregate = await this.authenticationRepository.findByIdentityId(
      command.identityId,
    );

    if (aggregate === null) {
      throw new AuthenticationNotFoundException(command.identityId.value);
    }

    // ------------------------------------------------------------------
    // Execute Domain Behavior
    // ------------------------------------------------------------------

    aggregate.expirePassword(command.expiredAt, command.correlationId);

    // ------------------------------------------------------------------
    // Persist
    // ------------------------------------------------------------------

    await this.authenticationRepository.save(aggregate);

    // ------------------------------------------------------------------
    // Publish Domain Events
    // ------------------------------------------------------------------

    await this.eventPublisher.publishAll(aggregate.pullDomainEvents());
  }
}
