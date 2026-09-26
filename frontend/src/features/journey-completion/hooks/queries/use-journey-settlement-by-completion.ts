// -----------------------------------------------------------------------------
// sisiMove — useJourneySettlementByCompletion
// -----------------------------------------------------------------------------
//
// Reads the settlement associated with a Journey Completion.
//
// Settlement remains a separate backend aggregate. This hook therefore
// observes settlement state rather than deriving it from Journey Completion.
// -----------------------------------------------------------------------------

import { useQuery } from '@tanstack/react-query';

import { getJourneySettlementByCompletion } from '../../api/settlement/get-journey-settlement-by-completion.api';
import {
  JourneySettlementMapper,
  type JourneySettlementMapperInput,
} from '../../mappers/journey-settlement.mapper';
import type { JourneySettlement } from '../../models/journey-settlement';
import { journeySettlementKeys } from '../query-keys/journey-settlement.keys';

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

export function useJourneySettlementByCompletion(
  completionPublicId: string | undefined,
) {
  return useQuery({
    queryKey: completionPublicId
      ? journeySettlementKeys.byCompletion(completionPublicId)
      : journeySettlementKeys.lists(),

    queryFn: async (): Promise<JourneySettlement | null> => {
      if (completionPublicId === undefined) {
        return null;
      }

      const response = await getJourneySettlementByCompletion({
        completionPublicId,
      });

      return response === null
        ? null
        : JourneySettlementMapper.fromResponse(
            response as JourneySettlementMapperInput,
          );
    },

    enabled:
      completionPublicId !== undefined &&
      completionPublicId.length > 0,
  });
}

export default useJourneySettlementByCompletion;