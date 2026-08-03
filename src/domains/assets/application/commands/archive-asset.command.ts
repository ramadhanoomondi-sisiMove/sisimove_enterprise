// src/domains/assets/application/commands/archive-asset.command.ts

import { Command } from '../../../../foundation/kernel/application/command';

export class ArchiveAssetCommand extends Command {
  constructor(
    // ----------------------------------------------------------------------
    // Asset
    // ----------------------------------------------------------------------

    public readonly assetId: string,

    // ----------------------------------------------------------------------
    // Archive
    // ----------------------------------------------------------------------

    public readonly archivedAt: Date,

    // ----------------------------------------------------------------------
    // Correlation
    // ----------------------------------------------------------------------

    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {
    super();
  }
}
