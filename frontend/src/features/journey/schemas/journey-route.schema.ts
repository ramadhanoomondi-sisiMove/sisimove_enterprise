// -----------------------------------------------------------------------------
// sisiMove — Journey Route Selection Schema
// -----------------------------------------------------------------------------
//
// The provider does not define a route geographically.
//
// sisiMove controls the supported journey network through its corridor and
// waypoint catalogue. The provider selects from that catalogue.
//
// The frontend therefore submits only public identifiers for catalogue
// entities. Names, coordinates, corridor keys, waypoint types, ordering, and
// pickup/drop-off capabilities are owned by the backend catalogue.
// -----------------------------------------------------------------------------

import { z } from 'zod';

// -----------------------------------------------------------------------------
// Waypoint Selection
// -----------------------------------------------------------------------------

export const journeyWaypointSelectionSchema = z.object({
  waypointPublicId: z
    .string()
    .trim()
    .min(1, 'Waypoint is required'),
});

// -----------------------------------------------------------------------------
// Route Selection
// -----------------------------------------------------------------------------

export const journeyRouteSchema = z.object({
  corridorPublicId: z
    .string()
    .trim()
    .min(1, 'Corridor is required'),

  waypoints: z
    .array(journeyWaypointSelectionSchema)
    .default([]),
});

// -----------------------------------------------------------------------------
// Inferred Types
// -----------------------------------------------------------------------------

export type JourneyWaypointSelectionInput = z.infer<
  typeof journeyWaypointSelectionSchema
>;

export type JourneyRouteInput = z.infer<
  typeof journeyRouteSchema
>;