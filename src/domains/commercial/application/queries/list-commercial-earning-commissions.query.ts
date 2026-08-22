// =============================================================================
// COMMERCIAL DOMAIN
// =============================================================================
// Application / Queries
//
// Commercial Earning Commission — List Query
//
// Retrieves all Commercial Earning Commission aggregates.
//
// -----------------------------------------------------------------------------
// RESPONSIBILITY
// -----------------------------------------------------------------------------
//
// This query represents the application request to retrieve the complete
// collection of Commercial Earning Commission aggregates.
//
// It contains no business logic and performs no persistence operations.
//
// The corresponding query handler delegates retrieval to the
// CommercialEarningCommissionRepository.
//
// -----------------------------------------------------------------------------
// CQRS
// -----------------------------------------------------------------------------
//
// Query:
//
//   ListCommercialEarningCommissionsQuery
//
// Handler:
//
//   ListCommercialEarningCommissionsHandler
//
// Repository:
//
//   CommercialEarningCommissionRepository.findAll()
//
// -----------------------------------------------------------------------------
// DOMAIN BOUNDARY
// -----------------------------------------------------------------------------
//
// The query does not:
//
// - create commissions;
// - assess commissions;
// - cancel commissions;
// - calculate commission amounts;
// - modify commission state.
//
// Those responsibilities belong to the appropriate command handlers and
// CommercialEarningCommission aggregate.
//
// =============================================================================

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Query } from '../../../../foundation/kernel/application/query';

// =============================================================================
// Query
// =============================================================================

export class ListCommercialEarningCommissionsQuery extends Query {
  public constructor() {
    super();
  }
}

// =============================================================================
// Default Export
// =============================================================================

export default ListCommercialEarningCommissionsQuery;
