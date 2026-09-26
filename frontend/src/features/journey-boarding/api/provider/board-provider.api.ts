// -----------------------------------------------------------------------------
// sisiMove — Board Provider API
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Board the provider participating in a Journey Boarding.
// - Define the HTTP transport contract for this operation.
// - Delegate authenticated HTTP execution to AuthenticatedApiClient.
//
// Architectural rules:
// - This is an API adapter only.
// - No domain/business rules belong here.
// - No authentication storage access belongs here.
// - The authenticated API client owns authentication concerns.
// - Public IDs remain opaque strings at the frontend boundary.
// - Correlation/causation identifiers are application-layer concerns and are
//   therefore not part of the frontend request contract.
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
 * Request body accepted by the Board Provider endpoint.
 *
 * `boardedAt` is optional because the backend command supports an optional
 * timestamp and the aggregate is responsible for determining the resulting
 * lifecycle state.
 */
export interface BoardProviderRequest {
  boardedAt?: string;
}

// -----------------------------------------------------------------------------
// Parameters
// -----------------------------------------------------------------------------

/**
 * Route parameters required to identify the Journey Boarding.
 */
export interface BoardProviderParams {
  journeyBoardingPublicId: string;
}

// -----------------------------------------------------------------------------
// Response — Participant
// -----------------------------------------------------------------------------

export interface BoardProviderParticipantResponse {
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

export interface BoardProviderEventResponse {
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

export interface BoardProviderResponse {
  publicId: string;
  journeyId: string;
  providerPublicId: string;
  status: string;
  boardingStartedAt?: string;
  journeyStartedAt?: string;
  cancelledAt?: string;
  version: number;
  participants: BoardProviderParticipantResponse[];
  events: BoardProviderEventResponse[];
  createdAt: string;
  updatedAt: string;
}

// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------

/**
 * Boards the provider participating in the Journey Boarding.
 *
 * Backend endpoint:
 *
 * POST /journey-boardings/:journeyBoardingPublicId/provider/board
 */
export async function boardProvider(
  params: BoardProviderParams,
  request?: BoardProviderRequest,
  options?: RequestOptions,
): Promise<BoardProviderResponse> {
  return authenticatedApiClient.post<BoardProviderResponse>(
    `/journey-boardings/${encodeURIComponent(
      params.journeyBoardingPublicId,
    )}/provider/board`,
    request,
    options,
  );
}