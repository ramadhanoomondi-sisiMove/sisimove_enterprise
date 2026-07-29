// src/domains/identity/application/handlers/expire-recovery.handler.ts

import { Inject, Injectable } from '@nestjs/common';

import { CommandHandler } from '../../../../foundation/kernel/application/command-handler';
import type { EventPublisher } from '../../../../foundation/events/event-publisher.interface';

import {
  IDENTITY_EVENT_PUBLISHER,
  IDENTITY_RECOVERY_REPOSITORY,
} from '../identity.tokens';

import { ExpireRecoveryCommand } from '../commands/expire-recovery.command';
import type { ExpireRecoveryResult } from '../contracts/expire-recovery.result';

import type { RecoveryRepository } from '../../domain/repositories/recovery.repository';

@Injectable()
export class ExpireRecoveryHandler implements CommandHandler<
  ExpireRecoveryCommand,
  ExpireRecoveryResult
> {
  constructor(
    @Inject(IDENTITY_RECOVERY_REPOSITORY)
    private readonly recoveryRepository: RecoveryRepository,

    @Inject(IDENTITY_EVENT_PUBLISHER)
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: ExpireRecoveryCommand): Promise<ExpireRecoveryResult> {
    const recoveries = await this.recoveryRepository.findExpired(
      command.referenceDate,
    );

    let expiredCount = 0;

    for (const recovery of recoveries) {
      recovery.expire(command.correlationId, command.referenceDate);

      await this.recoveryRepository.save(recovery);

      await this.eventPublisher.publishAll(recovery.pullDomainEvents());

      expiredCount++;
    }

    return {
      processedAt: command.referenceDate,
      expiredCount,
    };
  }
}
