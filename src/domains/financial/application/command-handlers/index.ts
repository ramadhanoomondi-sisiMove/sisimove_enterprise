// -----------------------------------------------------------------------------
// Financial Account — Command Handlers
// -----------------------------------------------------------------------------
//
// Public barrel export for all Financial Account command handlers.
//
// All command handlers operate through their respective aggregate roots.
//
// Domain behavior, invariants, state transitions, and domain events remain
// inside the aggregates.
//
// Application handlers are responsible for:
// - Resolving aggregates.
// - Coordinating application workflows.
// - Delegating domain behavior to aggregates.
// - Persisting aggregate changes.
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
// Financial Transaction Lifecycle
// -----------------------------------------------------------------------------

export * from './complete-financial-transaction.handler';

export * from './fail-financial-transaction.handler';

export * from './reverse-financial-transaction.handler';

export * from './cancel-financial-transaction.handler';

// -----------------------------------------------------------------------------
// Financial Payment Creation
// -----------------------------------------------------------------------------

export * from './create-financial-payment.handler';

// -----------------------------------------------------------------------------
// Financial Payment Lifecycle
// -----------------------------------------------------------------------------

export * from './process-financial-payment.handler';

export * from './succeed-financial-payment.handler';

export * from './fail-financial-payment.handler';

export * from './cancel-financial-payment.handler';

export * from './expire-financial-payment.handler';

// -----------------------------------------------------------------------------
// Financial Payment Transaction
// -----------------------------------------------------------------------------

export * from './link-financial-payment-transaction.handler';

// -----------------------------------------------------------------------------
// Financial Payment Method
// -----------------------------------------------------------------------------

export * from './add-financial-payment-method.handler';

export * from './set-default-financial-payment-method.handler';

export * from './deactivate-financial-payment-method.handler';

// -----------------------------------------------------------------------------
// Financial Account Hold Creation
// -----------------------------------------------------------------------------

export * from './create-financial-account-hold.handler';

// -----------------------------------------------------------------------------
// Financial Account Hold Lifecycle
// -----------------------------------------------------------------------------
//
// Financial Account Hold lifecycle:
//
//     ACTIVE
//        │
//        ├── RELEASED
//        ├── CAPTURED
//        └── CANCELLED
//
// RELEASED, CAPTURED and CANCELLED are terminal states.
//
// -----------------------------------------------------------------------------

export * from './capture-financial-account-hold.handler';

export * from './release-financial-account-hold.handler';

export * from './cancel-financial-account-hold.handler';
