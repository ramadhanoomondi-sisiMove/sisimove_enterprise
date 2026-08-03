import { AssetDomainException } from '../asset-domain.exception';

export class InvalidObjectKeyException extends AssetDomainException {
  constructor() {
    super('ASSET_INVALID_OBJECT_KEY', 'The asset object key is invalid.');
  }
}
