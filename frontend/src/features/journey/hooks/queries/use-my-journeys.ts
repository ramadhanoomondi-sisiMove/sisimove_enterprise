// -----------------------------------------------------------------------------
// sisiMove — useMyJourneys
// -----------------------------------------------------------------------------
//
// React Query hook for the authenticated user's Journeys.
//
// API boundary:
//
//     GET /api/v1/journeys/me
//
// The backend derives the provider/member identity from the authenticated
// request context. The frontend therefore does NOT submit providerPublicId.
//
// -----------------------------------------------------------------------------
//
// Read-model boundary
// -----------------------------------------------------------------------------
//
// This hook returns the authenticated Journey management read model:
//
//     MyJourney[]
//
// It must not expose the general `Journey` discovery model. The management
// endpoint has its own presentation/read-model contract.
//
// The conversion from API transport data to MyJourney is performed by
// `mapMyJourneys()`.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Execute the authenticated My Journeys API.
// - Map API transport responses into MyJourney.
// - Manage request state and caching through React Query.
//
// Non-responsibilities:
// - Accept providerPublicId.
// - Determine ownership.
// - Resolve Traveller Profile or Trust Profile.
// - Perform lifecycle mutations.
// - Format data for a specific UI component.
// -----------------------------------------------------------------------------

import { useQuery } from '@tanstack/react-query';

import { getMyJourneys } from '../../api/management';

import {
  mapMyJourneys,
  type MyJourneyApiResponse,
} from '../../mappers';

import type { MyJourney } from '@/features/journeys/models';

// -----------------------------------------------------------------------------
// Query Key
// -----------------------------------------------------------------------------

/**
 * Stable query-key namespace for the authenticated user's Journeys.
 *
 * The authenticated identity is intentionally not included because ownership
 * is derived by the backend from the authenticated session.
 */
export const MY_JOURNEYS_QUERY_KEY = [
  'journeys',
  'me',
] as const;

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

/**
 * Fetches the Journeys belonging to the currently authenticated user.
 *
 * The query must return MyJourney[], because this is an authenticated
 * management read model rather than the general Journey discovery model.
 */
export function useMyJourneys() {
  return useQuery<MyJourney[], Error>({
    queryKey: MY_JOURNEYS_QUERY_KEY,

    queryFn: async (): Promise<MyJourney[]> => {
      const response = await getMyJourneys();

      const apiJourneys =
        response as MyJourneyApiResponse[];

      return mapMyJourneys(
        apiJourneys,
      ) as MyJourney[];
    },
  });
}