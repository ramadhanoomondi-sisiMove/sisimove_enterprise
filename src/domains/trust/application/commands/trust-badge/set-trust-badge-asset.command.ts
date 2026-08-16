// src/domains/trust/application/commands/trust-badge/set-trust-badge-asset.command.ts

import { Command } from '../../../../../foundation/kernel/application/command';

export class SetTrustBadgeAssetCommand extends Command {
  constructor(
    public readonly trustBadgeId: string,
    public readonly assetPublicId: string | undefined,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {
    super();
  }
}
