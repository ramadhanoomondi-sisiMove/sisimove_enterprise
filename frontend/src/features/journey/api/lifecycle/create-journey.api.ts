// -----------------------------------------------------------------------------
// sisiMove — Create Journey API
// -----------------------------------------------------------------------------
//
// HTTP adapter for creating a new Journey aggregate.
//
// Backend endpoint:
//
//   POST /api/v1/journeys
//
// IMPORTANT:
//
// The frozen backend controller does NOT accept a request body for Journey
// creation.
//
// The authenticated identity is derived from the JWT and the backend creates
// the Journey using:
//
//   CreateJourneyCommand(
//     identity.identityPublicId,
//     randomUUID(),
//   )
//
// Therefore this adapter deliberately sends NO request body and accepts NO
// providerPublicId.
//
// Architectural boundary:
//
//   UI / Hook
//       │
//       ▼
//   createJourney()
//       │
//       ▼
//   AuthenticatedApiClient
//       │
//       ▼
//   POST /journeys
//
// Journey components such as corridor, schedule, vehicle, capacity, pricing,
// preferences, and assets are attached through their own API endpoints after
// the Journey aggregate has been created.
//
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http';

import type { Journey } from '../../models';

/**
 * Create a new Journey for the currently authenticated identity.
 *
 * The backend derives the provider from the authenticated JWT.
 *
 * No request body is sent.
 *
 * @returns The newly created Journey aggregate representation.
 */
export async function createJourney(): Promise<Journey> {
  return authenticatedApiClient.post<Journey>(
    '/journeys',
  );
}