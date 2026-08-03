// src/domains/assets/application/commands/create-asset.command.ts

import { Command } from '../../../../foundation/kernel/application/command';

import type {
  AssetCategory,
  AssetType,
  ChecksumAlgorithm,
  JsonValue,
  StorageProvider,
} from '../../domain/value-objects';

export class CreateAssetCommand extends Command {
  constructor(
    // ----------------------------------------------------------------------
    // Ownership
    // ----------------------------------------------------------------------

    public readonly ownerIdentityId: string | undefined,

    // ----------------------------------------------------------------------
    // Classification
    // ----------------------------------------------------------------------

    public readonly type: AssetType,
    public readonly category: AssetCategory,

    // ----------------------------------------------------------------------
    // Storage
    // ----------------------------------------------------------------------

    public readonly storageProvider: StorageProvider,
    public readonly bucket: string,
    public readonly objectKey: string,

    // ----------------------------------------------------------------------
    // File Metadata
    // ----------------------------------------------------------------------

    public readonly originalFilename: string | undefined,
    public readonly storedFilename: string | undefined,

    public readonly mimeType: string,
    public readonly extension: string | undefined,

    public readonly sizeBytes: bigint,

    // ----------------------------------------------------------------------
    // Integrity
    // ----------------------------------------------------------------------

    public readonly checksumAlgorithm: ChecksumAlgorithm | undefined,
    public readonly checksum: string | undefined,

    // ----------------------------------------------------------------------
    // Additional Metadata
    // ----------------------------------------------------------------------

    public readonly metadata: JsonValue | undefined,

    // ----------------------------------------------------------------------
    // Correlation
    // ----------------------------------------------------------------------

    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {
    super();
  }
}
