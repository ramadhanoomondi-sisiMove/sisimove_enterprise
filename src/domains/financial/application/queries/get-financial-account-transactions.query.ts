// -----------------------------------------------------------------------------
// Financial Account Transactions — Get Query
// -----------------------------------------------------------------------------
//
// Application query for retrieving the Financial Transactions associated with
// an existing Financial Account.
//
// The query identifies the Financial Account through its domain public
// identifier.
//
// Transaction retrieval is a query concern and does not mutate the Financial
// Account or Financial Transaction aggregates.
//
// Repository access belongs to the query handler.
//
// The query intentionally carries only the account identity. Filtering,
// pagination, ordering, and projection policies should be introduced through
// dedicated query parameters when the application use case requires them.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Query } from '../../../../foundation/kernel/application/query';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { FinancialAccountPublicId } from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

/**
 * Query for retrieving Financial Transactions associated with a Financial
 * Account.
 *
 * The account public identifier is a domain value object because the query
 * represents an application-level request against the Financial domain.
 */
export class GetFinancialAccountTransactionsQuery extends Query {
  public constructor(
    /**
     * Public identity of the Financial Account whose transactions are
     * requested.
     */
    public readonly accountPublicId: FinancialAccountPublicId,
  ) {
    super();
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetFinancialAccountTransactionsQuery;
