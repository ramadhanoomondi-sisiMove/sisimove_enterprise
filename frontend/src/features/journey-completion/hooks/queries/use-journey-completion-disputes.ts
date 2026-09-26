// -----------------------------------------------------------------------------
// sisiMove — useJourneyCompletionDisputes
// -----------------------------------------------------------------------------

import { useQuery } from '@tanstack/react-query';

import { getJourneyCompletionDisputes } from '../../api/disputes/get-journey-completion-disputes.api';
import {
  JourneyCompletionDisputeMapper,
  type JourneyCompletionDisputeMapperInput,
} from '../../mappers/journey-completion-dispute.mapper';
import type { JourneyCompletionDispute } from '../../models/journey-completion-dispute';
import { journeyCompletionKeys } from '../query-keys/journey-completion.keys';

// -----------------------------------------------------------------------------
// Query Options
// -----------------------------------------------------------------------------

export interface UseJourneyCompletionDisputesOptions {
  raisedByPublicId?: string;
  status?: string;
  reason?: string;
}

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

export function useJourneyCompletionDisputes(
  journeyCompletionPublicId: string | undefined,
  options: UseJourneyCompletionDisputesOptions = {},
) {
  return useQuery({
    queryKey: journeyCompletionPublicId
      ? journeyCompletionKeys.disputeList(
          journeyCompletionPublicId,
          options,
        )
      : journeyCompletionKeys.disputes(),

    queryFn: async (): Promise<JourneyCompletionDispute[]> => {
      if (journeyCompletionPublicId === undefined) {
        return [];
      }

      const responses = await getJourneyCompletionDisputes(
        journeyCompletionPublicId,
        options,
      );

      return JourneyCompletionDisputeMapper.fromResponses(
        responses as JourneyCompletionDisputeMapperInput[],
      );
    },

    enabled:
      journeyCompletionPublicId !== undefined &&
      journeyCompletionPublicId.length > 0,
  });
}

export default useJourneyCompletionDisputes;