// -----------------------------------------------------------------------------
// sisiMove — useJourneyCompletionConfirmations
// -----------------------------------------------------------------------------

import { useQuery } from '@tanstack/react-query';

import { getJourneyCompletionConfirmations } from '../../api/confirmations/get-journey-completion-confirmations.api';
import {
  JourneyCompletionConfirmationMapper,
  type JourneyCompletionConfirmationMapperInput,
} from '../../mappers/journey-completion-confirmation.mapper';
import type { JourneyCompletionConfirmation } from '../../models/journey-completion-confirmation';
import { journeyCompletionKeys } from '../query-keys/journey-completion.keys';

// -----------------------------------------------------------------------------
// Query Options
// -----------------------------------------------------------------------------

export interface UseJourneyCompletionConfirmationsOptions {
  memberPublicId?: string;
  bookingPublicId?: string;
  role?: string;
  status?: string;
}

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

export function useJourneyCompletionConfirmations(
  journeyCompletionPublicId: string | undefined,
  options: UseJourneyCompletionConfirmationsOptions = {},
) {
  return useQuery({
    queryKey: journeyCompletionPublicId
      ? journeyCompletionKeys.confirmationList(
          journeyCompletionPublicId,
          options,
        )
      : journeyCompletionKeys.confirmations(),

    queryFn: async (): Promise<JourneyCompletionConfirmation[]> => {
      if (journeyCompletionPublicId === undefined) {
        return [];
      }

      const responses = await getJourneyCompletionConfirmations(
        journeyCompletionPublicId,
        options,
      );

      return JourneyCompletionConfirmationMapper.fromResponses(
        responses as JourneyCompletionConfirmationMapperInput[],
      );
    },

    enabled:
      journeyCompletionPublicId !== undefined &&
      journeyCompletionPublicId.length > 0,
  });
}

export default useJourneyCompletionConfirmations;