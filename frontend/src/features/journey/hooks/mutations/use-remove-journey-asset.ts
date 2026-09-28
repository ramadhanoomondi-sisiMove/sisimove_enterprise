// -----------------------------------------------------------------------------
// sisiMove — Use Remove Journey Asset
// -----------------------------------------------------------------------------

"use client";

import { useCallback, useState } from "react";

import { removeJourneyAsset } from "../../api/assets/remove-journey-asset";

export interface UseRemoveJourneyAssetResult {
  readonly remove: (
    journeyPublicId: string,
    assetPublicId: string,
  ) => Promise<void>;
  readonly isPending: boolean;
  readonly error: Error | null;
}

export function useRemoveJourneyAsset(): UseRemoveJourneyAssetResult {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const remove = useCallback(
    async (
      journeyPublicId: string,
      assetPublicId: string,
    ): Promise<void> => {
      setIsPending(true);
      setError(null);

      try {
        await removeJourneyAsset(journeyPublicId, assetPublicId);
      } catch (cause) {
        const nextError =
          cause instanceof Error
            ? cause
            : new Error("Failed to remove the journey asset.");

        setError(nextError);
        throw nextError;
      } finally {
        setIsPending(false);
      }
    },
    [],
  );

  return { remove, isPending, error };
}