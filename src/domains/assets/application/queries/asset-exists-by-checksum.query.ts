import type { ChecksumAlgorithm } from '../../domain/value-objects';

export class AssetExistsByChecksumQuery {
  constructor(
    public readonly algorithm: ChecksumAlgorithm,
    public readonly checksum: string,
    public readonly correlationId?: string,
  ) {}
}
