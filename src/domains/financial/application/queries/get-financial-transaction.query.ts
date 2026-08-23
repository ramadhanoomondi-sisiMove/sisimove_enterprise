// -----------------------------------------------------------------------------
// Financial Transaction — Get Query
// -----------------------------------------------------------------------------
//
// Application query for retrieving an existing Financial Transaction.
//
// The query identifies the Financial Transaction through its domain public
// identifier.
//
// The query does not mutate the Financial Transaction aggregate.
//
// Repository access and transaction retrieval belong to the query handler.
//
// The query intentionally carries only the transaction identity. Projection,
// authorization, and presentation concerns remain outside the domain.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Query } from '../../../../foundation/kernel/application/query';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { FinancialTransactionPublicId } from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

/**
 * Query for retrieving a Financial Transaction.
 */
export class GetFinancialTransactionQuery extends Query {
  public constructor(
    /**
     * Public identity of the Financial Transaction to retrieve.
     */
    public readonly transactionPublicId: FinancialTransactionPublicId,
  ) {
    super();
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetFinancialTransactionQuery;
