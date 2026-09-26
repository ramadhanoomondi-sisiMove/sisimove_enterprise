// -----------------------------------------------------------------------------
// sisiMove — Journey Completion
// Withdraw Journey Completion Confirmation API
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - Withdraw one Journey Completion confirmation.
// - Preserve the command transport contract.
// - Use the authenticated API client for the protected endpoint.
//
// Non-responsibilities:
//
// - Deciding whether the authenticated member may withdraw the confirmation.
// - Supplying or changing another member's identity.
// - Recalculating confirmation counts locally.
// - Orchestrating settlement.
// - Optimistically changing lifecycle state.
// - React Query caching.
// - UI state management.
//
// The backend Journey Completion aggregate remains the authority for the
// confirmation withdrawal and resulting lifecycle state.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Authentication / HTTP
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http/authenticated-api-client';

// -----------------------------------------------------------------------------
// API response
// -----------------------------------------------------------------------------

/**
 * Raw REST representation returned by the withdraw-confirmation command.
 *
 * The command handler returns the JourneyCompletionAggregate, so the response
 * includes confirmations and disputes.
 *
 * Lifecycle enum values remain strings at the transport boundary.
 * DateTime values are represented as ISO strings after JSON serialization.
 */
export interface WithdrawJourneyCompletionConfirmationResponse {
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

  confirmations: WithdrawJourneyCompletionConfirmationItemResponse[];
  disputes: WithdrawJourneyCompletionDisputeResponse[];

  createdAt: string;
  updatedAt: string;
}

/**
 * Raw confirmation representation contained in the aggregate response.
 */
export interface WithdrawJourneyCompletionConfirmationItemResponse {
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
export interface WithdrawJourneyCompletionDisputeResponse {
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
 * POST
 * /journey-completions/:journeyCompletionPublicId/confirmations/:confirmationPublicId/withdraw
 *
 * `memberPublicId` is optional because the backend command can derive the
 * current member from the authenticated request context.
 *
 * When supplied, it remains a backend-authorized value; the frontend must
 * never use it to assume authorization.
 */
export interface WithdrawJourneyCompletionConfirmationRequest {
  memberPublicId?: string;
  withdrawnAt?: string;
}

// -----------------------------------------------------------------------------
// API function
// -----------------------------------------------------------------------------

/**
 * Withdraws a Journey Completion confirmation.
 *
 * Backend endpoint:
 *
 * POST
 * /journey-completions/:journeyCompletionPublicId/confirmations/:confirmationPublicId/withdraw
 *
 * Authentication:
 * - Required.
 * - `authenticatedApiClient` supplies the current session access token.
 *
 * @param journeyCompletionPublicId
 *   Public ID of the Journey Completion aggregate.
 *
 * @param confirmationPublicId
 *   Public ID of the confirmation being withdrawn.
 *
 * @param request
 *   Optional member and withdrawal timestamp supplied to the backend command.
 *
 * @returns
 *   The updated Journey Completion aggregate representation.
 */
export async function withdrawJourneyCompletionConfirmation(
  journeyCompletionPublicId: string,
  confirmationPublicId: string,
  request: WithdrawJourneyCompletionConfirmationRequest = {},
): Promise<WithdrawJourneyCompletionConfirmationResponse> {
  return authenticatedApiClient.post<
    WithdrawJourneyCompletionConfirmationResponse
  >(
    `/journey-completions/${encodeURIComponent(
      journeyCompletionPublicId,
    )}/confirmations/${encodeURIComponent(
      confirmationPublicId,
    )}/withdraw`,
    request,
  );
}