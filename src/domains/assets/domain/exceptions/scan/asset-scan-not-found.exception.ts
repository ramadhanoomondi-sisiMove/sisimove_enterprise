// src/domains/assets/domain/exceptions/asset-scan/asset-scan-not-found.exception.ts

import { AssetDomainException } from '../asset-domain.exception';

export class AssetScanNotFoundException extends AssetDomainException {
  constructor(engine: string) {
    super('ASSET_SCAN_NOT_FOUND', `Asset scan '${engine}' was not found.`);

    Object.freeze(this);
  }
}
