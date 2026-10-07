// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Publish Action
// -----------------------------------------------------------------------------
//
// Self-contained publish action for an authenticated Journey Demand.
//
// UX PRINCIPLE:
// - The Publish control is not hidden because of frontend lifecycle checks.
// - The current Journey Demand status remains visible elsewhere in the
//   management/detail UI.
// - The backend remains authoritative over whether publishing is valid for the
//   current lifecycle state.
//
// Architecture:
// - owns the publish mutation;
// - owns mutation loading/error state;
// - performs the publish API request through the mutation hook;
// - does not perform authorization checks;
// - does not inspect Journey Demand lifecycle state;
// - does not derive lifecycle transitions;
// - does not decide whether publishing is allowed;
// - receives the command request from the parent/container;
// - parent/container may refresh the authoritative Journey Demand projection
//   through onSuccess.
//
// The action deliberately does not contain logic such as:
//
//     if (status !== 'DRAFT') ...
//
// or:
//
//     if (!canPublish) ...
//
// Backend command validation remains the source of truth.
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
  /**
   * Public identifier of the Journey Demand being published.
   */
  readonly journeyDemandPublicId: string;

  /**
   * Backend command request metadata.
   */
  readonly request: PublishJourneyDemandRequest;

  /**
   * Called after the backend confirms a successful publish command.
   *
   * The parent/container normally uses this to refetch the authoritative
   * Journey Demand projection.
   */
  readonly onSuccess?: () => void | Promise<void>;

  /**
   * Presentation-level disabled state.
   *
   * This does not represent lifecycle capability.
   */
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

  // ===========================================================================
  // Publish
  // ===========================================================================

  const handlePublish = async (): Promise<void> => {
    if (isDisabled) {
      return;
    }

    try {
      await publishJourneyDemand(journeyDemandPublicId, request);
      await onSuccess?.();
    } catch {
      // The mutation hook owns and exposes the normalized error state.
      //
      // The action intentionally does not:
      // - transform the error;
      // - determine whether the command should have been allowed;
      // - inspect the Journey Demand lifecycle;
      // - hide itself after a failed command.
    }
  };

  // ===========================================================================
  // Presentation
  // ===========================================================================

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

