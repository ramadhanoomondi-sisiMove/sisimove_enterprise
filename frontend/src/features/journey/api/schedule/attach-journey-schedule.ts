// src/features/journey/api/schedule/attach-journey-schedule.ts

// -----------------------------------------------------------------------------
// sisiMove — Attach Journey Schedule API
// -----------------------------------------------------------------------------
//
// Mirrors:
//
//   POST /journeys/:journeyPublicId/schedule
//
// The backend application layer:
// - receives primitive HTTP schedule data;
// - converts values at the application/domain boundary;
// - creates the JourneyScheduleEntity;
// - asks the Journey aggregate to attach/orchestrate the schedule;
// - enforces aggregate invariants;
// - persists the aggregate.
//
// The frontend therefore submits only the schedule configuration accepted by
// the HTTP endpoint.
//
// The backend generates the schedule public identifier.
// The frontend does not generate or submit it.
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from "@/features/authentication/http/authenticated-api-client";
import type { RequestOptions } from "@/foundation/http";

/**
 * HTTP input required to attach a schedule to a Journey.
 *
 * Date/time values remain strings at the HTTP boundary. The backend controller
 * is responsible for converting them into Date values before constructing the
 * application command.
 */
export interface AttachJourneyScheduleRequest {
  readonly departureAt: string;
  readonly arrivalAt?: string;
  readonly timezone: string;
}

/**
 * Attaches a schedule to an existing Journey.
 *
 * Backend:
 *   POST /journeys/:journeyPublicId/schedule
 *
 * Request body:
 *   {
 *     departureAt: string;
 *     arrivalAt?: string;
 *     timezone: string;
 *   }
 *
 * Response:
 *   no response body
 *
 * The resulting Journey state should be obtained through the canonical
 * authenticated Journey query rather than fabricated locally.
 */
export async function attachJourneySchedule(
  journeyPublicId: string,
  request: AttachJourneyScheduleRequest,
  options: RequestOptions = {},
): Promise<void> {
  await authenticatedApiClient.post<void>(
    `/journeys/${encodeURIComponent(journeyPublicId)}/schedule`,
    request,
    options,
  );
}