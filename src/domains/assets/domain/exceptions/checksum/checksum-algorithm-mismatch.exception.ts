// src/domains/assets/domain/exceptions/checksum/checksum-algorithm-mismatch.exception.ts

import { AssetDomainException } from '../asset-domain.exception';

export class ChecksumAlgorithmMismatchException extends AssetDomainException {
  constructor() {
    super(
      'ASSET_CHECKSUM_ALGORITHM_MISMATCH',
      'The asset checksum does not match the selected checksum algorithm.',
    );
  }
}
