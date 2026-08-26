// -----------------------------------------------------------------------------
// Financial Application — Queries
// -----------------------------------------------------------------------------
//
// Public barrel export for all Financial application queries.
//
// Covers:
//
// - Financial Account
// - Financial Account Balance
// - Financial Account Transactions
// - Financial Transaction
// - Financial Payment Method
// - Financial Payment
// - Financial Account Payments
// - Financial Account Holds
// - Financial Account Withdrawals
// - Financial Settlement
// - Financial Settlement Items
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
// FinancialAccountAggregate and FinancialTransactionAggregate remain separate
// aggregate roots.
//
// -----------------------------------------------------------------------------

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
//
// Retrieves Financial Payments associated with a Financial Account.
//
// -----------------------------------------------------------------------------

export * from './get-financial-account-payments.query';

// -----------------------------------------------------------------------------
// Financial Account Holds
// -----------------------------------------------------------------------------
//
// Retrieves Financial Account Holds associated with a Financial Account.
//
// -----------------------------------------------------------------------------

export * from './get-financial-account-holds.query';

// -----------------------------------------------------------------------------
// Financial Account Withdrawals
// -----------------------------------------------------------------------------
//
// Retrieves Financial Account Withdrawals associated with a Financial Account.
//
// Withdrawal lifecycle:
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
// The withdrawal aggregate remains separate from the Financial Account
// aggregate. These queries provide read access to withdrawal state without
// exposing lifecycle behavior through the query layer.
//
// -----------------------------------------------------------------------------

export * from './get-financial-account-withdrawal.query';

export * from './get-financial-account-withdrawals.query';

export * from './get-financial-account-withdrawals-by-status.query';

// -----------------------------------------------------------------------------
// Financial Settlement
// -----------------------------------------------------------------------------
//
// Retrieves an existing Financial Settlement by its public identity.
//
// The Settlement aggregate owns its Settlement Items and Allocations.
//
// -----------------------------------------------------------------------------

export * from './get-financial-settlement.query';

// -----------------------------------------------------------------------------
// Financial Settlement Items
// -----------------------------------------------------------------------------
//
// Retrieves the Settlement Items belonging to a Financial Settlement.
//
// Settlement Items remain child entities of the Financial Settlement aggregate
// and are not independent aggregate roots.
//
// -----------------------------------------------------------------------------

export * from './get-financial-settlement-items.query';
