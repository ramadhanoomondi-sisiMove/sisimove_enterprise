// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Waypoint API
// -----------------------------------------------------------------------------
//
// HTTP adapter for updating an existing Journey Demand waypoint.
//
// Backend endpoint:
//
//   PUT /journey-demands/:journeyDemandPublicId/waypoints/:waypointPublicId
//
// Backend request:
//
//   UpdateJourneyDemandWaypointDto
//
// Backend response:
//
//   void
//
// The waypoint public identifier is part of the URL. Only fields accepted by
// the backend DTO are sent in the request body.
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication';

// -----------------------------------------------------------------------------
// Request
// -----------------------------------------------------------------------------

/**
 * Request payload for updating a Journey Demand waypoint.
 *
 * Every waypoint property is optional because the backend supports partial
 * waypoint changes. At least the command correlation metadata remains
 * required.
 */
export interface UpdateJourneyDemandWaypointRequest {
  /**
   * Updated waypoint name.
   */
  readonly name?: string;

  /**
   * Updated waypoint latitude.
   */
  readonly latitude?: number;

  /**
   * Updated waypoint longitude.
   */
  readonly longitude?: number;

  /**
   * Updated waypoint sequence.
   */
  readonly sequence?: number;

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
 * Update a Journey Demand waypoint.
 *
 * The backend aggregate/application layer owns the actual mutation and any
 * corridor consistency rules resulting from the change.
 */
export async function updateJourneyDemandWaypoint(
  journeyDemandPublicId: string,
  waypointPublicId: string,
  request: UpdateJourneyDemandWaypointRequest,
): Promise<void> {
  await authenticatedApiClient.put<void>(
    `${JOURNEY_DEMANDS_PATH}/${encodeURIComponent(journeyDemandPublicId)}/waypoints/${encodeURIComponent(waypointPublicId)}`,
    request,
  );
}