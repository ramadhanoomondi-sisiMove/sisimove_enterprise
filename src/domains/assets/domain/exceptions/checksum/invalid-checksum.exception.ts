import { AssetDomainException } from '../asset-domain.exception';

export class InvalidChecksumException extends AssetDomainException {
  constructor() {
    super('ASSET_INVALID_CHECKSUM', 'The asset checksum is invalid.');
  }
}
