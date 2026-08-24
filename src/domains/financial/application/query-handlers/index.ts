// -----------------------------------------------------------------------------
// Financial Account — Query Handlers
// -----------------------------------------------------------------------------
//
// Public barrel export for all Financial Account query handlers.
//
// Query handlers:
//
// - retrieve existing aggregates or related financial data;
// - perform no domain mutations;
// - create no domain events;
// - do not execute financial operations.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Financial Account
// -----------------------------------------------------------------------------

export * from './get-financial-account.handler';

// -----------------------------------------------------------------------------
// Financial Account Balance
// -----------------------------------------------------------------------------

export * from './get-financial-account-balance.handler';

// -----------------------------------------------------------------------------
// Financial Transaction
// -----------------------------------------------------------------------------

export * from './get-financial-transaction.handler';

// -----------------------------------------------------------------------------
// Financial Account Transactions
// -----------------------------------------------------------------------------

export * from './get-financial-account-transactions.handler';

// -----------------------------------------------------------------------------
// Financial Payment
// -----------------------------------------------------------------------------

export * from './get-financial-payment.handler';

// -----------------------------------------------------------------------------
// Financial Account Payments
// -----------------------------------------------------------------------------

export * from './get-financial-account-payments.handler';

// -----------------------------------------------------------------------------
// Financial Payment Method
// -----------------------------------------------------------------------------

export * from './get-financial-payment-method.handler';

// -----------------------------------------------------------------------------
// Default Financial Payment Method
// -----------------------------------------------------------------------------

export * from './get-default-financial-payment-method.handler';
