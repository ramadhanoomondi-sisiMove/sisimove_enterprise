// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Pricing Model
// -----------------------------------------------------------------------------
//
// Frontend representation of JourneyDemandPricingResponse.
//
// Pricing interpretation and constraints are determined by the backend.
// The frontend consumes the supplied values and convenience flags.
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
   */
  readonly maximumPricePerSeat: number | undefined;

  /**
   * Preferred price per seat, when supplied.
   */
  readonly preferredPricePerSeat: number | undefined;

  /**
   * Currency supplied by the backend.
   */
  readonly currency: string;

  /**
   * Backend-provided pricing state.
   */
  readonly hasMaximumPrice: boolean;
  readonly hasPreferredPrice: boolean;
  readonly hasPriceConstraint: boolean;
  readonly hasMaximumPriceConstraint: boolean;
  readonly hasPreferredPriceConstraint: boolean;

  /**
   * Backend-provided pricing interpretation flags.
   */
  readonly isUnconstrained: boolean;
  readonly isPreferredPriceOnly: boolean;
  readonly isMaximumPriceOnly: boolean;
  readonly hasPreferredAndMaximumPrice: boolean;

  /**
   * Backend timestamps.
   */
  readonly createdAt: Date;
  readonly updatedAt: Date;
}