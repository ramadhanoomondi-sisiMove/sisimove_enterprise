// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Participants Hook
// -----------------------------------------------------------------------------

import { useQuery } from '@tanstack/react-query';

import {
  getJourneyDemandParticipants,
} from '../api/participants/get-journey-demand-participants.api';

import type {
  JourneyDemandParticipant,
} from '../models';

export const JOURNEY_DEMAND_PARTICIPANTS_QUERY_KEY = [
  'journey-demand-participants',
] as const;

export function useJourneyDemandParticipants(
  journeyDemandPublicId?: string,
) {
  return useQuery<JourneyDemandParticipant[]>({
    queryKey: [
      ...JOURNEY_DEMAND_PARTICIPANTS_QUERY_KEY,
      journeyDemandPublicId,
    ],
    queryFn: () =>
      getJourneyDemandParticipants(
        journeyDemandPublicId!,
      ),
    enabled: Boolean(journeyDemandPublicId),
  });
}