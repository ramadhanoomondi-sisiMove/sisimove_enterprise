// -----------------------------------------------------------------------------
// sisiMove — Get Journey Query Hook
// -----------------------------------------------------------------------------
//
// React Query hook for retrieving one publicly discoverable Journey.
//
// Backend endpoint:
//
//     GET /journeys/:journeyPublicId
//
// The backend implements this through GetPublicJourneysQuery with a publicId
// filter, so this hook belongs to Journey public discovery rather than
// authenticated Journey management.
//
// Architectural boundary:
// - Calls the Journey discovery API adapter.
// - Manages server state through React Query.
// - Returns the frontend Journey model.
// - Does NOT construct API URLs.
// - Does NOT perform lifecycle mutations.
// - Does NOT make authorization decisions.
// - Does NOT contain UI presentation logic.
//
// -----------------------------------------------------------------------------

import { useQuery } from '@tanstack/react-query';

import type { Journey } from '@/features/journey/models/journey';

import { getJourney } from '@/features/journey/api/discovery/get-journey.api';

// -----------------------------------------------------------------------------
// Query key
// -----------------------------------------------------------------------------

export const JOURNEY_QUERY_KEY = (
  journeyPublicId: string,
) => ['journey', journeyPublicId] as const;

// -----------------------------------------------------------------------------
// Options
// -----------------------------------------------------------------------------

export interface UseJourneyOptions {
  journeyPublicId: string;
  enabled?: boolean;
}

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

export function useJourney({
  journeyPublicId,
  enabled = true,
}: UseJourneyOptions) {
  return useQuery<Journey | null>({
    queryKey: JOURNEY_QUERY_KEY(journeyPublicId),
    queryFn: () => getJourney(journeyPublicId),
    enabled:
      enabled &&
      journeyPublicId.trim().length > 0,
  });
}