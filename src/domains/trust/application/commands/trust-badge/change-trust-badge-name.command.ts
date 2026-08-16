// src/domains/trust/application/commands/trust-badge/change-trust-badge-name.command.ts

import { Command } from '../../../../../foundation/kernel/application/command';

export class ChangeTrustBadgeNameCommand extends Command {
  constructor(
    public readonly trustBadgeId: string,
    public readonly name: string,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {
    super();
  }
}
