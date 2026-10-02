// -----------------------------------------------------------------------------
// sisiMove — Success Modal
// -----------------------------------------------------------------------------
//
// Generic success acknowledgement modal.
//
// Responsibilities:
// - communicate that an operation completed successfully;
// - provide a single acknowledgement action;
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

  readonly actionLabel?: string;

  readonly onClose: () => void;

  readonly className?: string;

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
  className,
  children,
}: SuccessModalProps) {
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
      footer={
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
      }
    >
      <div className="space-y-4">
        {/* ----------------------------------------------------------------- */}
        {/* Success Indicator                                                 */}
        {/* ----------------------------------------------------------------- */}

        <div className="flex items-start gap-3">
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
              "bg-[var(--brand)]",
              "text-[var(--brand-foreground)]",
            )}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path
                d="m5 12 4 4L19 6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <p className="min-w-0 pt-0.5 text-sm leading-5 text-[var(--foreground-muted)]">
            The operation has been completed successfully.
          </p>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Additional Content                                                */}
        {/* ----------------------------------------------------------------- */}

        {children}
      </div>
    </Dialog>
  );
}
