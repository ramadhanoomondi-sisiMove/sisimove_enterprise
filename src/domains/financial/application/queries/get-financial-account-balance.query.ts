// -----------------------------------------------------------------------------
// Financial Account Balance — Get Query
// -----------------------------------------------------------------------------
//
// Application query for retrieving the balance state of an existing
// Financial Account.
//
// The query carries a domain-ready Financial Account public identifier.
//
// The balance is aggregate-owned:
//
// FinancialAccountAggregate
// ├── FinancialAccountEntity
// └── FinancialAccountBalanceEntity
//
// The query does not expose the balance entity as an independent aggregate.
// Query behavior belongs to the application/query layer.
// Repository access belongs to the query handler.
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
 * Query for retrieving the balance of a Financial Account.
 */
export class GetFinancialAccountBalanceQuery extends Query {
  public constructor(
    /**
     * Public identity of the Financial Account whose balance is requested.
     */
    public readonly accountPublicId: FinancialAccountPublicId,
  ) {
    super();
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetFinancialAccountBalanceQuery;
