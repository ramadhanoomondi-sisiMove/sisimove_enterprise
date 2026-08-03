// src/domains/assets/application/commands/complete-processing.command.ts

import { Command } from '../../../../foundation/kernel/application/command';

import type { AssetProcessingOperation } from '../../domain/value-objects';

export class CompleteProcessingCommand extends Command {
  constructor(
    // ----------------------------------------------------------------------
    // Asset
    // ----------------------------------------------------------------------

    public readonly assetId: string,

    // ----------------------------------------------------------------------
    // Processing
    // ----------------------------------------------------------------------

    public readonly operation: AssetProcessingOperation,

    public readonly completedAt: Date,

    // ----------------------------------------------------------------------
    // Correlation
    // ----------------------------------------------------------------------

    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {
    super();
  }
}
