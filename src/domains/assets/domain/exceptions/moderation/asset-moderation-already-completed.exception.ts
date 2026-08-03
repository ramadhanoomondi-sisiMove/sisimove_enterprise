import { AssetDomainException } from '../asset-domain.exception';

export class AssetModerationAlreadyCompletedException extends AssetDomainException {
  constructor() {
    super(
      'ASSET_MODERATION_ALREADY_COMPLETED',
      'The asset moderation has already been completed.',
    );

    Object.freeze(this);
  }
}
