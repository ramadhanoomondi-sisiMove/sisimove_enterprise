// -----------------------------------------------------------------------------
// SisiMove — Journey Pricing
// -----------------------------------------------------------------------------
//
// Public/frontend representation of Journey seat pricing.
//
// This model is a frontend read model and is intentionally independent of:
// - Prisma models
// - backend domain entities
// - aggregates
// - persistence structures
//
// This represents only the public price presented to a traveller for one seat.
//
// Commercial rules and financial information do not belong in this model,
// including:
// - commissions
// - booking fees
// - discounts
// - settlements
// - platform revenue
// - wallet balances
// - payment information
// - provider earnings
//
// The backend is authoritative for the published Journey price.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Journey Pricing
// -----------------------------------------------------------------------------

export interface JourneyPricing {
  /**
   * Stable public identifier of the pricing representation.
   *
   * This is an opaque frontend-safe identifier and must not be treated as an
   * internal database identifier.
   */
  publicId: string;

  /**
   * Public price for one seat on the Journey.
   *
   * The amount is an integer represented in the smallest unit of the
   * specified currency.
   *
   * Examples:
   *
   * KES 1,500.00 → 150000
   * KES 750.00   → 75000
   *
   * The frontend must not assume that every currency uses two decimal places.
   * Currency precision is determined from the currency code when formatting
   * the amount for display.
   */
  amount: number;

  /**
   * ISO 4217 currency code.
   *
   * Example:
   * KES
   */
  currency: string;
}