// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Route
// -----------------------------------------------------------------------------
//
// Frontend representation of the route requested by a Journey Demand.
//
// The route describes the traveller's intended corridor.
//
// Precise coordinates and private meeting-point information are intentionally
// excluded from this model.
//
// -----------------------------------------------------------------------------

import type { JourneyDemandWaypoint } from './journey-demand-waypoint';

// -----------------------------------------------------------------------------
// Journey Demand Route
// -----------------------------------------------------------------------------

export interface JourneyDemandRoute {
  /**
   * Public identifier of the route record.
   */
  publicId: string;

  /**
   * Public origin name.
   */
  originName: string;

  /**
   * Public destination name.
   */
  destinationName: string;

  /**
   * Publicly discoverable route waypoints.
   */
  waypoints: JourneyDemandWaypoint[];
}