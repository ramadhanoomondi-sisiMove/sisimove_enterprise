// -----------------------------------------------------------------------------
// sisiMove — Journey Complete Action
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - present the Journey complete action;
// - own the complete mutation for the UI it renders;
// - expose pending/error state through the action UI;
// - notify the parent after a successful completion request.
//
// Non-responsibilities:
// - no Journey status inference;
// - no completion confirmation logic;
// - no passenger confirmation handling;
// - no dispute handling;
// - no settlement handling;
// - no financial mutation handling;
// - no authorization decisions;
// - no verification checks;
// - no navigation;
// - no route construction.
//
// Journey completion may lead into the separate Journey Completion bounded
// context. This component only invokes the Journey lifecycle command exposed
// by the Journey feature.
//
// The backend remains authoritative for whether the Journey can be completed.
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

import { useCompleteJourney } from "@/features/journey/hooks/mutations";

// -----------------------------------------------------------------------------
// Icons
// -----------------------------------------------------------------------------

function CompleteIcon() {
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
        d="m5 12.5 4.25 4.25L19 7"
      />
    </svg>
  );
}

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyCompleteActionProps {
  /**
   * Public identifier of the Journey being completed.
   */
  readonly journeyPublicId: string;

  /**
   * Allows the parent management surface to disable the action.
   *
   * This does not replace backend lifecycle validation.
   */
  readonly disabled?: boolean;

  /**
   * Called after the complete command succeeds.
   *
   * The parent can use this to refetch the Journey projection or update
   * management presentation state.
   */
  readonly onCompleted?: () => void | Promise<void>;

  /**
   * Optional action label.
   */
  readonly label?: string;

  /**
   * Optional label displayed while the mutation is processing.
   */
  readonly completingLabel?: string;

  /**
   * Optional additional classes.
   */
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyCompleteAction({
  journeyPublicId,
  disabled = false,
  onCompleted,
  label = "Complete Journey",
  completingLabel = "Completing…",
  className,
}: JourneyCompleteActionProps) {
  const [error, setError] = useState<Error | null>(null);

  const completeJourneyMutation =
    useCompleteJourney();

  async function handleComplete(): Promise<void> {
    if (
      disabled ||
      completeJourneyMutation.isPending
    ) {
      return;
    }

    const normalizedJourneyPublicId =
      journeyPublicId.trim();

    if (normalizedJourneyPublicId.length === 0) {
      setError(
        new Error(
          "Journey public ID is required to complete the Journey.",
        ),
      );

      return;
    }

    setError(null);

    try {
      await completeJourneyMutation.complete(
        normalizedJourneyPublicId,
      );

      await onCompleted?.();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause
          : new Error(
              "Unable to complete the Journey.",
            ),
      );
    }
  }

  const isPending =
    completeJourneyMutation.isPending;

  return (
    <div
      className={cn(
        "space-y-2",
        className,
      )}
    >
      {error !== null && (
        <ErrorState
          title="We couldn't complete this Journey"
          description={error.message}
          retryAction={{
            label: "Try again",
            onClick: handleComplete,
            disabled: isPending || disabled,
          }}
        />
      )}

      <Button
        type="button"
        variant="primary"
        leadingIcon={<CompleteIcon />}
        onClick={handleComplete}
        loading={isPending}
        disabled={disabled}
      >
        {isPending ? completingLabel : label}
      </Button>
    </div>
  );
}

