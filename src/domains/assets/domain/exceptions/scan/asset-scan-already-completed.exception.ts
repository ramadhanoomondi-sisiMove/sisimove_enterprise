// src/domains/assets/domain/exceptions/scan/asset-scan-already-completed.exception.ts

import { AssetDomainException } from '../asset-domain.exception';

export class AssetScanAlreadyCompletedException extends AssetDomainException {
  constructor() {
    super(
      'ASSET_SCAN_ALREADY_COMPLETED',
      'The asset scan has already been completed.',
    );

    Object.freeze(this);
  }
}
