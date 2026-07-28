// src/domains/identity/application/handlers/request-recovery.handler.ts

import { Inject, Injectable } from '@nestjs/common';

import { CommandHandler } from '../../../../foundation/kernel/application/command-handler';
import type { EventPublisher } from '../../../../foundation/events/event-publisher.interface';

import { RequestRecoveryCommand } from '../commands/request-recovery.command';
import type { RequestRecoveryResult } from '../contracts/request-recovery.result';
import type { RecoveryTokenGenerator } from '../services/recovery-token-generator';

import { RecoveryAggregate } from '../../domain/aggregates/recovery.aggregate';
import { ActiveRecoveryAlreadyExistsException } from '../../domain/exceptions/active-recovery-already-exists.exception';
import type { RecoveryRepository } from '../../domain/repositories/recovery.repository';

@Injectable()
export class RequestRecoveryHandler implements CommandHandler<
  RequestRecoveryCommand,
  RequestRecoveryResult
> {
  /**
   * Default recovery lifetime (15 minutes).
   */
  private static readonly RECOVERY_TTL_MS = 15 * 60 * 1000;

  constructor(
    @Inject('RecoveryRepository')
    private readonly recoveryRepository: RecoveryRepository,

    @Inject('RecoveryTokenGenerator')
    private readonly tokenGenerator: RecoveryTokenGenerator,

    @Inject('EventPublisher')
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(
    command: RequestRecoveryCommand,
  ): Promise<RequestRecoveryResult> {
    const activeRecovery =
      await this.recoveryRepository.findActiveByIdentityIdAndType(
        command.identityId,
        command.recoveryType,
      );

    if (activeRecovery) {
      throw new ActiveRecoveryAlreadyExistsException(command.recoveryType);
    }

    const { token: recoveryToken, hash: recoveryTokenHash } =
      await this.tokenGenerator.generate();

    const expiresAt = new Date(
      Date.now() + RequestRecoveryHandler.RECOVERY_TTL_MS,
    );

    const recovery = RecoveryAggregate.request(
      command.identityId,
      command.recoveryType,
      recoveryTokenHash,
      expiresAt,
      command.correlationId,
    );

    await this.recoveryRepository.save(recovery);

    await this.eventPublisher.publishAll(recovery.pullDomainEvents());

    return {
      recoveryPublicId: recovery.publicId.value,
      recoveryToken,
      expiresAt,
    };
  }
}
