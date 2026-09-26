// -----------------------------------------------------------------------------
// sisiMove — Journey Completion
// Open Journey Completion Dispute API
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - Open a dispute against a Journey Completion.
// - Preserve the command transport contract.
// - Use the authenticated API client for the protected endpoint.
//
// Non-responsibilities:
//
// - Deciding whether the authenticated member may open the dispute.
// - Validating dispute eligibility.
// - Resolving or reviewing the dispute.
// - Changing Journey Completion lifecycle state locally.
// - Orchestrating settlement.
// - React Query caching.
// - UI state management.
//
// The backend Journey Completion aggregate remains the authority for dispute
// creation and any resulting lifecycle transition.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Authentication / HTTP
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http/authenticated-api-client';

// -----------------------------------------------------------------------------
// API response
// -----------------------------------------------------------------------------

/**
 * Raw REST representation returned by the open-dispute command.
 *
 * The command handler returns the JourneyCompletionAggregate, so the response
 * includes confirmations and disputes.
 *
 * Lifecycle and dispute enum values remain strings at the transport boundary.
 * DateTime values are represented as ISO strings after JSON serialization.
 */
export interface OpenJourneyCompletionDisputeResponse {
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

  confirmations: OpenJourneyCompletionConfirmationResponse[];
  disputes: OpenJourneyCompletionDisputeResponseItem[];

  createdAt: string;
  updatedAt: string;
}

/**
 * Raw confirmation representation contained in the aggregate response.
 */
export interface OpenJourneyCompletionConfirmationResponse {
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
export interface OpenJourneyCompletionDisputeResponseItem {
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
 * POST /journey-completions/:journeyCompletionPublicId/disputes
 *
 * `raisedByPublicId` is optional because the backend controller defaults it
 * to the currently authenticated identity when it is omitted.
 *
 * The frontend should normally omit it for a member self-service action and
 * allow the backend to derive the actor from the authenticated request.
 */
export interface OpenJourneyCompletionDisputeRequest {
  raisedByPublicId?: string;
  reason: string;
  description?: string;
}

// -----------------------------------------------------------------------------
// API function
// -----------------------------------------------------------------------------

/**
 * Opens a dispute against a Journey Completion.
 *
 * Backend endpoint:
 *
 * POST
 * /journey-completions/:journeyCompletionPublicId/disputes
 *
 * Authentication:
 * - Required.
 * - `authenticatedApiClient` supplies the current session access token.
 *
 * @param journeyCompletionPublicId
 *   Public ID of the Journey Completion aggregate.
 *
 * @param request
 *   Dispute reason, optional description, and optional actor override.
 *
 * @returns
 *   The updated Journey Completion aggregate representation.
 */
export async function openJourneyCompletionDispute(
  journeyCompletionPublicId: string,
  request: OpenJourneyCompletionDisputeRequest,
): Promise<OpenJourneyCompletionDisputeResponse> {
  return authenticatedApiClient.post<OpenJourneyCompletionDisputeResponse>(
    `/journey-completions/${encodeURIComponent(
      journeyCompletionPublicId,
    )}/disputes`,
    request,
  );
}