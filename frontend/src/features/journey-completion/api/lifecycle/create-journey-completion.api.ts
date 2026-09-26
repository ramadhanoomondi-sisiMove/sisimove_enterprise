// -----------------------------------------------------------------------------
// sisiMove — Journey Completion
// Create Journey Completion API
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - Create a Journey Completion aggregate through the backend.
// - Preserve the command transport contract.
// - Use the authenticated API client for the protected endpoint.
//
// Non-responsibilities:
//
// - Deciding whether a Journey is eligible for completion.
// - Generating domain state.
// - Orchestrating confirmations.
// - Orchestrating settlement.
// - React Query caching.
// - UI state management.
//
// The backend Journey Completion aggregate remains the authority for creation
// and lifecycle rules.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Authentication / HTTP
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http/authenticated-api-client';

// -----------------------------------------------------------------------------
// API response
// -----------------------------------------------------------------------------

/**
 * Raw REST representation returned after Journey Completion creation.
 *
 * The create command returns the JourneyCompletionAggregate, therefore the
 * response includes the aggregate's child confirmations and disputes.
 *
 * Lifecycle enum values remain strings at the transport boundary.
 * DateTime values are represented as ISO strings after JSON serialization.
 */
export interface CreateJourneyCompletionResponse {
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

  confirmations: CreateJourneyCompletionConfirmationResponse[];
  disputes: CreateJourneyCompletionDisputeResponse[];

  createdAt: string;
  updatedAt: string;
}

/**
 * Raw confirmation representation contained in the aggregate response.
 */
export interface CreateJourneyCompletionConfirmationResponse {
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
export interface CreateJourneyCompletionDisputeResponse {
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
 * POST /journey-completions
 *
 * `journeyPublicId` and `providerPublicId` are opaque public references.
 *
 * `requiredConfirmations` is optional because the backend command supports
 * its own default when the value is omitted.
 *
 * Correlation and causation IDs are optional tracing metadata supplied by
 * the caller when available.
 */
export interface CreateJourneyCompletionRequest {
  journeyPublicId: string;
  providerPublicId: string;
  requiredConfirmations?: number;
  correlationId?: string;
  causationId?: string;
}

// -----------------------------------------------------------------------------
// API function
// -----------------------------------------------------------------------------

/**
 * Creates a Journey Completion.
 *
 * Backend endpoint:
 *
 * POST
 * /journey-completions
 *
 * Authentication:
 * - Required.
 * - `authenticatedApiClient` supplies the current session access token.
 *
 * @param request
 *   Journey Completion creation command.
 *
 * @returns
 *   The created Journey Completion aggregate representation.
 */
export async function createJourneyCompletion(
  request: CreateJourneyCompletionRequest,
): Promise<CreateJourneyCompletionResponse> {
  return authenticatedApiClient.post<CreateJourneyCompletionResponse>(
    '/journey-completions',
    request,
  );
}