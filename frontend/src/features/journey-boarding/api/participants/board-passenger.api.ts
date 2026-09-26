// -----------------------------------------------------------------------------
// sisiMove — Board Passenger API
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Board a passenger participating in a Journey Boarding.
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
 * Request body accepted by the Board Passenger endpoint.
 *
 * `boardedAt` is optional because the backend command accepts an optional
 * boarding timestamp and the aggregate owns the resulting state transition.
 */
export interface BoardPassengerRequest {
  boardedAt?: string;
}

// -----------------------------------------------------------------------------
// Parameters
// -----------------------------------------------------------------------------

/**
 * Route parameters required to identify the Journey Boarding and passenger
 * participant.
 */
export interface BoardPassengerParams {
  journeyBoardingPublicId: string;
  participantPublicId: string;
}

// -----------------------------------------------------------------------------
// Response — Participant
// -----------------------------------------------------------------------------

export interface BoardPassengerParticipantResponse {
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

export interface BoardPassengerEventResponse {
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

export interface BoardPassengerResponse {
  publicId: string;
  journeyId: string;
  providerPublicId: string;
  status: string;
  boardingStartedAt?: string;
  journeyStartedAt?: string;
  cancelledAt?: string;
  version: number;
  participants: BoardPassengerParticipantResponse[];
  events: BoardPassengerEventResponse[];
  createdAt: string;
  updatedAt: string;
}

// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------

/**
 * Boards a passenger participating in the Journey Boarding.
 *
 * Backend endpoint:
 *
 * POST /journey-boardings/:journeyBoardingPublicId/participants/:participantPublicId/board
 */
export async function boardPassenger(
  params: BoardPassengerParams,
  request?: BoardPassengerRequest,
  options?: RequestOptions,
): Promise<BoardPassengerResponse> {
  return authenticatedApiClient.post<BoardPassengerResponse>(
    `/journey-boardings/${encodeURIComponent(
      params.journeyBoardingPublicId,
    )}/participants/${encodeURIComponent(
      params.participantPublicId,
    )}/board`,
    request,
    options,
  );
}