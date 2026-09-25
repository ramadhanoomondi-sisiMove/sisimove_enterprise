// -----------------------------------------------------------------------------
// sisiMove — Add Journey Waypoint API
// -----------------------------------------------------------------------------
//
// HTTP adapter for configuring and adding a waypoint to a Journey.
//
// Backend endpoint:
//
//   POST /api/v1/journeys/:journeyPublicId/waypoints
//
// Request body:
//
//   {
//     type: JourneyWaypointType;
//     sequence: number;
//     name: string;
//     latitude: number;
//     longitude: number;
//     pickupAllowed: boolean;
//     dropoffAllowed: boolean;
//   }
//
// -----------------------------------------------------------------------------
// ARCHITECTURAL FLOW
// -----------------------------------------------------------------------------
//
// Route Form
//     │
//     ▼
// addJourneyWaypoint()
//     │
//     ▼
// AuthenticatedApiClient
//     │
//     ▼
// POST /journeys/:journeyPublicId/waypoints
//     │
//     ▼
// AddJourneyWaypointCommand
//     │
//     ▼
// JourneyAggregate
//     │
//     ├── resolve Journey
//     ├── validate waypoint configuration
//     ├── create JourneyWaypoint
//     ├── add waypoint through aggregate
//     └── persist aggregate
//
// -----------------------------------------------------------------------------
// RESPONSIBILITY
// -----------------------------------------------------------------------------
//
// This adapter is responsible only for:
//
// - accepting transport-safe waypoint data;
// - accepting the Journey public identifier;
// - encoding the Journey public identifier for URL transport;
// - issuing the authenticated HTTP request;
// - exposing the backend operation result to the caller.
//
// This adapter does NOT:
//
// - create domain entities;
// - create domain value objects;
// - generate waypoint public identifiers;
// - resolve geographic locations;
// - validate Journey lifecycle rules;
// - enforce waypoint ordering invariants;
// - determine whether pickup/dropoff configuration is valid;
// - persist the Journey directly;
// - navigate;
// - manage React state;
// - manage React Query state.
//
// The backend Journey application/domain layers remain authoritative for
// waypoint creation, validation, aggregate association, ordering rules,
// lifecycle rules, and persistence.
//
// -----------------------------------------------------------------------------
// PRESENTATION-ONLY LOCAL IDENTIFIER
// -----------------------------------------------------------------------------
//
// JourneyWaypointsForm may maintain a local React identifier:
//
//   localId
//
// That identifier exists only to provide stable rendering/editing keys.
//
// It is NOT part of AddJourneyWaypointRequest and must never cross the HTTP
// boundary.
//
// The backend generates and owns the waypoint public identifier.
//
// -----------------------------------------------------------------------------
// SEQUENCE OWNERSHIP
// -----------------------------------------------------------------------------
//
// `sequence` is included in the request because it is part of the waypoint
// configuration supplied by the workflow.
//
// However, the frontend does NOT own the domain invariant represented by
// sequence ordering.
//
// The Journey aggregate remains authoritative for:
//
// - sequence validity;
// - uniqueness;
// - ordering invariants;
// - insertion/removal behavior.
//
// -----------------------------------------------------------------------------


import { authenticatedApiClient } from '@/features/authentication/http';

import type { JourneyWaypointType } from '../../../models';


// =============================================================================
// Request
// =============================================================================

/**
 * HTTP request body accepted by the add Journey waypoint endpoint.
 *
 * This is a transport contract only.
 *
 * It intentionally contains primitive transport values plus the shared
 * JourneyWaypointType model type. It does not contain a JourneyWaypoint
 * domain entity or any presentation-only form state.
 */
export interface AddJourneyWaypointRequest {
  /**
   * Type of waypoint.
   */
  type: JourneyWaypointType;

  /**
   * Requested position of the waypoint within the Journey route.
   *
   * The value is supplied to the backend as configuration. The Journey
   * aggregate remains authoritative for sequence/order invariants.
   */
  sequence: number;

  /**
   * Human-readable name of the waypoint location.
   */
  name: string;

  /**
   * Latitude of the waypoint.
   *
   * Geographic range validation belongs to the backend.
   */
  latitude: number;

  /**
   * Longitude of the waypoint.
   *
   * Geographic range validation belongs to the backend.
   */
  longitude: number;

  /**
   * Whether passengers may be picked up at this waypoint.
   */
  pickupAllowed: boolean;

  /**
   * Whether passengers may be dropped off at this waypoint.
   */
  dropoffAllowed: boolean;
}


// =============================================================================
// API Operation
// =============================================================================

/**
 * Add a waypoint to a Journey.
 *
 * Backend operation:
 *
 *   POST /journeys/:journeyPublicId/waypoints
 *
 * The backend is responsible for:
 *
 *   1. Resolving the Journey aggregate.
 *   2. Validating the waypoint configuration.
 *   3. Creating the JourneyWaypoint entity.
 *   4. Adding the waypoint through JourneyAggregate.
 *   5. Persisting the aggregate.
 *
 * This function intentionally performs no frontend state management,
 * navigation, cache invalidation, or domain mutation.
 *
 * @param journeyPublicId Public identifier of the Journey.
 * @param request Waypoint configuration supplied by the route workflow.
 * @returns Resolves when the backend successfully adds the waypoint.
 */
export async function addJourneyWaypoint(
  journeyPublicId: string,
  request: AddJourneyWaypointRequest,
): Promise<void> {
  await authenticatedApiClient.post<void>(
    `/journeys/${encodeURIComponent(journeyPublicId)}/waypoints`,
    request,
  );
}