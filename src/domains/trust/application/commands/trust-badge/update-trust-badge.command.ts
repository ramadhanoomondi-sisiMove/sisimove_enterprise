// src/domains/trust/application/commands/trust-badge/update-trust-badge.command.ts

import { Command } from '../../../../../foundation/kernel/application/command';

import type { TrustBadgeType } from '../../../domain/value-objects/trust-badge-type.vo';

export class UpdateTrustBadgeCommand extends Command {
  constructor(
    public readonly trustBadgeId: string,
    public readonly type: TrustBadgeType | undefined,
    public readonly name: string | undefined,
    public readonly description: string | undefined,
    public readonly assetPublicId: string | undefined,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {
    super();
  }
}
