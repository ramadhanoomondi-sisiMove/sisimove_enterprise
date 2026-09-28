// -----------------------------------------------------------------------------
// sisiMove — Use Attach Journey Pricing
// -----------------------------------------------------------------------------

"use client";

import { useCallback, useState } from "react";

import {
  attachJourneyPricing,
  type AttachJourneyPricingRequest,
} from "../../api/pricing/attach-journey-pricing";

export interface UseAttachJourneyPricingResult {
  readonly attach: (
    journeyPublicId: string,
    request: AttachJourneyPricingRequest,
  ) => Promise<void>;
  readonly isPending: boolean;
  readonly error: Error | null;
}

export function useAttachJourneyPricing(): UseAttachJourneyPricingResult {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const attach = useCallback(
    async (
      journeyPublicId: string,
      request: AttachJourneyPricingRequest,
    ): Promise<void> => {
      setIsPending(true);
      setError(null);

      try {
        await attachJourneyPricing(journeyPublicId, request);
      } catch (cause) {
        const nextError =
          cause instanceof Error
            ? cause
            : new Error("Failed to attach the journey pricing.");

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