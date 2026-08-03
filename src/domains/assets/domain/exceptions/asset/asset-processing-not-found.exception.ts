// src/domains/assets/domain/exceptions/asset-processing/asset-processing-not-found.exception.ts

import { AssetDomainException } from '../asset-domain.exception';

export class AssetProcessingNotFoundException extends AssetDomainException {
  constructor(operation: string) {
    super(
      'ASSET_PROCESSING_NOT_FOUND',
      `Asset processing '${operation}' was not found.`,
    );

    Object.freeze(this);
  }
}
