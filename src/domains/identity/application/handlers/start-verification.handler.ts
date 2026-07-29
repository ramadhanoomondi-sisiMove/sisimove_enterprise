// src/domains/identity/application/handlers/start-verification.handler.ts

import { Inject, Injectable } from '@nestjs/common';

import { CommandHandler } from '../../../../foundation/kernel/application/command-handler';
import type { EventPublisher } from '../../../../foundation/events/event-publisher.interface';

import {
  IDENTITY_EVENT_PUBLISHER,
  IDENTITY_REPOSITORY,
  IDENTITY_VERIFICATION_REPOSITORY,
} from '../identity.tokens';

import { StartVerificationCommand } from '../commands/start-verification.command';

import { VerificationAggregate } from '../../domain/aggregates/verification.aggregate';

import { IdentityNotFoundException } from '../../domain/exceptions/identity-not-found.exception';
import { VerificationAlreadyExistsException } from '../../domain/exceptions/verification-already-exists.exception';

import type { IdentityRepository } from '../../domain/repositories/identity.repository';
import type { VerificationRepository } from '../../domain/repositories/verification.repository';

import { IdentityId } from '../../domain/value-objects/identity-id.vo';

@Injectable()
export class StartVerificationHandler implements CommandHandler<
  StartVerificationCommand,
  string
> {
  constructor(
    @Inject(IDENTITY_VERIFICATION_REPOSITORY)
    private readonly verificationRepository: VerificationRepository,

    @Inject(IDENTITY_REPOSITORY)
    private readonly identityRepository: IdentityRepository,

    @Inject(IDENTITY_EVENT_PUBLISHER)
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: StartVerificationCommand): Promise<string> {
    const identityPublicId = new IdentityId(command.identityPublicId);

    const identity =
      await this.identityRepository.findByPublicId(identityPublicId);

    if (!identity) {
      throw new IdentityNotFoundException(identityPublicId.value);
    }

    const verification = await this.verificationRepository.findByIdentityId(
      identity.publicId,
    );

    if (verification) {
      throw new VerificationAlreadyExistsException(identity.publicId.value);
    }

    const aggregate = VerificationAggregate.create(
      identity.publicId,
      command.correlationId,
    );

    await this.verificationRepository.save(aggregate);

    await this.eventPublisher.publishAll(aggregate.pullDomainEvents());

    return aggregate.publicId.value;
  }
}
