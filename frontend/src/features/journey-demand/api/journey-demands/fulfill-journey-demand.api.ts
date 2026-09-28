// -----------------------------------------------------------------------------
// sisiMove — Fulfill Journey Demand API
// -----------------------------------------------------------------------------
//
// Authenticated API operation for fulfilling a Journey Demand.
//
// Backend:
//
//     POST /journey-demands/:journeyDemandPublicId/fulfill
//
// The backend owns fulfillment validation and the Journey Demand lifecycle
// transition. The frontend only submits the command metadata.
//
// The frontend does not:
//
// - determine whether the Demand is fulfillable;
// - transition the Demand lifecycle locally;
// - recreate JourneyDemandAggregate;
// - implement fulfillment domain rules.
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
 * HTTP request body for fulfilling a Journey Demand.
 *
 * This mirrors the currently defined FulfillJourneyDemandCommand without
 * exposing the backend Command class to the frontend.
 *
 * The Journey Demand public identifier is part of the URL and is therefore
 * deliberately excluded from the request body.
 */
export interface FulfillJourneyDemandRequest {
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
// Fulfill Journey Demand
// =============================================================================

/**
 * Fulfill a Journey Demand.
 *
 * Backend:
 *
 *     POST /journey-demands/:journeyDemandPublicId/fulfill
 *
 * The backend owns all fulfillment validation and lifecycle transition rules.
 *
 * Successful execution returns void.
 */
export async function fulfillJourneyDemand(
  journeyDemandPublicId: string,
  request: FulfillJourneyDemandRequest,
): Promise<void> {
  await authenticatedApiClient.post<void>(
    `${JOURNEY_DEMANDS_PATH}/${encodeURIComponent(
      journeyDemandPublicId,
    )}/fulfill`,
    request,
  );
}