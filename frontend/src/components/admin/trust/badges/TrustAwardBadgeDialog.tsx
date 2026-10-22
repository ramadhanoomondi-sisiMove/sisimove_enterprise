"use client";

import { useState } from "react";

import { TrustConfirmDialog } from "../shared/TrustConfirmDialog";
import type { TrustBadgeModel } from "@/features/admin/trust/models";

// -----------------------------------------------------------------------------
// sisiMove — Trust Award Badge Dialog
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Let an administrator select an active badge to award.
// - Display the selected trust profile reference.
// - Confirm the award action.
// - Pass the selected badge definition to the parent.
//
// Non-responsibilities:
// - Performing the badge-award mutation.
// - Fetching badge definitions or profile data.
// - Making authorization decisions.
// -----------------------------------------------------------------------------

export interface TrustAwardBadgeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  profilePublicId: string;
  badges: TrustBadgeModel[];

  onConfirm: (
    badge: TrustBadgeModel,
  ) => void | Promise<void>;

  isPending?: boolean;
  disabled?: boolean;
  className?: string;
}

export function TrustAwardBadgeDialog({
  open,
  onOpenChange,
  profilePublicId,
  badges,
  onConfirm,
  isPending = false,
  disabled = false,
  className,
}: TrustAwardBadgeDialogProps) {
  const [selectedBadgeId, setSelectedBadgeId] = useState("");
  const [validationError, setValidationError] = useState<string>();
  const [submissionError, setSubmissionError] = useState<string>();

  const availableBadges = badges.filter((badge) => badge.active);

  const selectedBadge = availableBadges.find(
    (badge) => badge.id === selectedBadgeId,
  );

  function resetForm() {
    setSelectedBadgeId("");
    setValidationError(undefined);
    setSubmissionError(undefined);
  }

  function handleOpenChange(nextOpen: boolean) {
    if (isPending && !nextOpen) {
      return;
    }

    if (!nextOpen) {
      resetForm();
    }

    onOpenChange(nextOpen);
  }

  async function handleConfirm() {
    if (disabled || isPending) {
      return;
    }

    if (!selectedBadge) {
      setValidationError("Select a badge to award.");
      return;
    }

    setValidationError(undefined);
    setSubmissionError(undefined);

    try {
      await onConfirm(selectedBadge);
      resetForm();
      onOpenChange(false);
    } catch {
      setSubmissionError(
        "The badge could not be awarded. Please try again.",
      );
    }
  }

  return (
    <TrustConfirmDialog
      open={open}
      onOpenChange={handleOpenChange}
      title="Award trust badge"
      description="Choose an active badge to assign to this trust profile."
      confirmLabel="Award badge"
      cancelLabel="Cancel"
      tone="default"
      isPending={isPending}
      preventCloseWhilePending
      onConfirm={handleConfirm}
      className={className}
    >
      <div className="space-y-4">
        <div className="rounded-lg border border-[var(--border)] bg-[var(--background-subtle)] p-3">
          <p className="text-xs font-medium text-[var(--foreground-muted)]">
            Trust profile
          </p>

          <p className="mt-1 break-all font-mono text-sm text-[var(--foreground)]">
            {profilePublicId}
          </p>
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="trust-award-badge-select"
            className="block text-sm font-medium text-[var(--foreground)]"
          >
            Badge <span className="text-[var(--danger)]">*</span>
          </label>

          <select
            id="trust-award-badge-select"
            value={selectedBadgeId}
            onChange={(event) => {
              setSelectedBadgeId(event.currentTarget.value);
              setValidationError(undefined);
              setSubmissionError(undefined);
            }}
            disabled={disabled || isPending}
            aria-invalid={Boolean(validationError)}
            aria-describedby={
              validationError
                ? "trust-award-badge-error"
                : undefined
            }
            className="min-h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)] focus:border-[var(--brand)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Select a badge</option>

            {availableBadges.map((badge) => (
              <option key={badge.id} value={badge.id}>
                {badge.name} ({badge.type})
              </option>
            ))}
          </select>

          {validationError && (
            <p
              id="trust-award-badge-error"
              role="alert"
              className="text-sm text-[var(--danger)]"
            >
              {validationError}
            </p>
          )}

          {availableBadges.length === 0 && (
            <p className="text-sm text-[var(--foreground-muted)]">
              No active badges are available to award.
            </p>
          )}
        </div>

        {selectedBadge && (
          <div className="space-y-2 rounded-lg border border-[var(--border-subtle)] p-3">
            <p className="text-sm font-semibold text-[var(--foreground)]">
              {selectedBadge.name}
            </p>

            {selectedBadge.description ? (
              <p className="text-sm leading-5 text-[var(--foreground-secondary)]">
                {selectedBadge.description}
              </p>
            ) : (
              <p className="text-sm italic text-[var(--foreground-muted)]">
                No badge description provided.
              </p>
            )}

            <p className="text-xs text-[var(--foreground-muted)]">
              Type: {selectedBadge.type}
            </p>
          </div>
        )}

        {submissionError && (
          <p
            role="alert"
            className="rounded-lg border border-[var(--danger)]/30 p-3 text-sm text-[var(--danger)]"
          >
            {submissionError}
          </p>
        )}
      </div>
    </TrustConfirmDialog>
  );
}

export default TrustAwardBadgeDialog;