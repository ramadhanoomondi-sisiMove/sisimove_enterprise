// -----------------------------------------------------------------------------
// sisiMove — Journey Completion
// List Journey Completions API
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - Retrieve Journey Completion records from the backend.
// - Support the backend collection filters.
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
 * The collection endpoint returns JourneyCompletionEntity records rather
 * than the full JourneyCompletionAggregate. Therefore child collections
 * are intentionally not included here.
 *
 * The frontend must not assume that confirmations or disputes are present
 * in this response. Dedicated child endpoints provide those collections.
 */
export interface ListJourneyCompletionsResponse {
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
 * GET /journey-completions
 *
 * The public API keeps these filters explicitly typed while the HTTP client
 * receives them as a Record-compatible query object.
 */
export interface ListJourneyCompletionsQuery {
  journeyPublicId?: string;
  providerPublicId?: string;
  status?: string;
}

// -----------------------------------------------------------------------------
// API function
// -----------------------------------------------------------------------------

/**
 * Lists Journey Completion records.
 *
 * Backend endpoint:
 *
 * GET
 * /journey-completions
 *
 * Supported query parameters:
 *
 * - journeyPublicId
 * - providerPublicId
 * - status
 *
 * Authentication:
 * - Required.
 * - `authenticatedApiClient` supplies the current session access token.
 *
 * @param query
 *   Optional backend-supported collection filters.
 *
 * @returns
 *   Journey Completion entity representations.
 */
export async function listJourneyCompletions(
  query: ListJourneyCompletionsQuery = {},
): Promise<ListJourneyCompletionsResponse[]> {
  return authenticatedApiClient.get<ListJourneyCompletionsResponse[]>(
    '/journey-completions',
    {
      query: {
        journeyPublicId: query.journeyPublicId,
        providerPublicId: query.providerPublicId,
        status: query.status,
      },
    },
  );
}