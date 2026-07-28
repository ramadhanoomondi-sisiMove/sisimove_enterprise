// src/domains/identity/application/handlers/unlock-authentication.handler.ts

import { Inject, Injectable } from '@nestjs/common';

import { CommandHandler } from '../../../../foundation/kernel/application/command-handler';
import type { EventPublisher } from '../../../../foundation/events/event-publisher.interface';

import { UnlockAuthenticationCommand } from '../commands/unlock-authentication.command';

import { AuthenticationNotFoundException } from '../../domain/exceptions/authentication-not-found.exception';

import type { AuthenticationRepository } from '../../domain/repositories/authentication.repository';

@Injectable()
export class UnlockAuthenticationHandler implements CommandHandler<
  UnlockAuthenticationCommand,
  void
> {
  public constructor(
    @Inject('AuthenticationRepository')
    private readonly authenticationRepository: AuthenticationRepository,

    @Inject('EventPublisher')
    private readonly eventPublisher: EventPublisher,
  ) {}

  public async execute(command: UnlockAuthenticationCommand): Promise<void> {
    const authentication = await this.authenticationRepository.findByIdentityId(
      command.identityId,
    );

    if (authentication === null) {
      throw new AuthenticationNotFoundException(command.identityId.value);
    }

    authentication.unlock(command.unlockedAt, command.correlationId);

    await this.authenticationRepository.save(authentication);

    await this.eventPublisher.publishAll(authentication.pullDomainEvents());
  }
}
