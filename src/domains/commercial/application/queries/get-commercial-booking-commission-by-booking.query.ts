// =============================================================================
// COMMERCIAL DOMAIN
// =============================================================================
// Application / Queries
//
// Commercial Booking Commission — Get By Booking Query
//
// Retrieves the Commercial Booking Commission associated with a Booking.
//
// -----------------------------------------------------------------------------
// RESPONSIBILITY
// -----------------------------------------------------------------------------
//
// This query represents the application request to retrieve the commission
// associated with a specific Booking.
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
//   GetCommercialBookingCommissionByBookingQuery
//
// Handler:
//
//   GetCommercialBookingCommissionByBookingHandler
//
// Repository:
//
//   CommercialBookingCommissionRepository.findByBookingPublicId()
//
// -----------------------------------------------------------------------------
// BUSINESS INVARIANT
// -----------------------------------------------------------------------------
//
// A Booking can have at most one Commercial Booking Commission.
//
// Therefore this query returns:
//
//   CommercialBookingCommissionAggregate | null
//
// The query itself does not enforce the invariant. Persistence and command
// handling are responsible for maintaining it.
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

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { CommercialBookingCommissionBookingPublicId } from '../../domain/value-objects';

// =============================================================================
// Query
// =============================================================================

export class GetCommercialBookingCommissionByBookingQuery extends Query {
  public constructor(
    public readonly bookingPublicId: CommercialBookingCommissionBookingPublicId,
  ) {
    super();
  }
}

// =============================================================================
// Default Export
// =============================================================================

export default GetCommercialBookingCommissionByBookingQuery;
