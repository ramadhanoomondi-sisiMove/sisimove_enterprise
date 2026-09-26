// -----------------------------------------------------------------------------
// sisiMove — Start Journey API
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Start the Journey associated with a JourneyBoarding.
// - Define the HTTP request/response transport contract.
// - Delegate authenticated HTTP execution to AuthenticatedApiClient.
//
// Architectural rules:
// - This is an API adapter only.
// - No lifecycle/business rules belong here.
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
// The backend aggregate remains authoritative for all start-Journey
// invariants, including provider boarding and lifecycle state.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// HTTP
// -----------------------------------------------------------------------------

import type { RequestOptions } from '@/foundation/http';

// -----------------------------------------------------------------------------
// Authentication HTTP Client
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http/authenticated-api-client';

// -----------------------------------------------------------------------------
// Request Contract
// -----------------------------------------------------------------------------

/**
 * Request body accepted by the start Journey endpoint.
 *
 * `journeyStartedAt` is optional because the backend command supports an
 * optional explicit timestamp.
 */
export interface StartJourneyRequest {
  journeyStartedAt?: string;
}

// -----------------------------------------------------------------------------
// Response Contract
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
 * Transport representation of a JourneyBoarding event.
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
 * Dates are serialized as ISO strings at the HTTP boundary.
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
   * Opaque public identifier of the JourneyBoarding whose Journey should
   * be started.
   */
  journeyBoardingPublicId: string;
}

// -----------------------------------------------------------------------------
// API Adapter
// -----------------------------------------------------------------------------

/**
 * Starts the Journey associated with a JourneyBoarding.
 *
 * Backend endpoint:
 *
 * POST /journey-boardings/:journeyBoardingPublicId/start
 */
export async function startJourney(
  params: StartJourneyParams,
  request?: StartJourneyRequest,
  options?: RequestOptions,
): Promise<StartJourneyResponse> {
  return authenticatedApiClient.post<StartJourneyResponse>(
    `/journey-boardings/${encodeURIComponent(
      params.journeyBoardingPublicId,
    )}/start`,
    request,
    options,
  );
}