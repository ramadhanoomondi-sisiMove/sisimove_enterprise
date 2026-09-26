// -----------------------------------------------------------------------------
// sisiMove — Journey Completion
// Get Journey Completions By Provider API
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - Retrieve Journey Completion records for a provider.
// - Support the backend's optional status filter.
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
export interface GetJourneyCompletionsByProviderResponse {
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
 * GET /journey-completions/by-provider
 *
 * The provider public ID is required by the backend route's query contract.
 * Status is optional.
 */
export interface GetJourneyCompletionsByProviderQuery {
  providerPublicId: string;
  status?: string;
}

// -----------------------------------------------------------------------------
// API function
// -----------------------------------------------------------------------------

/**
 * Retrieves Journey Completion records belonging to a provider.
 *
 * Backend endpoint:
 *
 * GET
 * /journey-completions/by-provider
 *
 * Supported query parameters:
 *
 * - providerPublicId
 * - status
 *
 * Authentication:
 * - Required.
 * - `authenticatedApiClient` supplies the current session access token.
 *
 * @param query
 *   Provider filter and optional lifecycle status filter.
 *
 * @returns
 *   Journey Completion entity representations.
 */
export async function getJourneyCompletionsByProvider(
  query: GetJourneyCompletionsByProviderQuery,
): Promise<GetJourneyCompletionsByProviderResponse[]> {
  return authenticatedApiClient.get<
    GetJourneyCompletionsByProviderResponse[]
  >('/journey-completions/by-provider', {
    query: {
      providerPublicId: query.providerPublicId,
      status: query.status,
    },
  });
}