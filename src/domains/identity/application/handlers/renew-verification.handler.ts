// src/domains/identity/application/handlers/renew-verification.handler.ts

import { Inject, Injectable } from '@nestjs/common';

import { CommandHandler } from '../../../../foundation/kernel/application/command-handler';
import type { EventPublisher } from '../../../../foundation/events/event-publisher.interface';

import { RenewVerificationCommand } from '../commands/renew-verification.command';

import { VerificationNotFoundException } from '../../domain/exceptions/verification-not-found.exception';

import type { VerificationRepository } from '../../domain/repositories/verification.repository';

import { VerificationId } from '../../domain/value-objects/verification-id.vo';

@Injectable()
export class RenewVerificationHandler implements CommandHandler<
  RenewVerificationCommand,
  void
> {
  constructor(
    @Inject('VerificationRepository')
    private readonly verificationRepository: VerificationRepository,

    @Inject('EventPublisher')
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: RenewVerificationCommand): Promise<void> {
    const verificationPublicId = new VerificationId(
      command.verificationPublicId,
    );

    const verification =
      await this.verificationRepository.findByPublicId(verificationPublicId);

    if (!verification) {
      throw new VerificationNotFoundException(verificationPublicId.value);
    }

    verification.renew(command.correlationId);

    await this.verificationRepository.update(verification);

    await this.eventPublisher.publishAll(verification.pullDomainEvents());
  }
}
