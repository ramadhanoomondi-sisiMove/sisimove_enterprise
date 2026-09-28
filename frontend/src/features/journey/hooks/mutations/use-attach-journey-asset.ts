// -----------------------------------------------------------------------------
// sisiMove — Use Attach Journey Asset
// -----------------------------------------------------------------------------

"use client";

import { useCallback, useState } from "react";

import {
  attachJourneyAsset,
  type AttachJourneyAssetRequest,
} from "../../api/assets/attach-journey-asset";

export interface UseAttachJourneyAssetResult {
  readonly attach: (
    journeyPublicId: string,
    request: AttachJourneyAssetRequest,
  ) => Promise<void>;
  readonly isPending: boolean;
  readonly error: Error | null;
}

export function useAttachJourneyAsset(): UseAttachJourneyAssetResult {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const attach = useCallback(
    async (
      journeyPublicId: string,
      request: AttachJourneyAssetRequest,
    ): Promise<void> => {
      setIsPending(true);
      setError(null);

      try {
        await attachJourneyAsset(journeyPublicId, request);
      } catch (cause) {
        const nextError =
          cause instanceof Error
            ? cause
            : new Error("Failed to attach the journey asset.");

        setError(nextError);
        throw nextError;
      } finally {
        setIsPending(false);
      }
    },
    [],
  );

  return { attach, isPending, error };
}