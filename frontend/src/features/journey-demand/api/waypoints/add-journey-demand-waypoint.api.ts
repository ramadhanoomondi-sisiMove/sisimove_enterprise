// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Waypoint API
// -----------------------------------------------------------------------------
//
// HTTP adapter for adding a waypoint to a Journey Demand corridor.
//
// Backend endpoint:
//
//   POST /journey-demands/:journeyDemandPublicId/waypoints
//
// Backend request:
//
//   AddJourneyDemandWaypointDto
//
// Backend response:
//
//   void
//
// The Journey Demand backend owns waypoint ordering, corridor consistency,
// validation, and lifecycle rules. The frontend only submits the requested
// waypoint values.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Authentication
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication';

// -----------------------------------------------------------------------------
// Models
// -----------------------------------------------------------------------------

import type { JourneyDemandWaypointType } from '../../models/journey-demand-waypoint-type';

// -----------------------------------------------------------------------------
// Request
// -----------------------------------------------------------------------------

/**
 * Request payload for adding a Journey Demand waypoint.
 *
 * This mirrors the backend `AddJourneyDemandWaypointDto`.
 *
 * `journeyDemandPublicId` is intentionally excluded because it is represented
 * by the URL resource parameter.
 *
 * The backend currently derives pickup/dropoff semantics from `type`, so the
 * frontend must not send separate pickupRequired/dropoffRequired fields.
 */
export interface AddJourneyDemandWaypointRequest {
  /**
   * Type of waypoint.
   */
  readonly type: JourneyDemandWaypointType;

  /**
   * Position of the waypoint within the corridor.
   *
   * The backend requires a non-negative integer.
   */
  readonly sequence: number;

  /**
   * Human-readable waypoint name.
   */
  readonly name: string;

  /**
   * Latitude of the waypoint.
   */
  readonly latitude: number;

  /**
   * Longitude of the waypoint.
   */
  readonly longitude: number;

  /**
   * Correlation identifier for distributed tracing.
   */
  readonly correlationId: string;

  /**
   * Optional causation identifier for distributed tracing.
   */
  readonly causationId?: string;
}

// -----------------------------------------------------------------------------
// Endpoint
// -----------------------------------------------------------------------------

const JOURNEY_DEMANDS_PATH = '/journey-demands';

// -----------------------------------------------------------------------------
// Mutation
// -----------------------------------------------------------------------------

/**
 * Add a waypoint to a Journey Demand.
 *
 * The backend owns the resulting corridor state. No domain entity or
 * aggregate is returned to the frontend.
 */
export async function addJourneyDemandWaypoint(
  journeyDemandPublicId: string,
  request: AddJourneyDemandWaypointRequest,
): Promise<void> {
  await authenticatedApiClient.post<void>(
    `${JOURNEY_DEMANDS_PATH}/${encodeURIComponent(journeyDemandPublicId)}/waypoints`,
    request,
  );
}