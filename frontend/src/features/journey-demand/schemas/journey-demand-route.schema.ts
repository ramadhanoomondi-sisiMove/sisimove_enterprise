// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Route Schema
// -----------------------------------------------------------------------------
//
// Validation schemas for the JourneyDemand corridor and waypoint workflow.
//
// The route step owns:
//
//     Origin
//     Destination
//     Waypoints
//
// Corridor coordinates are geographic decimal values.
//
// Waypoint input intentionally follows the current backend command contract.
// pickupRequired and dropoffRequired are NOT included in the mutation schema
// until the backend Add/Update Waypoint DTOs expose those fields.
//
// -----------------------------------------------------------------------------

import { z } from 'zod';

import { JOURNEY_DEMAND_WAYPOINT_TYPES } from '../models/journey-demand-waypoint-type';

// -----------------------------------------------------------------------------
// Coordinate
// -----------------------------------------------------------------------------

const latitudeSchema = z
  .number()
  .finite()
  .min(-90, 'Latitude must be between -90 and 90.')
  .max(90, 'Latitude must be between -90 and 90.');

const longitudeSchema = z
  .number()
  .finite()
  .min(-180, 'Longitude must be between -180 and 180.')
  .max(180, 'Longitude must be between -180 and 180.');

// -----------------------------------------------------------------------------
// Corridor
// -----------------------------------------------------------------------------

export const journeyDemandRouteSchema = z.object({
  originName: z
    .string()
    .trim()
    .min(1, 'Origin is required.'),

  destinationName: z
    .string()
    .trim()
    .min(1, 'Destination is required.'),

  originLatitude: latitudeSchema,

  originLongitude: longitudeSchema,

  destinationLatitude: latitudeSchema,

  destinationLongitude: longitudeSchema,

  /**
   * Stable discovery/matching identifier.
   *
   * Optional because the backend can operate without one.
   */
  corridorKey: z
    .string()
    .trim()
    .min(1)
    .optional()
    .nullable(),
});

export type JourneyDemandRouteInput = z.infer<
  typeof journeyDemandRouteSchema
>;

// -----------------------------------------------------------------------------
// Waypoint — create
// -----------------------------------------------------------------------------

export const journeyDemandWaypointSchema = z.object({
  type: z.enum(JOURNEY_DEMAND_WAYPOINT_TYPES),

  sequence: z
    .number()
    .int()
    .min(1, 'Waypoint sequence must be at least 1.'),

  name: z
    .string()
    .trim()
    .min(1, 'Waypoint name is required.'),

  latitude: latitudeSchema,

  longitude: longitudeSchema,
});

export type JourneyDemandWaypointInput = z.infer<
  typeof journeyDemandWaypointSchema
>;

// -----------------------------------------------------------------------------
// Waypoint — update
// -----------------------------------------------------------------------------
//
// The current backend update command accepts:
//
//     name
//     latitude
//     longitude
//     sequence
//
// It does not currently accept type, pickupRequired, or dropoffRequired.
//
// -----------------------------------------------------------------------------

export const updateJourneyDemandWaypointSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Waypoint name is required.'),

  latitude: latitudeSchema,

  longitude: longitudeSchema,

  sequence: z
    .number()
    .int()
    .min(1, 'Waypoint sequence must be at least 1.'),
});

export type UpdateJourneyDemandWaypointInput = z.infer<
  typeof updateJourneyDemandWaypointSchema
>;

// -----------------------------------------------------------------------------
// Waypoint list
// -----------------------------------------------------------------------------

export const journeyDemandWaypointListSchema = z
  .array(journeyDemandWaypointSchema)
  .superRefine((waypoints, context) => {
    const sequences = new Set<number>();

    for (const waypoint of waypoints) {
      if (sequences.has(waypoint.sequence)) {
        context.addIssue({
          code: 'custom',
          path: ['waypoints'],
          message: `Waypoint sequence ${waypoint.sequence} is duplicated.`,
        });
      }

      sequences.add(waypoint.sequence);
    }
  });

export type JourneyDemandWaypointListInput = z.infer<
  typeof journeyDemandWaypointListSchema
>;