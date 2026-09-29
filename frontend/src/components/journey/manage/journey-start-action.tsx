// -----------------------------------------------------------------------------
// sisiMove — Journey Start Action
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - present the Journey start action;
// - own the start mutation for the UI it renders;
// - expose pending/error state through the action UI;
// - notify the parent after a successful start.
//
// Non-responsibilities:
// - no Journey status inference;
// - no authorization decisions;
// - no verification checks;
// - no navigation;
// - no route construction;
// - no generic Journey management;
// - no start eligibility calculation.
//
// The backend remains authoritative for whether the Journey can be started.
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

import { useStartJourney } from "@/features/journey/hooks/mutations";

// -----------------------------------------------------------------------------
// Icons
// -----------------------------------------------------------------------------

function StartIcon() {
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
        d="M6 4.75v14.5L18 12 6 4.75Z"
      />
    </svg>
  );
}

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyStartActionProps {
  /**
   * Public identifier of the Journey being started.
   */
  readonly journeyPublicId: string;

  /**
   * Allows the parent management surface to disable the action.
   *
   * This does not replace backend lifecycle validation.
   */
  readonly disabled?: boolean;

  /**
   * Called after the start command succeeds.
   *
   * The parent can use this to refetch the Journey projection or update
   * management presentation state.
   */
  readonly onStarted?: () => void | Promise<void>;

  /**
   * Optional action label.
   */
  readonly label?: string;

  /**
   * Optional label displayed while the mutation is processing.
   */
  readonly startingLabel?: string;

  /**
   * Optional additional classes.
   */
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyStartAction({
  journeyPublicId,
  disabled = false,
  onStarted,
  label = "Start Journey",
  startingLabel = "Starting…",
  className,
}: JourneyStartActionProps) {
  const [error, setError] = useState<Error | null>(null);

  const startJourneyMutation = useStartJourney();

  async function handleStart(): Promise<void> {
    if (
      disabled ||
      startJourneyMutation.isPending
    ) {
      return;
    }

    const normalizedJourneyPublicId =
      journeyPublicId.trim();

    if (normalizedJourneyPublicId.length === 0) {
      setError(
        new Error(
          "Journey public ID is required to start the Journey.",
        ),
      );

      return;
    }

    setError(null);

    try {
      await startJourneyMutation.start(
        normalizedJourneyPublicId,
      );

      await onStarted?.();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause
          : new Error(
              "Unable to start the Journey.",
            ),
      );
    }
  }

  const isPending =
    startJourneyMutation.isPending;

  return (
    <div
      className={cn(
        "space-y-2",
        className,
      )}
    >
      {error !== null && (
        <ErrorState
          title="We couldn't start this Journey"
          description={error.message}
          retryAction={{
            label: "Try again",
            onClick: handleStart,
            disabled: isPending || disabled,
          }}
        />
      )}

      <Button
        type="button"
        variant="primary"
        leadingIcon={<StartIcon />}
        onClick={handleStart}
        loading={isPending}
        disabled={disabled}
      >
        {isPending ? startingLabel : label}
      </Button>
    </div>
  );
}

