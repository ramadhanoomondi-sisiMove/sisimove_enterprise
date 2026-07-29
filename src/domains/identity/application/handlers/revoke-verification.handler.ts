// src/domains/identity/application/handlers/revoke-verification.handler.ts

import { Inject, Injectable } from '@nestjs/common';

import { CommandHandler } from '../../../../foundation/kernel/application/command-handler';
import type { EventPublisher } from '../../../../foundation/events/event-publisher.interface';

import {
  IDENTITY_EVENT_PUBLISHER,
  IDENTITY_VERIFICATION_REPOSITORY,
} from '../identity.tokens';

import { RevokeVerificationCommand } from '../commands/revoke-verification.command';

import { VerificationNotFoundException } from '../../domain/exceptions/verification-not-found.exception';

import type { VerificationRepository } from '../../domain/repositories/verification.repository';

import { IdentityId } from '../../domain/value-objects/identity-id.vo';
import { VerificationId } from '../../domain/value-objects/verification-id.vo';

@Injectable()
export class RevokeVerificationHandler implements CommandHandler<
  RevokeVerificationCommand,
  void
> {
  constructor(
    @Inject(IDENTITY_VERIFICATION_REPOSITORY)
    private readonly verificationRepository: VerificationRepository,

    @Inject(IDENTITY_EVENT_PUBLISHER)
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: RevokeVerificationCommand): Promise<void> {
    const verificationPublicId = new VerificationId(
      command.verificationPublicId,
    );

    const reviewerIdentityId = new IdentityId(command.reviewerIdentityPublicId);

    const verification =
      await this.verificationRepository.findByPublicId(verificationPublicId);

    if (!verification) {
      throw new VerificationNotFoundException(verificationPublicId.value);
    }

    verification.revoke(
      reviewerIdentityId,
      command.revocationReason,
      command.correlationId,
    );

    await this.verificationRepository.update(verification);

    await this.eventPublisher.publishAll(verification.pullDomainEvents());
  }
}
