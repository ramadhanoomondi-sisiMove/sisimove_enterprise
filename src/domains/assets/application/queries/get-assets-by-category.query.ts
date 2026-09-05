// -----------------------------------------------------------------------------
// Assets — Get Assets By Category Query
// -----------------------------------------------------------------------------
//
// Application query for retrieving Asset aggregates by Asset category.
//
// The category is represented by the AssetCategory value object.
//
// This query does not modify Asset state.
//
// -----------------------------------------------------------------------------

import type { Query } from '../../../../foundation/kernel/application/query';

import type { AssetCategory } from '../../domain/value-objects';

// =============================================================================
// Query
// =============================================================================

export class GetAssetsByCategoryQuery implements Query {
  public constructor(
    /**
     * Asset category used for the lookup.
     */
    public readonly category: AssetCategory,
  ) {}
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetAssetsByCategoryQuery;
