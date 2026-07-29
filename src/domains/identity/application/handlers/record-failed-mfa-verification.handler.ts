// src/domains/identity/application/handlers/record-failed-mfa-verification.handler.ts

import { Inject, Injectable } from '@nestjs/common';

import type { EventPublisher } from '../../../../foundation/events/event-publisher.interface';
import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import {
  IDENTITY_AUTHENTICATION_REPOSITORY,
  IDENTITY_EVENT_PUBLISHER,
} from '../identity.tokens';

import { RecordFailedMfaVerificationCommand } from '../commands/record-failed-mfa-verification.command';

import { AuthenticationNotFoundException } from '../../domain/exceptions/authentication-not-found.exception';

import type { AuthenticationRepository } from '../../domain/repositories/authentication.repository';

import { IdentityId } from '../../domain/value-objects/identity-id.vo';

@Injectable()
export class RecordFailedMfaVerificationHandler implements CommandHandler<RecordFailedMfaVerificationCommand> {
  constructor(
    @Inject(IDENTITY_AUTHENTICATION_REPOSITORY)
    private readonly repository: AuthenticationRepository,

    @Inject(IDENTITY_EVENT_PUBLISHER)
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: RecordFailedMfaVerificationCommand): Promise<void> {
    const identityId = new IdentityId(command.identityId);

    const authentication = await this.repository.findByIdentityId(identityId);

    if (!authentication) {
      throw new AuthenticationNotFoundException(command.identityId);
    }

    authentication.recordFailedMfaVerification(
      command.reason,
      command.failedAt,
      command.correlationId,
    );

    await this.repository.save(authentication);

    await this.eventPublisher.publishAll(authentication.pullDomainEvents());
  }
}
