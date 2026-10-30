
"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import type { ReactNode } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";

import { cn } from "@/foundation/utils/cn";

// -----------------------------------------------------------------------------
// sisiMove Admin — Provider Operation Confirmation
// -----------------------------------------------------------------------------

export type ProviderConfirmationVariant =
  | "default"
  | "danger";

export interface ProviderOperationConfirmationProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ProviderConfirmationVariant;
  isLoading?: boolean;
  children?: ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function ProviderOperationConfirmation({
  isOpen,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  isLoading = false,
  children,
  onConfirm,
  onCancel,
  className,
}: ProviderOperationConfirmationProps) {
  // ---------------------------------------------------------------------------
  // Body Scroll Lock and Escape Handling
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isLoading) {
        onCancel();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, isLoading, onCancel]);

  // ---------------------------------------------------------------------------
  // Closed State
  // ---------------------------------------------------------------------------

  if (!isOpen || typeof document === "undefined") {
    return null;
  }

  const isDanger = variant === "danger";

  // ---------------------------------------------------------------------------
  // Portal
  // ---------------------------------------------------------------------------

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 z-[10000]",
        "flex items-center justify-center",
        "overflow-y-auto",
        "bg-black/60",
        "p-4 sm:p-6",
      )}
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !isLoading
        ) {
          onCancel();
        }
      }}
    >
      <section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="provider-confirmation-title"
        aria-describedby="provider-confirmation-description"
        className={cn(
          "relative flex w-full max-w-xl flex-col",
          "max-h-[90vh] overflow-hidden",
          "rounded-2xl border border-[var(--border)]",
          "bg-[var(--background)] shadow-2xl",
          "animate-in fade-in zoom-in-95 duration-150",
          className,
        )}
        onMouseDown={(event) => event.stopPropagation()}
      >
        {/* ----------------------------------------------------------------- */}
        {/* Header                                                            */}
        {/* ----------------------------------------------------------------- */}

        <div className="flex shrink-0 items-start gap-3 border-b border-[var(--border)] px-5 py-5 sm:px-6">
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
              isDanger
                ? "bg-[var(--danger-soft)] text-[var(--danger)]"
                : "bg-[var(--brand-soft)] text-[var(--brand)]",
            )}
          >
            <AlertTriangle
              className="h-5 w-5"
              aria-hidden="true"
            />
          </div>

          <div className="min-w-0 flex-1 space-y-1">
            <h2
              id="provider-confirmation-title"
              className="text-base font-semibold text-[var(--foreground)]"
            >
              {title}
            </h2>

            <p
              id="provider-confirmation-description"
              className="text-sm leading-6 text-[var(--foreground-secondary)]"
            >
              {description}
            </p>
          </div>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Scrollable Content                                                */}
        {/* ----------------------------------------------------------------- */}

        {children && (
          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
            {children}
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* Footer                                                            */}
        {/* ----------------------------------------------------------------- */}

        <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-[var(--border)] bg-[var(--background)] px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className={cn(
              "inline-flex h-10 items-center justify-center rounded-lg",
              "border border-[var(--border)]",
              "bg-[var(--background)] px-5",
              "text-sm font-medium text-[var(--foreground)]",
              "transition-colors hover:bg-[var(--background-muted)]",
              "focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-[var(--brand)]",
              "disabled:pointer-events-none disabled:opacity-50",
            )}
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={cn(
              "inline-flex h-10 items-center justify-center gap-2 rounded-lg",
              "px-5 text-sm font-medium text-white transition-colors",
              "focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-[var(--brand)]",
              "disabled:pointer-events-none disabled:opacity-50",
              isDanger
                ? "bg-[var(--danger)] hover:opacity-90"
                : "bg-[var(--brand)] hover:bg-[var(--brand-hover)]",
            )}
          >
            {isLoading && (
              <Loader2
                className="h-4 w-4 animate-spin"
                aria-hidden="true"
              />
            )}

            {isLoading ? "Processing..." : confirmLabel}
          </button>
        </div>
      </section>
    </div>,
    document.body,
  );
}
