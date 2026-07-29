// src/domains/identity/application/handlers/complete-recovery.handler.ts

import { Inject, Injectable } from '@nestjs/common';

import { CommandHandler } from '../../../../foundation/kernel/application/command-handler';
import type { EventPublisher } from '../../../../foundation/events/event-publisher.interface';

import {
  IDENTITY_EVENT_PUBLISHER,
  IDENTITY_RECOVERY_REPOSITORY,
  IDENTITY_RECOVERY_TOKEN_HASHER,
} from '../identity.tokens';

import { CompleteRecoveryCommand } from '../commands/complete-recovery.command';
import type { CompleteRecoveryResult } from '../contracts/complete-recovery.result';

import { RecoveryNotFoundException } from '../../domain/exceptions/recovery-not-found.exception';

import type { RecoveryRepository } from '../../domain/repositories/recovery.repository';

import type { RecoveryTokenHasher } from '../../../../infrastructure/security/recovery-token-hasher.interface';

@Injectable()
export class CompleteRecoveryHandler implements CommandHandler<
  CompleteRecoveryCommand,
  CompleteRecoveryResult
> {
  constructor(
    @Inject(IDENTITY_RECOVERY_REPOSITORY)
    private readonly recoveryRepository: RecoveryRepository,

    @Inject(IDENTITY_RECOVERY_TOKEN_HASHER)
    private readonly tokenHasher: RecoveryTokenHasher,

    @Inject(IDENTITY_EVENT_PUBLISHER)
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(
    command: CompleteRecoveryCommand,
  ): Promise<CompleteRecoveryResult> {
    const recoveryTokenHash = this.tokenHasher.hash(command.recoveryToken);

    const recovery =
      await this.recoveryRepository.findByRecoveryTokenHash(recoveryTokenHash);

    if (recovery === null) {
      throw new RecoveryNotFoundException();
    }

    // Defense-in-depth.
    if (recovery.identityId !== command.identityId) {
      throw new RecoveryNotFoundException();
    }

    if (recovery.type !== command.recoveryType) {
      throw new RecoveryNotFoundException();
    }

    recovery.complete(recoveryTokenHash, command.correlationId);

    await this.recoveryRepository.save(recovery);

    await this.eventPublisher.publishAll(recovery.pullDomainEvents());

    return {
      recoveryPublicId: recovery.publicId.value,
      identityId: recovery.identityId,
      completed: true,
      completedAt: recovery.completedAt!,
    };
  }
}
