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
