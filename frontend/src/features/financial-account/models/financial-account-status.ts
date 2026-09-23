// =============================================================================
// sisiMove — Financial Account Status
// =============================================================================
//
// Frontend representation of the FinancialAccount lifecycle status.
//
// This model mirrors the backend FinancialAccountStatus enum at the API
// boundary. UI components may map these values to labels, descriptions, or
// visual states, but must not introduce additional lifecycle values here.
//
// =============================================================================

// -----------------------------------------------------------------------------
// FinancialAccountStatus
// -----------------------------------------------------------------------------

export type FinancialAccountStatus =
  | 'ACTIVE'
  | 'SUSPENDED'
  | 'CLOSED';