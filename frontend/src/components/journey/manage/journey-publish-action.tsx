// -----------------------------------------------------------------------------
// sisiMove — Journey Publish Action
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - present the Journey publish action;
// - own the publish mutation for the UI it renders;
// - expose pending/error state through the action UI;
// - notify the parent after a successful publish.
//
// Non-responsibilities:
// - no Journey status inference;
// - no authorization decisions;
// - no verification checks;
// - no navigation;
// - no route construction;
// - no generic Journey management;
// - no publish eligibility calculation.
//
// The backend remains authoritative for whether the Journey can be published.
//
// The parent decides whether this action should be rendered and may supply
// additional disabled state or a success callback.
//
// -----------------------------------------------------------------------------

"use client";

import { useState } from "react";

import { Button } from "@/components/ui";
import { ErrorState } from "@/components/ui/error-state";
import { cn } from "@/foundation/utils/cn";

import { usePublishJourney } from "@/features/journey/hooks/mutations";

// =============================================================================
// Icons
// =============================================================================

function PublishIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="size-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 16V4"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m7 9 5-5 5 5"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13v4.5A2.5 2.5 0 0 0 7.5 20h9a2.5 2.5 0 0 0 2.5-2.5V13"
      />
    </svg>
  );
}

// =============================================================================
// Props
// =============================================================================

export interface JourneyPublishActionProps {
  /**
   * Public identifier of the Journey being published.
   */
  readonly journeyPublicId: string;

  /**
   * Allows the parent management surface to disable the action.
   *
   * This does not replace backend lifecycle validation.
   */
  readonly disabled?: boolean;

  /**
   * Called after the publish command succeeds.
   *
   * The parent can use this to refetch the Journey projection or update
   * management presentation state.
   */
  readonly onPublished?: () => void | Promise<void>;

  /**
   * Optional action label.
   */
  readonly label?: string;

  /**
   * Optional label displayed while the mutation is processing.
   */
  readonly publishingLabel?: string;

  /**
   * Optional additional classes.
   */
  readonly className?: string;
}

// =============================================================================
// Component
// =============================================================================

export function JourneyPublishAction({
  journeyPublicId,
  disabled = false,
  onPublished,
  label = "Publish Journey",
  publishingLabel = "Publishing…",
  className,
}: JourneyPublishActionProps) {
  const [error, setError] = useState<Error | null>(null);

  const publishJourneyMutation = usePublishJourney();

  const isPending = publishJourneyMutation.isPending;
  const isDisabled = disabled || isPending;

  // ===========================================================================
  // Publish
  // ===========================================================================

  async function handlePublish(): Promise<void> {
    if (isDisabled) {
      return;
    }

    const normalizedJourneyPublicId = journeyPublicId.trim();

    if (normalizedJourneyPublicId.length === 0) {
      setError(
        new Error(
          "Journey public ID is required to publish the Journey.",
        ),
      );

      return;
    }

    setError(null);

    try {
      await publishJourneyMutation.publish(
        normalizedJourneyPublicId,
      );

      await onPublished?.();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause
          : new Error(
              "Unable to publish the Journey.",
            ),
      );
    }
  }

  // ===========================================================================
  // Render
  // ===========================================================================

  return (
    <div
      className={cn(
        "w-full",
        "space-y-2",
        className,
      )}
    >
      {error !== null && (
        <ErrorState
          title="We couldn't publish this Journey"
          description={error.message}
          retryAction={{
            label: "Try again",
            onClick: handlePublish,
            disabled: isDisabled,
          }}
        />
      )}

      <Button
        type="button"
        variant="primary"
        leadingIcon={<PublishIcon />}
        onClick={handlePublish}
        loading={isPending}
        disabled={isDisabled}
      >
        {isPending ? publishingLabel : label}
      </Button>
    </div>
  );
}