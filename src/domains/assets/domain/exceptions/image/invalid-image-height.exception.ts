import { AssetDomainException } from '../asset-domain.exception';

export class InvalidImageHeightException extends AssetDomainException {
  constructor() {
    super(
      'ASSET_INVALID_IMAGE_HEIGHT',
      'The asset image height must be greater than zero.',
    );
  }
}
