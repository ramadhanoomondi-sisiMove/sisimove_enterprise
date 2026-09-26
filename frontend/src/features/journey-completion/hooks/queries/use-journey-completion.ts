// -----------------------------------------------------------------------------
// sisiMove — useJourneyCompletion
// -----------------------------------------------------------------------------
//
// TanStack Query hook for retrieving one Journey Completion by public ID.
//
// Responsibilities:
// - execute the Journey Completion discovery API;
// - map the transport response into the frontend JourneyCompletion model;
// - provide TanStack Query loading/error/cache state.
//
// Non-responsibilities:
// - authentication;
// - authorization;
// - lifecycle transitions;
// - cache mutation.
// -----------------------------------------------------------------------------

import { useQuery } from '@tanstack/react-query';

import { getJourneyCompletion } from '../../api/discovery/get-journey-completion.api';
import {
  JourneyCompletionMapper,
  type JourneyCompletionMapperInput,
} from '../../mappers/journey-completion.mapper';
import type { JourneyCompletion } from '../../models/journey-completion';
import { journeyCompletionKeys } from '../query-keys/journey-completion.keys';

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

export function useJourneyCompletion(
  journeyCompletionPublicId: string | undefined,
) {
  return useQuery({
    queryKey: journeyCompletionPublicId
      ? journeyCompletionKeys.byId(journeyCompletionPublicId)
      : journeyCompletionKeys.details(),

    queryFn: async (): Promise<JourneyCompletion | null> => {
      if (journeyCompletionPublicId === undefined) {
        return null;
      }

      const response = await getJourneyCompletion(
        journeyCompletionPublicId,
      );

      return response === null
        ? null
        : JourneyCompletionMapper.fromResponse(
            response as JourneyCompletionMapperInput,
          );
    },

    enabled:
      journeyCompletionPublicId !== undefined &&
      journeyCompletionPublicId.length > 0,
  });
}

export default useJourneyCompletion;