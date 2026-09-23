// -----------------------------------------------------------------------------
// sisiMove — Financial Transaction Status
// -----------------------------------------------------------------------------
//
// Frontend representation of the backend FinancialTransactionStatus enum.
//
// Backend:
//     PENDING
//     COMPLETED
//     FAILED
//     REVERSED
//     CANCELLED
//
// This file mirrors the backend contract exactly.
// -----------------------------------------------------------------------------

export enum FinancialTransactionStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  REVERSED = "REVERSED",
  CANCELLED = "CANCELLED",
}

