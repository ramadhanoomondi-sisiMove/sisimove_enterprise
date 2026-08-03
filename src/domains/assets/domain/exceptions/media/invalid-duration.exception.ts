import { AssetDomainException } from '../asset-domain.exception';

export class InvalidDurationException extends AssetDomainException {
  constructor() {
    super('ASSET_INVALID_DURATION', 'The asset duration cannot be negative.');
  }
}
