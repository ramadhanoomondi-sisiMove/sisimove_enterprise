// -----------------------------------------------------------------------------
// Financial Settlement — Get Query
// -----------------------------------------------------------------------------
//
// Application query for retrieving an existing Financial Settlement
// aggregate.
//
// The query identifies the Financial Settlement through its public identity.
//
// Query behavior belongs to the application/query layer.
// Repository access and aggregate rehydration belong to the query handler.
//
// This query does not mutate the Financial Settlement aggregate.
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
 * Query for retrieving a Financial Settlement by its public identity.
 *
 * The returned Settlement may include its complete aggregate graph depending
 * on the projection implemented by the query handler:
 *
 * FinancialSettlementAggregate
 * └── FinancialSettlementEntity
 *     └── FinancialSettlementItemEntity[]
 *         └── FinancialSettlementAllocationEntity[]
 */
export class GetFinancialSettlementQuery extends Query {
  public constructor(
    /**
     * Public identity of the Financial Settlement to retrieve.
     */
    public readonly settlementPublicId: FinancialSettlementPublicId,
  ) {
    super();
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetFinancialSettlementQuery;
