// -----------------------------------------------------------------------------
// Financial — Command Handlers
// -----------------------------------------------------------------------------
//
// Public barrel export for all Financial command handlers.
//
// All command handlers operate through their respective aggregate roots.
//
// Domain behavior, invariants, lifecycle transitions, and domain events remain
// inside the aggregates.
//
// Application handlers are responsible for:
//
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
// RELEASED, CAPTURED, and CANCELLED are terminal states.
//
// -----------------------------------------------------------------------------

export * from './capture-financial-account-hold.handler';

export * from './release-financial-account-hold.handler';

export * from './cancel-financial-account-hold.handler';

// -----------------------------------------------------------------------------
// Financial Account Withdrawal Request
// -----------------------------------------------------------------------------
//
// Financial Account Withdrawal lifecycle:
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
// The withdrawal aggregate owns lifecycle validation and state transitions.
//
// Withdrawal handlers do not directly move money, modify Financial Account
// balances, create transactions, or execute Financial Disbursements.
//
// -----------------------------------------------------------------------------

export * from './request-financial-account-withdrawal.handler';

// -----------------------------------------------------------------------------
// Financial Account Withdrawal Lifecycle
// -----------------------------------------------------------------------------
//
// Valid lifecycle transitions:
//
//     PENDING     -> PROCESSING
//
//     PROCESSING  -> COMPLETED
//     PROCESSING  -> FAILED
//     PROCESSING  -> CANCELLED
//
//     PENDING     -> CANCELLED
//
// COMPLETED, FAILED, and CANCELLED are terminal states.
//
// -----------------------------------------------------------------------------

export * from './process-financial-account-withdrawal.handler';

export * from './complete-financial-account-withdrawal.handler';

export * from './fail-financial-account-withdrawal.handler';

export * from './cancel-financial-account-withdrawal.handler';

// -----------------------------------------------------------------------------
// Financial Settlement Creation
// -----------------------------------------------------------------------------
//
// Financial Settlement represents the settlement lifecycle aggregate.
//
// Settlement creation establishes the Settlement and its initial lifecycle
// state. Settlement Items are subsequently managed through the Settlement
// aggregate.
//
// -----------------------------------------------------------------------------

export * from './create-financial-settlement.handler';

// -----------------------------------------------------------------------------
// Financial Settlement Lifecycle
// -----------------------------------------------------------------------------
//
// Financial Settlement lifecycle:
//
//     PENDING
//        │
//        ├── PROCESSING
//        │      │
//        │      ├── COMPLETED
//        │      ├── FAILED
//        │      └── CANCELLED
//        │
//        ├── FAILED
//        └── CANCELLED
//
// COMPLETED, FAILED, and CANCELLED are terminal states.
//
// The aggregate remains responsible for validating every lifecycle
// transition.
//
// -----------------------------------------------------------------------------

export * from './process-financial-settlement.handler';

export * from './complete-financial-settlement.handler';

export * from './fail-financial-settlement.handler';

export * from './cancel-financial-settlement.handler';

// -----------------------------------------------------------------------------
// Financial Settlement Item
// -----------------------------------------------------------------------------
//
// Settlement Item allocation is an operation on the Financial Settlement
// aggregate.
//
// Allocation does not itself move money or execute a Financial Transaction.
// It records the domain allocation state required by the Settlement
// lifecycle.
//
// -----------------------------------------------------------------------------

export * from './allocate-financial-settlement-item.handler';

// -----------------------------------------------------------------------------
// Financial Disbursement Creation
// -----------------------------------------------------------------------------
//
// Financial Disbursement represents the external payout execution lifecycle.
//
// Creation establishes the Financial Disbursement aggregate in its initial
// PENDING state.
//
// The destination is independently persisted and associated with the
// Financial Disbursement aggregate.
//
// -----------------------------------------------------------------------------

export * from './create-financial-disbursement.handler';

// -----------------------------------------------------------------------------
// Financial Disbursement Lifecycle
// -----------------------------------------------------------------------------
//
// Financial Disbursement lifecycle:
//
//     PENDING
//        │
//        ├── PROCESSING
//        │      │
//        │      ├── COMPLETED
//        │      ├── FAILED
//        │      └── CANCELLED
//        │
//        ├── FAILED
//        └── CANCELLED
//
// COMPLETED, FAILED, and CANCELLED are terminal states.
//
// FinancialDisbursementAggregate remains responsible for:
//
// - lifecycle validation;
// - destination consistency;
// - execution-attempt consistency;
// - transaction-reference consistency;
// - domain event emission.
//
// Disbursement handlers do not:
//
// - execute external providers;
// - create or post Financial Transactions;
// - modify Financial Account balances;
// - perform accounting.
//
// -----------------------------------------------------------------------------

export * from './process-financial-disbursement.handler';

export * from './complete-financial-disbursement.handler';

export * from './fail-financial-disbursement.handler';

export * from './cancel-financial-disbursement.handler';
