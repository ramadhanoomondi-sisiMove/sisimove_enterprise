// src/domains/assets/domain/exceptions/asset/invalid-asset-state-transition.exception.ts

import { AssetDomainException } from '../asset-domain.exception';

export class InvalidAssetStateTransitionException extends AssetDomainException {
  constructor(current: string, next: string) {
    super(
      'ASSET_INVALID_STATE_TRANSITION',
      `Invalid asset state transition from '${current}' to '${next}'.`,
    );

    Object.freeze(this);
  }
}
