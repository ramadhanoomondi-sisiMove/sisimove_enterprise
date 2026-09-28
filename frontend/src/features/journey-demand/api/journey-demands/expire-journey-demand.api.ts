// -----------------------------------------------------------------------------
// sisiMove — Journey Demand API
// -----------------------------------------------------------------------------
//
// Exposes the HTTP adapter for expiring a Journey Demand.
//
// Architectural boundary:
//
// - The frontend sends the command through the authenticated API client.
// - The Journey Demand aggregate remains the backend owner of lifecycle rules.
// - The frontend does not determine whether expiration is currently valid.
// - The frontend does not recreate or return the backend aggregate.
// - The API adapter only translates the frontend request into the HTTP
//   contract expected by the Journey Demand controller.
//
// Backend endpoint:
//
//   POST /journey-demands/:journeyDemandPublicId/expire
//
// Backend command:
//
//   ExpireJourneyDemandCommand
//
// Backend response:
//
//   void
//
// Cache invalidation/refetching belongs to the React/query hook layer, not
// this transport adapter.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication';

// -----------------------------------------------------------------------------
// Request
// -----------------------------------------------------------------------------

/**
 * Request payload required by the expire command endpoint.
 *
 * The Journey Demand public identifier is intentionally NOT part of this
 * request body because the HTTP API models it as the resource identifier
 * in the URL.
 *
 * Backend command contract:
 *
 *   journeyDemandPublicId
 *   correlationId
 *   causationId?
 *
 * The public identifier is therefore supplied separately to
 * `expireJourneyDemand(...)`, while this interface represents only the
 * command payload sent in the request body.
 */
export interface ExpireJourneyDemandRequest {
  /**
   * Correlation identifier used to correlate this command with the
   * originating operation across application boundaries.
   */
  readonly correlationId: string;

  /**
   * Optional causation identifier identifying the operation that caused
   * this expiration command.
   */
  readonly causationId?: string;
}

// -----------------------------------------------------------------------------
// Endpoint
// -----------------------------------------------------------------------------

/**
 * Root path for Journey Demand HTTP resources.
 *
 * Keeping the resource root local to this feature API module avoids coupling
 * callers to URL construction details.
 */
const JOURNEY_DEMANDS_PATH = '/journey-demands';

// -----------------------------------------------------------------------------
// Mutation
// -----------------------------------------------------------------------------

/**
 * Expire a Journey Demand.
 *
 * This is a thin HTTP adapter around the backend expire command.
 *
 * Important architectural boundary:
 *
 * The frontend does NOT:
 *
 * - inspect the current Journey Demand status;
 * - decide whether the demand may be expired;
 * - transition the demand locally;
 * - return an updated Journey Demand;
 * - reconstruct the backend aggregate.
 *
 * The backend Journey Demand aggregate owns the lifecycle transition and
 * validates whether expiration is permitted.
 *
 * Because the controller returns void, this function also returns void.
 * Consumers that need fresh Journey Demand state must invalidate/refetch
 * their relevant query through the appropriate hook after this command
 * succeeds.
 *
 * @param journeyDemandPublicId
 *   Public identifier of the Journey Demand to expire.
 *
 * @param request
 *   Correlation/causation metadata required by the backend command.
 */
export async function expireJourneyDemand(
  journeyDemandPublicId: string,
  request: ExpireJourneyDemandRequest,
): Promise<void> {
  await authenticatedApiClient.post<void>(
    `${JOURNEY_DEMANDS_PATH}/${encodeURIComponent(journeyDemandPublicId)}/expire`,
    request,
  );
}