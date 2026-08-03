// src/domains/assets/domain/exceptions/asset-reference/duplicate-asset-reference.exception.ts

import { AssetDomainException } from '../asset-domain.exception';

export class DuplicateAssetReferenceException extends AssetDomainException {
  constructor(
    resourceType: string,
    resourcePublicId: string,
    referenceField: string,
  ) {
    super(
      'ASSET_REFERENCE_ALREADY_EXISTS',
      `Asset reference already exists for '${resourceType}' '${resourcePublicId}' as '${referenceField}'.`,
    );

    Object.freeze(this);
  }
}
