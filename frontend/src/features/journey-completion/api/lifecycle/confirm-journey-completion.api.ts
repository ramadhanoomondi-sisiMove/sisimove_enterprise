// -----------------------------------------------------------------------------
// sisiMove — Journey Completion
// Confirm Journey Completion API
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - Confirm a Journey Completion for the currently authenticated member.
// - Preserve the command transport contract.
// - Use the authenticated API client for the protected endpoint.
//
// Non-responsibilities:
//
// - Supplying the member public ID.
// - Deciding whether the current member is allowed to confirm.
// - Managing confirmation counts locally.
// - Orchestrating settlement.
// - Optimistically changing lifecycle state.
// - React Query caching.
// - UI state management.
//
// The backend derives the confirming member from the authenticated request
// context and the Journey Completion aggregate remains the lifecycle
// authority.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Authentication / HTTP
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http/authenticated-api-client';

// -----------------------------------------------------------------------------
// API response
// -----------------------------------------------------------------------------

/**
 * Raw REST representation returned by the confirm-completion command.
 *
 * The command handler returns the JourneyCompletionAggregate, so the response
 * includes confirmations and disputes.
 *
 * Lifecycle enum values remain strings at the transport boundary.
 * DateTime values are represented as ISO strings after JSON serialization.
 */
export interface ConfirmJourneyCompletionResponse {
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

  confirmations: ConfirmJourneyCompletionConfirmationResponse[];
  disputes: ConfirmJourneyCompletionDisputeResponse[];

  createdAt: string;
  updatedAt: string;
}

/**
 * Raw confirmation representation contained in the aggregate response.
 */
export interface ConfirmJourneyCompletionConfirmationResponse {
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
export interface ConfirmJourneyCompletionDisputeResponse {
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
 * POST /journey-completions/:journeyCompletionPublicId/confirm
 *
 * The member identity is intentionally absent.
 *
 * The backend controller derives the confirming member from the authenticated
 * request context. This prevents the frontend from impersonating another
 * member by supplying an arbitrary memberPublicId.
 */
export interface ConfirmJourneyCompletionRequest {
  confirmedAt?: string;
}

// -----------------------------------------------------------------------------
// API function
// -----------------------------------------------------------------------------

/**
 * Confirms a Journey Completion for the currently authenticated member.
 *
 * Backend endpoint:
 *
 * POST
 * /journey-completions/:journeyCompletionPublicId/confirm
 *
 * Authentication:
 * - Required.
 * - `authenticatedApiClient` supplies the current session access token.
 *
 * @param journeyCompletionPublicId
 *   Public ID of the Journey Completion aggregate.
 *
 * @param request
 *   Optional confirmation timestamp.
 *
 * @returns
 *   The updated Journey Completion aggregate representation.
 */
export async function confirmJourneyCompletion(
  journeyCompletionPublicId: string,
  request: ConfirmJourneyCompletionRequest = {},
): Promise<ConfirmJourneyCompletionResponse> {
  return authenticatedApiClient.post<ConfirmJourneyCompletionResponse>(
    `/journey-completions/${encodeURIComponent(
      journeyCompletionPublicId,
    )}/confirm`,
    request,
  );
}