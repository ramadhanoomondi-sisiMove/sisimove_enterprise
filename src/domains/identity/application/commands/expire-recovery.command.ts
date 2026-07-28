// src/domains/identity/application/commands/expire-recovery.command.ts

import { Command } from '../../../../foundation/kernel/application/command';

export class ExpireRecoveryCommand extends Command {
  constructor(
    public readonly correlationId: string,
    public readonly referenceDate: Date = new Date(),
  ) {
    super();
  }
}
