// -----------------------------------------------------------------------------
// sisiMove — Journey Completion
// Get Journey Completions By Status API
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - Retrieve Journey Completion records filtered by lifecycle status.
// - Support the backend's optional provider and journey filters.
// - Preserve the raw REST transport contract.
// - Use the authenticated API client for the protected endpoint.
//
// Non-responsibilities:
//
// - Domain validation.
// - Authorization decisions.
// - React Query caching.
// - UI state management.
// - Mapping backend strings into frontend domain enums.
//
// The adapter intentionally remains a thin HTTP boundary.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Authentication / HTTP
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http/authenticated-api-client';

// -----------------------------------------------------------------------------
// API response
// -----------------------------------------------------------------------------

/**
 * Raw REST representation returned by the Journey Completion collection
 * endpoint.
 *
 * The backend endpoint returns JourneyCompletionEntity records rather than
 * JourneyCompletionAggregate instances. Consequently, confirmations and
 * disputes are not included in this response.
 */
export interface GetJourneyCompletionsByStatusResponse {
  publicId: string;
  journeyPublicId: string;
  providerPublicId: string;

  status: string;

  completionRequestedAt: string | undefined;
  confirmedAt: string | undefined;
  disputedAt: string | undefined;
  cancelledAt: string | undefined;

  requiredConfirmations: number;
  confirmedCount: number;
  version: number;

  createdAt: string;
  updatedAt: string;
}

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

/**
 * Filters supported by:
 *
 * GET /journey-completions/by-status
 *
 * Status is required by the backend endpoint.
 * Provider and journey filters are optional.
 */
export interface GetJourneyCompletionsByStatusQuery {
  status: string;
  providerPublicId?: string;
  journeyPublicId?: string;
}

// -----------------------------------------------------------------------------
// API function
// -----------------------------------------------------------------------------

/**
 * Retrieves Journey Completion records filtered by lifecycle status.
 *
 * Backend endpoint:
 *
 * GET
 * /journey-completions/by-status
 *
 * Supported query parameters:
 *
 * - status
 * - providerPublicId
 * - journeyPublicId
 *
 * Authentication:
 * - Required.
 * - `authenticatedApiClient` supplies the current session access token.
 *
 * @param query
 *   Required status filter and optional provider/journey filters.
 *
 * @returns
 *   Journey Completion entity representations.
 */
export async function getJourneyCompletionsByStatus(
  query: GetJourneyCompletionsByStatusQuery,
): Promise<GetJourneyCompletionsByStatusResponse[]> {
  return authenticatedApiClient.get<
    GetJourneyCompletionsByStatusResponse[]
  >('/journey-completions/by-status', {
    query: {
      status: query.status,
      providerPublicId: query.providerPublicId,
      journeyPublicId: query.journeyPublicId,
    },
  });
}