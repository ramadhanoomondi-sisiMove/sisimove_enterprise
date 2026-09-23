// -----------------------------------------------------------------------------
// sisiMove — Financial Transaction Type
// -----------------------------------------------------------------------------
//
// Frontend representation of the backend FinancialTransactionType enum.
//
// Backend:
//     PAYMENT
//     TRANSFER
//     HOLD
//     RELEASE
//     CAPTURE
//     SETTLEMENT
//     DISBURSEMENT
//     REFUND
//     REVERSAL
//     ADJUSTMENT
//
// This file mirrors the backend contract exactly.
// -----------------------------------------------------------------------------

export enum FinancialTransactionType {
  PAYMENT = "PAYMENT",
  TRANSFER = "TRANSFER",
  HOLD = "HOLD",
  RELEASE = "RELEASE",
  CAPTURE = "CAPTURE",
  SETTLEMENT = "SETTLEMENT",
  DISBURSEMENT = "DISBURSEMENT",
  REFUND = "REFUND",
  REVERSAL = "REVERSAL",
  ADJUSTMENT = "ADJUSTMENT",
}

