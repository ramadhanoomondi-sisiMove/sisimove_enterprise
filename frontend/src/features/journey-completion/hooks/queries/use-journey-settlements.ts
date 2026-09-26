// -----------------------------------------------------------------------------
// sisiMove — useJourneySettlements
// -----------------------------------------------------------------------------
//
// Lists Journey Settlement root entities.
//
// The backend list endpoint returns JourneySettlementEntity[] and therefore
// does not provide aggregate-specific nested data.
// -----------------------------------------------------------------------------

import { useQuery } from '@tanstack/react-query';

import { listJourneySettlements } from '../../api/settlement/list-journey-settlements.api';
import {
  JourneySettlementMapper,
  type JourneySettlementMapperInput,
} from '../../mappers/journey-settlement.mapper';
import type { JourneySettlement } from '../../models/journey-settlement';
import { journeySettlementKeys } from '../query-keys/journey-settlement.keys';

// -----------------------------------------------------------------------------
// Query Options
// -----------------------------------------------------------------------------

export interface UseJourneySettlementsOptions {
  journeyPublicId?: string;
  providerPublicId?: string;
  status?: string;
}

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

export function useJourneySettlements(
  options: UseJourneySettlementsOptions = {},
) {
  return useQuery({
    queryKey: journeySettlementKeys.list(options),

    queryFn: async (): Promise<JourneySettlement[]> => {
      const responses = await listJourneySettlements({
        journeyPublicId: options.journeyPublicId,
        providerPublicId: options.providerPublicId,
        status: options.status,
      });

      return JourneySettlementMapper.fromResponses(
        responses as JourneySettlementMapperInput[],
      );
    },
  });
}

export default useJourneySettlements;