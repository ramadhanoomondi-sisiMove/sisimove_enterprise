
// =============================================================================
// sisiMove — Financial Withdrawal Status
// =============================================================================
//
// Member-facing representation of the FinancialAccountWithdrawal lifecycle.
//
// Backend lifecycle:
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
// COMPLETED, FAILED and CANCELLED are terminal states.
//
// This is a frontend contract type. It is intentionally not a Prisma type and
// must not expose persistence concerns.
//
// =============================================================================

/**
 * Lifecycle status of a Financial Account Withdrawal.
 */
export type FinancialWithdrawalStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED';

