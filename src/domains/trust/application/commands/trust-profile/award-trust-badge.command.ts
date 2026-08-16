// src/domains/trust/application/commands/trust-profile/award-trust-badge.command.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Command } from '../../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

export class AwardTrustBadgeCommand extends Command {
  constructor(
    public readonly trustProfileId: string,
    public readonly badgeId: string,
    public readonly profileBadgeId: string,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {
    super();
  }
}
