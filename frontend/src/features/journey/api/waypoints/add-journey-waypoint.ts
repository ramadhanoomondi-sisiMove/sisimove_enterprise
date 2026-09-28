// src/features/journey/api/waypoints/add-journey-waypoint.ts

// -----------------------------------------------------------------------------
// sisiMove — Add Journey Waypoint API
// -----------------------------------------------------------------------------
//
// Mirrors:
//
//   POST /journeys/:journeyPublicId/waypoints
//
// The backend application layer:
// - converts primitive command values into domain Value Objects;
// - creates the JourneyWaypointEntity;
// - asks the Journey aggregate to add/orchestrate the waypoint;
// - enforces aggregate invariants;
// - persists the aggregate.
//
// The frontend therefore submits only the waypoint configuration accepted by
// the HTTP endpoint.
//
// The backend generates the waypoint public identifier.
// The frontend does not generate or submit it.
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from "@/features/authentication/http/authenticated-api-client";
import type { RequestOptions } from "@/foundation/http";
import type { JourneyWaypointType } from "../../models/journey-waypoint-type";

/**
 * HTTP input required to add a waypoint to a Journey.
 *
 * `publicId` is intentionally absent because the backend creates the
 * JourneyWaypointEntity and generates its public identifier.
 */
export interface AddJourneyWaypointRequest {
  readonly type: JourneyWaypointType;
  readonly sequence: number;
  readonly name: string;
  readonly latitude: number;
  readonly longitude: number;
  readonly pickupAllowed: boolean;
  readonly dropoffAllowed: boolean;
}

/**
 * Adds a waypoint to an existing Journey.
 *
 * Backend:
 *   POST /journeys/:journeyPublicId/waypoints
 *
 * Request body:
 *   {
 *     type: JourneyWaypointType;
 *     sequence: number;
 *     name: string;
 *     latitude: number;
 *     longitude: number;
 *     pickupAllowed: boolean;
 *     dropoffAllowed: boolean;
 *   }
 *
 * Response:
 *   no response body
 *
 * The resulting Journey state should be obtained through the canonical
 * authenticated Journey query rather than fabricated locally.
 */
export async function addJourneyWaypoint(
  journeyPublicId: string,
  request: AddJourneyWaypointRequest,
  options: RequestOptions = {},
): Promise<void> {
  await authenticatedApiClient.post<void>(
    `/journeys/${encodeURIComponent(journeyPublicId)}/waypoints`,
    request,
    options,
  );
}