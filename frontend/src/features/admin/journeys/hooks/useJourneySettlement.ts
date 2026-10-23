'use client';

import { useQuery } from '@tanstack/react-query';

import { journeySettlementsApi } from '@/features/admin/journeys/api/journey-settlements.api';
import { JourneySettlementResponseMapper } from '@/features/admin/journeys/mappers/journey-settlement.mapper';

export const journeySettlementsByJourneyQueryKeys = {
  all: ['journey-settlements'] as const,
  byJourney: (journeyPublicId: string) =>
    [...journeySettlementsByJourneyQueryKeys.all, 'journey', journeyPublicId] as const,
};

/**
 * Fetch every settlement associated with one journey.
 *
 * This is intentionally separate from useJourneySettlement(completionPublicId)
 * so existing completion-scoped consumers keep their current contract.
 */
export function useJourneySettlementsByJourney(
  journeyPublicId: string | undefined,
) {
  const normalizedJourneyPublicId = journeyPublicId?.trim() ?? '';

  return useQuery({
    queryKey: journeySettlementsByJourneyQueryKeys.byJourney(
      normalizedJourneyPublicId,
    ),
    queryFn: async () => {
      const responses = await journeySettlementsApi.list({
        journeyPublicId: normalizedJourneyPublicId,
      });

      return JourneySettlementResponseMapper.toModels(responses);
    },
    enabled: normalizedJourneyPublicId.length > 0,
    staleTime: 30_000,
  });
}

export default useJourneySettlementsByJourney;
