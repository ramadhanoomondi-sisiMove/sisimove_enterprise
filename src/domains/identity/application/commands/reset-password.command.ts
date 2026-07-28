// src/domains/identity/application/commands/reset-password.command.ts

import { Command } from '../../../../foundation/kernel/application/command';

export class ResetPasswordCommand extends Command {
  constructor(
    public readonly identityId: string,
    public readonly passwordHash: string,
    public readonly resetAt: Date,
    public readonly correlationId: string,
    public readonly passwordExpiresAt?: Date,
    public readonly causationId?: string,
  ) {
    super();
  }
}
