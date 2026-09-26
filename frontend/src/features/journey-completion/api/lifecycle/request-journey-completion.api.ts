// -----------------------------------------------------------------------------
// sisiMove — Journey Completion
// Request Journey Completion API
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - Request completion of a Journey Completion aggregate.
// - Preserve the command transport contract.
// - Use the authenticated API client for the protected endpoint.
//
// Non-responsibilities:
//
// - Deciding whether the Journey is eligible for completion.
// - Managing confirmations.
// - Orchestrating settlement.
// - Optimistically changing lifecycle state.
// - React Query caching.
// - UI state management.
//
// The backend Journey Completion aggregate remains the authority for the
// completion-request transition.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Authentication / HTTP
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http/authenticated-api-client';

// -----------------------------------------------------------------------------
// API response
// -----------------------------------------------------------------------------

/**
 * Raw REST representation returned by the request-completion command.
 *
 * The command handler returns the JourneyCompletionAggregate, so the response
 * includes confirmations and disputes.
 *
 * Lifecycle enum values remain strings at the transport boundary.
 * DateTime values are represented as ISO strings after JSON serialization.
 */
export interface RequestJourneyCompletionResponse {
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

  confirmations: RequestJourneyCompletionConfirmationResponse[];
  disputes: RequestJourneyCompletionDisputeResponse[];

  createdAt: string;
  updatedAt: string;
}

/**
 * Raw confirmation representation contained in the aggregate response.
 */
export interface RequestJourneyCompletionConfirmationResponse {
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
export interface RequestJourneyCompletionDisputeResponse {
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
 * POST /journey-completions/:journeyCompletionPublicId/request
 *
 * `requestAt` is optional. When omitted, the backend determines the request
 * timestamp according to its domain command rules.
 */
export interface RequestJourneyCompletionRequest {
  requestAt?: string;
}

// -----------------------------------------------------------------------------
// API function
// -----------------------------------------------------------------------------

/**
 * Requests completion for a Journey Completion.
 *
 * Backend endpoint:
 *
 * POST
 * /journey-completions/:journeyCompletionPublicId/request
 *
 * Authentication:
 * - Required.
 * - `authenticatedApiClient` supplies the current session access token.
 *
 * @param journeyCompletionPublicId
 *   Public ID of the Journey Completion aggregate.
 *
 * @param request
 *   Optional completion-request timestamp.
 *
 * @returns
 *   The updated Journey Completion aggregate representation.
 */
export async function requestJourneyCompletion(
  journeyCompletionPublicId: string,
  request: RequestJourneyCompletionRequest = {},
): Promise<RequestJourneyCompletionResponse> {
  return authenticatedApiClient.post<RequestJourneyCompletionResponse>(
    `/journey-completions/${encodeURIComponent(
      journeyCompletionPublicId,
    )}/request`,
    request,
  );
}