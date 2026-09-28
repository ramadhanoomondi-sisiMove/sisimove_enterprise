// -----------------------------------------------------------------------------
// sisiMove — Public Journey Demand Pricing
// -----------------------------------------------------------------------------
//
// Public price requirements supplied by the traveller.
//
// A Journey Demand does not have a final Journey price. Instead, the traveller
// may specify a maximum acceptable price and/or a preferred price.
//
// These values describe what the requester is looking for. They do not
// represent a confirmed fare, booking amount, provider income, platform fee,
// commission, settlement, wallet balance, or accounting transaction.
//
// No booking, commission, settlement, wallet, or accounting information
// belongs in this model.
// -----------------------------------------------------------------------------

export interface PublicJourneyDemandPricing {
  /**
   * Highest price per seat the requester is willing to accept.
   *
   * Null means that no maximum price constraint was supplied.
   */
  readonly maximumPricePerSeat: number | null;

  /**
   * Requester's preferred price per seat.
   *
   * Null means that no preferred price was supplied.
   */
  readonly preferredPricePerSeat: number | null;

  /**
   * Currency used by the pricing values.
   *
   * Example:
   *
   *     KES
   */
  readonly currency: string;
}