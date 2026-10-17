// -----------------------------------------------------------------------------
// sisiMove — Verification Confirmation Dialog
// -----------------------------------------------------------------------------
// Purpose: Confirm an administrative action before the parent executes it.
// -----------------------------------------------------------------------------

"use client";

import { Dialog } from "@/components/ui";

export interface VerificationConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  isDestructive?: boolean;
}

export function VerificationConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isLoading = false,
  isDestructive = false,
}: VerificationConfirmationDialogProps) {
  function handleConfirm(): void {
    if (isLoading) {
      return;
    }

    onConfirm();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      size="sm"
      closeOnBackdropClick={!isLoading}
      closeOnEscape={!isLoading}
      showCloseButton={!isLoading}
      footer={
        <>
          <button
            type="button"
            disabled={isLoading}
            onClick={() => onOpenChange(false)}
            className={[
              "inline-flex",
              "min-h-10",
              "items-center",
              "justify-center",
              "rounded-[var(--radius-md)]",
              "border",
              "border-[var(--border)]",
              "bg-[var(--surface)]",
              "px-4",
              "text-sm",
              "font-medium",
              "text-[var(--foreground)]",
              "hover:bg-[var(--background-muted)]",
              "disabled:cursor-not-allowed",
              "disabled:opacity-60",
            ].join(" ")}
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            disabled={isLoading}
            onClick={handleConfirm}
            className={[
              "inline-flex",
              "min-h-10",
              "items-center",
              "justify-center",
              "rounded-[var(--radius-md)]",
              "px-4",
              "text-sm",
              "font-medium",
              "transition-colors",
              "disabled:cursor-not-allowed",
              "disabled:opacity-60",
              isDestructive
                ? [
                    "bg-[var(--danger)]",
                    "text-white",
                    "hover:opacity-90",
                  ].join(" ")
                : [
                    "bg-[var(--brand)]",
                    "text-[var(--brand-foreground)]",
                    "hover:bg-[var(--brand-hover)]",
                  ].join(" "),
            ].join(" ")}
          >
            {isLoading ? "Please wait…" : confirmLabel}
          </button>
        </>
      }
    >
      <p className="text-sm leading-6 text-[var(--foreground-secondary)]">
        {description}
      </p>
    </Dialog>
  );
}

export default VerificationConfirmationDialog;