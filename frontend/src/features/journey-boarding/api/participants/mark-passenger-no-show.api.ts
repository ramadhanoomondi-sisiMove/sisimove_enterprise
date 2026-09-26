// -----------------------------------------------------------------------------
// sisiMove — Mark Passenger No-Show API
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Mark a passenger as a no-show during Journey Boarding.
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
 * Request body accepted by the Mark Passenger No-Show endpoint.
 *
 * `noShowAt` is optional because the backend command accepts an optional
 * timestamp and the aggregate owns the resulting participant transition.
 */
export interface MarkPassengerNoShowRequest {
  noShowAt?: string;
}

// -----------------------------------------------------------------------------
// Parameters
// -----------------------------------------------------------------------------

/**
 * Route parameters required to identify the Journey Boarding and passenger
 * participant.
 */
export interface MarkPassengerNoShowParams {
  journeyBoardingPublicId: string;
  participantPublicId: string;
}

// -----------------------------------------------------------------------------
// Response — Participant
// -----------------------------------------------------------------------------

export interface MarkPassengerNoShowParticipantResponse {
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

export interface MarkPassengerNoShowEventResponse {
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

export interface MarkPassengerNoShowResponse {
  publicId: string;
  journeyId: string;
  providerPublicId: string;
  status: string;
  boardingStartedAt?: string;
  journeyStartedAt?: string;
  cancelledAt?: string;
  version: number;
  participants: MarkPassengerNoShowParticipantResponse[];
  events: MarkPassengerNoShowEventResponse[];
  createdAt: string;
  updatedAt: string;
}

// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------

/**
 * Marks a passenger participant as a no-show.
 *
 * Backend endpoint:
 *
 * POST /journey-boardings/:journeyBoardingPublicId/participants/:participantPublicId/no-show
 */
export async function markPassengerNoShow(
  params: MarkPassengerNoShowParams,
  request?: MarkPassengerNoShowRequest,
  options?: RequestOptions,
): Promise<MarkPassengerNoShowResponse> {
  return authenticatedApiClient.post<MarkPassengerNoShowResponse>(
    `/journey-boardings/${encodeURIComponent(
      params.journeyBoardingPublicId,
    )}/participants/${encodeURIComponent(
      params.participantPublicId,
    )}/no-show`,
    request,
    options,
  );
}