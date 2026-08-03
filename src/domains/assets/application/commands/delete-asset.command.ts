// src/domains/assets/application/commands/delete-asset.command.ts

import { Command } from '../../../../foundation/kernel/application/command';

export class DeleteAssetCommand extends Command {
  constructor(
    // ----------------------------------------------------------------------
    // Asset
    // ----------------------------------------------------------------------

    public readonly assetId: string,

    // ----------------------------------------------------------------------
    // Deletion
    // ----------------------------------------------------------------------

    public readonly deletedAt: Date,

    // ----------------------------------------------------------------------
    // Correlation
    // ----------------------------------------------------------------------

    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {
    super();
  }
}
