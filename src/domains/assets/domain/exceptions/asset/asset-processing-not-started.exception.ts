// src/domains/assets/domain/exceptions/asset-processing/asset-processing-not-started.exception.ts

import { AssetDomainException } from '../asset-domain.exception';

export class AssetProcessingNotStartedException extends AssetDomainException {
  constructor(operation: string) {
    super(
      'ASSET_PROCESSING_NOT_STARTED',
      `Asset processing '${operation}' has not been started.`,
    );

    Object.freeze(this);
  }
}
