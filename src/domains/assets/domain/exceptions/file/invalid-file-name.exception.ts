import { AssetDomainException } from '../asset-domain.exception';

export class InvalidFileNameException extends AssetDomainException {
  constructor() {
    super('ASSET_INVALID_FILE_NAME', 'The asset file name is invalid.');
  }
}
