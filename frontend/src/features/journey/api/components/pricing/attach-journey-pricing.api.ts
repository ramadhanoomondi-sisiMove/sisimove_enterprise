// -----------------------------------------------------------------------------
// sisiMove — Attach / Configure Journey Schedule API
// -----------------------------------------------------------------------------
//
// HTTP adapter for configuring the schedule of a Journey.
//
// Backend endpoint:
//
//   POST /api/v1/journeys/:journeyPublicId/schedule
//
// Request body:
//
//   {
//     departureAt: string;
//     arrivalAt?: string;
//     timezone: string;
//   }
//
// The Journey application handler owns the creation/configuration workflow:
//
//   1. Resolve the Journey aggregate.
//   2. Create the JourneySchedule entity from the request.
//   3. Attach the schedule to the Journey aggregate.
//   4. Persist the Journey aggregate.
//
// Architectural boundary:
//
//   Schedule Form
//       │
//       ▼
//   attachJourneySchedule()
//       │
//       ▼
//   AuthenticatedApiClient
//       │
//       ▼
//   POST /journeys/:journeyPublicId/schedule
//       │
//       ▼
//   AttachJourneyScheduleCommand
//       │
//       ▼
//   Journey Aggregate
//
// This adapter does NOT:
// - create domain entities;
// - generate schedule public identifiers;
// - validate Journey lifecycle rules;
// - determine schedule validity;
// - persist the Journey;
// - navigate;
// - manage React Query state.
//
// Date/time values remain transport strings here. The HTTP controller converts
// the ISO date strings into Date instances before constructing the command.
//
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http';

/**
 * Request accepted by the configure Journey schedule endpoint.
 *
 * These are transport-level fields required by the backend command.
 *
 * The backend owns schedule creation, validation, Journey association,
// * lifecycle rules, and aggregate persistence.
 */
export interface AttachJourneyScheduleRequest {
  /**
   * Journey departure date/time as an ISO-8601 string.
   */
  departureAt: string;

  /**
   * Optional Journey arrival date/time as an ISO-8601 string.
   */
  arrivalAt?: string;

  /**
   * IANA timezone in which the Journey schedule is expressed.
   *
   * Example:
   *
   *   Africa/Nairobi
   */
  timezone: string;
}

/**
 * Configure and attach a schedule to a Journey.
 *
 * The backend creates the JourneySchedule entity, attaches it to the
 * Journey aggregate, and persists the aggregate.
 *
 * @param journeyPublicId Public identifier of the Journey.
 * @param request Schedule configuration data.
 */
export async function attachJourneySchedule(
  journeyPublicId: string,
  request: AttachJourneyScheduleRequest,
): Promise<void> {
  await authenticatedApiClient.post<void>(
    `/journeys/${encodeURIComponent(journeyPublicId)}/schedule`,
    request,
  );
}