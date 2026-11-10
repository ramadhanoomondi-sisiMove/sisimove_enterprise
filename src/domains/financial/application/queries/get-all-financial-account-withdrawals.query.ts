// -----------------------------------------------------------------------------
// Financial Account Withdrawal — Get All Query
// -----------------------------------------------------------------------------
//
// Application query for retrieving all Financial Account Withdrawal
// aggregates across the platform.
//
// The query represents a platform-wide withdrawal collection request.
//
// The Financial Account Withdrawal is an independent aggregate:
//
// FinancialAccountWithdrawalAggregate
// └── FinancialAccountWithdrawalEntity
//
// The query does not:
// - mutate withdrawals;
// - execute withdrawals;
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
// Query
// -----------------------------------------------------------------------------

/**
 * Query for retrieving all Financial Account Withdrawals.
 *
 * This query does not require an account identifier because it is intended
 * for platform-wide administrative withdrawal oversight.
 *
 * The returned withdrawal collection is determined by the query handler
 * and repository implementation.
 */
export class GetAllFinancialAccountWithdrawalsQuery extends Query {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor() {
    super();
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetAllFinancialAccountWithdrawalsQuery;
