// src/domains/identity/application/commands/require-password-change.command.ts

import { Command } from '../../../../foundation/kernel/application/command';

export class RequirePasswordChangeCommand extends Command {
  constructor(
    public readonly identityId: string,
    public readonly requiredAt: Date,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {
    super();
  }
}
