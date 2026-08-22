// =============================================================================
// COMMERCIAL DOMAIN
// =============================================================================
// Application / Queries
//
// Commercial Earning Commission — Get By Settlement Query
//
// Retrieves the Commercial Earning Commission associated with a Settlement.
//
// -----------------------------------------------------------------------------
// RESPONSIBILITY
// -----------------------------------------------------------------------------
//
// This query represents the application request to retrieve the earning
// commission associated with a specific Settlement.
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
//   GetCommercialEarningCommissionBySettlementQuery
//
// Handler:
//
//   GetCommercialEarningCommissionBySettlementHandler
//
// Repository:
//
//   CommercialEarningCommissionRepository.findBySettlementPublicId()
//
// -----------------------------------------------------------------------------
// BUSINESS INVARIANT
// -----------------------------------------------------------------------------
//
// A Settlement can have at most one Commercial Earning Commission.
//
// Therefore this query returns:
//
//   CommercialEarningCommissionAggregate | null
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

import type { CommercialEarningCommissionSettlementPublicId } from '../../domain/value-objects';

// =============================================================================
// Query
// =============================================================================

export class GetCommercialEarningCommissionBySettlementQuery extends Query {
  public constructor(
    public readonly settlementPublicId: CommercialEarningCommissionSettlementPublicId,
  ) {
    super();
  }
}

// =============================================================================
// Default Export
// =============================================================================

export default GetCommercialEarningCommissionBySettlementQuery;
