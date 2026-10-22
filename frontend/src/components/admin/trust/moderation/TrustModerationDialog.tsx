"use client";

import { useState } from "react";

import { TrustConfirmDialog } from "../shared/TrustConfirmDialog";
import { TrustModerationReasonField } from "./TrustModerationReasonField";

// -----------------------------------------------------------------------------
// sisiMove — Trust Moderation Dialog
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Collect a reason before a moderation action.
// - Support confirmation, cancellation, and pending states.
// - Return the confirmed reason to the parent.
//
// Non-responsibilities:
// - Choosing or executing a backend moderation operation.
// - Performing permission checks.
// - Defining server-side validation rules.
// -----------------------------------------------------------------------------

export type TrustModerationDialogTone = "default" | "danger";

export interface TrustModerationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  title: string;
  description?: string;

  confirmLabel?: string;
  cancelLabel?: string;
  tone?: TrustModerationDialogTone;

  reasonLabel?: string;
  reasonDescription?: string;
  reasonPlaceholder?: string;
  reasonRequired?: boolean;
  minReasonLength?: number;
  maxReasonLength?: number;

  isPending?: boolean;
  onConfirm: (reason: string) => void | Promise<void>;

  className?: string;
}

export function TrustModerationDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm action",
  cancelLabel = "Cancel",
  tone = "danger",
  reasonLabel = "Moderation reason",
  reasonDescription = "Provide a clear, factual explanation for this action.",
  reasonPlaceholder = "Explain the reason for this moderation action…",
  reasonRequired = true,
  minReasonLength = 1,
  maxReasonLength = 1000,
  isPending = false,
  onConfirm,
  className,
}: TrustModerationDialogProps) {
  const [reason, setReason] = useState("");
  const [validationError, setValidationError] = useState<string>();
  const [submissionError, setSubmissionError] = useState<string>();

  function resetForm() {
    setReason("");
    setValidationError(undefined);
    setSubmissionError(undefined);
  }

  function handleReasonChange(nextReason: string) {
    setReason(nextReason);
    setValidationError(undefined);
    setSubmissionError(undefined);
  }

  async function handleConfirm() {
    if (isPending) return;

    const normalizedReason = reason.trim();

    if (reasonRequired && normalizedReason.length === 0) {
      setValidationError("A moderation reason is required.");
      return;
    }

    if (
      normalizedReason.length > 0 &&
      normalizedReason.length < minReasonLength
    ) {
      setValidationError(
        `Please provide at least ${minReasonLength} characters.`,
      );
      return;
    }

    if (normalizedReason.length > maxReasonLength) {
      setValidationError(
        `The reason must be no longer than ${maxReasonLength} characters.`,
      );
      return;
    }

    setValidationError(undefined);
    setSubmissionError(undefined);

    try {
      await onConfirm(normalizedReason);
      resetForm();
      onOpenChange(false);
    } catch {
      // Keep the dialog open so the user can retry.
      setSubmissionError(
        "The action could not be completed. Please try again.",
      );
    }
  }

  function handleOpenChange(nextOpen: boolean) {
    if (isPending && !nextOpen) return;

    if (!nextOpen) {
      resetForm();
    }

    onOpenChange(nextOpen);
  }

  return (
    <TrustConfirmDialog
      open={open}
      onOpenChange={handleOpenChange}
      title={title}
      description={description}
      confirmLabel={confirmLabel}
      cancelLabel={cancelLabel}
      tone={tone}
      isPending={isPending}
      preventCloseWhilePending
      onConfirm={handleConfirm}
      className={className}
    >
      <div className="space-y-3">
        <TrustModerationReasonField
          value={reason}
          onChange={handleReasonChange}
          label={reasonLabel}
          description={reasonDescription}
          placeholder={reasonPlaceholder}
          required={reasonRequired}
          maxLength={maxReasonLength}
          error={validationError}
          disabled={isPending}
        />

        {submissionError && (
          <p
            role="alert"
            className="rounded-md border border-[var(--danger)]/30 bg-[var(--background-subtle)] px-3 py-2 text-sm text-[var(--danger)]"
          >
            {submissionError}
          </p>
        )}
      </div>
    </TrustConfirmDialog>
  );
}

export default TrustModerationDialog;