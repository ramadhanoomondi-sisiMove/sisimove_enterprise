// -----------------------------------------------------------------------------
// sisiMove — Publish Journey Demand API
// -----------------------------------------------------------------------------
//
// Authenticated API operation for publishing a Journey Demand.
//
// Backend:
//
//     POST /journey-demands/:journeyDemandPublicId/publish
//
// Publishing is a backend domain operation. The frontend sends the command
// metadata and delegates lifecycle validation to the backend.
//
// The frontend does not:
// 
// - determine whether the Journey Demand is publishable;
// - transition the Journey Demand status locally;
// - recreate JourneyDemandAggregate;
// - implement domain lifecycle rules.
//
// Successful execution returns no Journey Demand representation. Consumers
// should invalidate/refetch the relevant Journey Demand query after the
// command succeeds.
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
 * HTTP request body for publishing a Journey Demand.
 *
 * This mirrors the currently defined PublishJourneyDemandCommand without
 * exposing the backend Command class to the frontend.
 *
 * The Journey Demand public identifier is part of the URL and therefore is
 * deliberately excluded from the request body.
 */
export interface PublishJourneyDemandRequest {
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
// Publish Journey Demand
// =============================================================================

/**
 * Publish a Journey Demand.
 *
 * Backend:
 *
 *     POST /journey-demands/:journeyDemandPublicId/publish
 *
 * The backend owns all publishability and lifecycle validation.
 *
 * Successful execution returns void.
 */
export async function publishJourneyDemand(
  journeyDemandPublicId: string,
  request: PublishJourneyDemandRequest,
): Promise<void> {
  await authenticatedApiClient.post<void>(
    `${JOURNEY_DEMANDS_PATH}/${encodeURIComponent(
      journeyDemandPublicId,
    )}/publish`,
    request,
  );
}