// -----------------------------------------------------------------------------
// sisiMove — Get Journey Corridor API
// -----------------------------------------------------------------------------
//
// HTTP adapter for retrieving the corridor attached to a Journey.
//
// Backend endpoint:
//
//   GET /api/v1/journeys/:journeyPublicId/corridor
//
// Response:
//
//   JourneyCorridor
//   │
//   └── null when no corridor is currently attached
//
// -----------------------------------------------------------------------------
// ARCHITECTURAL FLOW
// -----------------------------------------------------------------------------
//
// UI / Hook
//     │
//     ▼
// getJourneyCorridor()
//     │
//     ▼
// AuthenticatedApiClient
//     │
//     ▼
// GET /journeys/:journeyPublicId/corridor
//     │
//     ▼
// Journey HTTP Controller
//     │
//     ▼
// GetJourneyCorridorQuery
//     │
//     ▼
// Journey Read Model / Repository
//
// -----------------------------------------------------------------------------
// RESPONSIBILITY
// -----------------------------------------------------------------------------
//
// This adapter is responsible only for:
//
// - accepting the Journey public identifier;
// - encoding the identifier for URL transport;
// - issuing the HTTP request;
// - returning the typed HTTP response.
//
// This adapter does NOT:
//
// - access persistence directly;
// - construct Journey domain entities;
// - construct Journey value objects;
// - mutate the Journey aggregate;
// - validate Journey lifecycle rules;
// - decide whether the corridor is editable;
// - navigate;
// - manage React state;
// - manage React Query state;
// - transform the response into a different presentation model.
//
// The Journey HTTP/application boundary remains responsible for resolving
// and returning the Journey corridor.
//
// -----------------------------------------------------------------------------
// NULL SEMANTICS
// -----------------------------------------------------------------------------
//
// `null` is a valid successful response and means:
//
//   The Journey exists, but currently has no attached corridor.
//
// An HTTP error should therefore remain an HTTP error and must not be
// converted into `null` by this adapter.
//
// -----------------------------------------------------------------------------


import { authenticatedApiClient } from '@/features/authentication/http';

import type { JourneyCorridor } from '../../../models';


// =============================================================================
// API Operation
// =============================================================================

/**
 * Retrieve the corridor attached to a Journey.
 *
 * Backend operation:
 *
 *   GET /journeys/:journeyPublicId/corridor
 *
 * A successful request returns the Journey corridor when one is attached.
 * When the Journey currently has no corridor, the backend returns `null`.
 *
 * This function intentionally performs no frontend state management,
 * navigation, cache handling, or domain mutation.
 *
 * @param journeyPublicId Public identifier of the Journey.
 * @returns The attached Journey corridor, or `null` when none is attached.
 */
export async function getJourneyCorridor(
  journeyPublicId: string,
): Promise<JourneyCorridor | null> {
  return authenticatedApiClient.get<JourneyCorridor | null>(
    `/journeys/${encodeURIComponent(journeyPublicId)}/corridor`,
  );
}