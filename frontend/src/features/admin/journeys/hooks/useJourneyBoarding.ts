
'use client';

import { useQuery } from '@tanstack/react-query';

import { journeyBoardingsApi } from '../api/journey-boardings.api';
import { JourneyBoardingResponseMapper } from '../mappers/journey-boarding.mapper';

export const journeyBoardingQueryKeys = {
  all: ['journey-boardings'] as const,

  details: () => [...journeyBoardingQueryKeys.all, 'detail'] as const,

  byJourney: (journeyPublicId: string) =>
    [...journeyBoardingQueryKeys.details(), 'journey', journeyPublicId] as const,
};

export function useJourneyBoarding(
  journeyPublicId: string | undefined,
) {
  const normalizedJourneyPublicId = journeyPublicId?.trim() ?? '';

  return useQuery({
    queryKey: journeyBoardingQueryKeys.byJourney(
      normalizedJourneyPublicId,
    ),

    queryFn: async () => {
      const response = await journeyBoardingsApi.getByJourney(
        normalizedJourneyPublicId,
      );

      return JourneyBoardingResponseMapper.toModel(
        response,
        normalizedJourneyPublicId,
      );
    },

    enabled: normalizedJourneyPublicId.length > 0,
    staleTime: 30_000,
  });
}

export default useJourneyBoarding;
