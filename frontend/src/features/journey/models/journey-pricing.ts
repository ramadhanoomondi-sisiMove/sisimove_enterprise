// -----------------------------------------------------------------------------
// sisiMove — Journey Pricing Model
// -----------------------------------------------------------------------------
//
// Frontend projection of JourneyPricing.
//
// The backend JourneyPricing entity owns:
// - amount
// - currency
//
// `amount` is represented exactly as supplied by the backend.
// The frontend must not reinterpret the value as a decimal monetary amount
// or introduce its own minor-unit conversion rules.
//
// Pricing is a Journey component. The frontend submits pricing configuration
// through the backend's attach-pricing command and reads the resulting pricing
// projection from Journey responses.
//
// This model intentionally contains only fields exposed by the Journey
// read projections. It does not expose persistence IDs or timestamps.
// -----------------------------------------------------------------------------

export interface JourneyPricing {
  /**
   * JourneyPricing public identifier.
   *
   * This is an opaque public reference supplied by the backend.
   */
  readonly publicId: string;

  /**
   * Journey price amount as supplied by the backend.
   */
  readonly amount: number;

  /**
   * ISO-style currency code supplied by the backend.
   *
   * The current backend default is KES.
   */
  readonly currency: string;
}