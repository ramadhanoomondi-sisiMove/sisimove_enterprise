// -----------------------------------------------------------------------------
// sisiMove — Withdraw Participant API
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Withdraw a participant from a Journey Boarding.
// - Define the HTTP transport contract for this operation.
// - Delegate authenticated HTTP execution to AuthenticatedApiClient.
//
// Architectural rules:
// - This is an API adapter only.
// - No domain/business rules belong here.
// - No authentication storage access belongs here.
// - The authenticated API client owns authentication concerns.
// - Public IDs remain opaque strings at the frontend boundary.
// - Correlation/causation identifiers remain application-layer concerns.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// HTTP Foundation
// -----------------------------------------------------------------------------

import type { RequestOptions } from '@/foundation/http';
import { authenticatedApiClient } from '@/features/authentication/http/authenticated-api-client';

// -----------------------------------------------------------------------------
// Request
// -----------------------------------------------------------------------------

/**
 * Request body accepted by the Withdraw Participant endpoint.
 *
 * `withdrawnAt` is optional because the backend command accepts an optional
 * timestamp and the aggregate owns the resulting participant transition.
 */
export interface WithdrawParticipantRequest {
  withdrawnAt?: string;
}

// -----------------------------------------------------------------------------
// Parameters
// -----------------------------------------------------------------------------

/**
 * Route parameters required to identify the Journey Boarding and participant.
 */
export interface WithdrawParticipantParams {
  journeyBoardingPublicId: string;
  participantPublicId: string;
}

// -----------------------------------------------------------------------------
// Response — Participant
// -----------------------------------------------------------------------------

export interface WithdrawParticipantParticipantResponse {
  publicId: string;
  boardingId: string;
  memberPublicId: string;
  bookingPublicId?: string;
  role: string;
  status: string;
  expectedAt: string;
  boardedAt?: string;
  withdrawnAt?: string;
  noShowAt?: string;
  removedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// -----------------------------------------------------------------------------
// Response — Event
// -----------------------------------------------------------------------------

export interface WithdrawParticipantEventResponse {
  publicId: string;
  boardingId: string;
  type: string;
  memberPublicId?: string;
  bookingPublicId?: string;
  actorPublicId?: string;
  occurredAt: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

// -----------------------------------------------------------------------------
// Response — Journey Boarding
// -----------------------------------------------------------------------------

export interface WithdrawParticipantResponse {
  publicId: string;
  journeyId: string;
  providerPublicId: string;
  status: string;
  boardingStartedAt?: string;
  journeyStartedAt?: string;
  cancelledAt?: string;
  version: number;
  participants: WithdrawParticipantParticipantResponse[];
  events: WithdrawParticipantEventResponse[];
  createdAt: string;
  updatedAt: string;
}

// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------

/**
 * Withdraws a participant from the Journey Boarding.
 *
 * Backend endpoint:
 *
 * POST /journey-boardings/:journeyBoardingPublicId/participants/:participantPublicId/withdraw
 */
export async function withdrawParticipant(
  params: WithdrawParticipantParams,
  request?: WithdrawParticipantRequest,
  options?: RequestOptions,
): Promise<WithdrawParticipantResponse> {
  return authenticatedApiClient.post<WithdrawParticipantResponse>(
    `/journey-boardings/${encodeURIComponent(
      params.journeyBoardingPublicId,
    )}/participants/${encodeURIComponent(
      params.participantPublicId,
    )}/withdraw`,
    request,
    options,
  );
}