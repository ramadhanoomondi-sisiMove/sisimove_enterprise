import { Command } from '../../../../foundation/kernel/application/command';

import type { RecoveryType } from '../../domain/value-objects/recovery-type.enum';

export class CompleteRecoveryCommand extends Command {
  constructor(
    public readonly identityId: string,
    public readonly recoveryToken: string,
    public readonly recoveryType: RecoveryType,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {
    super();
  }
}
