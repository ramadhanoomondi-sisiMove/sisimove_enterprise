// -----------------------------------------------------------------------------
// sisiMove — Journey Completion
// Get Journey Completion Confirmations API
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - Retrieve confirmations belonging to a Journey Completion.
// - Support the backend's optional confirmation filters.
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
 * Raw REST representation returned by the Journey Completion confirmation
 * endpoint.
 *
 * The backend response mapper exposes `role` and `status` as strings.
 * DateTime values are represented as ISO strings after JSON serialization.
 */
export interface GetJourneyCompletionConfirmationsResponse {
  publicId: string;
  completionId: string;
  memberPublicId: string;
  bookingPublicId: string | undefined;

  role: string;
  status: string;

  confirmedAt: string;
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
 * /journey-completions/:journeyCompletionPublicId/confirmations
 *
 * The query properties intentionally use strings at the transport boundary.
 * Frontend enum models can be used by callers and narrowed by a mapper later.
 */
export interface GetJourneyCompletionConfirmationsQuery {
  memberPublicId?: string;
  bookingPublicId?: string;
  role?: string;
  status?: string;
}

// -----------------------------------------------------------------------------
// API function
// -----------------------------------------------------------------------------

/**
 * Retrieves confirmations belonging to a Journey Completion.
 *
 * Backend endpoint:
 *
 * GET
 * /journey-completions/:journeyCompletionPublicId/confirmations
 *
 * Supported query parameters:
 *
 * - memberPublicId
 * - bookingPublicId
 * - role
 * - status
 *
 * Authentication:
 * - Required.
 * - `authenticatedApiClient` supplies the current session access token.
 *
 * @param journeyCompletionPublicId
 *   Public ID of the Journey Completion aggregate.
 *
 * @param query
 *   Optional confirmation filters.
 *
 * @returns
 *   Raw Journey Completion confirmation representations.
 */
export async function getJourneyCompletionConfirmations(
  journeyCompletionPublicId: string,
  query: GetJourneyCompletionConfirmationsQuery = {},
): Promise<GetJourneyCompletionConfirmationsResponse[]> {
  return authenticatedApiClient.get<
    GetJourneyCompletionConfirmationsResponse[]
  >(
    `/journey-completions/${encodeURIComponent(
      journeyCompletionPublicId,
    )}/confirmations`,
    {
      query: {
        memberPublicId: query.memberPublicId,
        bookingPublicId: query.bookingPublicId,
        role: query.role,
        status: query.status,
      },
    },
  );
}