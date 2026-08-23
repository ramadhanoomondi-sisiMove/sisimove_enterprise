// -----------------------------------------------------------------------------
// Financial Account — Command Handlers
// -----------------------------------------------------------------------------
//
// Public barrel export for all Financial Account command handlers.
//
// All command handlers operate through FinancialAccountAggregate.
// Domain behavior, invariants, state transitions, and domain events remain
// inside the aggregate.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Financial Account Creation
// -----------------------------------------------------------------------------

export * from './create-financial-account.handler';

// -----------------------------------------------------------------------------
// Financial Account Lifecycle
// -----------------------------------------------------------------------------

export * from './activate-financial-account.handler';

export * from './suspend-financial-account.handler';

export * from './close-financial-account.handler';

// -----------------------------------------------------------------------------
// Financial Transaction Creation
// -----------------------------------------------------------------------------

export * from './create-financial-transaction.handler';

// -----------------------------------------------------------------------------
// Financial Transaction Completion
// -----------------------------------------------------------------------------

export * from './complete-financial-transaction.handler';

// -----------------------------------------------------------------------------
// Financial Transaction Failure
// -----------------------------------------------------------------------------

export * from './fail-financial-transaction.handler';

// -----------------------------------------------------------------------------
// Financial Transaction Reversal
// -----------------------------------------------------------------------------

export * from './reverse-financial-transaction.handler';

// -----------------------------------------------------------------------------
// Financial Transaction Cancellation
// -----------------------------------------------------------------------------

export * from './cancel-financial-transaction.handler';
