// -----------------------------------------------------------------------------
// sisiMove — Cancel Journey Demand API
// -----------------------------------------------------------------------------
//
// Authenticated API operation for cancelling a Journey Demand.
//
// Backend:
//
//     POST /journey-demands/:journeyDemandPublicId/cancel
//
// The backend owns cancellation validation and the Journey Demand lifecycle
// transition. The frontend only submits the command data required by the
// HTTP boundary.
//
// The frontend does not:
//
// - determine whether the Demand is cancellable;
// - transition the Demand lifecycle locally;
// - recreate JourneyDemandAggregate;
// - implement cancellation domain rules.
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
 * HTTP request body for cancelling a Journey Demand.
 *
 * This mirrors the currently defined CancelJourneyDemandCommand without
 * exposing the backend Command class to the frontend.
 *
 * The Journey Demand public identifier is part of the URL and is therefore
 * deliberately excluded from the request body.
 */
export interface CancelJourneyDemandRequest {
  /**
   * Correlation identifier for distributed tracing.
   */
  readonly correlationId: string;

  /**
   * Optional causation identifier for distributed tracing.
   */
  readonly causationId?: string;

  /**
   * Optional reason supplied for the cancellation.
   */
  readonly reason?: string;
}

// =============================================================================
// API Paths
// =============================================================================

/**
 * Canonical Journey Demand HTTP resource path.
 */
const JOURNEY_DEMANDS_PATH = '/journey-demands';

// =============================================================================
// Cancel Journey Demand
// =============================================================================

/**
 * Cancel a Journey Demand.
 *
 * Backend:
 *
 *     POST /journey-demands/:journeyDemandPublicId/cancel
 *
 * The backend owns all cancellation validation and lifecycle transition rules.
 *
 * Successful execution returns void.
 */
export async function cancelJourneyDemand(
  journeyDemandPublicId: string,
  request: CancelJourneyDemandRequest,
): Promise<void> {
  await authenticatedApiClient.post<void>(
    `${JOURNEY_DEMANDS_PATH}/${encodeURIComponent(
      journeyDemandPublicId,
    )}/cancel`,
    request,
  );
}