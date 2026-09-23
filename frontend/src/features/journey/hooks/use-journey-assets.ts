// -----------------------------------------------------------------------------
// sisiMove — useJourneyAssets
// -----------------------------------------------------------------------------

import { useQuery } from '@tanstack/react-query';

import { getJourneyAssets } from '../api';
import type { JourneyAsset } from '../models/journey-asset';

// -----------------------------------------------------------------------------
// Query Key
// -----------------------------------------------------------------------------

export const journeyAssetsQueryKeys = {
  list: (journeyPublicId: string) =>
    ['journeys', 'assets', journeyPublicId] as const,
};

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

export function useJourneyAssets(
  journeyPublicId: string | null | undefined,
) {
  return useQuery<readonly JourneyAsset[]>({
    queryKey: journeyPublicId
      ? journeyAssetsQueryKeys.list(journeyPublicId)
      : journeyAssetsQueryKeys.list(''),

    queryFn: () => getJourneyAssets(journeyPublicId!),

    enabled: Boolean(journeyPublicId),
  });
}