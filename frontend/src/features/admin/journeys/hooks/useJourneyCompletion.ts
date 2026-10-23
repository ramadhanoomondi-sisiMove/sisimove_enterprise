'use client';

import { useQuery } from '@tanstack/react-query';

import { journeyCompletionsApi } from '../api/journey-completions.api';
import { JourneyCompletionResponseMapper } from '../mappers/journey-completion.mapper';

export const journeyCompletionQueryKeys = {
  all: ['journey-completions'] as const,
  details: () => [...journeyCompletionQueryKeys.all, 'detail'] as const,
  byJourney: (journeyPublicId: string) =>
    [...journeyCompletionQueryKeys.details(), 'journey', journeyPublicId] as const,
};

export function useJourneyCompletion(journeyPublicId: string | undefined) {
  const normalizedJourneyPublicId = journeyPublicId?.trim() ?? '';

  return useQuery({
    queryKey: journeyCompletionQueryKeys.byJourney(normalizedJourneyPublicId),
    queryFn: async () => {
      const response = await journeyCompletionsApi.getByJourney(
        normalizedJourneyPublicId,
      );

      return response == null
        ? null
        : JourneyCompletionResponseMapper.toModel(response);
    },
    enabled: normalizedJourneyPublicId.length > 0,
    staleTime: 30_000,
  });
}

export default useJourneyCompletion;
