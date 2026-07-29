// src/domains/identity/application/handlers/activate-identity.handler.ts

import { Inject, Injectable } from '@nestjs/common';

import { CommandHandler } from '../../../../foundation/kernel/application/command-handler';
import type { EventPublisher } from '../../../../foundation/events/event-publisher.interface';

import {
  IDENTITY_REPOSITORY,
  IDENTITY_EVENT_PUBLISHER,
} from '../identity.tokens';

import { ActivateIdentityCommand } from '../commands/activate-identity.command';

import { IdentityNotFoundException } from '../../domain/exceptions/identity-not-found.exception';

import type { IdentityRepository } from '../../domain/repositories/identity.repository';

import { IdentityId } from '../../domain/value-objects/identity-id.vo';

@Injectable()
export class ActivateIdentityHandler implements CommandHandler<
  ActivateIdentityCommand,
  void
> {
  constructor(
    @Inject(IDENTITY_REPOSITORY)
    private readonly repository: IdentityRepository,

    @Inject(IDENTITY_EVENT_PUBLISHER)
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: ActivateIdentityCommand): Promise<void> {
    const identity = await this.repository.findByPublicId(
      new IdentityId(command.publicId),
    );

    if (identity === null) {
      throw new IdentityNotFoundException(command.publicId);
    }

    identity.activate(command.correlationId);

    await this.repository.update(identity);

    await this.eventPublisher.publishAll(identity.pullDomainEvents());
  }
}
