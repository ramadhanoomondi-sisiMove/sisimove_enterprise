'use client';

// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Convert Action
// -----------------------------------------------------------------------------
//
// Self-contained conversion action for an authenticated Journey Demand.
//
// Architecture:
// - owns the conversion mutation;
// - owns mutation loading/error state;
// - performs the conversion API request through the mutation hook;
// - does not perform authorization checks;
// - does not inspect Journey Demand lifecycle state;
// - does not determine whether conversion is allowed;
// - does not construct or create a Journey;
// - parent/container supplies the publicId and request;
// - parent/container remains responsible for capability/visibility decisions;
// - parent/container may refresh the authoritative Journey Demand projection
//   through onSuccess.
//
// Conversion semantics belong to the backend aggregate/application boundary.
// This component owns only the user-facing mutation interaction.
//
// -----------------------------------------------------------------------------

import { Button } from '@/components/ui';

import type { ConvertJourneyDemandRequest } from '@/features/journey-demand/api/journey-demands/convert-journey-demand.api';
import { useConvertJourneyDemand } from '@/features/journey-demand/hooks';

export interface JourneyDemandConvertActionProps {
  readonly journeyDemandPublicId: string;
  readonly request: ConvertJourneyDemandRequest;
  readonly onSuccess?: () => void | Promise<void>;
  readonly disabled?: boolean;
}

export function JourneyDemandConvertAction({
  journeyDemandPublicId,
  request,
  onSuccess,
  disabled = false,
}: JourneyDemandConvertActionProps) {
  const { isLoading, error, convertJourneyDemand } =
    useConvertJourneyDemand();

  const handleConvert = async (): Promise<void> => {
    try {
      await convertJourneyDemand(journeyDemandPublicId, request);
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
      onClick={handleConvert}
      loading={isLoading}
      disabled={disabled || isLoading}
      aria-disabled={disabled || isLoading}
      title={error?.message}
    >
      Convert demand
    </Button>
  );
}