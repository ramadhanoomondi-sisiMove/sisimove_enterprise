// -----------------------------------------------------------------------------
// Financial Account Withdrawals — Get Query
// -----------------------------------------------------------------------------
//
// Application query for retrieving Financial Account Withdrawals belonging to
// a Financial Account.
//
// The query carries the domain-ready Financial Account public identifier.
//
// This query represents an account-level withdrawal history/read operation.
//
// The query does NOT:
//
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
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { FinancialAccountPublicId } from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

/**
 * Query for retrieving all Financial Account Withdrawals belonging to a
 * Financial Account.
 *
 * The account is identified by its stable public identifier.
 */
export class GetFinancialAccountWithdrawalsQuery extends Query {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    /**
     * Public identity of the Financial Account whose withdrawals are requested.
     */
    public readonly accountPublicId: FinancialAccountPublicId,
  ) {
    super();
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetFinancialAccountWithdrawalsQuery;
