import { AssetDomainException } from '../asset-domain.exception';

export class InvalidAssetSizeException extends AssetDomainException {
  constructor() {
    super('ASSET_INVALID_SIZE', 'The asset size must be greater than zero.');
  }
}
