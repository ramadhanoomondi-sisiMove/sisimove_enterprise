// =============================================================================
// COMMERCIAL DOMAIN
// =============================================================================
// Application / Queries
//
// Commercial Earning Commissions — Get By Journey Query
//
// Retrieves all Commercial Earning Commission aggregates associated with a
// Journey.
//
// -----------------------------------------------------------------------------
// RESPONSIBILITY
// -----------------------------------------------------------------------------
//
// This query represents the application request to retrieve all earning
// commissions associated with a specific Journey.
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
//   GetCommercialEarningCommissionsByJourneyQuery
//
// Handler:
//
//   GetCommercialEarningCommissionsByJourneyHandler
//
// Repository:
//
//   CommercialEarningCommissionRepository.findByJourneyPublicId()
//
// -----------------------------------------------------------------------------
// CARDINALITY
// -----------------------------------------------------------------------------
//
// A Journey may have multiple settlements.
//
// Therefore a Journey may have multiple Commercial Earning Commissions.
//
// The query returns:
//
//   CommercialEarningCommissionAggregate[]
//
// An empty array is a valid result when the Journey has no earning
// commissions.
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

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { CommercialEarningCommissionJourneyPublicId } from '../../domain/value-objects';

// =============================================================================
// Query
// =============================================================================

export class GetCommercialEarningCommissionsByJourneyQuery extends Query {
  public constructor(
    public readonly journeyPublicId: CommercialEarningCommissionJourneyPublicId,
  ) {
    super();
  }
}

// =============================================================================
// Default Export
// =============================================================================

export default GetCommercialEarningCommissionsByJourneyQuery;
