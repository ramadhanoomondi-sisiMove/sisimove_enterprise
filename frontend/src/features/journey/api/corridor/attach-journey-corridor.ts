// src/features/journey/api/corridor/attach-journey-corridor.ts

// -----------------------------------------------------------------------------
// sisiMove — Attach Journey Corridor API
// -----------------------------------------------------------------------------
//
// Mirrors:
//
//   POST /journeys/:journeyPublicId/corridor
//
// The backend application handler is responsible for:
// - converting primitive HTTP values into domain Value Objects;
// - creating the JourneyCorridorEntity;
// - asking the Journey aggregate to attach/orchestrate the corridor;
// - enforcing Journey aggregate invariants;
// - persisting the aggregate.
//
// The frontend therefore submits only the primitive corridor configuration
// accepted by the HTTP endpoint.
//
// The backend generates the corridor public identifier.
// The frontend does not generate or submit it.
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from "@/features/authentication/http/authenticated-api-client";
import type { RequestOptions } from "@/foundation/http";

/**
 * HTTP input required to attach a corridor to a Journey.
 *
 * The corridor public identifier is intentionally absent because the backend
 * creates the JourneyCorridorEntity and generates its public identifier.
 */
export interface AttachJourneyCorridorRequest {
  readonly originName: string;
  readonly originLatitude: number;
  readonly originLongitude: number;
  readonly destinationName: string;
  readonly destinationLatitude: number;
  readonly destinationLongitude: number;
}

/**
 * Attaches a corridor to an existing Journey.
 *
 * Backend:
 *   POST /journeys/:journeyPublicId/corridor
 *
 * Request body:
 *   {
 *     originName: string;
 *     originLatitude: number;
 *     originLongitude: number;
 *     destinationName: string;
 *     destinationLatitude: number;
 *     destinationLongitude: number;
 *   }
 *
 * Response:
 *   no response body
 *
 * The resulting Journey state should be obtained through the canonical
 * authenticated Journey query rather than fabricated locally.
 */
export async function attachJourneyCorridor(
  journeyPublicId: string,
  request: AttachJourneyCorridorRequest,
  options: RequestOptions = {},
): Promise<void> {
  await authenticatedApiClient.post<void>(
    `/journeys/${encodeURIComponent(journeyPublicId)}/corridor`,
    request,
    options,
  );
}