// src/domains/identity/application/commands/cancel-recovery.command.ts

import { Command } from '../../../../foundation/kernel/application/command';

import type { RecoveryFailureReason } from '../../domain/value-objects/recovery-failure-reason.enum';
import type { RecoveryId } from '../../domain/value-objects/recovery-id.vo';

export class CancelRecoveryCommand extends Command {
  constructor(
    /**
     * Public recovery identifier.
     */
    public readonly recoveryPublicId: RecoveryId,

    /**
     * Why the recovery is being cancelled.
     */
    public readonly reason: RecoveryFailureReason,

    /**
     * Correlation identifier for distributed tracing.
     */
    public readonly correlationId: string,
  ) {
    super();
  }
}
