// -----------------------------------------------------------------------------
// sisiMove — Create Journey Boarding API
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Create a JourneyBoarding through the backend command endpoint.
// - Define the HTTP request/response transport contract.
// - Delegate authenticated HTTP execution to AuthenticatedApiClient.
//
// Architectural rules:
// - This is an API adapter only.
// - No domain/business rules belong here.
// - No aggregate is created in the frontend.
// - No value objects are constructed in the frontend.
// - No authentication storage is accessed directly.
// - The authenticated API client owns authentication concerns.
// - Public identifiers remain opaque strings at the frontend boundary.
//
// Backend endpoint:
// POST /journey-boardings
//
// Backend command inputs:
// - journeyId
// - providerPublicId
//
// The backend generates the JourneyBoarding publicId and initializes the
// aggregate in NOT_STARTED state.
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
 * Request body accepted by the create JourneyBoarding endpoint.
 *
 * These are opaque public identifiers at the frontend boundary.
 *
 * The backend application layer is responsible for constructing the
 * corresponding domain value objects.
 */
export interface CreateJourneyBoardingRequest {
  /**
   * Public identifier of the Journey that owns this boarding workflow.
   */
  journeyId: string;

  /**
   * Public identifier of the Journey provider.
   */
  providerPublicId: string;
}

// -----------------------------------------------------------------------------
// Response Contract
// -----------------------------------------------------------------------------

/**
 * Transport representation of a JourneyBoarding participant.
 *
 * A newly created JourneyBoarding normally has no participants yet, but the
 * response contract remains aligned with the JourneyBoarding response shape.
 */
export interface CreateJourneyBoardingParticipantResponse {
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
export interface CreateJourneyBoardingEventResponse {
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
 * HTTP response returned by the create endpoint.
 *
 * Dates are serialized as ISO strings at the HTTP boundary.
 */
export interface CreateJourneyBoardingResponse {
  publicId: string;
  journeyId: string;
  providerPublicId: string;
  status: string;
  boardingStartedAt?: string;
  journeyStartedAt?: string;
  cancelledAt?: string;
  version: number;
  participants: CreateJourneyBoardingParticipantResponse[];
  events: CreateJourneyBoardingEventResponse[];
  createdAt: string;
  updatedAt: string;
}

// -----------------------------------------------------------------------------
// API Adapter
// -----------------------------------------------------------------------------

/**
 * Creates a new JourneyBoarding.
 *
 * Backend endpoint:
 *
 * POST /journey-boardings
 *
 * The backend:
 * - generates the JourneyBoarding public identifier,
 * - creates the root entity,
 * - initializes it as NOT_STARTED,
 * - creates the aggregate,
 * - records the creation event,
 * - persists the aggregate.
 */
export async function createJourneyBoarding(
  request: CreateJourneyBoardingRequest,
  options?: RequestOptions,
): Promise<CreateJourneyBoardingResponse> {
  return authenticatedApiClient.post<CreateJourneyBoardingResponse>(
    '/journey-boardings',
    request,
    options,
  );
}