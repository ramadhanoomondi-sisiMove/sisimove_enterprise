'use client';

// -----------------------------------------------------------------------------
// sisiMove — Remove Journey Demand Participant Mutation Hook
// -----------------------------------------------------------------------------

import { useCallback, useState } from 'react';

import { removeJourneyDemandParticipant } from '../../api/participants/remove-journey-demand-participant.api';

type RemoveJourneyDemandParticipantRequest =
  Parameters<typeof removeJourneyDemandParticipant>[2];

export interface UseRemoveJourneyDemandParticipantResult {
  readonly isLoading: boolean;
  readonly error: Error | null;

  readonly removeJourneyDemandParticipant: (
    journeyDemandPublicId: string,
    participantPublicId: string,
    request: RemoveJourneyDemandParticipantRequest,
  ) => Promise<void>;
}

export function useRemoveJourneyDemandParticipant(): UseRemoveJourneyDemandParticipantResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async (
      journeyDemandPublicId: string,
      participantPublicId: string,
      request: RemoveJourneyDemandParticipantRequest,
    ): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        await removeJourneyDemandParticipant(
          journeyDemandPublicId,
          participantPublicId,
          request,
        );
      } catch (cause) {
        const normalizedError =
          cause instanceof Error
            ? cause
            : new Error(
                'Unable to remove the Journey Demand participant.',
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
    removeJourneyDemandParticipant: execute,
  };
}