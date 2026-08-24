// -----------------------------------------------------------------------------
// Financial Account — Queries
// -----------------------------------------------------------------------------
//
// Public barrel export for all Financial Account application queries.
//
// Covers:
// - Financial Account
// - Financial Account Balance
// - Financial Account Transactions
// - Financial Payment Method
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

// -----------------------------------------------------------------------------
// Financial Account Transactions
// -----------------------------------------------------------------------------

//
// Retrieves Financial Transactions associated with a Financial Account.
//
// FinancialAccountAggregate and FinancialTransactionAggregate remain
// separate aggregate roots.
//

export * from './get-financial-account-transactions.query';

// -----------------------------------------------------------------------------
// Financial Transaction
// -----------------------------------------------------------------------------

export * from './get-financial-transaction.query';

// -----------------------------------------------------------------------------
// Financial Payment Method
// -----------------------------------------------------------------------------

export * from './get-financial-payment-method.query';

export * from './get-default-financial-payment-method.query';

// -----------------------------------------------------------------------------
// Financial Payment
// -----------------------------------------------------------------------------

export * from './get-financial-payment.query';

// -----------------------------------------------------------------------------
// Financial Account Payments
// -----------------------------------------------------------------------------

export * from './get-financial-account-payments.query';
