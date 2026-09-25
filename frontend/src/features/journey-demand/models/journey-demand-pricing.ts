// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Pricing
// -----------------------------------------------------------------------------
//
// Presentation/API model for the requester's price constraints.
//
// Monetary values are represented as integer minor units.
//
// For KES:
//
//     150000 = KES 1,500.00
//
// The exact money-display conversion belongs to the presentation layer.
//
// -----------------------------------------------------------------------------

export interface JourneyDemandPricing {
  /**
   * Public identifier of the pricing component.
   */
  publicId: string;

  /**
   * Maximum amount the requester is willing to pay per seat.
   *
   * Integer minor units.
   */
  maximumPricePerSeat: number | null;

  /**
   * Preferred amount the requester would like to pay per seat.
   *
   * Integer minor units.
   */
  preferredPricePerSeat: number | null;

  /**
   * ISO currency code.
   *
   * Backend default: KES.
   */
  currency: string;

  createdAt: string;
  updatedAt: string;
}