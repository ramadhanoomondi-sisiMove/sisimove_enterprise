// =============================================================================
// sisiMove — Financial Payment Provider Type
// =============================================================================
//
// Member-facing representation of supported payment provider categories.
//
// Current member-facing support:
// - M-PESA (MOBILE_MONEY)
//
// Additional backend provider categories may be enabled in the member
// application when those payment methods are introduced.
//
// =============================================================================

/**
 * Supported member-facing financial payment provider categories.
 */
export type FinancialPaymentProviderType = 'MOBILE_MONEY';