// -----------------------------------------------------------------------------
// sisiMove — Journey Completion
// Withdraw Journey Completion Dispute API
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - Withdraw one Journey Completion dispute.
// - Preserve the command transport contract.
// - Use the authenticated API client for the protected endpoint.
//
// Non-responsibilities:
//
// - Deciding whether the authenticated member may withdraw the dispute.
// - Resolving or rejecting the dispute.
// - Changing Journey Completion lifecycle state locally.
// - Orchestrating settlement.
// - React Query caching.
// - UI state management.
//
// The backend Journey Completion aggregate remains the authority for dispute
// withdrawal and any resulting lifecycle transition.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Authentication / HTTP
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http/authenticated-api-client';

// -----------------------------------------------------------------------------
// API response
// -----------------------------------------------------------------------------

/**
 * Raw REST representation returned by the withdraw-dispute command.
 *
 * The command handler returns the JourneyCompletionAggregate, so the response
 * includes confirmations and disputes.
 *
 * Lifecycle and dispute enum values remain strings at the transport boundary.
 * DateTime values are represented as ISO strings after JSON serialization.
 */
export interface WithdrawJourneyCompletionDisputeResponse {
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

  confirmations: WithdrawJourneyCompletionConfirmationResponse[];
  disputes: WithdrawJourneyCompletionDisputeResponseItem[];

  createdAt: string;
  updatedAt: string;
}

/**
 * Raw confirmation representation contained in the aggregate response.
 */
export interface WithdrawJourneyCompletionConfirmationResponse {
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
export interface WithdrawJourneyCompletionDisputeResponseItem {
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
 * /journey-completions/:journeyCompletionPublicId/disputes/:disputePublicId/withdraw
 *
 * `withdrawnByPublicId` is optional because the backend controller defaults
 * it to the currently authenticated identity when it is omitted.
 *
 * The frontend should normally omit it for a member self-service action and
 * allow the backend to derive the actor from the authenticated request.
 */
export interface WithdrawJourneyCompletionDisputeRequest {
  withdrawnByPublicId?: string;
  withdrawnAt?: string;
}

// -----------------------------------------------------------------------------
// API function
// -----------------------------------------------------------------------------

/**
 * Withdraws a Journey Completion dispute.
 *
 * Backend endpoint:
 *
 * POST
 * /journey-completions/:journeyCompletionPublicId/disputes/:disputePublicId/withdraw
 *
 * Authentication:
 * - Required.
 * - `authenticatedApiClient` supplies the current session access token.
 *
 * @param journeyCompletionPublicId
 *   Public ID of the Journey Completion aggregate.
 *
 * @param disputePublicId
 *   Public ID of the dispute being withdrawn.
 *
 * @param request
 *   Optional withdrawing actor and withdrawal timestamp.
 *
 * @returns
 *   The updated Journey Completion aggregate representation.
 */
export async function withdrawJourneyCompletionDispute(
  journeyCompletionPublicId: string,
  disputePublicId: string,
  request: WithdrawJourneyCompletionDisputeRequest = {},
): Promise<WithdrawJourneyCompletionDisputeResponse> {
  return authenticatedApiClient.post<WithdrawJourneyCompletionDisputeResponse>(
    `/journey-completions/${encodeURIComponent(
      journeyCompletionPublicId,
    )}/disputes/${encodeURIComponent(
      disputePublicId,
    )}/withdraw`,
    request,
  );
}