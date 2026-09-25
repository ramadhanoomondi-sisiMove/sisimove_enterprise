// -----------------------------------------------------------------------------
// sisiMove — Remove Journey Corridor API
// -----------------------------------------------------------------------------
//
// HTTP adapter for removing the corridor attached to a Journey.
//
// Backend endpoint:
//
//   DELETE /api/v1/journeys/:journeyPublicId/corridor
//
// Request body:
//
//   None
//
// -----------------------------------------------------------------------------
// ARCHITECTURAL FLOW
// -----------------------------------------------------------------------------
//
// UI / Hook
//     │
//     ▼
// removeJourneyCorridor()
//     │
//     ▼
// AuthenticatedApiClient
//     │
//     ▼
// DELETE /journeys/:journeyPublicId/corridor
//     │
//     ▼
// RemoveJourneyCorridorCommand
//     │
//     ▼
// JourneyAggregate
//     │
//     ├── resolve Journey
//     ├── validate lifecycle/invariants
//     ├── remove corridor
//     └── persist aggregate
//
// -----------------------------------------------------------------------------
// RESPONSIBILITY
// -----------------------------------------------------------------------------
//
// This adapter is responsible only for:
//
// - accepting the Journey public identifier;
// - encoding the identifier for URL transport;
// - issuing the authenticated HTTP request;
// - exposing the successful operation result to the caller.
//
// This adapter does NOT:
//
// - load the Journey first;
// - load the corridor first;
// - create domain entities;
// - construct domain value objects;
// - validate Journey lifecycle rules;
// - determine whether removal is permitted;
// - mutate application state;
// - invalidate React Query state;
// - navigate;
// - persist directly.
//
// The backend Journey application/domain layers remain authoritative for
// corridor removal, lifecycle validation, aggregate invariants, and
// persistence.
//
// -----------------------------------------------------------------------------
// ERROR HANDLING
// -----------------------------------------------------------------------------
//
// Backend errors are intentionally allowed to propagate through the
// AuthenticatedApiClient.
//
// For example, if the Journey cannot be modified because of its lifecycle
// state, the API adapter must NOT convert that failure into a successful
// response.
//
// The calling workflow/hook owns user-facing error handling.
//
// -----------------------------------------------------------------------------


import { authenticatedApiClient } from '@/features/authentication/http';


// =============================================================================
// API Operation
// =============================================================================

/**
 * Remove the corridor attached to a Journey.
 *
 * Backend operation:
 *
 *   DELETE /journeys/:journeyPublicId/corridor
 *
 * No request body is required.
 *
 * The backend resolves the Journey aggregate and performs the removal through
 * the Journey application/domain boundary.
 *
 * This function intentionally performs no frontend state management,
 * navigation, cache invalidation, or pre-flight reads.
 *
 * @param journeyPublicId Public identifier of the Journey.
 * @returns Resolves when the backend successfully removes the corridor.
 */
export async function removeJourneyCorridor(
  journeyPublicId: string,
): Promise<void> {
  await authenticatedApiClient.delete<void>(
    `/journeys/${encodeURIComponent(journeyPublicId)}/corridor`,
  );
}