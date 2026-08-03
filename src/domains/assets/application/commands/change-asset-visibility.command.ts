// src/domains/assets/application/commands/change-asset-visibility.command.ts

import { Command } from '../../../../foundation/kernel/application/command';

import type { AssetVisibility } from '../../domain/value-objects';

export class ChangeAssetVisibilityCommand extends Command {
  constructor(
    // ----------------------------------------------------------------------
    // Asset
    // ----------------------------------------------------------------------

    public readonly assetId: string,

    // ----------------------------------------------------------------------
    // Visibility
    // ----------------------------------------------------------------------

    public readonly visibility: AssetVisibility,

    public readonly changedAt: Date,

    // ----------------------------------------------------------------------
    // Correlation
    // ----------------------------------------------------------------------

    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {
    super();
  }
}
