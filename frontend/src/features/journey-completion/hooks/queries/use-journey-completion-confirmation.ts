// -----------------------------------------------------------------------------
// sisiMove — useJourneyCompletionConfirmation
// -----------------------------------------------------------------------------

import { useQuery } from '@tanstack/react-query';

import { getJourneyCompletionConfirmation } from '../../api/confirmations/get-journey-completion-confirmation.api';
import {
  JourneyCompletionConfirmationMapper,
  type JourneyCompletionConfirmationMapperInput,
} from '../../mappers/journey-completion-confirmation.mapper';
import type { JourneyCompletionConfirmation } from '../../models/journey-completion-confirmation';
import { journeyCompletionKeys } from '../query-keys/journey-completion.keys';

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

export function useJourneyCompletionConfirmation(
  journeyCompletionPublicId: string | undefined,
  confirmationPublicId: string | undefined,
) {
  return useQuery({
    queryKey:
      journeyCompletionPublicId !== undefined &&
      confirmationPublicId !== undefined
        ? journeyCompletionKeys.confirmation(
            journeyCompletionPublicId,
            confirmationPublicId,
          )
        : journeyCompletionKeys.confirmations(),

    queryFn: async (): Promise<JourneyCompletionConfirmation | null> => {
      if (
        journeyCompletionPublicId === undefined ||
        confirmationPublicId === undefined
      ) {
        return null;
      }

      const response = await getJourneyCompletionConfirmation(
        journeyCompletionPublicId,
        confirmationPublicId,
      );

      return response === null
        ? null
        : JourneyCompletionConfirmationMapper.fromResponse(
            response as JourneyCompletionConfirmationMapperInput,
          );
    },

    enabled:
      journeyCompletionPublicId !== undefined &&
      journeyCompletionPublicId.length > 0 &&
      confirmationPublicId !== undefined &&
      confirmationPublicId.length > 0,
  });
}

export default useJourneyCompletionConfirmation;