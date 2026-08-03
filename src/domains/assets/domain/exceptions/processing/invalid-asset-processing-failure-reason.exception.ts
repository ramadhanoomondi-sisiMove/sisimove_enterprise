import { AssetDomainException } from '../asset-domain.exception';

export class InvalidAssetProcessingFailureReasonException extends AssetDomainException {
  constructor() {
    super(
      'INVALID_ASSET_PROCESSING_FAILURE_REASON',
      'The asset processing failure reason is invalid.',
    );

    Object.freeze(this);
  }
}
