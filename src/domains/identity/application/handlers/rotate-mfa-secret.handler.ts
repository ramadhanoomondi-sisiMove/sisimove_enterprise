// src/domains/identity/application/handlers/rotate-mfa-secret.handler.ts

import { Inject, Injectable } from '@nestjs/common';

import { CommandHandler } from '../../../../foundation/kernel/application/command-handler';
import type { EventPublisher } from '../../../../foundation/events/event-publisher.interface';

import {
  IDENTITY_AUTHENTICATION_REPOSITORY,
  IDENTITY_EVENT_PUBLISHER,
} from '../identity.tokens';

import { RotateMfaSecretCommand } from '../commands/rotate-mfa-secret.command';

import { AuthenticationNotFoundException } from '../../domain/exceptions/authentication-not-found.exception';
import type { AuthenticationRepository } from '../../domain/repositories/authentication.repository';

@Injectable()
export class RotateMfaSecretHandler implements CommandHandler<
  RotateMfaSecretCommand,
  void
> {
  constructor(
    @Inject(IDENTITY_AUTHENTICATION_REPOSITORY)
    private readonly repository: AuthenticationRepository,

    @Inject(IDENTITY_EVENT_PUBLISHER)
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: RotateMfaSecretCommand): Promise<void> {
    const authentication = await this.repository.findByIdentityId(
      command.identityId,
    );

    if (authentication === null) {
      throw new AuthenticationNotFoundException(command.identityId.value);
    }

    authentication.rotateMfaSecret(
      command.encryptedSecret,
      command.rotatedAt,
      command.correlationId,
    );

    await this.repository.save(authentication);

    await this.eventPublisher.publishAll(authentication.pullDomainEvents());
  }
}
