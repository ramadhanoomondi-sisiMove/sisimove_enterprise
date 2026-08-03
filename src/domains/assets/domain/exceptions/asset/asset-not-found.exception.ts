// src/domains/assets/domain/exceptions/asset/asset-not-found.exception.ts

import { AssetDomainException } from '../asset-domain.exception';

export class AssetNotFoundException extends AssetDomainException {
  constructor(assetId: string) {
    super('ASSET_NOT_FOUND', `Asset '${assetId}' was not found.`);

    Object.freeze(this);
  }
}
