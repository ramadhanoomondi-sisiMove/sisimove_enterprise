// src/domains/assets/domain/exceptions/media/invalid-bitrate.exception.ts

import { AssetDomainException } from '../asset-domain.exception';

export class InvalidBitrateException extends AssetDomainException {
  constructor() {
    super(
      'ASSET_INVALID_BITRATE',
      'The asset bitrate must be greater than zero.',
    );
  }
}
