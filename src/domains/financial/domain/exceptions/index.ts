// -----------------------------------------------------------------------------
// Financial Domain Exceptions
// -----------------------------------------------------------------------------
//
// Public barrel export for all Financial domain exceptions.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Core Financial Exceptions
// -----------------------------------------------------------------------------

export * from './financial.exception';
export * from './financial-invariant.exception';
export * from './financial-not-found.exception';
export * from './financial-invalid-status-transition.exception';

// -----------------------------------------------------------------------------
// Financial Account Exceptions
// -----------------------------------------------------------------------------

export * from './financial-account.exception';
export * from './financial-account-already-exists.exception';
export * from './financial-account-not-active.exception';
export * from './financial-account-closed.exception';
export * from './financial-account-suspended.exception';
export * from './financial-account-insufficient-funds.exception';
export * from './financial-account-currency-mismatch.exception';
export * from './financial-account-not-found.exception';

// -----------------------------------------------------------------------------
// Financial Transaction Exceptions
// -----------------------------------------------------------------------------

export * from './financial-transaction.exception';
export * from './financial-transaction-invalid-amount.exception';
export * from './financial-transaction-invalid-entry.exception';
export * from './financial-transaction-invalid-status.exception';
export * from './financial-transaction-account-conflict.exception';

// -----------------------------------------------------------------------------
// Financial Payment Exceptions
// -----------------------------------------------------------------------------

export * from './financial-payment.exception';
export * from './financial-payment-invalid-status.exception';
export * from './financial-payment-attempt.exception';
export * from './financial-payment-method.exception';

// -----------------------------------------------------------------------------
// Financial Account Hold Exceptions
// -----------------------------------------------------------------------------

export * from './financial-account-hold.exception';
export * from './financial-account-hold-invalid-status.exception';
export * from './financial-account-hold-insufficient-funds.exception';
export * from './financial-account-hold-expired.exception';

// -----------------------------------------------------------------------------
// Financial Settlement Exceptions
// -----------------------------------------------------------------------------

export * from './financial-settlement.exception';
export * from './financial-settlement-invalid-status.exception';
export * from './financial-settlement-item.exception';
export * from './financial-settlement-allocation.exception';
export * from './financial-settlement-allocation-exceeds-item.exception';

// -----------------------------------------------------------------------------
// Financial Account Withdrawal Exceptions
// -----------------------------------------------------------------------------

export * from './financial-account-withdrawal.exception';
export * from './financial-account-withdrawal-invalid-status.exception';
export * from './financial-account-withdrawal-invalid-destination.exception';

// -----------------------------------------------------------------------------
// Financial Disbursement Exceptions
// -----------------------------------------------------------------------------

export * from './financial-disbursement.exception';
export * from './financial-disbursement-invalid-status.exception';
export * from './financial-disbursement-attempt.exception';
export * from './financial-disbursement-destination.exception';
