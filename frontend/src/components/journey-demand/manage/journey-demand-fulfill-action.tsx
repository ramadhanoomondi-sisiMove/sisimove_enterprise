'use client';

// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Fulfill Action
// -----------------------------------------------------------------------------
//
// Self-contained fulfillment action for an authenticated Journey Demand.
//
// Architecture:
// - owns the fulfillment mutation;
// - owns mutation loading/error state;
// - performs the fulfillment API request through the mutation hook;
// - does not perform authorization checks;
// - does not inspect Journey Demand lifecycle state;
// - does not determine whether fulfillment is allowed;
// - does not decide whether the demand is actually fulfilled;
// - parent/container supplies the publicId and request;
// - parent/container remains responsible for capability/visibility decisions;
// - parent/container may refresh the authoritative Journey Demand projection
//   through onSuccess.
//
// Fulfillment semantics remain owned by the backend aggregate/application
// boundary. This component owns only the user-facing mutation interaction.
//
// -----------------------------------------------------------------------------

import { Button } from '@/components/ui';

import type { FulfillJourneyDemandRequest } from '@/features/journey-demand/api/journey-demands/fulfill-journey-demand.api';
import { useFulfillJourneyDemand } from '@/features/journey-demand/hooks';

export interface JourneyDemandFulfillActionProps {
  readonly journeyDemandPublicId: string;
  readonly request: FulfillJourneyDemandRequest;
  readonly onSuccess?: () => void | Promise<void>;
  readonly disabled?: boolean;
}

export function JourneyDemandFulfillAction({
  journeyDemandPublicId,
  request,
  onSuccess,
  disabled = false,
}: JourneyDemandFulfillActionProps) {
  const { isLoading, error, fulfillJourneyDemand } =
    useFulfillJourneyDemand();

  const handleFulfill = async (): Promise<void> => {
    try {
      await fulfillJourneyDemand(journeyDemandPublicId, request);
      await onSuccess?.();
    } catch {
      // The mutation hook owns and exposes the normalized error state.
      // The action intentionally does not transform the mutation error.
    }
  };

  return (
    <Button
      type="button"
      variant="primary"
      size="md"
      onClick={handleFulfill}
      loading={isLoading}
      disabled={disabled || isLoading}
      aria-disabled={disabled || isLoading}
      title={error?.message}
    >
      Fulfill demand
    </Button>
  );
}
