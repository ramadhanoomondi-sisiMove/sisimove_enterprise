import { AssetDomainException } from '../asset-domain.exception';

export class InvalidBucketException extends AssetDomainException {
  constructor() {
    super('ASSET_INVALID_BUCKET', 'The asset storage bucket is invalid.');
  }
}
