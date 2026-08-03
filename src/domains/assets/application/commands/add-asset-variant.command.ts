// src/domains/assets/application/commands/add-asset-variant.command.ts

import { Command } from '../../../../foundation/kernel/application/command';

import type {
  AssetVariantType,
  StorageProvider,
} from '../../domain/value-objects';

export class AddAssetVariantCommand extends Command {
  constructor(
    // ----------------------------------------------------------------------
    // Asset
    // ----------------------------------------------------------------------

    public readonly assetId: string,

    // ----------------------------------------------------------------------
    // Variant
    // ----------------------------------------------------------------------

    public readonly variant: AssetVariantType,

    // ----------------------------------------------------------------------
    // Storage
    // ----------------------------------------------------------------------

    public readonly storageProvider: StorageProvider,

    public readonly bucket: string,
    public readonly objectKey: string,

    // ----------------------------------------------------------------------
    // File Metadata
    // ----------------------------------------------------------------------

    public readonly mimeType: string,
    public readonly extension: string | undefined,

    public readonly sizeBytes: bigint,

    // ----------------------------------------------------------------------
    // Image Metadata (Optional)
    // ----------------------------------------------------------------------

    public readonly width: number | undefined,
    public readonly height: number | undefined,

    // ----------------------------------------------------------------------
    // Media Metadata (Optional)
    // ----------------------------------------------------------------------

    public readonly durationSeconds: number | undefined,

    // ----------------------------------------------------------------------
    // Correlation
    // ----------------------------------------------------------------------

    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {
    super();
  }
}
