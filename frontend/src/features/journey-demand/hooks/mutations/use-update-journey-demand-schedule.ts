'use client';

// -----------------------------------------------------------------------------
// sisiMove — Update Journey Demand Schedule Mutation Hook
// -----------------------------------------------------------------------------

import { useCallback, useState } from 'react';

import { updateJourneyDemandSchedule } from '../../api/schedule/update-journey-demand-schedule.api';

type UpdateJourneyDemandScheduleRequest =
  Parameters<typeof updateJourneyDemandSchedule>[1];

export interface UseUpdateJourneyDemandScheduleResult {
  readonly isLoading: boolean;
  readonly error: Error | null;

  readonly updateJourneyDemandSchedule: (
    journeyDemandPublicId: string,
    request: UpdateJourneyDemandScheduleRequest,
  ) => Promise<void>;
}

export function useUpdateJourneyDemandSchedule(): UseUpdateJourneyDemandScheduleResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async (
      journeyDemandPublicId: string,
      request: UpdateJourneyDemandScheduleRequest,
    ): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        await updateJourneyDemandSchedule(journeyDemandPublicId, request);
      } catch (cause) {
        const normalizedError =
          cause instanceof Error
            ? cause
            : new Error(
                'Unable to update the Journey Demand schedule.',
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
    updateJourneyDemandSchedule: execute,
  };
}