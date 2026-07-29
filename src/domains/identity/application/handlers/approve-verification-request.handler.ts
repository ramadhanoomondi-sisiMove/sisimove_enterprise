// src/domains/identity/application/handlers/approve-verification-request.handler.ts

import { Inject, Injectable } from '@nestjs/common';

import { CommandHandler } from '../../../../foundation/kernel/application/command-handler';
import type { EventPublisher } from '../../../../foundation/events/event-publisher.interface';

import {
  IDENTITY_EVENT_PUBLISHER,
  IDENTITY_AUTHENTICATION_REPOSITORY,
} from '../identity.tokens';

import { ApproveVerificationRequestCommand } from '../commands/approve-verification-request.command';

import { VerificationNotFoundException } from '../../domain/exceptions/verification-not-found.exception';

import type { VerificationRepository } from '../../domain/repositories/verification.repository';

import { IdentityId } from '../../domain/value-objects/identity-id.vo';
import { VerificationId } from '../../domain/value-objects/verification-id.vo';
import { VerificationRequestId } from '../../domain/value-objects/verification-request-id.vo';

@Injectable()
export class ApproveVerificationRequestHandler implements CommandHandler<
  ApproveVerificationRequestCommand,
  void
> {
  constructor(
    @Inject(IDENTITY_AUTHENTICATION_REPOSITORY)
    private readonly verificationRepository: VerificationRepository,

    @Inject(IDENTITY_EVENT_PUBLISHER)
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: ApproveVerificationRequestCommand): Promise<void> {
    const verificationPublicId = new VerificationId(
      command.verificationPublicId,
    );

    const requestPublicId = new VerificationRequestId(command.requestPublicId);

    const reviewerIdentityId = new IdentityId(command.reviewerIdentityPublicId);

    const verification =
      await this.verificationRepository.findByPublicId(verificationPublicId);

    if (verification === null) {
      throw new VerificationNotFoundException(verificationPublicId.value);
    }

    verification.approveRequest(
      requestPublicId,
      reviewerIdentityId,
      command.correlationId,
    );

    await this.verificationRepository.update(verification);

    await this.eventPublisher.publishAll(verification.pullDomainEvents());
  }
}
