// src/domains/trust/application/commands/trust-profile/revoke-trust-badge.command.ts

import { Command } from '../../../../../foundation/kernel/application/command';

export class RevokeTrustBadgeCommand extends Command {
  constructor(
    public readonly trustProfileId: string,
    public readonly profileBadgeId: string,
    public readonly reason: string | undefined,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {
    super();
  }
}
