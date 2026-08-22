// =============================================================================
// COMMERCIAL DOMAIN
// =============================================================================
// Application / Queries
//
// Commercial Booking Commission — Get Query
//
// Retrieves a Commercial Booking Commission aggregate by its public identity.
//
// -----------------------------------------------------------------------------
// RESPONSIBILITY
// -----------------------------------------------------------------------------
//
// This query represents the application request to retrieve one specific
// Commercial Booking Commission.
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
//   GetCommercialBookingCommissionQuery
//
// Handler:
//
//   GetCommercialBookingCommissionHandler
//
// Repository:
//
//   CommercialBookingCommissionRepository.findByPublicId()
//
// -----------------------------------------------------------------------------
// DOMAIN BOUNDARY
// -----------------------------------------------------------------------------
//
// The query does not:
//
// - create a commission;
// - assess a commission;
// - cancel a commission;
// - calculate a commission;
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

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { CommercialBookingCommissionPublicId } from '../../domain/value-objects';

// =============================================================================
// Query
// =============================================================================

export class GetCommercialBookingCommissionQuery extends Query {
  public constructor(
    public readonly publicId: CommercialBookingCommissionPublicId,
  ) {
    super();
  }
}

// =============================================================================
// Default Export
// =============================================================================

export default GetCommercialBookingCommissionQuery;
