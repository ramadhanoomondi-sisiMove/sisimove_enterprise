// -----------------------------------------------------------------------------
// sisiMove — Journey Cancel Action
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - present the Journey cancel action;
// - open the cancellation confirmation dialog;
// - own the cancel mutation for the UI it renders;
// - receive the cancellation reason from JourneyCancelDialog;
// - construct the backend cancellation request;
// - pass the confirmed cancellation request to the backend;
// - expose pending/error state;
// - notify the parent after successful cancellation.
//
// Non-responsibilities:
// - no Journey status inference;
// - no authorization decisions;
// - no verification checks;
// - no navigation;
// - no route construction;
// - no cancellation eligibility calculation;
// - no financial/refund calculation;
// - no booking cancellation orchestration;
// - no Journey aggregate reconstruction.
//
// The backend remains authoritative for whether the Journey can be cancelled.
//
// Cancellation confirmation and reason validation are delegated to
// JourneyCancelDialog.
//
// -----------------------------------------------------------------------------
// Backend mutation contract
// -----------------------------------------------------------------------------
//
// useCancelJourney exposes:
//
//   cancel(
//     journeyPublicId: string,
//     request: CancelJourneyRequest,
//   ): Promise<void>
//
// CancelJourneyRequest is an API contract and therefore remains owned by the
// Journey API layer. This component imports that type directly from the API
// module rather than from the mutation hook.
//
// JourneyCancelDialog supplies the cancellation reason:
//
//   onConfirm(reason: string)
//
// This component is the orchestration boundary between those two contracts.
//
// -----------------------------------------------------------------------------

"use client";

import { useState } from "react";

import { Button } from "@/components/ui";
import { ErrorState } from "@/components/ui/error-state";
import { cn } from "@/foundation/utils/cn";

import {
  useCancelJourney,
} from "@/features/journey/hooks/mutations";

import type { CancelJourneyRequest } from "@/features/journey/api/journeys/cancel-journey";

import { JourneyCancelDialog } from "./journey-cancel-dialog";

// -----------------------------------------------------------------------------
// Icons
// -----------------------------------------------------------------------------

function CancelIcon() {
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
        d="M6 6l12 12M18 6 6 18"
      />
    </svg>
  );
}

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyCancelActionProps {
  /**
   * Public identifier of the Journey being cancelled.
   */
  readonly journeyPublicId: string;

  /**
   * Allows the parent management surface to disable the action.
   *
   * This does not replace backend lifecycle validation.
   */
  readonly disabled?: boolean;

  /**
   * Called after the cancel command succeeds.
   *
   * The parent can use this to refetch the Journey projection or update
   * management presentation state.
   */
  readonly onCancelled?: () => void | Promise<void>;

  /**
   * Optional action label.
   */
  readonly label?: string;

  /**
   * Optional additional classes.
   */
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyCancelAction({
  journeyPublicId,
  disabled = false,
  onCancelled,
  label = "Cancel Journey",
  className,
}: JourneyCancelActionProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const cancelJourneyMutation = useCancelJourney();

  // ---------------------------------------------------------------------------
  // Open dialog
  // ---------------------------------------------------------------------------

  function handleOpenDialog(): void {
    if (
      disabled ||
      cancelJourneyMutation.isPending
    ) {
      return;
    }

    setError(null);
    setDialogOpen(true);
  }

  // ---------------------------------------------------------------------------
  // Confirm cancellation
  // ---------------------------------------------------------------------------
  //
  // JourneyCancelDialog owns the transient reason input.
  //
  // This component translates that presentation value into the exact API
  // request expected by useCancelJourney.
  // ---------------------------------------------------------------------------

  async function handleConfirmCancel(
    reason: string,
  ): Promise<void> {
    if (cancelJourneyMutation.isPending) {
      return;
    }

    const normalizedJourneyPublicId =
      journeyPublicId.trim();

    if (normalizedJourneyPublicId.length === 0) {
      setError(
        new Error(
          "Journey public ID is required to cancel the Journey.",
        ),
      );

      return;
    }

    const normalizedReason = reason.trim();

    if (normalizedReason.length === 0) {
      setError(
        new Error(
          "A cancellation reason is required.",
        ),
      );

      return;
    }

    const request: CancelJourneyRequest = {
      reason: normalizedReason,
    };

    setError(null);

    try {
      await cancelJourneyMutation.cancel(
        normalizedJourneyPublicId,
        request,
      );

      // Close only after the backend confirms the command succeeded.
      setDialogOpen(false);

      // The parent normally refetches the My Journey projection here.
      await onCancelled?.();
    } catch (cause) {
      // Keep the dialog open so the user can retry with the entered reason.
      setError(
        cause instanceof Error
          ? cause
          : new Error(
              "Unable to cancel the Journey.",
            ),
      );
    }
  }

  const isPending =
    cancelJourneyMutation.isPending;

  return (
    <div
      className={cn(
        "space-y-2",
        className,
      )}
    >
      {/* ------------------------------------------------------------------- */}
      {/* Mutation error                                                      */}
      {/* ------------------------------------------------------------------- */}

      {error !== null && (
        <ErrorState
          title="We couldn't cancel this Journey"
          description={error.message}
          retryAction={{
            label: "Try again",
            onClick: () => {
              // The previous request cannot be automatically retried because
              // its reason belongs to the dialog form.
              setError(null);
              setDialogOpen(true);
            },
            disabled:
              isPending ||
              disabled,
          }}
        />
      )}

      {/* ------------------------------------------------------------------- */}
      {/* Cancel action                                                       */}
      {/* ------------------------------------------------------------------- */}

      <Button
        type="button"
        variant="danger"
        leadingIcon={<CancelIcon />}
        onClick={handleOpenDialog}
        loading={isPending}
        disabled={disabled}
      >
        {label}
      </Button>

      {/* ------------------------------------------------------------------- */}
      {/* Cancellation confirmation dialog                                    */}
      {/* ------------------------------------------------------------------- */}

      <JourneyCancelDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onConfirm={handleConfirmCancel}
        submitting={isPending}
      />
    </div>
  );
}

