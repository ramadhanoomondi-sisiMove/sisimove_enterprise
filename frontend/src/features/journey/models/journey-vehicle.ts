// -----------------------------------------------------------------------------
// sisiMove — Journey Vehicle Model
// -----------------------------------------------------------------------------
//
// Frontend representation of a Journey vehicle exposed by the Journey HTTP
// API.
//
// A vehicle is an independently identifiable Journey component. The Journey
// references it through its public identifier.
//
// Internal database identifiers are intentionally excluded.
//
// -----------------------------------------------------------------------------

/**
 * Journey vehicle.
 */
export interface JourneyVehicle {
  /**
   * Public identifier of the vehicle.
   */
  publicId: string;

  /**
   * Vehicle manufacturer.
   */
  make: string;

  /**
   * Vehicle model.
   */
  model: string;

  /**
   * Manufacturing model year, when available.
   */
  year?: number | null;

  /**
   * Vehicle exterior color, when provided.
   */
  color?: string | null;

  /**
   * Vehicle registration identifier, when provided.
   *
   * The backend may intentionally omit this from public representations
   * depending on the API surface and privacy rules.
   */
  registration?: string | null;

  /**
   * Public identifier of the vehicle's associated asset, when available.
   *
   * The underlying asset belongs to the Assets domain.
   */
  assetPublicId?: string | null;

  /**
   * Creation timestamp returned by the API, when available.
   */
  createdAt?: string;

  /**
   * Last update timestamp returned by the API, when available.
   */
  updatedAt?: string;
}