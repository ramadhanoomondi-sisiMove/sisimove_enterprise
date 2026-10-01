// -----------------------------------------------------------------------------
// Path: src/foundation/location/types/location.types.ts
// -----------------------------------------------------------------------------
//
// sisiMove — Foundation Location Types
//
// Canonical location types shared by location selection components and
// SisiMove-owned location sources.
//
// The foundation location layer is deliberately provider-neutral.
// It does not know about Mapbox, Google, geocoding APIs, or Journey.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Supported Location
// -----------------------------------------------------------------------------

/**
 * A location that SisiMove explicitly supports.
 *
 * Coordinates are supplied by SisiMove's location data source rather than
 * entered by the user or resolved through an external geocoding provider.
 */
export interface SupportedLocation {
  /**
   * Stable SisiMove identifier for this location.
   *
   * Example:
   *   NAIROBI
   *   KISUMU
   */
  readonly key: string;

  /**
   * Human-readable location name.
   */
  readonly name: string;

  /**
   * Geographic latitude in decimal degrees.
   */
  readonly latitude: number;

  /**
   * Geographic longitude in decimal degrees.
   */
  readonly longitude: number;
}

// -----------------------------------------------------------------------------
// Resolved Location
// -----------------------------------------------------------------------------

/**
 * Location selected by the user and resolved from a SisiMove-owned
 * supported-location definition.
 *
 * This is the canonical location shape consumed by presentation components.
 */
export interface ResolvedLocation {
  /**
   * Stable SisiMove location identifier.
   */
  readonly key: string;

  /**
   * Human-readable location name.
   */
  readonly name: string;

  /**
   * Geographic latitude in decimal degrees.
   */
  readonly latitude: number;

  /**
   * Geographic longitude in decimal degrees.
   */
  readonly longitude: number;
}