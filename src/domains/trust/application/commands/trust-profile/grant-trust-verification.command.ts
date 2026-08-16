// src/domains/trust/application/commands/trust-profile/grant-trust-verification.command.ts

import { Command } from '../../../../../foundation/kernel/application/command';

import type { TrustVerificationLevel } from '../../../domain/value-objects/trust-verification-level.vo';

export class GrantTrustVerificationCommand extends Command {
  constructor(
    public readonly trustProfileId: string,
    public readonly verificationLevel: TrustVerificationLevel,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {
    super();
  }
}
