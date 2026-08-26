// -----------------------------------------------------------------------------
// Financial Account Withdrawals — Get By Status Query
// -----------------------------------------------------------------------------
//
// Application query for retrieving Financial Account Withdrawals belonging to
// a Financial Account and matching a specific lifecycle status.
//
// The query carries domain-ready value objects.
//
// The withdrawal lifecycle is:
//
//     PENDING
//        │
//        ├── PROCESSING
//        │      ├── COMPLETED
//        │      ├── FAILED
//        │      └── CANCELLED
//        │
//        └── CANCELLED
//
// This query is intended for lifecycle-aware read operations such as:
//
// - pending withdrawals;
// - processing withdrawals;
// - completed withdrawals;
// - failed withdrawals;
// - cancelled withdrawals.
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

import type {
  FinancialAccountPublicId,
  FinancialAccountWithdrawalStatus,
} from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

/**
 * Query for retrieving Financial Account Withdrawals belonging to a Financial
 * Account and matching the supplied lifecycle status.
 */
export class GetFinancialAccountWithdrawalsByStatusQuery extends Query {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    /**
     * Public identity of the Financial Account whose withdrawals are requested.
     */
    public readonly accountPublicId: FinancialAccountPublicId,

    /**
     * Lifecycle status that the withdrawals must match.
     */
    public readonly status: FinancialAccountWithdrawalStatus,
  ) {
    super();
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetFinancialAccountWithdrawalsByStatusQuery;
