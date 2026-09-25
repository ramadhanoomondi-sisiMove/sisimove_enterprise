// -----------------------------------------------------------------------------
// sisiMove — Attach / Configure Journey Corridor API
// -----------------------------------------------------------------------------
//
// HTTP adapter for configuring the corridor of a Journey.
//
// Backend endpoint:
//
//   POST /api/v1/journeys/:journeyPublicId/corridor
//
// Request body:
//
//   {
//     originName: string;
//     originLatitude: number;
//     originLongitude: number;
//     destinationName: string;
//     destinationLatitude: number;
//     destinationLongitude: number;
//   }
//
// -----------------------------------------------------------------------------
// ARCHITECTURAL FLOW
// -----------------------------------------------------------------------------
//
// Route Form
//     │
//     ▼
// attachJourneyCorridor()
//     │
//     ▼
// AuthenticatedApiClient
//     │
//     ▼
// POST /journeys/:journeyPublicId/corridor
//     │
//     ▼
// AttachJourneyCorridorCommand
//     │
//     ▼
// JourneyAggregate
//     │
//     ├── resolve Journey
//     ├── create/configure JourneyCorridor
//     ├── attach corridor
//     └── persist aggregate
//
// -----------------------------------------------------------------------------
// RESPONSIBILITY
// -----------------------------------------------------------------------------
//
// This frontend API adapter is intentionally thin.
//
// It is responsible only for:
//
// - accepting transport-safe request data;
// - encoding the Journey public ID for use in the URL;
// - issuing the authenticated HTTP request;
// - returning the backend operation result.
//
// This adapter does NOT:
//
// - create domain entities;
// - create value objects;
// - generate public identifiers;
// - resolve geographic locations;
// - validate Journey lifecycle rules;
// - enforce aggregate invariants;
// - persist Journey state directly;
// - navigate;
// - manage React state;
// - manage React Query state;
// - transform the request into a domain command.
//
// The backend remains the authoritative owner of:
//
// - corridor creation;
// - coordinate validation;
// - corridor invariants;
// - Journey association;
// - Journey lifecycle validation;
// - aggregate persistence.
//
// -----------------------------------------------------------------------------
//
// IMPORTANT
// -----------------------------------------------------------------------------
//
// `journeyPublicId` is intentionally passed separately from the request body.
//
// It identifies the Journey resource represented by the URL:
//
//   /journeys/:journeyPublicId/corridor
//
// It must NOT be duplicated inside AttachJourneyCorridorRequest.
//
// -----------------------------------------------------------------------------


import { authenticatedApiClient } from '@/features/authentication/http';


// =============================================================================
// Request
// =============================================================================

/**
 * HTTP request body accepted by the Journey corridor configuration endpoint.
 *
 * This is a transport contract only.
 *
 * It deliberately contains primitives rather than Journey domain value
 * objects. The backend application/domain layers are responsible for
 * converting these values into the appropriate domain representation.
 */
export interface AttachJourneyCorridorRequest {
  /**
   * Human-readable name of the Journey origin.
   */
  originName: string;

  /**
   * Latitude of the Journey origin.
   *
   * The frontend sends the numeric transport value.
   * Geographic range validation belongs to the backend.
   */
  originLatitude: number;

  /**
   * Longitude of the Journey origin.
   *
   * The frontend sends the numeric transport value.
   * Geographic range validation belongs to the backend.
   */
  originLongitude: number;

  /**
   * Human-readable name of the Journey destination.
   */
  destinationName: string;

  /**
   * Latitude of the Journey destination.
   *
   * The frontend sends the numeric transport value.
   * Geographic range validation belongs to the backend.
   */
  destinationLatitude: number;

  /**
   * Longitude of the Journey destination.
   *
   * The frontend sends the numeric transport value.
   * Geographic range validation belongs to the backend.
   */
  destinationLongitude: number;
}


// =============================================================================
// API Operation
// =============================================================================

/**
 * Configure and attach a corridor to a Journey.
 *
 * Backend operation:
 *
 *   POST /journeys/:journeyPublicId/corridor
 *
 * The backend is responsible for:
 *
 *   1. Resolving the Journey aggregate.
 *   2. Validating the requested corridor configuration.
 *   3. Creating/configuring the JourneyCorridor entity.
 *   4. Attaching the corridor through JourneyAggregate.
 *   5. Persisting the aggregate.
 *
 * This function intentionally performs no frontend navigation, state
 * management, domain mutation, or cache invalidation.
 *
 * Cache invalidation, workflow progression, and navigation belong to the
 * calling application/workflow layer.
 *
 * @param journeyPublicId Public identifier of the Journey being configured.
 * @param request Corridor configuration supplied by the Journey form.
 */
export async function attachJourneyCorridor(
  journeyPublicId: string,
  request: AttachJourneyCorridorRequest,
): Promise<void> {
  await authenticatedApiClient.post<void>(
    `/journeys/${encodeURIComponent(journeyPublicId)}/corridor`,
    request,
  );
}