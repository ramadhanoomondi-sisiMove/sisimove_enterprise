// src/domains/identity/application/handlers/cancel-recovery.handler.ts

import { Inject, Injectable } from '@nestjs/common';

import { CommandHandler } from '../../../../foundation/kernel/application/command-handler';
import type { EventPublisher } from '../../../../foundation/events/event-publisher.interface';

import {
  IDENTITY_EVENT_PUBLISHER,
  IDENTITY_RECOVERY_REPOSITORY,
} from '../identity.tokens';

import { CancelRecoveryCommand } from '../commands/cancel-recovery.command';
import type { CancelRecoveryResult } from '../contracts/cancel-recovery.result';

import { RecoveryNotFoundException } from '../../domain/exceptions/recovery-not-found.exception';

import type { RecoveryRepository } from '../../domain/repositories/recovery.repository';

@Injectable()
export class CancelRecoveryHandler implements CommandHandler<
  CancelRecoveryCommand,
  CancelRecoveryResult
> {
  constructor(
    @Inject(IDENTITY_RECOVERY_REPOSITORY)
    private readonly recoveryRepository: RecoveryRepository,

    @Inject(IDENTITY_EVENT_PUBLISHER)
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: CancelRecoveryCommand): Promise<CancelRecoveryResult> {
    const recovery = await this.recoveryRepository.findByPublicId(
      command.recoveryPublicId,
    );

    if (recovery === null) {
      throw new RecoveryNotFoundException();
    }

    recovery.cancel(command.reason, command.correlationId);

    await this.recoveryRepository.save(recovery);

    await this.eventPublisher.publishAll(recovery.pullDomainEvents());

    return {
      recoveryPublicId: recovery.publicId.value,
      identityId: recovery.identityId,
      cancelled: true,
      cancelledAt: recovery.cancelledAt!,
    };
  }
}
