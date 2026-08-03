import { AssetDomainException } from '../asset-domain.exception';

export class AssetAlreadyDeletedException extends AssetDomainException {
  constructor() {
    super('ASSET_ALREADY_DELETED', 'The asset has already been deleted.');
  }
}
