// =============================================================================
// COMMERCIAL DOMAIN
// =============================================================================
// Application / Queries
//
// Commercial Booking Commissions — Get By Journey Query
//
// Retrieves all Commercial Booking Commission aggregates associated with a
// Journey.
//
// -----------------------------------------------------------------------------
// RESPONSIBILITY
// -----------------------------------------------------------------------------
//
// This query represents the application request to retrieve all booking
// commissions associated with a specific Journey.
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
//   GetCommercialBookingCommissionsByJourneyQuery
//
// Handler:
//
//   GetCommercialBookingCommissionsByJourneyHandler
//
// Repository:
//
//   CommercialBookingCommissionRepository.findByJourneyPublicId()
//
// -----------------------------------------------------------------------------
// CARDINALITY
// -----------------------------------------------------------------------------
//
// A Journey may have multiple bookings.
//
// Therefore a Journey may have multiple Commercial Booking Commissions.
//
// The query returns:
//
//   CommercialBookingCommissionAggregate[]
//
// An empty array indicates that no booking commissions currently exist for
// the specified Journey.
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

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { CommercialBookingCommissionJourneyPublicId } from '../../domain/value-objects';

// =============================================================================
// Query
// =============================================================================

export class GetCommercialBookingCommissionByJourneyQuery extends Query {
  public constructor(
    public readonly journeyPublicId: CommercialBookingCommissionJourneyPublicId,
  ) {
    super();
  }
}

// =============================================================================
// Default Export
// =============================================================================

export default GetCommercialBookingCommissionByJourneyQuery;
