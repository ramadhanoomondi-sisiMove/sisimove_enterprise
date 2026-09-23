// =============================================================================
// sisiMove — Financial Payment Method Type
// =============================================================================
//
// Member-facing representation of the payment-method types supported by the
// FinancialPaymentMethod backend model.
//
// This is a frontend contract type, not a copy of the Prisma enum.
//
// Architectural rules:
// - Do not expose database identifiers.
// - Keep the type aligned with the backend API contract.
// - Do not add UI-specific values here.
// - Do not include lifecycle/status values; those belong to the payment
//   method model itself if the API exposes them.
//
// =============================================================================

/**
 * Supported payment-method categories.
 *
 * These values mirror the backend FinancialPaymentMethodType enum.
 */
export type PaymentMethodType =
  | 'MOBILE_MONEY'
  | 'BANK'
  | 'CARD'
  | 'WALLET'
  | 'OTHER';