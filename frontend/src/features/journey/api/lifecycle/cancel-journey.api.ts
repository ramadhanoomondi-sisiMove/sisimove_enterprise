// -----------------------------------------------------------------------------
// sisiMove — Cancel Journey API
// -----------------------------------------------------------------------------
//
// HTTP adapter for cancelling a Journey.
//
// Backend endpoint:
//
//   POST /api/v1/journeys/:journeyPublicId/cancel
//
// Request body:
//
//   {
//     reason: string,
//     cancelledAt?: string
//   }
//
// The cancellation reason is required by the frozen backend controller.
//
// Cancellation rules and lifecycle invariants remain owned by the backend
// Journey aggregate/application layer.
//
// Architectural boundary:
//
//   UI / Hook
//       │
//       ▼
//   cancelJourney()
//       │
//       ▼
//   AuthenticatedApiClient
//       │
//       ▼
//   POST /journeys/:journeyPublicId/cancel
//
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http';

import type { Journey } from '../../models';

/**
 * Request accepted by the cancel Journey endpoint.
 */
export interface CancelJourneyRequest {
  /**
   * Reason supplied for cancelling the Journey.
   */
  reason: string;

  /**
   * Optional Journey cancellation timestamp.
   *
   * Expected to be an ISO-8601 timestamp when provided.
   */
  cancelledAt?: string;
}

/**
 * Cancel a Journey.
 *
 * @param journeyPublicId Public identifier of the Journey.
 * @param request Cancellation reason and optional cancellation timestamp.
 * @returns The updated Journey representation.
 */
export async function cancelJourney(
  journeyPublicId: string,
  request: CancelJourneyRequest,
): Promise<Journey> {
  return authenticatedApiClient.post<Journey>(
    `/journeys/${encodeURIComponent(journeyPublicId)}/cancel`,
    request,
  );
}