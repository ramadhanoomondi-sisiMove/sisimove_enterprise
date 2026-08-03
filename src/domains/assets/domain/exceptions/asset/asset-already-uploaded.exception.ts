import { AssetDomainException } from '../asset-domain.exception';

export class AssetAlreadyUploadedException extends AssetDomainException {
  constructor() {
    super('ASSET_ALREADY_UPLOADED', 'The asset has already been uploaded.');
  }
}
