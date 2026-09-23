// =============================================================================
// sisiMove — Withdrawal Destination Type
// =============================================================================
//
// Member-facing representation of the destination category captured by a
// Financial Account Withdrawal.
//
// IMPORTANT:
// - This represents the destination snapshot stored on the withdrawal.
// - It is NOT a reference to FinancialDisbursementDestination.
// - A withdrawal captures destination details immutably so the withdrawal
//   remains auditable even if a member later changes their saved destinations.
//
// Backend enum:
//
//     FinancialDisbursementDestinationType
//       ├── MOBILE_MONEY
//       ├── BANK_ACCOUNT
//       └── OTHER
//
// This is a frontend contract type. It intentionally does not depend on
// Prisma, NestJS, or backend enum imports.
//
// =============================================================================

/**
 * Destination category for a financial withdrawal.
 */
export type WithdrawalDestinationType =
  | 'MOBILE_MONEY'
  | 'BANK_ACCOUNT'
  | 'OTHER';

