// -----------------------------------------------------------------------------
// sisiMove — Public Journey Demand Pricing
// -----------------------------------------------------------------------------
//
// Public price requirements supplied by the traveller.
//
// A demand does not have a final Journey price. Instead, the traveller may
// specify a maximum acceptable price and/or a preferred price.
//
// No booking, commission, settlement, wallet, or accounting information
// belongs in this model.
// -----------------------------------------------------------------------------

export interface PublicJourneyDemandPricing {
  /**
   * Highest price per seat the requester is willing to accept.
   */
  maximumPricePerSeat: number | null;

  /**
   * Requester's preferred price per seat.
   */
  preferredPricePerSeat: number | null;

  /**
   * Currency used by the pricing values.
   */
  currency: string;
}