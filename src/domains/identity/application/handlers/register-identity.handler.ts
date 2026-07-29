// src/domains/identity/application/handlers/register-identity.handler.ts

import { Inject, Injectable } from '@nestjs/common';

import { CommandHandler } from '../../../../foundation/kernel/application/command-handler';
import type { EventPublisher } from '../../../../foundation/events/event-publisher.interface';
import type { PasswordHasher } from '../../../../foundation/security/password-hasher.interface';

import {
  IDENTITY_REPOSITORY,
  IDENTITY_PASSWORD_HASHER,
  IDENTITY_EVENT_PUBLISHER,
} from '../identity.tokens';

import { RegisterIdentityCommand } from '../commands/register-identity.command';

import { IdentityAggregate } from '../../domain/aggregates/identity.aggregate';
import { AuthenticationEntity } from '../../domain/entities/authentication.entity';

import { IdentityAlreadyExistsException } from '../../domain/exceptions/identity-already-exists.exception';

import type { IdentityRepository } from '../../domain/repositories/identity.repository';

import { Email } from '../../domain/value-objects/email.vo';

@Injectable()
export class RegisterIdentityHandler implements CommandHandler<
  RegisterIdentityCommand,
  string
> {
  constructor(
    @Inject(IDENTITY_REPOSITORY)
    private readonly repository: IdentityRepository,

    @Inject(IDENTITY_PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasher,

    @Inject(IDENTITY_EVENT_PUBLISHER)
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: RegisterIdentityCommand): Promise<string> {
    const email = new Email(command.email);

    const existingIdentity = await this.repository.findByEmail(email);

    if (existingIdentity) {
      throw new IdentityAlreadyExistsException(email.value);
    }

    const passwordHash = await this.passwordHasher.hash(command.password);

    const identity = IdentityAggregate.register(
      command.type,
      email,
      command.phoneNumber,
      command.correlationId,
    );

    const authentication = AuthenticationEntity.create(
      identity.id.value,
      passwordHash,
    );

    await this.repository.save(identity, authentication);

    await this.eventPublisher.publishAll(identity.pullDomainEvents());

    return identity.publicId.value;
  }
}
