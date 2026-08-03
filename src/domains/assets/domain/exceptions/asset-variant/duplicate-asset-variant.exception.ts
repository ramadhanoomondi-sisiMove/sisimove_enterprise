// src/domains/assets/domain/exceptions/asset-variant/duplicate-asset-variant.exception.ts

import { AssetDomainException } from '../asset-domain.exception';

export class DuplicateAssetVariantException extends AssetDomainException {
  constructor(variant: string) {
    super(
      'ASSET_VARIANT_ALREADY_EXISTS',
      `Asset variant '${variant}' already exists.`,
    );

    Object.freeze(this);
  }
}
