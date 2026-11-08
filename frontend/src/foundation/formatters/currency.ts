
// -----------------------------------------------------------------------------
// sisiMove — Currency Formatters
// -----------------------------------------------------------------------------
//
// Shared financial presentation formatters.
//
// Monetary conventions:
//
// 1. formatCurrency()
//    Accepts amounts expressed in major currency units.
//
// 2. formatCurrencyMinorUnits()
//    Accepts amounts expressed in integer minor currency units.
//
// Examples for KES:
//
//     formatCurrency(10000)             → KES 10,000.00
//     formatCurrencyMinorUnits(10000)   → KES 100.00
//
// Currency precision is determined from the ISO currency code.
//
// These functions perform presentation formatting only.
// They do not mutate financial values or perform exchange-rate conversion.
//
// -----------------------------------------------------------------------------

// =============================================================================
// Format Currency — Major Units
// =============================================================================

/**
 * Format an amount already expressed in major currency units.
 *
 * Example:
 *
 *     10000 → KES 10,000.00
 *
 * Do not pass integer minor-unit amounts to this function.
 */
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
// Format Currency — Minor Units
// =============================================================================

/**
 * Format an amount expressed in integer minor currency units.
 *
 * The currency's standard fraction-digit precision determines the conversion.
 *
 * Examples:
 *
 *     10000 → KES 100.00
 *     12600 → KES 126.00
 *    100000 → KES 1,000.00
 *
 * For currencies without fractional minor units, the amount is formatted
 * without dividing by 100.
 */

export function formatCurrencyMinorUnits(
  amount: number,
  currency = 'KES',
): string {
  const currencyFormatter = new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency,
  });

  const fractionDigits =
    currencyFormatter.resolvedOptions().maximumFractionDigits ?? 2;

  const divisor = 10 ** fractionDigits;
  const majorAmount = amount / divisor;

  return currencyFormatter.format(majorAmount);
}

