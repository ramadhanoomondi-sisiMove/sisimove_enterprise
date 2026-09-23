// -----------------------------------------------------------------------------
// sisiMove — useMyJourneys
// -----------------------------------------------------------------------------
//
// Loads journeys belonging to the currently authenticated provider/member.
//
// Authentication is handled by authenticatedApiClient. The hook therefore
// does not accept an identity or provider public ID.
// -----------------------------------------------------------------------------

import { useQuery } from '@tanstack/react-query';

import { getMyJourneys } from '../api';
import type { Journey } from '../models/journey';

// -----------------------------------------------------------------------------
// Query Key
// -----------------------------------------------------------------------------

export const myJourneysQueryKey = [
  'journeys',
  'me',
] as const;

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

export function useMyJourneys() {
  return useQuery<readonly Journey[]>({
    queryKey: myJourneysQueryKey,
    queryFn: getMyJourneys,
  });
}