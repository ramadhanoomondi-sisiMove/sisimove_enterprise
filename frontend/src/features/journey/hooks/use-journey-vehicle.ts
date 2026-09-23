// -----------------------------------------------------------------------------
// sisiMove — useJourneyVehicle
// -----------------------------------------------------------------------------

import { useQuery } from '@tanstack/react-query';

import { getJourneyVehicle } from '../api';
import type { JourneyVehicle } from '../models/journey-vehicle';

// -----------------------------------------------------------------------------
// Query Key
// -----------------------------------------------------------------------------

export const journeyVehicleQueryKeys = {
  detail: (journeyPublicId: string) =>
    ['journeys', 'vehicle', journeyPublicId] as const,
};

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

export function useJourneyVehicle(
  journeyPublicId: string | null | undefined,
) {
  return useQuery<JourneyVehicle | null>({
    queryKey: journeyPublicId
      ? journeyVehicleQueryKeys.detail(journeyPublicId)
      : journeyVehicleQueryKeys.detail(''),

    queryFn: () => getJourneyVehicle(journeyPublicId!),

    enabled: Boolean(journeyPublicId),
  });
}