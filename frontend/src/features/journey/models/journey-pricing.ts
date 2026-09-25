// -----------------------------------------------------------------------------
// sisiMove — Journey Pricing Model
// -----------------------------------------------------------------------------
//
// Frontend representation of Journey pricing exposed by the Journey HTTP API.
//
// Pricing defines the cost associated with a passenger booking on a Journey.
// Monetary amounts are represented as integer minor units, consistent with the
// sisiMove financial model.
//
// Internal database identifiers are intentionally excluded.
//
// -----------------------------------------------------------------------------

/**
 * Journey pricing.
 */
export interface JourneyPricing {
  /**
   * Public identifier of the pricing configuration.
   */
  publicId: string;

  /**
   * Journey price in the currency's minor unit.
   *
   * For KES, this represents cents.
   */
  amount: number;

  /**
   * ISO 4217 currency code.
   *
   * The backend defaults to `KES`.
   */
  currency: string;

  /**
   * Creation timestamp returned by the API, when available.
   */
  createdAt?: string;

  /**
   * Last update timestamp returned by the API, when available.
   */
  updatedAt?: string;
}