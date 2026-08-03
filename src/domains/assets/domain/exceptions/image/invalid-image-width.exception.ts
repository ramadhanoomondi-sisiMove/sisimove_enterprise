import { AssetDomainException } from '../asset-domain.exception';

export class InvalidImageWidthException extends AssetDomainException {
  constructor() {
    super(
      'ASSET_INVALID_IMAGE_WIDTH',
      'The asset image width must be greater than zero.',
    );
  }
}
