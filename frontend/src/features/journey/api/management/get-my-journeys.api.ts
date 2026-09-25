// -----------------------------------------------------------------------------
// sisiMove — Get My Journeys API
// -----------------------------------------------------------------------------
//
// HTTP adapter for the authenticated Journey management collection.
//
// Backend endpoint:
//
//   GET /api/v1/journeys/me
//
// The backend derives the Journey provider from the authenticated JWT
// identity. The client MUST NOT provide providerPublicId.
//
// Architectural boundary:
//
//   UI / Hook
//       │
//       ▼
//   getMyJourneys()
//       │
//       ▼
//   AuthenticatedApiClient
//       │
//       ▼
//   GET /journeys/me
//
// This endpoint returns the authenticated provider's Journey management
// representation. It is intentionally distinct from public marketplace
// discovery.
//
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http';

import type { Journey } from '../../models';

/**
 * Fetch Journeys belonging to the currently authenticated provider.
 *
 * Maps directly to:
 *
 *   GET /journeys/me
 *
 * Authentication is supplied by the shared AuthenticatedApiClient. The
 * current identity is resolved server-side from the access token.
 *
 * No provider identifier is accepted because the backend derives it from
 * `CurrentIdentity`.
 *
 * @returns Journeys owned by the authenticated provider.
 */
export async function getMyJourneys(): Promise<Journey[]> {
  return authenticatedApiClient.get<Journey[]>(
    '/journeys/me',
  );
}