
// -----------------------------------------------------------------------------
// sisiMove — Start Journey API
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Request the backend to start the Journey associated with a JourneyBoarding.
// - Define the HTTP request and response transport contracts.
// - Delegate authenticated HTTP execution to AuthenticatedApiClient.
//
// Architectural rules:
// - This is an API adapter only.
// - No lifecycle or business rules belong here.
// - No aggregate is created or orchestrated in the frontend.
// - No domain value objects are constructed in the frontend.
// - No authentication storage is accessed directly.
// - The authenticated API client owns authentication concerns.
// - Public identifiers remain opaque strings at the frontend boundary.
//
// Backend endpoint:
// POST /journey-boardings/:journeyBoardingPublicId/start
//
// Backend command input:
// - journeyBoardingPublicId
// - journeyStartedAt (optional)
//
// The backend coordinates the Journey and JourneyBoarding lifecycle changes,
// persists the historical JOURNEY_STARTED event, and returns the updated
// JourneyBoarding representation.
// -----------------------------------------------------------------------------

import type { RequestOptions } from '@/foundation/http';

import { authenticatedApiClient } from '@/features/authentication/http/authenticated-api-client';

// -----------------------------------------------------------------------------
// Request Contract
// -----------------------------------------------------------------------------

/**
 * Request body accepted by the start Journey endpoint.
 *
 * The timestamp is optional. When omitted, the backend determines the
 * effective start time.
 */
export interface StartJourneyRequest {
  journeyStartedAt?: string;
}

// -----------------------------------------------------------------------------
// Response Contracts
// -----------------------------------------------------------------------------

/**
 * Transport representation of a JourneyBoarding participant.
 */
export interface StartJourneyParticipantResponse {
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

/**
 * Transport representation of a historical JourneyBoarding event.
 */
export interface StartJourneyEventResponse {
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

/**
 * HTTP response returned by the start Journey endpoint.
 *
 * This contract mirrors the JourneyBoarding frontend model.
 * Dates are represented as serialized ISO date-time strings.
 *
 * The response describes the updated JourneyBoarding; it does not
 * expose or recreate the backend Journey aggregate.
 */
export interface StartJourneyResponse {
  publicId: string;
  journeyId: string;
  providerPublicId: string;
  status: string;
  boardingStartedAt?: string;
  journeyStartedAt?: string;
  cancelledAt?: string;
  version: number;
  participants: StartJourneyParticipantResponse[];
  events: StartJourneyEventResponse[];
  createdAt: string;
  updatedAt: string;
}

// -----------------------------------------------------------------------------
// Parameters
// -----------------------------------------------------------------------------

export interface StartJourneyParams {
  /**
   * Opaque public identifier of the JourneyBoarding whose Journey
   * should be started.
   */
  journeyBoardingPublicId: string;
}

// -----------------------------------------------------------------------------
// API Adapter
// -----------------------------------------------------------------------------

/**
 * Requests that the backend start the Journey associated with a
 * JourneyBoarding.
 *
 * The backend remains responsible for lifecycle validation, coordinated
 * persistence, and recording the historical start event.
 */
export async function startJourney(
  params: StartJourneyParams,
  request?: StartJourneyRequest,
  options?: RequestOptions,
): Promise<StartJourneyResponse> {
  const path =
    `/journey-boardings/${encodeURIComponent(
      params.journeyBoardingPublicId,
    )}/start`;

  return authenticatedApiClient.post<StartJourneyResponse>(
    path,
    request,
    options,
  );
}
