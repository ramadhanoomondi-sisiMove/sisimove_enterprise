// -----------------------------------------------------------------------------
// sisiMove — Cancel Journey Boarding API
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Cancel a JourneyBoarding.
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
// POST /journey-boardings/:journeyBoardingPublicId/cancel
//
// Backend command inputs:
// - journeyBoardingPublicId
// - cancelledAt (optional)
// - actorPublicId (optional)
//
// The backend aggregate remains authoritative for whether cancellation is
// currently permitted.
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
 * Request body accepted by the cancel JourneyBoarding endpoint.
 *
 * Both fields are optional because the backend command supports optional
 * cancellation metadata.
 */
export interface CancelJourneyBoardingRequest {
  cancelledAt?: string;
  actorPublicId?: string;
}

// -----------------------------------------------------------------------------
// Response Contract
// -----------------------------------------------------------------------------

/**
 * Transport representation of a JourneyBoarding participant.
 */
export interface CancelJourneyBoardingParticipantResponse {
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
export interface CancelJourneyBoardingEventResponse {
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
 * HTTP response returned by the cancel JourneyBoarding endpoint.
 *
 * Dates are serialized as ISO strings at the HTTP boundary.
 */
export interface CancelJourneyBoardingResponse {
  publicId: string;
  journeyId: string;
  providerPublicId: string;
  status: string;
  boardingStartedAt?: string;
  journeyStartedAt?: string;
  cancelledAt?: string;
  version: number;
  participants: CancelJourneyBoardingParticipantResponse[];
  events: CancelJourneyBoardingEventResponse[];
  createdAt: string;
  updatedAt: string;
}

// -----------------------------------------------------------------------------
// Parameters
// -----------------------------------------------------------------------------

export interface CancelJourneyBoardingParams {
  /**
   * Opaque public identifier of the JourneyBoarding to cancel.
   */
  journeyBoardingPublicId: string;
}

// -----------------------------------------------------------------------------
// API Adapter
// -----------------------------------------------------------------------------

/**
 * Cancels a JourneyBoarding.
 *
 * Backend endpoint:
 *
 * POST /journey-boardings/:journeyBoardingPublicId/cancel
 */
export async function cancelJourneyBoarding(
  params: CancelJourneyBoardingParams,
  request?: CancelJourneyBoardingRequest,
  options?: RequestOptions,
): Promise<CancelJourneyBoardingResponse> {
  return authenticatedApiClient.post<CancelJourneyBoardingResponse>(
    `/journey-boardings/${encodeURIComponent(
      params.journeyBoardingPublicId,
    )}/cancel`,
    request,
    options,
  );
}