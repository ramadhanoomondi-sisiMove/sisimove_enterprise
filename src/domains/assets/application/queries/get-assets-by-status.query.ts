// -----------------------------------------------------------------------------
// Assets — Get Assets By Status Query
// -----------------------------------------------------------------------------
//
// Application query for retrieving Asset aggregates by lifecycle status.
//
// The status is represented by the AssetStatus value object.
//
// This query does not determine whether an Asset may perform a business
// operation. It only requests persistence-level retrieval by lifecycle state.
//
// -----------------------------------------------------------------------------

import type { Query } from '../../../../foundation/kernel/application/query';

import type { AssetStatus } from '../../domain/value-objects';

// =============================================================================
// Query
// =============================================================================

export class GetAssetsByStatusQuery implements Query {
  public constructor(
    /**
     * Asset lifecycle status used for the lookup.
     */
    public readonly status: AssetStatus,
  ) {}
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetAssetsByStatusQuery;
