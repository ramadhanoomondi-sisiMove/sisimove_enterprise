// src/domains/identity/application/handlers/require-password-change.handler.ts

import { Inject, Injectable } from '@nestjs/common';

import type { EventPublisher } from '../../../../foundation/events/event-publisher.interface';
import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import { RequirePasswordChangeCommand } from '../commands/require-password-change.command';

import { AuthenticationNotFoundException } from '../../domain/exceptions/authentication-not-found.exception';

import type { AuthenticationRepository } from '../../domain/repositories/authentication.repository';

import { IdentityId } from '../../domain/value-objects/identity-id.vo';

@Injectable()
export class RequirePasswordChangeHandler implements CommandHandler<RequirePasswordChangeCommand> {
  constructor(
    @Inject('AuthenticationRepository')
    private readonly repository: AuthenticationRepository,

    @Inject('EventPublisher')
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: RequirePasswordChangeCommand): Promise<void> {
    const identityId = new IdentityId(command.identityId);

    const authentication = await this.repository.findByIdentityId(identityId);

    if (!authentication) {
      throw new AuthenticationNotFoundException(command.identityId);
    }

    authentication.requirePasswordChange(
      command.requiredAt,
      command.correlationId,
    );

    await this.repository.save(authentication);

    await this.eventPublisher.publishAll(authentication.pullDomainEvents());
  }
}
