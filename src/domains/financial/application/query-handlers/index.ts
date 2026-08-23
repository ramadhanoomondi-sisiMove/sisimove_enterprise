// -----------------------------------------------------------------------------
// Financial Account — Query Handlers
// -----------------------------------------------------------------------------
//
// Public barrel export for all Financial Account query handlers.
//
// Query handlers retrieve FinancialAccountAggregate instances and do not
// perform domain mutations or create domain events.
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
