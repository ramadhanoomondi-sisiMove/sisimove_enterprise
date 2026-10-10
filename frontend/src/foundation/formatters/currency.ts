//frontend/src/foundation/formatters/currency.ts
// -----------------------------------------------------------------------------
// sisiMove — Currency Formatters
// -----------------------------------------------------------------------------
//
// Shared financial presentation formatters.
//
// Current sisiMove financial amounts are represented as integer KES amounts
// throughout the financial backend.
//
// Example:
//
//     10000 → KES 10,000.00
//      2000 → KES 2,000.00
//
// These functions perform presentation formatting only.
// They do not calculate, convert, or mutate financial values.
//
// -----------------------------------------------------------------------------

// =============================================================================
// Format Currency
// =============================================================================

export function formatCurrency(
  amount: number,
  currency = 'KES',
): string {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// =============================================================================
// Format Currency Amount
// =============================================================================
//
// Kept as a compatibility alias for existing callers.
//
// Despite the historical name "formatCurrencyMinorUnits", the current
// financial backend represents amounts as integer KES amounts rather than
// minor units.
//
// Example:
//
//     10000 → KES 10,000.00
//      2000 → KES 2,000.00
//
// No division or currency conversion is performed.
//
// =============================================================================

export function formatCurrencyMinorUnits(
  amount: number,
  currency = 'KES',
): string {
  return formatCurrency(amount, currency);
}