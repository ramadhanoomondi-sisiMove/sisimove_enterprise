// =============================================================================
// sisiMove — Financial Account Type
// =============================================================================
//
// Frontend representation of the FinancialAccount type.
//
// This type mirrors the backend FinancialAccountType enum at the API
// boundary. It is descriptive data returned by the backend, not a value
// selected or changed by the member through the wallet UI.
//
// Normal member wallets use:
//     USER
//
// Platform and operational account types are retained here because they are
// valid backend values and may appear in administrative or future
// read-only financial boundaries.
//
// =============================================================================

// -----------------------------------------------------------------------------
// FinancialAccountType
// -----------------------------------------------------------------------------

export type FinancialAccountType =
  | 'USER'
  | 'PLATFORM'
  | 'MERCHANT'
  | 'HOLDING'
  | 'SETTLEMENT';