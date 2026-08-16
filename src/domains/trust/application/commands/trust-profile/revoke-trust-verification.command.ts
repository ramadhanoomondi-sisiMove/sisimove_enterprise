// src/domains/trust/application/commands/trust-profile/revoke-trust-verification.command.ts

import { Command } from '../../../../../foundation/kernel/application/command';

export class RevokeTrustVerificationCommand extends Command {
  constructor(
    public readonly trustProfileId: string,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {
    super();
  }
}
