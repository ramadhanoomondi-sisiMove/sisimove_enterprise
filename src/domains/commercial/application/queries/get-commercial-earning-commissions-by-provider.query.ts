// =============================================================================
// COMMERCIAL DOMAIN
// =============================================================================
// Application / Queries
//
// Commercial Earning Commissions — Get By Provider Query
//
// Retrieves all Commercial Earning Commission aggregates associated with a
// Provider.
//
// -----------------------------------------------------------------------------
// RESPONSIBILITY
// -----------------------------------------------------------------------------
//
// This query represents the application request to retrieve all earning
// commissions associated with a specific Provider.
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
//   GetCommercialEarningCommissionsByProviderQuery
//
// Handler:
//
//   GetCommercialEarningCommissionsByProviderHandler
//
// Repository:
//
//   CommercialEarningCommissionRepository.findByProviderPublicId()
//
// -----------------------------------------------------------------------------
// CARDINALITY
// -----------------------------------------------------------------------------
//
// A Provider may complete multiple Journeys and settlements.
//
// Therefore a Provider may have multiple Commercial Earning Commissions.
//
// The query returns:
//
//   CommercialEarningCommissionAggregate[]
//
// An empty array is a valid result when the Provider has no earning
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

import type { CommercialEarningCommissionProviderPublicId } from '../../domain/value-objects';

// =============================================================================
// Query
// =============================================================================

export class GetCommercialEarningCommissionsByProviderQuery extends Query {
  public constructor(
    public readonly providerPublicId: CommercialEarningCommissionProviderPublicId,
  ) {
    super();
  }
}

// =============================================================================
// Default Export
// =============================================================================

export default GetCommercialEarningCommissionsByProviderQuery;
