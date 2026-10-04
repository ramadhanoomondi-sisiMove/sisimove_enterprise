// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Publish Action
// -----------------------------------------------------------------------------
//
// Self-contained publish action for an authenticated Journey Demand.
//
// Architecture:
// - owns the publish mutation;
// - owns mutation loading/error state;
// - performs the publish API request through the mutation hook;
// - does not perform authorization checks;
// - does not inspect Journey Demand lifecycle state;
// - does not derive whether publishing is allowed;
// - parent/container supplies the publicId and request;
// - parent/container remains responsible for capability/visibility decisions;
// - parent/container may refresh the authoritative Journey Demand projection
//   through onSuccess.
//
// -----------------------------------------------------------------------------

'use client';

import { Button } from '@/components/ui';

import type { PublishJourneyDemandRequest } from '@/features/journey-demand/api/journey-demands/publish-journey-demand.api';
import { usePublishJourneyDemand } from '@/features/journey-demand/hooks';

// =============================================================================
// Props
// =============================================================================

export interface JourneyDemandPublishActionProps {
  readonly journeyDemandPublicId: string;
  readonly request: PublishJourneyDemandRequest;
  readonly onSuccess?: () => void | Promise<void>;
  readonly disabled?: boolean;
}

// =============================================================================
// Component
// =============================================================================

export function JourneyDemandPublishAction({
  journeyDemandPublicId,
  request,
  onSuccess,
  disabled = false,
}: JourneyDemandPublishActionProps) {
  const { isLoading, error, publishJourneyDemand } =
    usePublishJourneyDemand();

  const isDisabled = disabled || isLoading;

  const handlePublish = async (): Promise<void> => {
    if (isDisabled) {
      return;
    }

    try {
      await publishJourneyDemand(journeyDemandPublicId, request);
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
      onClick={handlePublish}
      loading={isLoading}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      title={error?.message}
    >
      Publish demand
    </Button>
  );
}
