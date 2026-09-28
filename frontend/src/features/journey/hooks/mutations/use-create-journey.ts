// -----------------------------------------------------------------------------
// sisiMove — Use Create Journey
// -----------------------------------------------------------------------------
//
// Creates a new Journey draft.
//
// The backend creates and owns the Journey aggregate. The frontend does not
// construct a Journey entity or generate its public ID.
//
// The current HTTP endpoint returns the aggregate directly, but its serialized
// response contract is intentionally not assumed here. The API adapter
// therefore exposes the result as unknown.
//
// -----------------------------------------------------------------------------

"use client";

import { useCallback, useState } from "react";

import { createJourney } from "../../api/journeys/create-journey";

export interface UseCreateJourneyResult {
  readonly create: () => Promise<unknown>;
  readonly isPending: boolean;
  readonly error: Error | null;
}

export function useCreateJourney(): UseCreateJourneyResult {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const create = useCallback(async (): Promise<unknown> => {
    setIsPending(true);
    setError(null);

    try {
      return await createJourney();
    } catch (cause) {
      const nextError =
        cause instanceof Error
          ? cause
          : new Error("Failed to create the journey.");

      setError(nextError);
      throw nextError;
    } finally {
      setIsPending(false);
    }
  }, []);

  return {
    create,
    isPending,
    error,
  };
}