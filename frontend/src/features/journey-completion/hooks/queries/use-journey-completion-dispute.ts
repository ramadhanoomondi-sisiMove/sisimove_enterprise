// -----------------------------------------------------------------------------
// sisiMove — useJourneyCompletionDispute
// -----------------------------------------------------------------------------

import { useQuery } from '@tanstack/react-query';

import { getJourneyCompletionDispute } from '../../api/disputes/get-journey-completion-dispute.api';
import {
  JourneyCompletionDisputeMapper,
  type JourneyCompletionDisputeMapperInput,
} from '../../mappers/journey-completion-dispute.mapper';
import type { JourneyCompletionDispute } from '../../models/journey-completion-dispute';
import { journeyCompletionKeys } from '../query-keys/journey-completion.keys';

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

export function useJourneyCompletionDispute(
  journeyCompletionPublicId: string | undefined,
  disputePublicId: string | undefined,
) {
  return useQuery({
    queryKey:
      journeyCompletionPublicId !== undefined &&
      disputePublicId !== undefined
        ? journeyCompletionKeys.dispute(
            journeyCompletionPublicId,
            disputePublicId,
          )
        : journeyCompletionKeys.disputes(),

    queryFn: async (): Promise<JourneyCompletionDispute | null> => {
      if (
        journeyCompletionPublicId === undefined ||
        disputePublicId === undefined
      ) {
        return null;
      }

      const response = await getJourneyCompletionDispute(
        journeyCompletionPublicId,
        disputePublicId,
      );

      return response === null
        ? null
        : JourneyCompletionDisputeMapper.fromResponse(
            response as JourneyCompletionDisputeMapperInput,
          );
    },

    enabled:
      journeyCompletionPublicId !== undefined &&
      journeyCompletionPublicId.length > 0 &&
      disputePublicId !== undefined &&
      disputePublicId.length > 0,
  });
}

export default useJourneyCompletionDispute;