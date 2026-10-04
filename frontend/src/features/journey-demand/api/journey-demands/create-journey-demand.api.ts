// -----------------------------------------------------------------------------
// sisiMove — Create Journey Demand API
// -----------------------------------------------------------------------------
//
// Authenticated API operation for creating a new Journey Demand.
//
// Backend:
//
//     POST /journey-demands
//
// Creation intentionally creates only the Journey Demand root in DRAFT state.
// Journey Demand-owned components such as corridor, schedule, capacity,
// pricing, waypoints, and participants are configured through their own
// subsequent API operations.
//
// The frontend must not recreate JourneyDemandAggregate or any domain value
// objects. It sends the command contract required by the HTTP boundary.
//
// Authentication:
//
//     authenticatedApiClient
//
// The authenticated client obtains the current access token and injects it
// into the request. This API adapter therefore does not access auth session
// storage directly.
//
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication';

// =============================================================================
// Types
// =============================================================================

/**
 * HTTP request body for creating a Journey Demand.
 *
 * This mirrors the application command contract without exposing the
 * backend Command class itself to the frontend.
 *
 * The requester is deliberately explicit here because the current backend
 * CreateJourneyDemandCommand requires requesterPublicId.
 *
 * The backend subsequently constructs the RequesterPublicId value object.
 */
export interface CreateJourneyDemandRequest {
  /**
   * Public identifier of the traveler/member creating the Journey Demand.
   */
  readonly requesterPublicId: string;

  /**
   * Correlation identifier for distributed tracing.
   */
  readonly correlationId: string;

  /**
   * Optional causation identifier for distributed tracing.
   */
  readonly causationId?: string;
}

// =============================================================================
// Response
// =============================================================================

/**
 * HTTP response returned after creating a Journey Demand.
 *
 * The backend creates the Journey Demand aggregate and returns it.
 * The frontend deliberately exposes only the public identifier required
 * for subsequent Journey Demand-owned update operations.
 *
 * The complete backend aggregate is not exposed as a frontend API model.
 */
export interface CreateJourneyDemandResponse {
  /**
   * Public identifier of the newly-created Journey Demand.
   *
   * This identifier is required by subsequent operations such as:
   *
   * - updating the corridor;
   * - updating the schedule;
   * - updating capacity;
   * - updating pricing.
   */
  readonly publicId: string;
}

// =============================================================================
// API Paths
// =============================================================================

/**
 * Canonical Journey Demand HTTP resource path.
 */
const JOURNEY_DEMANDS_PATH = '/journey-demands';

// =============================================================================
// Create Journey Demand
// =============================================================================

/**
 * Create a new Journey Demand.
 *
 * Backend:
 *
 *     POST /journey-demands
 *
 * The backend creates the Journey Demand in DRAFT state.
 *
 * The backend returns the created Journey Demand aggregate. This adapter
 * intentionally exposes only its public identifier to the frontend.
 *
 * The returned public identifier is required because the remaining
 * Journey Demand configuration is performed through separate HTTP
 * operations that address the Journey Demand by public identifier.
 */
export async function createJourneyDemand(
  request: CreateJourneyDemandRequest,
): Promise<CreateJourneyDemandResponse> {
  const response =
    await authenticatedApiClient.post<CreateJourneyDemandResponse>(
      JOURNEY_DEMANDS_PATH,
      request,
    );

  return response;
}
