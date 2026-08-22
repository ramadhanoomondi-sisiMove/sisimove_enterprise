// =============================================================================
// COMMERCIAL DOMAIN
// =============================================================================
// Application / Queries
//
// Commercial Earning Commission — Get Query
//
// Retrieves a Commercial Earning Commission aggregate by its public identity.
//
// -----------------------------------------------------------------------------
// RESPONSIBILITY
// -----------------------------------------------------------------------------
//
// This query represents the application request to retrieve one specific
// Commercial Earning Commission.
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
//   GetCommercialEarningCommissionQuery
//
// Handler:
//
//   GetCommercialEarningCommissionHandler
//
// Repository:
//
//   CommercialEarningCommissionRepository.findByPublicId()
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

import type { CommercialEarningCommissionPublicId } from '../../domain/value-objects';

// =============================================================================
// Query
// =============================================================================

export class GetCommercialEarningCommissionQuery extends Query {
  public constructor(
    public readonly publicId: CommercialEarningCommissionPublicId,
  ) {
    super();
  }
}

// =============================================================================
// Default Export
// =============================================================================

export default GetCommercialEarningCommissionQuery;
