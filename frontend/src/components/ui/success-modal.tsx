// -----------------------------------------------------------------------------
// sisiMove — Success Modal
// -----------------------------------------------------------------------------
//
// Generic success acknowledgement popup.
//
// Responsibilities:
// - communicate that an operation completed successfully;
// - present the acknowledgement as a modal popup;
// - provide a default acknowledgement action;
// - optionally allow the owning surface to provide contextual actions;
// - compose the shared Dialog design-system primitive;
// - remain presentation-only.
//
// Non-responsibilities:
// - no mutation;
// - no navigation;
// - no domain logic;
// - no API calls;
// - no lifecycle decisions;
// - no independent modal implementation.
//
// -----------------------------------------------------------------------------

"use client";

import type { ReactNode } from "react";

import { Dialog } from "@/components/ui/dialog";
import { cn } from "@/foundation/utils/cn";

// =============================================================================
// Props
// =============================================================================

export interface SuccessModalProps {
  readonly open: boolean;

  readonly title: string;

  readonly description?: string;

  /**
   * Label for the default acknowledgement action.
   *
   * Ignored when `actions` is provided.
   */
  readonly actionLabel?: string;

  /**
   * Called when the success acknowledgement is dismissed.
   */
  readonly onClose: () => void;

  /**
   * Optional contextual actions supplied by the owning surface.
   *
   * When provided, these replace the default single Done action.
   *
   * The modal remains presentation-only; action behavior belongs to
   * the caller.
   */
  readonly actions?: ReactNode;

  readonly className?: string;

  /**
   * Optional additional success content.
   */
  readonly children?: ReactNode;
}

// =============================================================================
// Component
// =============================================================================

export function SuccessModal({
  open,
  title,
  description,
  actionLabel = "Done",
  onClose,
  actions,
  className,
  children,
}: SuccessModalProps) {
  const footer =
    actions ?? (
      <button
        type="button"
        onClick={onClose}
        className={cn(
          "inline-flex",
          "min-h-10",
          "items-center",
          "justify-center",
          "rounded-[var(--radius-md)]",
          "bg-[var(--brand)]",
          "px-4",
          "py-2",
          "text-sm",
          "font-medium",
          "text-[var(--brand-foreground)]",
          "transition-opacity",
          "hover:opacity-90",
          "focus-visible:outline-2",
          "focus-visible:outline-[var(--brand)]",
          "focus-visible:outline-offset-2",
        )}
      >
        {actionLabel}
      </button>
    );

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onClose();
        }
      }}
      title={title}
      description={description}
      size="sm"
      closeOnBackdropClick
      closeOnEscape
      showCloseButton
      className={className}
      footer={footer}
    >
      <div className="space-y-4">
        {/* ----------------------------------------------------------------- */}
        {/* Success Indicator                                                 */}
        {/* ----------------------------------------------------------------- */}

        <div className="flex items-center gap-3">
          <div
            aria-hidden="true"
            className={cn(
              "flex",
              "h-10",
              "w-10",
              "shrink-0",
              "items-center",
              "justify-center",
              "rounded-full",
              "bg-[var(--success-soft)]",
              "text-[var(--success)]",
            )}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="m8 12 2.5 2.5L16 9" />
            </svg>
          </div>

          <div className="min-w-0">
            <p className="text-sm font-medium text-[var(--foreground)]">
              Success
            </p>

            <p className="text-sm leading-5 text-[var(--foreground-muted)]">
              The operation has been completed successfully.
            </p>
          </div>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Additional Content                                                */}
        {/* ----------------------------------------------------------------- */}

        {children}
      </div>
    </Dialog>
  );
}