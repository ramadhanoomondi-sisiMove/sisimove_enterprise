// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Corridor API
// -----------------------------------------------------------------------------
//
// HTTP adapter for updating the corridor owned by a Journey Demand.
//
// Backend endpoint:
//
//   PUT /journey-demands/:journeyDemandPublicId/corridor
//
// Backend request:
//
//   UpdateJourneyDemandCorridorDto
//
// Backend response:
//
//   void
//
// Architectural boundary:
//
// - Journey Demand remains the owner of its corridor.
// - The frontend sends the selected corridor values and their coordinates.
// - The backend aggregate/application layer owns validation and state change.
// - The frontend does not calculate coordinates, corridor keys, or waypoints.
// - Coordinates originate from the selected/resolved location and are passed
//   through this adapter unchanged.
// - The frontend does not reconstruct the Journey Demand aggregate.
// - Query invalidation/refetching belongs to the hook layer.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Authentication
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication';

// -----------------------------------------------------------------------------
// Request
// -----------------------------------------------------------------------------

/**
 * Request payload for replacing the Journey Demand corridor values.
 *
 * This mirrors the backend `UpdateJourneyDemandCorridorDto`.
 *
 * The Journey Demand public identifier is intentionally excluded from this
 * payload because the HTTP controller receives it as the URL resource
 * parameter.
 */
export interface UpdateJourneyDemandCorridorRequest {
  /**
   * New origin name for the Journey Demand corridor.
   *
   * Backend validation:
   *
   * - required;
   * - string;
   * - minimum length: 1;
   * - maximum length: 200.
   */
  readonly origin: string;

  /**
   * Latitude of the selected Journey Demand corridor origin.
   *
   * Backend validation:
   *
   * - required;
   * - number;
   * - minimum: -90;
   * - maximum: 90.
   */
  readonly originLatitude: number;

  /**
   * Longitude of the selected Journey Demand corridor origin.
   *
   * Backend validation:
   *
   * - required;
   * - number;
   * - minimum: -180;
   * - maximum: 180.
   */
  readonly originLongitude: number;

  /**
   * New destination name for the Journey Demand corridor.
   *
   * Backend validation:
   *
   * - required;
   * - string;
   * - minimum length: 1;
   * - maximum length: 200.
   */
  readonly destination: string;

  /**
   * Latitude of the selected Journey Demand corridor destination.
   *
   * Backend validation:
   *
   * - required;
   * - number;
   * - minimum: -90;
   * - maximum: 90.
   */
  readonly destinationLatitude: number;

  /**
   * Longitude of the selected Journey Demand corridor destination.
   *
   * Backend validation:
   *
   * - required;
   * - number;
   * - minimum: -180;
   * - maximum: 180.
   */
  readonly destinationLongitude: number;

  /**
   * Correlation identifier for distributed tracing.
   */
  readonly correlationId: string;

  /**
   * Optional causation identifier for distributed tracing.
   */
  readonly causationId?: string;
}

// -----------------------------------------------------------------------------
// Endpoint
// -----------------------------------------------------------------------------

/**
 * Root path for Journey Demand resources.
 */
const JOURNEY_DEMANDS_PATH = '/journey-demands';

// -----------------------------------------------------------------------------
// Mutation
// -----------------------------------------------------------------------------

/**
 * Update the corridor of a Journey Demand.
 *
 * The backend command owns the actual corridor transition. This adapter only
 * translates the frontend request into the backend HTTP contract.
 *
 * Coordinates are deliberately passed through without modification. The
 * selected `ResolvedLocation` is the source of those values in the creation
 * workflow.
 *
 * The endpoint returns no representation after the mutation, therefore this
 * function deliberately returns `Promise<void>`.
 *
 * Consumers that need the updated Journey Demand must invalidate/refetch
 * their relevant query through the appropriate React/query hook.
 *
 * @param journeyDemandPublicId
 *   Public identifier of the Journey Demand whose corridor is being updated.
 *
 * @param request
 *   New origin, destination, coordinates, and command tracing metadata.
 */
export async function updateJourneyDemandCorridor(
  journeyDemandPublicId: string,
  request: UpdateJourneyDemandCorridorRequest,
): Promise<void> {
  await authenticatedApiClient.put<void>(
    `${JOURNEY_DEMANDS_PATH}/${encodeURIComponent(journeyDemandPublicId)}/corridor`,
    request,
  );
}

