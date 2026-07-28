// src/domains/identity/application/commands/record-failed-mfa-verification.command.ts

import { Command } from '../../../../foundation/kernel/application/command';

import type { AuthenticationFailureReason } from '../../domain/value-objects/authentication-failure-reason.enum';

export class RecordFailedMfaVerificationCommand extends Command {
  constructor(
    public readonly identityId: string,
    public readonly failedAt: Date,
    public readonly reason: AuthenticationFailureReason,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {
    super();
  }
}
