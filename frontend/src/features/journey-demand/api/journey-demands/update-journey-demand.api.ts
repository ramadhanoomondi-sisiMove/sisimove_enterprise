// -----------------------------------------------------------------------------
// sisiMove — Update Journey Demand API
// -----------------------------------------------------------------------------
//
// Authenticated API operation for updating the Journey Demand root.
//
// Backend:
//
//     PUT /journey-demands/:journeyDemandPublicId
//
// The current UpdateJourneyDemandCommand contains only:
//
// - journeyDemandPublicId;
// - correlationId;
// - optional causationId.
//
// There are currently no Journey Demand root fields represented by this
// command. Journey Demand-owned components such as corridor, schedule,
// capacity, pricing, waypoints, and participants have their own dedicated
// command boundaries.
//
// The frontend therefore must not invent an update payload or recreate the
// backend aggregate/domain model.
//
// Authentication:
//
//     authenticatedApiClient
//
// The authenticated API client obtains the current access token and injects
// it into the request. This API adapter does not access auth session storage
// directly.
//
// Successful command execution does not return a frontend Journey Demand
// model. The backend command boundary returns void, so consumers should
// invalidate/refetch the relevant Journey Demand query after success.
//
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication';

// =============================================================================
// Types
// =============================================================================

/**
 * HTTP request body for updating a Journey Demand root.
 *
 * This mirrors the currently defined UpdateJourneyDemandCommand event
 * metadata contract without exposing the backend Command class itself.
 *
 * The Journey Demand public identifier is intentionally excluded from the
 * body because it is the resource identifier in the URL.
 */
export interface UpdateJourneyDemandRequest {
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
// Update Journey Demand
// =============================================================================

/**
 * Update a Journey Demand root.
 *
 * Backend:
 *
 *     PUT /journey-demands/:journeyDemandPublicId
 *
 * The Journey Demand public identifier is encoded as a path segment.
 *
 * The command currently carries no mutable root fields. Component changes
 * must use their dedicated API boundaries rather than being added to this
 * request opportunistically.
 *
 * Successful execution returns no Journey Demand representation.
 */
export async function updateJourneyDemand(
  journeyDemandPublicId: string,
  request: UpdateJourneyDemandRequest,
): Promise<void> {
  await authenticatedApiClient.put<void>(
    `${JOURNEY_DEMANDS_PATH}/${encodeURIComponent(journeyDemandPublicId)}`,
    request,
  );
}