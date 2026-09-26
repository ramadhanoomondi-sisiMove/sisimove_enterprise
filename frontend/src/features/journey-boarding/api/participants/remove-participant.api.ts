// -----------------------------------------------------------------------------
// sisiMove — Remove Participant API
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Remove a participant from a Journey Boarding.
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
 * Request body accepted by the Remove Participant endpoint.
 *
 * Both fields are optional because the backend command accepts optional
 * timestamps and an optional actor identifier.
 */
export interface RemoveParticipantRequest {
  removedAt?: string;
  actorPublicId?: string;
}

// -----------------------------------------------------------------------------
// Parameters
// -----------------------------------------------------------------------------

/**
 * Route parameters required to identify the Journey Boarding and participant.
 */
export interface RemoveParticipantParams {
  journeyBoardingPublicId: string;
  participantPublicId: string;
}

// -----------------------------------------------------------------------------
// Response — Participant
// -----------------------------------------------------------------------------

export interface RemoveParticipantParticipantResponse {
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

export interface RemoveParticipantEventResponse {
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

export interface RemoveParticipantResponse {
  publicId: string;
  journeyId: string;
  providerPublicId: string;
  status: string;
  boardingStartedAt?: string;
  journeyStartedAt?: string;
  cancelledAt?: string;
  version: number;
  participants: RemoveParticipantParticipantResponse[];
  events: RemoveParticipantEventResponse[];
  createdAt: string;
  updatedAt: string;
}

// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------

/**
 * Removes a participant from the Journey Boarding.
 *
 * Backend endpoint:
 *
 * POST /journey-boardings/:journeyBoardingPublicId/participants/:participantPublicId/remove
 */
export async function removeParticipant(
  params: RemoveParticipantParams,
  request?: RemoveParticipantRequest,
  options?: RequestOptions,
): Promise<RemoveParticipantResponse> {
  return authenticatedApiClient.post<RemoveParticipantResponse>(
    `/journey-boardings/${encodeURIComponent(
      params.journeyBoardingPublicId,
    )}/participants/${encodeURIComponent(
      params.participantPublicId,
    )}/remove`,
    request,
    options,
  );
}