//
// -----------------------------------------------------------------------------
// sisiMove — Match Journey Demand API
// -----------------------------------------------------------------------------
//
// Authenticated API operation for matching a Journey Demand to a Journey.
//
// Backend:
//
//     POST /journey-demands/:journeyDemandPublicId/match
//
// The backend owns the matching operation and all associated domain rules.
// The frontend only submits the command data required by the HTTP boundary.
//
// The frontend does not:
//
// - determine whether the Demand is matchable;
// - determine whether the Journey is eligible for matching;
// - transition the Demand lifecycle locally;
// - recreate JourneyDemandAggregate;
// - recreate matching domain rules.
//
// Successful execution returns no Journey Demand representation. Consumers
// should invalidate/refetch the relevant Journey Demand query after success.
//
// Authentication:
//
//     authenticatedApiClient
//
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication';

// =============================================================================
// Types
// =============================================================================

/**
 * HTTP request body for matching a Journey Demand to a Journey.
 *
 * This mirrors the currently defined MatchJourneyDemandCommand without
 * exposing the backend Command class to the frontend.
 *
 * The Journey Demand public identifier is part of the URL and is therefore
 * deliberately excluded from the request body.
 */
export interface MatchJourneyDemandRequest {
  /**
   * Public identifier of the Journey matched to the Demand.
   */
  readonly journeyPublicId: string;

  /**
   * Correlation identifier for distributed tracing.
   */
  readonly correlationId: string;

  /**
   * Optional causation identifier for distributed tracing.
   */
  readonly causationId?: string;
}

// =============================================================================
// API Paths
// =============================================================================

/**
 * Canonical Journey Demand HTTP resource path.
 */
const JOURNEY_DEMANDS_PATH = '/journey-demands';

// =============================================================================
// Match Journey Demand
// =============================================================================

/**
 * Match a Journey Demand to a Journey.
 *
 * Backend:
 *
 *     POST /journey-demands/:journeyDemandPublicId/match
 *
 * The backend owns all matching validation and lifecycle transition rules.
 *
 * Successful execution returns void.
 */
export async function matchJourneyDemand(
  journeyDemandPublicId: string,
  request: MatchJourneyDemandRequest,
): Promise<void> {
  await authenticatedApiClient.post<void>(
    `${JOURNEY_DEMANDS_PATH}/${encodeURIComponent(
      journeyDemandPublicId,
    )}/match`,
    request,
  );
}