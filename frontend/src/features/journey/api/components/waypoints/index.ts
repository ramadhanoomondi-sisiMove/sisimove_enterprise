// -----------------------------------------------------------------------------
// sisiMove — Journey Waypoints API Barrel
// -----------------------------------------------------------------------------
//
// Public barrel export for Journey waypoint API adapters.
//
// Waypoint capabilities exposed by the frozen Journey controller:
//
//   GET    /journeys/:journeyPublicId/waypoints
//   GET    /journeys/:journeyPublicId/waypoints/:waypointPublicId
//   POST   /journeys/:journeyPublicId/waypoints
//   DELETE /journeys/:journeyPublicId/waypoints/:waypointPublicId
//
// IMPORTANT:
//
// The Journey controller does NOT create waypoint details.
//
// The POST operation only attaches an existing waypoint using:
//
//   {
//     waypointPublicId: string
//   }
//
// Waypoint creation and management therefore remain outside this Journey
// API surface.
//
// All adapters use the authenticated API client because these are protected
// Journey management operations.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Get all Journey waypoints
// -----------------------------------------------------------------------------

export {
  getJourneyWaypoints,
} from './get-journey-waypoints.api';

// -----------------------------------------------------------------------------
// Get a single Journey waypoint
// -----------------------------------------------------------------------------

export {
  getJourneyWaypoint,
} from './get-journey-waypoint.api';

// -----------------------------------------------------------------------------
// Attach an existing waypoint
// -----------------------------------------------------------------------------

export {
  addJourneyWaypoint,
  type AddJourneyWaypointRequest,
} from './add-journey-waypoint.api';

// -----------------------------------------------------------------------------
// Remove a Journey waypoint
// -----------------------------------------------------------------------------

export {
  removeJourneyWaypoint,
} from './remove-journey-waypoint.api';