// src/domains/assets/application/commands/upload-asset.command.ts

import { Command } from '../../../../foundation/kernel/application/command';

import type { ChecksumAlgorithm, JsonValue } from '../../domain/value-objects';

export class UploadAssetCommand extends Command {
  constructor(
    // ----------------------------------------------------------------------
    // Asset
    // ----------------------------------------------------------------------

    public readonly assetId: string,

    // ----------------------------------------------------------------------
    // Integrity
    // ----------------------------------------------------------------------

    public readonly checksumAlgorithm: ChecksumAlgorithm,
    public readonly checksum: string,

    // ----------------------------------------------------------------------
    // Metadata
    // ----------------------------------------------------------------------

    public readonly metadata: JsonValue | undefined,

    // ----------------------------------------------------------------------
    // Upload
    // ----------------------------------------------------------------------

    public readonly uploadedAt: Date,

    // ----------------------------------------------------------------------
    // Correlation
    // ----------------------------------------------------------------------

    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {
    super();
  }
}
