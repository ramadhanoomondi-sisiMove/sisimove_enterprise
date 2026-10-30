
"use client";

// -----------------------------------------------------------------------------
// sisiMove — Payment Operation Dialog
// -----------------------------------------------------------------------------
// Responsibilities:
// - reuse the shared Dialog UI primitive;
// - present payment-operation content and confirmation actions;
// - expose loading and error states;
// - keep payment/API business logic in the parent.
// -----------------------------------------------------------------------------

import type { ReactNode } from "react";
import { AlertTriangle, LoaderCircle } from "lucide-react";

import { cn } from "@/foundation/utils/cn";
import { Dialog } from "@/components/ui/dialog";

// =============================================================================
// Types
// =============================================================================

export interface PaymentOperationDialogProps {
  readonly open: boolean;
  readonly title: string;
  readonly description?: string;
  readonly children?: ReactNode;
  readonly confirmLabel?: string;
  readonly cancelLabel?: string;
  readonly destructive?: boolean;
  readonly loading?: boolean;
  readonly error?: string | null;
  readonly onConfirm: () => void;
  readonly onClose: () => void;
  readonly className?: string;
}

// =============================================================================
// Payment Operation Dialog
// =============================================================================

export function PaymentOperationDialog({
  open,
  title,
  description,
  children,
  confirmLabel = "Confirm operation",
  cancelLabel = "Cancel",
  destructive = false,
  loading = false,
  error,
  onConfirm,
  onClose,
  className,
}: PaymentOperationDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen && !loading) {
          onClose();
        }
      }}
      title={title}
      description={description}
      size="md"
      closeOnBackdropClick={!loading}
      closeOnEscape={!loading}
      showCloseButton={!loading}
      className={className}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className={cn(
              "inline-flex min-h-10 items-center justify-center",
              "rounded-[var(--radius-md)] border border-[var(--border)]",
              "px-4 py-2 text-sm font-medium",
              "text-[var(--foreground-secondary)]",
              "transition-colors hover:bg-[var(--background-subtle)]",
              "focus-visible:outline-2 focus-visible:outline-offset-2",
              "focus-visible:outline-[var(--brand)]",
              "disabled:cursor-not-allowed disabled:opacity-50",
            )}
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={cn(
              "inline-flex min-h-10 items-center justify-center gap-2",
              "rounded-[var(--radius-md)] px-4 py-2",
              "text-sm font-semibold text-white transition-colors",
              "focus-visible:outline-2 focus-visible:outline-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-60",
              destructive
                ? [
                    "bg-[var(--danger)] hover:opacity-90",
                    "focus-visible:outline-[var(--danger)]",
                  ].join(" ")
                : [
                    "bg-[var(--brand)] hover:bg-[var(--brand-hover)]",
                    "focus-visible:outline-[var(--brand)]",
                  ].join(" "),
            )}
          >
            {loading ? (
              <>
                <LoaderCircle
                  aria-hidden="true"
                  className="size-4 animate-spin motion-reduce:animate-none"
                />
                Processing…
              </>
            ) : (
              <>
                {destructive ? (
                  <AlertTriangle
                    aria-hidden="true"
                    className="size-4"
                  />
                ) : null}
                {confirmLabel}
              </>
            )}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        {destructive ? (
          <div className="flex items-start gap-3 rounded-[var(--radius-lg)] border border-[var(--danger)]/20 bg-[var(--danger-soft)] p-3">
            <AlertTriangle
              aria-hidden="true"
              className="mt-0.5 size-5 shrink-0 text-[var(--danger)]"
            />
            <p className="text-sm leading-6 text-[var(--foreground-secondary)]">
              Please review this operation carefully before confirming.
            </p>
          </div>
        ) : null}

        {children}

        {error ? (
          <div
            role="alert"
            className="rounded-[var(--radius-md)] border border-[var(--danger)]/20 bg-[var(--danger-soft)] px-3 py-2.5"
          >
            <p className="text-sm leading-5 text-[var(--danger)]">
              {error}
            </p>
          </div>
        ) : null}
      </div>
    </Dialog>
  );
}
