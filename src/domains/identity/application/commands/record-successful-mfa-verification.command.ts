// src/domains/identity/application/commands/record-successful-mfa-verification.command.ts

import { Command } from '../../../../foundation/kernel/application/command';

export class RecordSuccessfulMfaVerificationCommand extends Command {
  constructor(
    public readonly identityId: string,
    public readonly verifiedAt: Date,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {
    super();
  }
}
