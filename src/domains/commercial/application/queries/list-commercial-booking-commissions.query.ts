// =============================================================================
// COMMERCIAL DOMAIN
// =============================================================================
// Application / Queries
//
// Commercial Booking Commission — List Query
//
// Retrieves all Commercial Booking Commission aggregates.
//
// -----------------------------------------------------------------------------
// RESPONSIBILITY
// -----------------------------------------------------------------------------
//
// This query represents the application request to retrieve the complete
// collection of Commercial Booking Commission aggregates.
//
// It contains no business logic and performs no persistence operations.
//
// The corresponding query handler delegates retrieval to the
// CommercialBookingCommissionRepository.
//
// -----------------------------------------------------------------------------
// CQRS
// -----------------------------------------------------------------------------
//
// Query:
//
//   ListCommercialBookingCommissionsQuery
//
// Handler:
//
//   ListCommercialBookingCommissionsHandler
//
// Repository:
//
//   CommercialBookingCommissionRepository.findAll()
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
// CommercialBookingCommission aggregate.
//
// =============================================================================

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Query } from '../../../../foundation/kernel/application/query';

// =============================================================================
// Query
// =============================================================================

export class ListCommercialBookingCommissionsQuery extends Query {
  public constructor() {
    super();
  }
}

// =============================================================================
// Default Export
// =============================================================================

export default ListCommercialBookingCommissionsQuery;
