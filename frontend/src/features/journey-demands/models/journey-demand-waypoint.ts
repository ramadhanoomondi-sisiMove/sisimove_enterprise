// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Waypoint
// -----------------------------------------------------------------------------
//
// Frontend representation of a waypoint requirement within a Journey Demand.
//
// Precise coordinates, private meeting points, addresses, and live locations
// are intentionally excluded.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Journey Demand Waypoint Type
// -----------------------------------------------------------------------------

export type JourneyDemandWaypointType =
  | 'ORIGIN'
  | 'DESTINATION'
  | 'PICKUP'
  | 'DROPOFF'
  | 'WAYPOINT';

// -----------------------------------------------------------------------------
// Journey Demand Waypoint
// -----------------------------------------------------------------------------

export interface JourneyDemandWaypoint {
  /**
   * Public identifier of the waypoint.
   */
  publicId: string;

  /**
   * Functional role of the waypoint in the requested route.
   */
  type: JourneyDemandWaypointType;

  /**
   * Ordered position of the waypoint within the requested route.
   */
  sequence: number;

  /**
   * Public location name.
   *
   * This should be a safe display name rather than a private meeting point
   * or precise address.
   */
  name: string;

  /**
   * Indicates whether the requester requires pickup at this waypoint.
   */
  pickupRequired: boolean;

  /**
   * Indicates whether the requester requires drop-off at this waypoint.
   */
  dropoffRequired: boolean;
}