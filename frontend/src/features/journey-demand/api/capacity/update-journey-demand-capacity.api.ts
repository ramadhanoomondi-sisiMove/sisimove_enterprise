// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Capacity API
// -----------------------------------------------------------------------------
//
// HTTP adapter for updating Journey Demand seat requirements.
//
// Backend endpoint:
//
//   PUT /journey-demands/:journeyDemandPublicId/capacity
//
// Backend request:
//
//   UpdateJourneyDemandCapacityDto
//
// Backend response:
//
//   void
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication';

// -----------------------------------------------------------------------------
// Request
// -----------------------------------------------------------------------------

/**
 * Request payload for updating Journey Demand capacity.
 *
 * The backend calls this field `seatsRequired`; that name is intentionally
 * preserved rather than introducing a frontend-specific alias.
 */
export interface UpdateJourneyDemandCapacityRequest {
  /**
   * Number of seats required by the Journey Demand.
   */
  readonly seatsRequired: number;

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
 * Update the number of seats required by a Journey Demand.
 *
 * The backend owns validation and any consequences for matching/participants.
 */
export async function updateJourneyDemandCapacity(
  journeyDemandPublicId: string,
  request: UpdateJourneyDemandCapacityRequest,
): Promise<void> {
  await authenticatedApiClient.put<void>(
    `${JOURNEY_DEMANDS_PATH}/${encodeURIComponent(journeyDemandPublicId)}/capacity`,
    request,
  );
}