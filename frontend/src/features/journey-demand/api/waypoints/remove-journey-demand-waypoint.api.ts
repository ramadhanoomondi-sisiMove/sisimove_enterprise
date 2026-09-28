// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Waypoint API
// -----------------------------------------------------------------------------
//
// HTTP adapter for removing a Journey Demand waypoint.
//
// Backend endpoint:
//
//   DELETE /journey-demands/:journeyDemandPublicId/waypoints/:waypointPublicId
//
// Backend request:
//
//   RemoveJourneyDemandWaypointDto
//
// Backend response:
//
//   void
//
// IMPORTANT CONTRACT NOTE:
//
// The backend DTO requires correlationId and optional causationId.
//
// However, the current frontend HTTP abstraction deliberately defines:
//
//   DELETE → apiClient.delete(path, options)
//
// and does not support a request body.
//
// Therefore this adapter must not pretend that a DELETE body can be sent.
//
// The current backend HTTP contract and foundation HTTP client are therefore
// not fully aligned for this command.
//
// This adapter preserves the command metadata at the feature boundary while
// encoding it as query parameters until the HTTP contract is explicitly
// changed to support DELETE request bodies.
//
// Do not remove the metadata or silently discard it.
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication';

// -----------------------------------------------------------------------------
// Request
// -----------------------------------------------------------------------------

/**
 * Request payload for removing a Journey Demand waypoint.
 *
 * These fields are required by the backend command contract.
 */
export interface RemoveJourneyDemandWaypointRequest {
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
 * Remove a waypoint from a Journey Demand.
 *
 * The waypoint public identifier is represented in the URL.
 *
 * Because the current authenticated HTTP client does not support DELETE
 * request bodies, command metadata is encoded into the query string.
 *
 * This is intentionally explicit rather than silently dropping correlation
 * information.
 */
export async function removeJourneyDemandWaypoint(
  journeyDemandPublicId: string,
  waypointPublicId: string,
  request: RemoveJourneyDemandWaypointRequest,
): Promise<void> {
  const query = new URLSearchParams({
    correlationId: request.correlationId,
  });

  if (request.causationId !== undefined) {
    query.set('causationId', request.causationId);
  }

  await authenticatedApiClient.delete<void>(
    `${JOURNEY_DEMANDS_PATH}/${encodeURIComponent(journeyDemandPublicId)}/waypoints/${encodeURIComponent(waypointPublicId)}?${query.toString()}`,
  );
}