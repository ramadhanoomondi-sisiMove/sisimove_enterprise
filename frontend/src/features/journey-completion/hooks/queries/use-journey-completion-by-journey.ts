// -----------------------------------------------------------------------------
// sisiMove — useJourneyCompletionByJourney
// -----------------------------------------------------------------------------

import { useQuery } from '@tanstack/react-query';

import { getJourneyCompletionByJourney } from '../../api/discovery/get-journey-completion-by-journey.api';
import {
  JourneyCompletionMapper,
  type JourneyCompletionMapperInput,
} from '../../mappers/journey-completion.mapper';
import type { JourneyCompletion } from '../../models/journey-completion';
import { journeyCompletionKeys } from '../query-keys/journey-completion.keys';

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

export function useJourneyCompletionByJourney(
  journeyPublicId: string | undefined,
) {
  return useQuery({
    queryKey: journeyPublicId
      ? journeyCompletionKeys.byJourney(journeyPublicId)
      : journeyCompletionKeys.details(),

    queryFn: async (): Promise<JourneyCompletion | null> => {
      if (journeyPublicId === undefined) {
        return null;
      }

      const response = await getJourneyCompletionByJourney(journeyPublicId);

      return response === null
        ? null
        : JourneyCompletionMapper.fromResponse(
            response as JourneyCompletionMapperInput,
          );
    },

    enabled:
      journeyPublicId !== undefined &&
      journeyPublicId.length > 0,
  });
}

export default useJourneyCompletionByJourney;