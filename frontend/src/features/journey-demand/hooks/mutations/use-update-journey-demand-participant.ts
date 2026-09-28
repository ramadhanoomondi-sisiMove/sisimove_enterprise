'use client';

// -----------------------------------------------------------------------------
// sisiMove — Update Journey Demand Participant Mutation Hook
// -----------------------------------------------------------------------------

import { useCallback, useState } from 'react';

import { updateJourneyDemandParticipant } from '../../api/participants/update-journey-demand-participant.api';

type UpdateJourneyDemandParticipantRequest =
  Parameters<typeof updateJourneyDemandParticipant>[2];

export interface UseUpdateJourneyDemandParticipantResult {
  readonly isLoading: boolean;
  readonly error: Error | null;

  readonly updateJourneyDemandParticipant: (
    journeyDemandPublicId: string,
    participantPublicId: string,
    request: UpdateJourneyDemandParticipantRequest,
  ) => Promise<void>;
}

export function useUpdateJourneyDemandParticipant(): UseUpdateJourneyDemandParticipantResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async (
      journeyDemandPublicId: string,
      participantPublicId: string,
      request: UpdateJourneyDemandParticipantRequest,
    ): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        await updateJourneyDemandParticipant(
          journeyDemandPublicId,
          participantPublicId,
          request,
        );
      } catch (cause) {
        const normalizedError =
          cause instanceof Error
            ? cause
            : new Error(
                'Unable to update the Journey Demand participant.',
              );

        setError(normalizedError);
        throw normalizedError;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return {
    isLoading,
    error,
    updateJourneyDemandParticipant: execute,
  };
}