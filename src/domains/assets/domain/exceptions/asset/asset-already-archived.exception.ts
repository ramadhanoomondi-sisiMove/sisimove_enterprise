import { AssetDomainException } from '../asset-domain.exception';

export class AssetAlreadyArchivedException extends AssetDomainException {
  constructor() {
    super('ASSET_ALREADY_ARCHIVED', 'The asset has already been archived.');
  }
}
