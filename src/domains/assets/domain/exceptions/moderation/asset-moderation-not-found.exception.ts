// src/domains/assets/domain/exceptions/asset-moderation-not-found.exception.ts

import type { AssetModerationType } from '../../value-objects';

import { AssetDomainException } from '../asset-domain.exception';

export class AssetModerationNotFoundException extends AssetDomainException {
  constructor(type: AssetModerationType) {
    super(
      'ASSET_MODERATION_NOT_FOUND',
      `Asset moderation '${type}' was not found.`,
    );
  }
}
