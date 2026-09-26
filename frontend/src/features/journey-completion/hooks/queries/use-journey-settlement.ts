// -----------------------------------------------------------------------------
// sisiMove — useJourneySettlement
// -----------------------------------------------------------------------------

import { useQuery } from '@tanstack/react-query';

import { getJourneySettlement } from '../../api/settlement/get-journey-settlement.api';
import {
  JourneySettlementMapper,
  type JourneySettlementMapperInput,
} from '../../mappers/journey-settlement.mapper';
import type { JourneySettlement } from '../../models/journey-settlement';
import { journeySettlementKeys } from '../query-keys/journey-settlement.keys';

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

export function useJourneySettlement(
  journeySettlementPublicId: string | undefined,
) {
  return useQuery({
    queryKey: journeySettlementPublicId
      ? journeySettlementKeys.byId(journeySettlementPublicId)
      : journeySettlementKeys.details(),

    queryFn: async (): Promise<JourneySettlement | null> => {
      if (journeySettlementPublicId === undefined) {
        return null;
      }

      const response = await getJourneySettlement(
        journeySettlementPublicId,
      );

      return response === null
        ? null
        : JourneySettlementMapper.fromResponse(
            response as JourneySettlementMapperInput,
          );
    },

    enabled:
      journeySettlementPublicId !== undefined &&
      journeySettlementPublicId.length > 0,
  });
}

export default useJourneySettlement;