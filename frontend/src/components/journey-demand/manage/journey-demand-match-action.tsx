// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Match Action
// -----------------------------------------------------------------------------
//
// Self-contained match action for an authenticated Journey Demand.
//
// Architecture:
// - owns the match mutation;
// - owns mutation loading/error state;
// - performs the match API request through the mutation hook;
// - does not perform authorization checks;
// - does not inspect Journey Demand lifecycle state;
// - does not determine whether matching is allowed;
// - does not select or construct a Journey;
// - parent/container supplies the publicId and request;
// - parent/container remains responsible for capability/visibility decisions;
// - parent/container may refresh the authoritative Journey Demand projection
//   through onSuccess.
//
// Matching is a backend-owned lifecycle operation. This component only
// provides the user-facing action that invokes the mutation.
//
// -----------------------------------------------------------------------------

'use client';

import { Button } from '@/components/ui';

import { useMatchJourneyDemand } from '@/features/journey-demand/hooks';
import type { MatchJourneyDemandRequest } from '@/features/journey-demand/api/journey-demands/match-journey-demand.api';

export interface JourneyDemandMatchActionProps {
  readonly journeyDemandPublicId: string;
  readonly request: MatchJourneyDemandRequest;
  readonly onSuccess?: () => void | Promise<void>;
  readonly disabled?: boolean;
}

export function JourneyDemandMatchAction({
  journeyDemandPublicId,
  request,
  onSuccess,
  disabled = false,
}: JourneyDemandMatchActionProps) {
  const { isLoading, error, matchJourneyDemand } =
    useMatchJourneyDemand();

  const handleMatch = async (): Promise<void> => {
    try {
      await matchJourneyDemand(journeyDemandPublicId, request);
      await onSuccess?.();
    } catch {
      // The mutation hook owns and exposes the normalized error state.
      // The action intentionally does not transform the mutation error.
    }
  };

  return (
    <Button
      type="button"
      variant="secondary"
      size="md"
      onClick={handleMatch}
      loading={isLoading}
      disabled={disabled || isLoading}
      aria-disabled={disabled || isLoading}
      title={error?.message}
    >
      Match demand
    </Button>
  );
}
