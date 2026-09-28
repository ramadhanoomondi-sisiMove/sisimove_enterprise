'use client';

// -----------------------------------------------------------------------------
// sisiMove — Withdraw Journey Demand Participant Mutation Hook
// -----------------------------------------------------------------------------

import { useCallback, useState } from 'react';

import { withdrawJourneyDemandParticipant } from '../../api/participants/withdraw-journey-demand-participant.api';

type WithdrawJourneyDemandParticipantRequest =
  Parameters<typeof withdrawJourneyDemandParticipant>[2];

export interface UseWithdrawJourneyDemandParticipantResult {
  readonly isLoading: boolean;
  readonly error: Error | null;

  readonly withdrawJourneyDemandParticipant: (
    journeyDemandPublicId: string,
    participantPublicId: string,
    request: WithdrawJourneyDemandParticipantRequest,
  ) => Promise<void>;
}

export function useWithdrawJourneyDemandParticipant(): UseWithdrawJourneyDemandParticipantResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async (
      journeyDemandPublicId: string,
      participantPublicId: string,
      request: WithdrawJourneyDemandParticipantRequest,
    ): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        await withdrawJourneyDemandParticipant(
          journeyDemandPublicId,
          participantPublicId,
          request,
        );
      } catch (cause) {
        const normalizedError =
          cause instanceof Error
            ? cause
            : new Error(
                'Unable to withdraw the Journey Demand participant.',
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
    withdrawJourneyDemandParticipant: execute,
  };
}