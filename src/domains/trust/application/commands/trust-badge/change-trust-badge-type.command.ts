// src/domains/trust/application/commands/trust-badge/change-trust-badge-type.command.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Command } from '../../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { TrustBadgeType } from '../../../domain/value-objects/trust-badge-type.vo';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

export class ChangeTrustBadgeTypeCommand extends Command {
  constructor(
    public readonly trustBadgeId: string,
    public readonly type: TrustBadgeType,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {
    super();
  }
}
