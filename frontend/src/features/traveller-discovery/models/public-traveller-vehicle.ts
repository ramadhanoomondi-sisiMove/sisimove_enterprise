// -----------------------------------------------------------------------------
// Public Traveller Vehicle
// -----------------------------------------------------------------------------
//
// Public-facing vehicle information used when displaying a traveller's
// publicly discoverable journey.
//
// This model is a frontend read-model contract. It is intentionally
// independent of the backend Vehicle entity, Journey entity, Prisma models,
// ownership records, and operational vehicle data.
//
// It contains only information that helps an anonymous visitor evaluate
// whether a publicly discoverable journey is suitable.
//
// It must never expose vehicle ownership, registration, internal identifiers,
// private documents, tracking information, or operational status.
//
// -----------------------------------------------------------------------------
//
// Publicly safe:
//
// - Make
// - Model
// - Year
// - Color
// - Public vehicle image
//
// Never expose here:
//
// - Registration number / license plate
// - Owner identity
// - Internal vehicle ID
// - Identity IDs
// - Insurance details
// - Inspection records
// - Private documents
// - Tracking/location data
// - Internal vehicle status
// - Maintenance records
// - Operational metadata
//
// -----------------------------------------------------------------------------


// -----------------------------------------------------------------------------
// Public Traveller Vehicle
// -----------------------------------------------------------------------------

/**
 * Public vehicle representation associated with a publicly discoverable
 * traveller journey.
 *
 * This is a presentation/read-model contract rather than a vehicle domain
 * entity.
 *
 * The backend public API is responsible for deciding which vehicle
 * information is eligible for anonymous public display.
 *
 * The frontend must treat this object as already sanitized and must not
 * attempt to reconstruct or infer private vehicle information.
 */
export interface PublicTravellerVehicle {
  /**
   * Vehicle manufacturer.
   *
   * Example:
   *
   * Toyota
   */
  make: string;

  /**
   * Vehicle model.
   *
   * Example:
   *
   * Fielder
   */
  model: string;

  /**
   * Vehicle manufacturing/model year when publicly available.
   *
   * Null when the year is not available or is not eligible for public
   * display.
   */
  year: number | null;

  /**
   * Publicly displayable vehicle color.
   *
   * Example:
   *
   * Silver
   *
   * Null when the color is not available or is not eligible for public
   * display.
   */
  color: string | null;

  /**
   * Public vehicle image URL.
   *
   * The URL must be supplied by the public asset/read-model boundary.
   * Internal storage identifiers, bucket paths, signed private URLs, and
   * other internal storage details must not be exposed through this model.
   *
   * Null when no public vehicle image is available.
   */
  imageUrl: string | null;
}