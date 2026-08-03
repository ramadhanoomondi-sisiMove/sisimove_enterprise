// src/domains/assets/application/commands/start-processing.command.ts

import { Command } from '../../../../foundation/kernel/application/command';

import type {
  AssetProcessingOperation,
  AssetProcessor,
} from '../../domain/value-objects';

export class StartProcessingCommand extends Command {
  constructor(
    // ----------------------------------------------------------------------
    // Asset
    // ----------------------------------------------------------------------

    public readonly assetId: string,

    // ----------------------------------------------------------------------
    // Processing
    // ----------------------------------------------------------------------

    public readonly operation: AssetProcessingOperation,

    public readonly processor: AssetProcessor | undefined,

    public readonly startedAt: Date,

    // ----------------------------------------------------------------------
    // Correlation
    // ----------------------------------------------------------------------

    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {
    super();
  }
}
