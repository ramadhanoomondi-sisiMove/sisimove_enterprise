// -----------------------------------------------------------------------------
// sisiMove — Journey Completion
// Get Journey Completion Dispute API
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - Retrieve one dispute belonging to a Journey Completion.
// - Preserve the raw REST transport contract.
// - Use the authenticated API client for the protected endpoint.
// - Encode opaque public IDs before placing them in the URL.
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
export interface GetJourneyCompletionDisputeResponse {
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
// API function
// -----------------------------------------------------------------------------

/**
 * Retrieves one dispute belonging to a Journey Completion.
 *
 * Backend endpoint:
 *
 * GET
 * /journey-completions/:journeyCompletionPublicId/disputes/:disputePublicId
 *
 * Authentication:
 * - Required.
 * - `authenticatedApiClient` supplies the current session access token.
 *
 * @param journeyCompletionPublicId
 *   Public ID of the Journey Completion aggregate.
 *
 * @param disputePublicId
 *   Public ID of the Journey Completion dispute.
 *
 * @returns
 *   The raw dispute representation, or null when not found.
 */
export async function getJourneyCompletionDispute(
  journeyCompletionPublicId: string,
  disputePublicId: string,
): Promise<GetJourneyCompletionDisputeResponse | null> {
  return authenticatedApiClient.get<
    GetJourneyCompletionDisputeResponse | null
  >(
    `/journey-completions/${encodeURIComponent(
      journeyCompletionPublicId,
    )}/disputes/${encodeURIComponent(disputePublicId)}`,
  );
}