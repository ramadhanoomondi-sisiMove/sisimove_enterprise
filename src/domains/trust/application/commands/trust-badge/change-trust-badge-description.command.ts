// src/domains/trust/application/commands/trust-badge/change-trust-badge-description.command.ts

import { Command } from '../../../../../foundation/kernel/application/command';

export class ChangeTrustBadgeDescriptionCommand extends Command {
  constructor(
    public readonly trustBadgeId: string,
    public readonly description: string | undefined,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {
    super();
  }
}
