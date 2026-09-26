// -----------------------------------------------------------------------------
// sisiMove — Journey Completion
// Get Journey Completion Confirmation API
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - Retrieve one confirmation belonging to a Journey Completion.
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
 * Raw REST representation returned by the Journey Completion confirmation
 * endpoint.
 *
 * The backend response mapper exposes `role` and `status` as strings.
 * DateTime values are represented as ISO strings after JSON serialization.
 */
export interface GetJourneyCompletionConfirmationResponse {
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
// API function
// -----------------------------------------------------------------------------

/**
 * Retrieves one confirmation belonging to a Journey Completion.
 *
 * Backend endpoint:
 *
 * GET
 * /journey-completions/:journeyCompletionPublicId/confirmations/:confirmationPublicId
 *
 * Authentication:
 * - Required.
 * - `authenticatedApiClient` supplies the current session access token.
 *
 * @param journeyCompletionPublicId
 *   Public ID of the Journey Completion aggregate.
 *
 * @param confirmationPublicId
 *   Public ID of the Journey Completion confirmation.
 *
 * @returns
 *   The raw confirmation representation, or null when not found.
 */
export async function getJourneyCompletionConfirmation(
  journeyCompletionPublicId: string,
  confirmationPublicId: string,
): Promise<GetJourneyCompletionConfirmationResponse | null> {
  return authenticatedApiClient.get<
    GetJourneyCompletionConfirmationResponse | null
  >(
    `/journey-completions/${encodeURIComponent(
      journeyCompletionPublicId,
    )}/confirmations/${encodeURIComponent(confirmationPublicId)}`,
  );
}