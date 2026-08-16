// src/domains/trust/application/commands/trust-badge/deactivate-trust-badge.command.ts

import { Command } from '../../../../../foundation/kernel/application/command';

export class DeactivateTrustBadgeCommand extends Command {
  constructor(
    public readonly trustBadgeId: string,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {
    super();
  }
}
