// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Pricing Model
// -----------------------------------------------------------------------------
//
// Frontend representation of JourneyDemandPricingResponse.
//
// Pricing rules and validation are owned by the backend.
// The frontend consumes the backend-provided maximum acceptable price.
//
// IMPORTANT:
//
// The current Journey Demand pricing contract supports only:
//
//     maximumPricePerSeat
//
// Preferred pricing is intentionally NOT represented here because the backend
// does not accept it as part of the current Journey Demand pricing contract.
//
// -----------------------------------------------------------------------------

/**
 * Journey Demand pricing response model.
 */
export interface JourneyDemandPricing {
  /**
   * Stable public identifier exposed by the backend.
   */
  readonly publicId: string;

  /**
   * Maximum acceptable price per seat.
   *
   * Undefined means that no maximum price was supplied.
   */
  readonly maximumPricePerSeat: number | undefined;

  /**
   * Currency supplied by the backend.
   */
  readonly currency: string;

  /**
   * Backend-provided pricing state.
   *
   * `hasMaximumPrice` is true when a maximum price has been supplied.
   */
  readonly hasMaximumPrice: boolean;

  /**
   * Whether the Journey Demand currently has a price constraint.
   *
   * With the current backend contract, this is equivalent to the presence
   * of a maximum price constraint.
   */
  readonly hasPriceConstraint: boolean;

  /**
   * Whether the Journey Demand has a maximum price constraint.
   */
  readonly hasMaximumPriceConstraint: boolean;

  /**
   * Whether the pricing is unconstrained.
   */
  readonly isUnconstrained: boolean;

  /**
   * Whether the pricing is maximum-price-only.
   *
   * With the current backend contract, this represents the supported
   * constrained pricing mode.
   */
  readonly isMaximumPriceOnly: boolean;

  /**
   * Backend timestamps.
   */
  readonly createdAt: Date;
  readonly updatedAt: Date;
}