// -----------------------------------------------------------------------------
// SisiMove — Journey Waypoint
// -----------------------------------------------------------------------------
//
// Public/frontend representation of a Journey waypoint.
//
// This model is a frontend read model and is intentionally independent of:
// - Prisma models
// - backend domain entities
// - aggregates
// - persistence structures
//
// A public Journey waypoint represents a location within the publicly visible
// travel corridor.
//
// It must not contain:
// - precise coordinates
// - private pickup locations
// - private drop-off locations
// - booking-specific meeting points
// - traveller contact information
// - internal persistence identifiers
//
// Booking-specific pickup/drop-off arrangements belong to the Booking/Journey
// operational flow and must only be exposed after the appropriate business
// rules and authorization have been satisfied.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Journey Waypoint Type
// -----------------------------------------------------------------------------

export type JourneyWaypointType =
  | 'ORIGIN'
  | 'DESTINATION'
  | 'WAYPOINT';

// -----------------------------------------------------------------------------
// Journey Waypoint
// -----------------------------------------------------------------------------

export interface JourneyWaypoint {
  /**
   * Stable public identifier of the waypoint.
   *
   * This identifier is safe for frontend use.
   */
  publicId: string;

  /**
   * Public role of the waypoint within the Journey corridor.
   *
   * ORIGIN and DESTINATION define the Journey endpoints.
   * WAYPOINT represents an intermediate publicly visible location.
   */
  type: JourneyWaypointType;

  /**
   * Position of the waypoint within the Journey corridor.
   *
   * Lower values occur earlier in the route.
   */
  sequence: number;

  /**
   * Publicly visible name of the waypoint.
   *
   * This must be a safe geographic/corridor label rather than a private
   * meeting-point description.
   */
  name: string;
}