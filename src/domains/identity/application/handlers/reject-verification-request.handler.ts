// src/domains/identity/application/handlers/reject-verification-request.handler.ts

import { Inject, Injectable } from '@nestjs/common';

import { CommandHandler } from '../../../../foundation/kernel/application/command-handler';
import type { EventPublisher } from '../../../../foundation/events/event-publisher.interface';

import { RejectVerificationRequestCommand } from '../commands/reject-verification-request.command';

import { VerificationNotFoundException } from '../../domain/exceptions/verification-not-found.exception';

import type { VerificationRepository } from '../../domain/repositories/verification.repository';

import { IdentityId } from '../../domain/value-objects/identity-id.vo';
import { VerificationId } from '../../domain/value-objects/verification-id.vo';
import { VerificationRequestId } from '../../domain/value-objects/verification-request-id.vo';

@Injectable()
export class RejectVerificationRequestHandler implements CommandHandler<
  RejectVerificationRequestCommand,
  void
> {
  constructor(
    @Inject('VerificationRepository')
    private readonly verificationRepository: VerificationRepository,

    @Inject('EventPublisher')
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: RejectVerificationRequestCommand): Promise<void> {
    const verificationPublicId = new VerificationId(
      command.verificationPublicId,
    );

    const requestPublicId = new VerificationRequestId(command.requestPublicId);

    const reviewerIdentityId = new IdentityId(command.reviewerIdentityPublicId);

    const verification =
      await this.verificationRepository.findByPublicId(verificationPublicId);

    if (!verification) {
      throw new VerificationNotFoundException(verificationPublicId.value);
    }

    verification.rejectRequest(
      requestPublicId,
      reviewerIdentityId,
      command.rejectionReason,
      command.correlationId,
    );

    await this.verificationRepository.update(verification);

    await this.eventPublisher.publishAll(verification.pullDomainEvents());
  }
}
