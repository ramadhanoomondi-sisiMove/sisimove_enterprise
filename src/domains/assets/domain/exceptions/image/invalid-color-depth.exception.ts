import { AssetDomainException } from '../asset-domain.exception';

export class InvalidColorDepthException extends AssetDomainException {
  constructor() {
    super(
      'ASSET_INVALID_COLOR_DEPTH',
      'The asset color depth must be greater than zero.',
    );
  }
}
