// -----------------------------------------------------------------------------
// Financial Settlement Items — Get Query
// -----------------------------------------------------------------------------
//
// Application query for retrieving the Settlement Items belonging to an
// existing Financial Settlement.
//
// The query identifies the owning Financial Settlement through its public
// identity.
//
// Query behavior belongs to the application/query layer.
// Repository access and aggregate rehydration/projection belong to the query
// handler.
//
// This query does not mutate the Financial Settlement aggregate.
//
// The returned items may include their Settlement Allocations depending on
// the projection implemented by the query handler.
//
// -----------------------------------------------------------------------------
//
// Aggregate:
//
// FinancialSettlementAggregate
// └── FinancialSettlementEntity
//     └── FinancialSettlementItemEntity[]
//         └── FinancialSettlementAllocationEntity[]
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Query } from '../../../../foundation/kernel/application/query';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { FinancialSettlementPublicId } from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

/**
 * Query for retrieving the Settlement Items belonging to a Financial
 * Settlement.
 *
 * The Settlement public identifier is a domain value object because the query
 * represents an application-level request against the Financial domain.
 *
 * The query intentionally carries only the Settlement identity.
 *
 * Filtering, pagination, ordering, and projection policies should be
 * introduced through dedicated query parameters when the application use
 * case requires them.
 */
export class GetFinancialSettlementItemsQuery extends Query {
  public constructor(
    /**
     * Public identity of the Financial Settlement whose Items are requested.
     */
    public readonly settlementPublicId: FinancialSettlementPublicId,
  ) {
    super();
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetFinancialSettlementItemsQuery;
