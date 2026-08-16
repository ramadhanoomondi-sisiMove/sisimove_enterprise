// src/domains/trust/application/commands/trust-badge/create-trust-badge.command.ts

import { Command } from '../../../../../foundation/kernel/application/command';

import type { TrustBadgeType } from '../../../domain/value-objects/trust-badge-type.vo';

export class CreateTrustBadgeCommand extends Command {
  constructor(
    public readonly type: TrustBadgeType,
    public readonly name: string,
    public readonly description: string | undefined,
    public readonly assetPublicId: string | undefined,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {
    super();
  }
}
