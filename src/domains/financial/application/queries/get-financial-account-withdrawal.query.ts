// -----------------------------------------------------------------------------
// Financial Account Withdrawal — Get Query
// -----------------------------------------------------------------------------
//
// Application query for retrieving an existing Financial Account Withdrawal
// aggregate.
//
// The query carries the domain-ready Financial Account Withdrawal public
// identifier.
//
// The Financial Account Withdrawal is an independent aggregate:
//
// FinancialAccountWithdrawalAggregate
// └── FinancialAccountWithdrawalEntity
//
// The query does not:
// - mutate the withdrawal;
// - execute the withdrawal;
// - move funds;
// - modify Financial Account balances;
// - create Financial Transactions;
// - create or execute Financial Disbursements;
// - call external providers.
//
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

import type { FinancialAccountWithdrawalPublicId } from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

/**
 * Query for retrieving a Financial Account Withdrawal.
 *
 * The query identifies the withdrawal through its stable public identifier.
 *
 * The returned withdrawal state is determined by the query handler and
 * repository implementation.
 */
export class GetFinancialAccountWithdrawalQuery extends Query {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    /**
     * Public identity of the Financial Account Withdrawal to retrieve.
     */
    public readonly withdrawalPublicId: FinancialAccountWithdrawalPublicId,
  ) {
    super();
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetFinancialAccountWithdrawalQuery;
