// -----------------------------------------------------------------------------
// Assets — Check Asset Exists Query
// -----------------------------------------------------------------------------
//
// Application query for checking whether an Asset exists.
//
// The query supports existence checks using one of the supported Asset
// repository lookup dimensions.
//
// Exactly one lookup criterion should be supplied.
//
// -----------------------------------------------------------------------------

import type { Query } from '../../../../foundation/kernel/application/query';

import type { AssetPublicId, AssetObjectKey } from '../../domain/value-objects';

// =============================================================================
// Query
// =============================================================================

export interface CheckAssetExistsCriteria {
  readonly publicId?: AssetPublicId;
  readonly objectKey?: AssetObjectKey;
}

// =============================================================================
// Query
// =============================================================================

export class CheckAssetExistsQuery implements Query {
  public constructor(
    /**
     * Asset existence lookup criteria.
     *
     * Exactly one supported identifier should be supplied.
     */
    public readonly criteria: CheckAssetExistsCriteria,
  ) {}
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default CheckAssetExistsQuery;
