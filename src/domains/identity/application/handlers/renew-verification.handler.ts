// src/domains/identity/application/handlers/renew-verification.handler.ts

import { Inject, Injectable } from '@nestjs/common';

import { CommandHandler } from '../../../../foundation/kernel/application/command-handler';
import type { EventPublisher } from '../../../../foundation/events/event-publisher.interface';

import {
  IDENTITY_EVENT_PUBLISHER,
  IDENTITY_VERIFICATION_REPOSITORY,
} from '../identity.tokens';

import { RenewVerificationCommand } from '../commands/renew-verification.command';

import { VerificationNotFoundException } from '../../domain/exceptions/verification-not-found.exception';

import type { VerificationRepository } from '../../domain/repositories/verification.repository';

import { VerificationId } from '../../domain/value-objects/verification-id.vo';

@Injectable()
export class RenewVerificationHandler implements CommandHandler<
  RenewVerificationCommand,
  void
> {
  public constructor(
    @Inject(IDENTITY_VERIFICATION_REPOSITORY)
    private readonly verificationRepository: VerificationRepository,

    @Inject(IDENTITY_EVENT_PUBLISHER)
    private readonly eventPublisher: EventPublisher,
  ) {}

  public async execute(command: RenewVerificationCommand): Promise<void> {
    const verificationPublicId = new VerificationId(
      command.verificationPublicId,
    );

    const verification =
      await this.verificationRepository.findByPublicId(verificationPublicId);

    if (verification === null) {
      throw new VerificationNotFoundException(verificationPublicId.value);
    }

    verification.renew(command.correlationId);

    await this.verificationRepository.update(verification);

    await this.eventPublisher.publishAll(verification.pullDomainEvents());
  }
}
