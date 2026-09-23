// -----------------------------------------------------------------------------
// sisiMove — Get My Journeys API
// -----------------------------------------------------------------------------
//
// Retrieves journeys belonging to the currently authenticated provider.
//
// Backend:
//     GET /journeys/me
//
// Authentication:
//     Required.
//
// IMPORTANT:
//     providerPublicId is deliberately NOT accepted by this API.
//
// The backend derives ownership from the authenticated JWT:
//
//     JWT
//       ↓
//     CurrentIdentity
//       ↓
//     identityPublicId
//       ↓
//     GetJourneysByProviderQuery
//
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/foundation/http/authenticated-api-client';

import type { Journey } from '../models/journey';

// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------

export async function getMyJourneys(): Promise<readonly Journey[]> {
  return authenticatedApiClient.get<readonly Journey[]>(
    '/journeys/me',
  );
}