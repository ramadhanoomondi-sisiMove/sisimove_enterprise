// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Pricing
// -----------------------------------------------------------------------------
//
// Frontend representation of the requester's pricing preferences.
//
// These are traveller preferences, not Commercial-domain records.
//
// This model must never expose:
// - commissions
// - booking fees
// - settlements
// - platform revenue
// - payment transactions
// - wallet information
//
// -----------------------------------------------------------------------------

export interface JourneyDemandPricing {
  /**
   * Public identifier of the pricing preference record.
   */
  publicId: string;

  /**
   * Maximum amount the requester is willing to pay per seat.
   *
   * Null means no maximum was specified.
   */
  maximumPricePerSeat: number | null;

  /**
   * Preferred amount the requester would like to pay per seat.
   *
   * Null means no preferred amount was specified.
   */
  preferredPricePerSeat: number | null;

  /**
   * ISO 4217 currency code.
   *
   * Example: KES.
   */
  currency: string;
}