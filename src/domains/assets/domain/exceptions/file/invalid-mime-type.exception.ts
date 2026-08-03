import { AssetDomainException } from '../asset-domain.exception';

export class InvalidMimeTypeException extends AssetDomainException {
  constructor() {
    super('ASSET_INVALID_MIME_TYPE', 'The asset MIME type is invalid.');
  }
}
