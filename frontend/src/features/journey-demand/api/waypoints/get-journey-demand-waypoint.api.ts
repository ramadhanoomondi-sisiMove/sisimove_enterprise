// -----------------------------------------------------------------------------
// sisiMove — Get Journey Demand Waypoint API
// -----------------------------------------------------------------------------
//
// Backend:
//     GET /journey-demands/:journeyDemandPublicId/waypoints/:waypointPublicId
//
// NOTE:
//     The current controller does NOT expose this GET endpoint.
//     Participant detail exists, but waypoint detail does not.
//
// This adapter is therefore intentionally not implemented against a fictitious
// endpoint.
//
// -----------------------------------------------------------------------------

export async function getJourneyDemandWaypoint(): Promise<never> {
  throw new Error(
    'The backend does not currently expose GET /journey-demands/:journeyDemandPublicId/waypoints/:waypointPublicId.',
  );
}