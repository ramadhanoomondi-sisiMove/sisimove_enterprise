// src/domains/assets/domain/exceptions/asset/asset-not-ready.exception.ts

import { AssetDomainException } from '../asset-domain.exception';

export class AssetNotReadyException extends AssetDomainException {
  constructor() {
    super('ASSET_NOT_READY', 'The asset is not ready for this operation.');

    Object.freeze(this);
  }
}
