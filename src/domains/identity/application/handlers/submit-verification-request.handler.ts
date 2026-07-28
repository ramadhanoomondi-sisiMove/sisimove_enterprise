// src/domains/identity/application/handlers/submit-verification-request.handler.ts

import { Inject, Injectable } from '@nestjs/common';

import { CommandHandler } from '../../../../foundation/kernel/application/command-handler';
import type { EventPublisher } from '../../../../foundation/events/event-publisher.interface';

import { SubmitVerificationRequestCommand } from '../commands/submit-verification-request.command';

import { VerificationRequestEntity } from '../../domain/entities/verification-request.entity';

import { VerificationNotFoundException } from '../../domain/exceptions/verification-not-found.exception';

import type { VerificationRepository } from '../../domain/repositories/verification.repository';

import { VerificationId } from '../../domain/value-objects/verification-id.vo';

@Injectable()
export class SubmitVerificationRequestHandler implements CommandHandler<
  SubmitVerificationRequestCommand,
  string
> {
  constructor(
    @Inject('VerificationRepository')
    private readonly verificationRepository: VerificationRepository,

    @Inject('EventPublisher')
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: SubmitVerificationRequestCommand): Promise<string> {
    const verificationPublicId = new VerificationId(
      command.verificationPublicId,
    );

    const verification =
      await this.verificationRepository.findByPublicId(verificationPublicId);

    if (!verification) {
      throw new VerificationNotFoundException(verificationPublicId.value);
    }

    const request = VerificationRequestEntity.create(
      verification.publicId,
      command.type,
      command.assetPublicId,
      command.metadata,
    );

    verification.submitRequest(request, command.correlationId);

    await this.verificationRepository.update(verification);

    await this.eventPublisher.publishAll(verification.pullDomainEvents());

    return request.publicId.value;
  }
}
