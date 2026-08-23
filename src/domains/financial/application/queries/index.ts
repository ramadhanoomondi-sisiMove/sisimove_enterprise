// -----------------------------------------------------------------------------
// Financial Account — Queries
// -----------------------------------------------------------------------------
//
// Public barrel export for all Financial Account application queries.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Financial Account
// -----------------------------------------------------------------------------

export * from './get-financial-account.query';

// -----------------------------------------------------------------------------
// Financial Account Balance
// -----------------------------------------------------------------------------

export * from './get-financial-account-balance.query';

export * from './get-financial-transaction.query';

// -----------------------------------------------------------------------------
// Financial Account Transactions
// -----------------------------------------------------------------------------
//
// Retrieves Financial Transactions associated with a Financial Account.
//
// FinancialAccountAggregate and FinancialTransactionAggregate remain separate
// aggregate roots.
//

export * from './get-financial-account-transactions.query';
