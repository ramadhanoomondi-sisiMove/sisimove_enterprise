// -----------------------------------------------------------------------------
// SisiMove — Journey Vehicle
// -----------------------------------------------------------------------------
//
// Public/frontend representation of the vehicle associated with a Journey.
//
// This model is a frontend read model and is intentionally independent of:
// - Prisma models
// - backend domain entities
// - aggregates
// - persistence structures
//
// Only vehicle attributes appropriate for public Journey discovery and
// presentation belong here.
//
// It must not contain:
// - registration number / number plate
// - VIN / chassis number
// - owner information
// - insurance information
// - inspection information
// - private vehicle documents
// - internal asset identifiers
// - other sensitive vehicle identity information
//
// Sensitive vehicle identity and compliance information remains behind the
// appropriate authorization boundary.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Journey Vehicle
// -----------------------------------------------------------------------------

export interface JourneyVehicle {
  /**
   * Stable public identifier of the vehicle representation.
   *
   * This is an opaque frontend-safe identifier and must not be treated as
   * an internal database identifier.
   */
  publicId: string;

  /**
   * Vehicle manufacturer.
   *
   * Example:
   * Toyota
   */
  make: string;

  /**
   * Vehicle model.
   *
   * Example:
   * Fielder
   */
  model: string;

  /**
   * Vehicle manufacturing/model year.
   *
   * Null when the year is not available for public presentation.
   */
  year: number | null;

  /**
   * Publicly displayable vehicle color.
   *
   * Null when the color is unavailable.
   */
  color: string | null;

  /**
   * Public vehicle image URL.
   *
   * The referenced asset must already have passed the backend's public
   * visibility and authorization rules.
   *
   * Null when no public vehicle image is available.
   */
  imageUrl: string | null;
}