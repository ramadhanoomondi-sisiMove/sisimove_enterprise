// -----------------------------------------------------------------------------
// sisiMove — Journey Completion
// Get Journey Completion Disputes API
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - Retrieve disputes belonging to a Journey Completion.
// - Support the backend's optional dispute filters.
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
 * Raw REST representation returned by the Journey Completion dispute
 * endpoint.
 *
 * The backend response mapper exposes dispute `reason` and `status` as
 * strings. DateTime values are represented as ISO strings after JSON
 * serialization.
 */
export interface GetJourneyCompletionDisputesResponse {
  publicId: string;
  completionId: string;
  raisedByPublicId: string;

  reason: string;
  description: string | undefined;
  status: string;

  resolvedByPublicId: string | undefined;
  resolutionSummary: string | undefined;

  openedAt: string;
  resolvedAt: string | undefined;
  rejectedAt: string | undefined;
  withdrawnAt: string | undefined;

  createdAt: string;
  updatedAt: string;
}

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

/**
 * Filters supported by:
 *
 * GET
 * /journey-completions/:journeyCompletionPublicId/disputes
 *
 * All filters are optional.
 */
export interface GetJourneyCompletionDisputesQuery {
  raisedByPublicId?: string;
  status?: string;
  reason?: string;
}

// -----------------------------------------------------------------------------
// API function
// -----------------------------------------------------------------------------

/**
 * Retrieves disputes belonging to a Journey Completion.
 *
 * Backend endpoint:
 *
 * GET
 * /journey-completions/:journeyCompletionPublicId/disputes
 *
 * Supported query parameters:
 *
 * - raisedByPublicId
 * - status
 * - reason
 *
 * Authentication:
 * - Required.
 * - `authenticatedApiClient` supplies the current session access token.
 *
 * @param journeyCompletionPublicId
 *   Public ID of the Journey Completion aggregate.
 *
 * @param query
 *   Optional dispute filters.
 *
 * @returns
 *   Raw Journey Completion dispute representations.
 */
export async function getJourneyCompletionDisputes(
  journeyCompletionPublicId: string,
  query: GetJourneyCompletionDisputesQuery = {},
): Promise<GetJourneyCompletionDisputesResponse[]> {
  return authenticatedApiClient.get<GetJourneyCompletionDisputesResponse[]>(
    `/journey-completions/${encodeURIComponent(
      journeyCompletionPublicId,
    )}/disputes`,
    {
      query: {
        raisedByPublicId: query.raisedByPublicId,
        status: query.status,
        reason: query.reason,
      },
    },
  );
}