// -----------------------------------------------------------------------------
// sisiMove — Journey Completion
// Cancel Journey Completion API
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - Cancel a Journey Completion aggregate through the backend.
// - Preserve the command transport contract.
// - Use the authenticated API client for the protected endpoint.
//
// Non-responsibilities:
//
// - Deciding whether cancellation is permitted.
// - Recalculating lifecycle state locally.
// - Orchestrating settlement.
// - Optimistically changing lifecycle state.
// - React Query caching.
// - UI state management.
//
// The backend Journey Completion aggregate remains the authority for the
// cancellation transition.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Authentication / HTTP
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http/authenticated-api-client';

// -----------------------------------------------------------------------------
// API response
// -----------------------------------------------------------------------------

/**
 * Raw REST representation returned by the cancel-completion command.
 *
 * The command handler returns the JourneyCompletionAggregate, so the response
 * includes confirmations and disputes.
 *
 * Lifecycle enum values remain strings at the transport boundary.
 * DateTime values are represented as ISO strings after JSON serialization.
 */
export interface CancelJourneyCompletionResponse {
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

  confirmations: CancelJourneyCompletionConfirmationResponse[];
  disputes: CancelJourneyCompletionDisputeResponse[];

  createdAt: string;
  updatedAt: string;
}

/**
 * Raw confirmation representation contained in the aggregate response.
 */
export interface CancelJourneyCompletionConfirmationResponse {
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
 * Raw dispute representation contained in the aggregate response.
 */
export interface CancelJourneyCompletionDisputeResponse {
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
// Request
// -----------------------------------------------------------------------------

/**
 * Command payload accepted by:
 *
 * POST /journey-completions/:journeyCompletionPublicId/cancel
 *
 * The backend command may accept an optional cancellation timestamp.
 */
export interface CancelJourneyCompletionRequest {
  cancelledAt?: string;
}

// -----------------------------------------------------------------------------
// API function
// -----------------------------------------------------------------------------

/**
 * Cancels a Journey Completion.
 *
 * Backend endpoint:
 *
 * POST
 * /journey-completions/:journeyCompletionPublicId/cancel
 *
 * Authentication:
 * - Required.
 * - `authenticatedApiClient` supplies the current session access token.
 *
 * @param journeyCompletionPublicId
 *   Public ID of the Journey Completion aggregate.
 *
 * @param request
 *   Optional cancellation timestamp.
 *
 * @returns
 *   The updated Journey Completion aggregate representation.
 */
export async function cancelJourneyCompletion(
  journeyCompletionPublicId: string,
  request: CancelJourneyCompletionRequest = {},
): Promise<CancelJourneyCompletionResponse> {
  return authenticatedApiClient.post<CancelJourneyCompletionResponse>(
    `/journey-completions/${encodeURIComponent(
      journeyCompletionPublicId,
    )}/cancel`,
    request,
  );
}