// src/domains/assets/domain/exceptions/media/invalid-frame-rate.exception.ts

import { AssetDomainException } from '../asset-domain.exception';

export class InvalidFrameRateException extends AssetDomainException {
  constructor() {
    super(
      'ASSET_INVALID_FRAME_RATE',
      'The asset frame rate must be greater than zero.',
    );
  }
}
