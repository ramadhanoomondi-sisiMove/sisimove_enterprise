// src/domains/assets/application/commands/scan-asset.command.ts

import { Command } from '../../../../foundation/kernel/application/command';

import type {
  AssetScanEngine,
  AssetScanStatus,
  JsonValue,
} from '../../domain/value-objects';

export class ScanAssetCommand extends Command {
  constructor(
    // ----------------------------------------------------------------------
    // Asset
    // ----------------------------------------------------------------------

    public readonly assetId: string,

    // ----------------------------------------------------------------------
    // Scan
    // ----------------------------------------------------------------------

    public readonly engine: AssetScanEngine,
    public readonly status: AssetScanStatus,

    /**
     * Present only when the asset is infected.
     * Converted into an AssetThreatName value object by the handler.
     */
    public readonly threatName: string | undefined,

    /**
     * Scan engine metadata (raw engine response, signatures, timings, etc.).
     */
    public readonly metadata: JsonValue | undefined,

    public readonly scannedAt: Date,

    // ----------------------------------------------------------------------
    // Correlation
    // ----------------------------------------------------------------------

    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {
    super();
  }
}
