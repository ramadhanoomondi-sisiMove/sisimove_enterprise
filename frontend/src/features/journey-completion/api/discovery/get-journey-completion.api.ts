// -----------------------------------------------------------------------------
// sisiMove — Journey Completion
// Get Journey Completion API
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - Retrieve one Journey Completion aggregate by public ID.
// - Preserve the backend REST transport contract.
// - Use the authenticated API client for the protected endpoint.
// - Encode the opaque public ID before placing it in the URL.
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
 * The frontend mapper can subsequently narrow these values into the
 * corresponding frontend models.
 *
 * DateTime values are represented as ISO strings after JSON serialization.
 */
export interface GetJourneyCompletionResponse {
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

  confirmations: GetJourneyCompletionConfirmationResponse[];
  disputes: GetJourneyCompletionDisputeResponse[];

  createdAt: string;
  updatedAt: string;
}

/**
 * Raw REST representation of a Journey Completion confirmation.
 *
 * This is intentionally transport-level data. The API boundary does not
 * claim that backend strings already satisfy the frontend enum contracts.
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

/**
 * Raw REST representation of a Journey Completion dispute.
 *
 * Dispute enum values remain strings at the transport boundary for the same
 * reason as confirmation role/status values.
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
 * Retrieves one Journey Completion aggregate.
 *
 * Backend endpoint:
 *
 * GET
 * /journey-completions/:journeyCompletionPublicId
 *
 * The backend endpoint may return null when the requested completion does
 * not exist.
 *
 * Authentication:
 * - Required.
 * - `authenticatedApiClient` supplies the current session access token.
 *
 * @param journeyCompletionPublicId
 *   Public ID of the Journey Completion aggregate.
 *
 * @returns
 *   The raw Journey Completion aggregate response, or null when not found.
 */
export async function getJourneyCompletion(
  journeyCompletionPublicId: string,
): Promise<GetJourneyCompletionResponse | null> {
  return authenticatedApiClient.get<GetJourneyCompletionResponse | null>(
    `/journey-completions/${encodeURIComponent(
      journeyCompletionPublicId,
    )}`,
  );
}