// src/domains/identity/application/handlers/change-password.handler.ts

import { Inject, Injectable } from '@nestjs/common';

import { CommandHandler } from '../../../../foundation/kernel/application/command-handler';
import type { EventPublisher } from '../../../../foundation/events/event-publisher.interface';
import type { PasswordHasher } from '../../../../foundation/security/password-hasher.interface';

import { ChangePasswordCommand } from '../commands/change-password.command';

import { AuthenticationNotFoundException } from '../../domain/exceptions/authentication-not-found.exception';

import type { AuthenticationRepository } from '../../domain/repositories/authentication.repository';

@Injectable()
export class ChangePasswordHandler implements CommandHandler<
  ChangePasswordCommand,
  void
> {
  constructor(
    @Inject('AuthenticationRepository')
    private readonly repository: AuthenticationRepository,

    @Inject('PasswordHasher')
    private readonly passwordHasher: PasswordHasher,

    @Inject('EventPublisher')
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: ChangePasswordCommand): Promise<void> {
    // ------------------------------------------------------------------
    // Load Authentication Aggregate
    // ------------------------------------------------------------------

    const authentication = await this.repository.findByIdentityId(
      command.identityId,
    );

    if (authentication === null) {
      throw new AuthenticationNotFoundException(command.identityId.value);
    }

    // ------------------------------------------------------------------
    // Hash new password
    // ------------------------------------------------------------------

    const passwordHash = await this.passwordHasher.hash(command.newPassword);

    // ------------------------------------------------------------------
    // Change password
    // ------------------------------------------------------------------

    authentication.changePassword(
      passwordHash,
      command.changedAt,
      command.correlationId,
      command.passwordExpiresAt,
    );

    // ------------------------------------------------------------------
    // Persist
    // ------------------------------------------------------------------

    await this.repository.save(authentication);

    // ------------------------------------------------------------------
    // Publish domain events
    // ------------------------------------------------------------------

    await this.eventPublisher.publishAll(authentication.pullDomainEvents());
  }
}
