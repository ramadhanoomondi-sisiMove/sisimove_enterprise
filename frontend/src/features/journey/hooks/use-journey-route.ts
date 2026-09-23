// -----------------------------------------------------------------------------
// sisiMove — useJourneyRoute
// -----------------------------------------------------------------------------
//
// Loads the controlled route/corridor attached to a Journey.
//
// Corridors and waypoints are sisiMove-controlled catalogue data. This hook
// therefore reads the persisted Journey route; it does not create geographic
// route data.
// -----------------------------------------------------------------------------

import { useQuery } from '@tanstack/react-query';

import { getJourneyCorridor } from '../api';
import type { JourneyCorridor } from '../models/journey-corridor';

// -----------------------------------------------------------------------------
// Query Key
// -----------------------------------------------------------------------------

export const journeyRouteQueryKeys = {
  detail: (journeyPublicId: string) =>
    ['journeys', 'route', journeyPublicId] as const,
};

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

export function useJourneyRoute(
  journeyPublicId: string | null | undefined,
) {
  return useQuery<JourneyCorridor | null>({
    queryKey: journeyPublicId
      ? journeyRouteQueryKeys.detail(journeyPublicId)
      : journeyRouteQueryKeys.detail(''),

    queryFn: () => getJourneyCorridor(journeyPublicId!),

    enabled: Boolean(journeyPublicId),
  });
}