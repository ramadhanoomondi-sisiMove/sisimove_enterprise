// src/domains/assets/domain/exceptions/scan/invalid-asset-threat-name.exception.ts

import { AssetDomainException } from '../asset-domain.exception';

export class InvalidAssetThreatNameException extends AssetDomainException {
  constructor() {
    super('INVALID_ASSET_THREAT_NAME', 'The asset threat name is invalid.');

    Object.freeze(this);
  }
}
