// =============================================================================
// sisiMove — Financial Payment Attempt Status
// =============================================================================
//
// Frontend representation of the FinancialPaymentAttempt lifecycle status.
//
// This type mirrors the backend FinancialPaymentAttemptStatus enum at the
// API boundary.
//
// Payment attempts are execution records belonging to a FinancialPayment.
// The frontend may display their state, but lifecycle transitions remain a
// backend responsibility.
//
// =============================================================================

// -----------------------------------------------------------------------------
// FinancialPaymentAttemptStatus
// -----------------------------------------------------------------------------

export type FinancialPaymentAttemptStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'SUCCEEDED'
  | 'FAILED'
  | 'CANCELLED'
  | 'EXPIRED';

