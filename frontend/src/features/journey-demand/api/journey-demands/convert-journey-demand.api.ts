// -----------------------------------------------------------------------------
// sisiMove — Convert Journey Demand API
// -----------------------------------------------------------------------------
//
// Authenticated API operation for converting a Journey Demand into a Journey.
//
// Backend:
//
//     POST /journey-demands/:journeyDemandPublicId/convert
//
// The backend owns the conversion operation and all associated domain rules.
// The frontend only submits the command data required by the HTTP boundary.
//
// The frontend does not:
//
// - determine whether the Demand is convertible;
// - determine whether the Journey is eligible for conversion;
// - transition the Demand lifecycle locally;
// - recreate JourneyDemandAggregate;
// - recreate conversion domain rules.
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
 * HTTP request body for converting a Journey Demand into a Journey.
 *
 * This mirrors the currently defined ConvertJourneyDemandCommand without
 * exposing the backend Command class to the frontend.
 *
 * The Journey Demand public identifier is part of the URL and is therefore
 * deliberately excluded from the request body.
 */
export interface ConvertJourneyDemandRequest {
  /**
   * Public identifier of the Journey created from the Demand.
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
// Convert Journey Demand
// =============================================================================

/**
 * Convert a Journey Demand into a Journey.
 *
 * Backend:
 *
 *     POST /journey-demands/:journeyDemandPublicId/convert
 *
 * The backend owns all conversion validation and lifecycle transition rules.
 *
 * Successful execution returns void.
 */
export async function convertJourneyDemand(
  journeyDemandPublicId: string,
  request: ConvertJourneyDemandRequest,
): Promise<void> {
  await authenticatedApiClient.post<void>(
    `${JOURNEY_DEMANDS_PATH}/${encodeURIComponent(
      journeyDemandPublicId,
    )}/convert`,
    request,
  );
}