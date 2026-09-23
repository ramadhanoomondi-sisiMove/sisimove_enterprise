// =============================================================================
// sisiMove — Financial Payment Status
// =============================================================================
//
// Frontend representation of the FinancialPayment lifecycle status.
//
// This type mirrors the backend FinancialPaymentStatus enum at the API
// boundary.
//
// The frontend may use these values to render payment state, progress,
// success, failure, cancellation, or expiration.
//
// The frontend must not introduce additional lifecycle values or independently
// transition payment state. Payment lifecycle transitions belong to the
// backend financial application/workflow layer.
//
// =============================================================================

// -----------------------------------------------------------------------------
// FinancialPaymentStatus
// -----------------------------------------------------------------------------

export type FinancialPaymentStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'SUCCEEDED'
  | 'FAILED'
  | 'CANCELLED'
  | 'EXPIRED';

