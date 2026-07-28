// src/domains/identity/application/handlers/enable-mfa.handler.ts

import { Inject, Injectable } from '@nestjs/common';

import { CommandHandler } from '../../../../foundation/kernel/application/command-handler';
import type { EventPublisher } from '../../../../foundation/events/event-publisher.interface';

import { EnableMfaCommand } from '../commands/enable-mfa.command';

import { AuthenticationNotFoundException } from '../../domain/exceptions/authentication-not-found.exception';
import type { AuthenticationRepository } from '../../domain/repositories/authentication.repository';

@Injectable()
export class EnableMfaHandler implements CommandHandler<
  EnableMfaCommand,
  void
> {
  constructor(
    @Inject('AuthenticationRepository')
    private readonly repository: AuthenticationRepository,

    @Inject('EventPublisher')
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: EnableMfaCommand): Promise<void> {
    const authentication = await this.repository.findByIdentityId(
      command.identityId,
    );

    if (authentication === null) {
      throw new AuthenticationNotFoundException(command.identityId.value);
    }

    authentication.enableMfa(
      command.method,
      command.encryptedSecret,
      command.enabledAt,
      command.correlationId,
    );

    await this.repository.save(authentication);

    await this.eventPublisher.publishAll(authentication.pullDomainEvents());
  }
}
