// -----------------------------------------------------------------------------
// sisiMove — Journey Completion
// Get Journey Completion By Journey API
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - Retrieve the Journey Completion associated with one Journey.
// - Preserve the backend REST transport contract.
// - Use the authenticated API client for the protected endpoint.
// - Encode the opaque journey public ID before placing it in the URL.
//
// Non-responsibilities:
//
// - Domain validation.
// - Authorization decisions.
// - React Query caching.
// - UI state management.
// - Mapping raw REST strings into frontend domain enums.
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
 * Raw REST representation returned by the Journey Completion endpoint.
 *
 * The backend response mapper exposes lifecycle enum values as strings.
 * DateTime values are represented as ISO strings after JSON serialization.
 */
export interface GetJourneyCompletionByJourneyResponse {
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

  confirmations: GetJourneyCompletionByJourneyConfirmationResponse[];
  disputes: GetJourneyCompletionByJourneyDisputeResponse[];

  createdAt: string;
  updatedAt: string;
}

/**
 * Raw REST representation of a Journey Completion confirmation.
 */
export interface GetJourneyCompletionByJourneyConfirmationResponse {
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

/**
 * Raw REST representation of a Journey Completion dispute.
 */
export interface GetJourneyCompletionByJourneyDisputeResponse {
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
 * Retrieves the Journey Completion associated with a Journey.
 *
 * Backend endpoint:
 *
 * GET
 * /journey-completions/by-journey/:journeyPublicId
 *
 * The backend returns null when no Journey Completion exists for the
 * requested Journey.
 *
 * Authentication:
 * - Required.
 * - `authenticatedApiClient` supplies the current session access token.
 *
 * @param journeyPublicId
 *   Public ID of the Journey whose completion should be retrieved.
 *
 * @returns
 *   The raw Journey Completion response, or null when no completion exists.
 */
export async function getJourneyCompletionByJourney(
  journeyPublicId: string,
): Promise<GetJourneyCompletionByJourneyResponse | null> {
  return authenticatedApiClient.get<
    GetJourneyCompletionByJourneyResponse | null
  >(
    `/journey-completions/by-journey/${encodeURIComponent(
      journeyPublicId,
    )}`,
  );
}