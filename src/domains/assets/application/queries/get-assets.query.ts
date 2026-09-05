// -----------------------------------------------------------------------------
// Assets — Get Assets Query
// -----------------------------------------------------------------------------
//
// Application query for retrieving Asset aggregates.
//
// This query represents a general Asset collection lookup.
//
// Filtering, pagination, and result shaping remain application concerns and
// are handled by the corresponding query handler/repository implementation.
//
// This query does NOT modify Asset state.
//
// -----------------------------------------------------------------------------

import type { Query } from '../../../../foundation/kernel/application/query';

// =============================================================================
// Query
// =============================================================================

export class GetAssetsQuery implements Query {
  public constructor() {}
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetAssetsQuery;
