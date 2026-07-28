// src/domains/identity/application/commands/request-recovery.command.ts

import { Command } from '../../../../foundation/kernel/application/command';

import type { RecoveryType } from '../../domain/value-objects/recovery-type.enum';

export class RequestRecoveryCommand extends Command {
  constructor(
    /**
     * Internal Identity UUID (Identity.id).
     */
    public readonly identityId: string,

    /**
     * Type of recovery being requested.
     */
    public readonly recoveryType: RecoveryType,

    /**
     * Correlation identifier propagated across the request.
     */
    public readonly correlationId: string,
  ) {
    super();
  }
}
