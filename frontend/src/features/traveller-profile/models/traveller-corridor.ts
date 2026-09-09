// -----------------------------------------------------------------------------
// Traveller Corridor
// -----------------------------------------------------------------------------
//
// Frontend representation of a traveller's primary travel corridor.
//
// A corridor describes the general route a traveller commonly travels. It is
// intentionally higher-level than an exact journey and must not expose private
// pickup/drop-off coordinates or other sensitive location information.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Traveller Corridor
// -----------------------------------------------------------------------------

/**
 * Represents a traveller's primary public travel corridor.
 *
 * A corridor is useful for:
 * - Traveller profiles
 * - Public traveller discovery
 * - Journey recommendations
 * - Traveller matching
 * - Route/corridor presentation
 *
 * It is not a Journey entity and must not contain journey-specific schedule,
 * booking, vehicle, pricing, or live-location information.
 */
export interface TravellerCorridor {
  /**
   * Public identifier of the corridor.
   *
   * This must be a public/read-model identifier rather than an internal
   * database identifier.
   */
  publicId: string;

  /**
   * Human-readable origin of the corridor.
   */
  origin: string;

  /**
   * Human-readable destination of the corridor.
   */
  destination: string;

  /**
   * Optional waypoints associated with the traveller's usual corridor.
   *
   * These should contain only public, intentionally disclosed locations.
   */
  waypoints: TravellerCorridorWaypoint[];
}

// -----------------------------------------------------------------------------
// Traveller Corridor Waypoint
// -----------------------------------------------------------------------------

/**
 * Public waypoint belonging to a traveller's primary corridor.
 *
 * Exact private pickup points and geographic coordinates must not be included
 * in this frontend model unless they are explicitly part of a separate,
 * authenticated journey context.
 */
export interface TravellerCorridorWaypoint {
  /**
   * Public identifier of the waypoint.
   */
  publicId: string;

  /**
   * Human-readable waypoint name.
   */
  name: string;

  /**
   * Optional sequence position within the corridor.
   */
  order: number;
}