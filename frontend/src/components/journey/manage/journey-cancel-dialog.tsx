// -----------------------------------------------------------------------------
// sisiMove — Journey Cancel Dialog
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - confirm that the member intentionally wants to cancel the Journey;
// - collect the cancellation reason required by the backend command;
// - validate that a reason has been provided;
// - delegate the confirmed reason to the parent.
//
// Non-responsibilities:
// - no Journey API calls;
// - no cancellation mutation;
// - no lifecycle/status interpretation;
// - no authorization logic;
// - no navigation.
//
// The parent JourneyCancelAction owns the mutation.
//
// IMPORTANT:
// This component deliberately does not use an effect to synchronize local form
// state with the `open` prop. Opening and closing a dialog is a user-driven
// interaction, not an external synchronization problem.
//
// -----------------------------------------------------------------------------

"use client";

import { useState } from "react";

import { Button, Dialog, Textarea } from "@/components/ui";

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyCancelDialogProps {
  /**
   * Controls whether the dialog is visible.
   */
  readonly open: boolean;

  /**
   * Called when the dialog requests a visibility change.
   */
  readonly onOpenChange: (open: boolean) => void;

  /**
   * Called when the member confirms cancellation.
   *
   * The supplied value is the cancellation reason required by the backend
   * CancelJourney command.
   */
  readonly onConfirm: (reason: string) => void | Promise<void>;

  /**
   * Indicates that the cancellation mutation is running.
   */
  readonly submitting?: boolean;

  /**
   * Optional Journey context rendered inside the confirmation content.
   */
  readonly journeySummary?: React.ReactNode;

  /**
   * Optional dialog title.
   */
  readonly title?: string;

  /**
   * Optional dialog description.
   */
  readonly description?: string;

  /**
   * Optional confirmation button label.
   */
  readonly confirmLabel?: string;

  /**
   * Optional submitting button label.
   */
  readonly confirmingLabel?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyCancelDialog({
  open,
  onOpenChange,
  onConfirm,
  submitting = false,
  journeySummary,
  title = "Cancel Journey?",
  description = "Please provide a reason for cancelling this Journey. The reason is required to complete the cancellation.",
  confirmLabel = "Cancel Journey",
  confirmingLabel = "Cancelling…",
}: JourneyCancelDialogProps) {
  const [reason, setReason] = useState("");
  const [validationError, setValidationError] =
    useState<string | null>(null);

  // ---------------------------------------------------------------------------
  // Confirm
  // ---------------------------------------------------------------------------

  async function handleConfirm(): Promise<void> {
    const normalizedReason = reason.trim();

    if (normalizedReason.length === 0) {
      setValidationError(
        "A cancellation reason is required.",
      );

      return;
    }

    setValidationError(null);

    await onConfirm(normalizedReason);
  }

  // ---------------------------------------------------------------------------
  // Close
  // ---------------------------------------------------------------------------
  //
  // Form state is reset as part of the explicit close interaction rather than
  // through an effect watching `open`.
  //
  // If the dialog is closed externally after a successful mutation, the parent
  // owns that state transition and the next opening can still start cleanly
  // because the successful cancellation normally unmounts/leaves this workflow.
  // ---------------------------------------------------------------------------

  function handleOpenChange(nextOpen: boolean): void {
    if (!nextOpen && !submitting) {
      setReason("");
      setValidationError(null);
    }

    onOpenChange(nextOpen);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
      title={title}
      description={description}
      size="sm"
      closeOnBackdropClick={!submitting}
      closeOnEscape={!submitting}
      showCloseButton={!submitting}
      footer={
        <>
          <Button
            type="button"
            variant="secondary"
            size="md"
            disabled={submitting}
            onClick={() => handleOpenChange(false)}
          >
            Keep Journey
          </Button>

          <Button
            type="button"
            variant="danger"
            size="md"
            loading={submitting}
            disabled={submitting}
            onClick={() => {
              void handleConfirm();
            }}
          >
            {submitting
              ? confirmingLabel
              : confirmLabel}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {journeySummary ? (
          <div
            className={[
              "rounded-[var(--radius-md)]",
              "border",
              "border-[var(--border)]",
              "bg-[var(--background-subtle)]",
              "p-4",
            ].join(" ")}
          >
            {journeySummary}
          </div>
        ) : null}

        <Textarea
          label="Cancellation reason"
          value={reason}
          onChange={(event) => {
            setReason(event.target.value);

            if (validationError !== null) {
              setValidationError(null);
            }
          }}
          error={validationError ?? undefined}
          disabled={submitting}
          placeholder="Tell us why you are cancelling this Journey."
          helperText="This reason will be submitted with the cancellation request."
          rows={4}
          fullWidth
        />
      </div>
    </Dialog>
  );
}

