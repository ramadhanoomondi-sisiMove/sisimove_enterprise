'use client';

// -----------------------------------------------------------------------------
// sisiMove — Add Journey Demand Participant Mutation Hook
// -----------------------------------------------------------------------------

import { useCallback, useState } from 'react';

import { addJourneyDemandParticipant } from '../../api/participants/add-journey-demand-participant.api';

type AddJourneyDemandParticipantRequest =
  Parameters<typeof addJourneyDemandParticipant>[1];

export interface UseAddJourneyDemandParticipantResult {
  readonly isLoading: boolean;
  readonly error: Error | null;

  readonly addJourneyDemandParticipant: (
    journeyDemandPublicId: string,
    request: AddJourneyDemandParticipantRequest,
  ) => Promise<void>;
}

export function useAddJourneyDemandParticipant(): UseAddJourneyDemandParticipantResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async (
      journeyDemandPublicId: string,
      request: AddJourneyDemandParticipantRequest,
    ): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        await addJourneyDemandParticipant(journeyDemandPublicId, request);
      } catch (cause) {
        const normalizedError =
          cause instanceof Error
            ? cause
            : new Error(
                'Unable to add the Journey Demand participant.',
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
    addJourneyDemandParticipant: execute,
  };
}