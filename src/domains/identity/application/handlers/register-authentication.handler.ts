// src/domains/identity/application/handlers/create-authentication.handler.ts

import { Inject, Injectable } from '@nestjs/common';

import { CommandHandler } from '../../../../foundation/kernel/application/command-handler';
import type { EventPublisher } from '../../../../foundation/events/event-publisher.interface';

import { RegisterAuthenticationCommand } from '../commands/register-authentication.command';

import { AuthenticationAggregate } from '../../domain/aggregates/authentication.aggregate';
import { AuthenticationEntity } from '../../domain/entities/authentication.entity';

import { AuthenticationAlreadyExistsException } from '../../domain/exceptions/authentication-already-exists.exception';
import { IdentityNotFoundException } from '../../domain/exceptions/identity-not-found.exception';

import type { AuthenticationRepository } from '../../domain/repositories/authentication.repository';
import type { IdentityRepository } from '../../domain/repositories/identity.repository';

@Injectable()
export class RegisterAuthenticationHandler implements CommandHandler<
  RegisterAuthenticationCommand,
  string
> {
  constructor(
    @Inject('AuthenticationRepository')
    private readonly authenticationRepository: AuthenticationRepository,

    @Inject('IdentityRepository')
    private readonly identityRepository: IdentityRepository,

    @Inject('EventPublisher')
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: RegisterAuthenticationCommand): Promise<string> {
    // ------------------------------------------------------------------
    // Verify Identity exists
    // ------------------------------------------------------------------

    const identity = await this.identityRepository.findById(command.identityId);

    if (identity === null) {
      throw new IdentityNotFoundException(command.identityId.value);
    }

    // ------------------------------------------------------------------
    // Ensure Authentication doesn't already exist
    // ------------------------------------------------------------------

    const exists = await this.authenticationRepository.existsByIdentityId(
      command.identityId,
    );

    if (exists) {
      throw new AuthenticationAlreadyExistsException(command.identityId.value);
    }

    // ------------------------------------------------------------------
    // Create Authentication Entity
    // Entity stores the primitive identity UUID
    // ------------------------------------------------------------------

    const authenticationEntity = AuthenticationEntity.create(
      command.identityId.value,
      command.passwordHash,
      command.passwordExpiresAt,
    );

    const aggregate = AuthenticationAggregate.create(authenticationEntity);

    // ------------------------------------------------------------------
    // Persist
    // ------------------------------------------------------------------

    await this.authenticationRepository.save(aggregate);

    // ------------------------------------------------------------------
    // Publish Domain Events
    // ------------------------------------------------------------------

    await this.eventPublisher.publishAll(aggregate.pullDomainEvents());

    return aggregate.publicId.value;
  }
}
