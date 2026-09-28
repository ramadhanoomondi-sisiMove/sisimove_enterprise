// -----------------------------------------------------------------------------
// sisiMove — Use Remove Journey Pricing
// -----------------------------------------------------------------------------

"use client";

import { useCallback, useState } from "react";

import { removeJourneyPricing } from "../../api/pricing/remove-journey-pricing";

export interface UseRemoveJourneyPricingResult {
  readonly remove: (journeyPublicId: string) => Promise<void>;
  readonly isPending: boolean;
  readonly error: Error | null;
}

export function useRemoveJourneyPricing(): UseRemoveJourneyPricingResult {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const remove = useCallback(async (journeyPublicId: string) => {
    setIsPending(true);
    setError(null);

    try {
      await removeJourneyPricing(journeyPublicId);
    } catch (cause) {
      const nextError =
        cause instanceof Error
          ? cause
          : new Error("Failed to remove the journey pricing.");

      setError(nextError);
      throw nextError;
    } finally {
      setIsPending(false);
    }
  }, []);

  return { remove, isPending, error };
}