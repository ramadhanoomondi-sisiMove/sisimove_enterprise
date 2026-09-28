// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Schedule API
// -----------------------------------------------------------------------------
//
// HTTP adapter for updating the schedule owned by a Journey Demand.
//
// Backend endpoint:
//
//   PUT /journey-demands/:journeyDemandPublicId/schedule
//
// Backend request:
//
//   UpdateJourneyDemandScheduleDto
//
// Backend response:
//
//   void
//
// Dates remain strings at the HTTP boundary because the backend DTO expects
// ISO date strings. Conversion to frontend Date objects belongs to response
// mapping, not request construction.
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication';

// -----------------------------------------------------------------------------
// Request
// -----------------------------------------------------------------------------

/**
 * Request payload for updating a Journey Demand schedule.
 *
 * This mirrors `UpdateJourneyDemandScheduleDto`.
 */
export interface UpdateJourneyDemandScheduleRequest {
  /**
   * Earliest permitted departure time.
   *
   * Expected to be an ISO-compatible date string accepted by the backend.
   */
  readonly earliestDeparture: string;

  /**
   * Latest permitted departure time.
   */
  readonly latestDeparture: string;

  /**
   * Optional target arrival time.
   */
  readonly targetArrival?: string;

  /**
   * Optional maximum acceptable arrival time.
   */
  readonly maximumArrival?: string;

  /**
   * Optional IANA timezone.
   */
  readonly timezone?: string;

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
 * Update the Journey Demand schedule.
 *
 * The backend owns schedule validation and lifecycle rules.
 */
export async function updateJourneyDemandSchedule(
  journeyDemandPublicId: string,
  request: UpdateJourneyDemandScheduleRequest,
): Promise<void> {
  await authenticatedApiClient.put<void>(
    `${JOURNEY_DEMANDS_PATH}/${encodeURIComponent(journeyDemandPublicId)}/schedule`,
    request,
  );
}