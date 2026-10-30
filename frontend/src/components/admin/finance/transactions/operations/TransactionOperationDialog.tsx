
"use client";

import { Dialog } from "@/components/ui/dialog";
import { TransactionOperationReasonField } from "./TransactionOperationReasonField";
import type { TransactionOperation } from "./TransactionActionsMenu";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface TransactionOperationDialogProps {
  open: boolean;
  operation: TransactionOperation | null;
  transactionPublicId: string;
  reason: string;
  onReasonChange: (reason: string) => void;
  submitting?: boolean;
  reasonError?: string;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

// -----------------------------------------------------------------------------
// Operation Labels
// -----------------------------------------------------------------------------

const operationLabels: Record<TransactionOperation, string> = {
  COMPLETE: "Complete transaction",
  FAIL: "Mark transaction failed",
  CANCEL: "Cancel transaction",
  REVERSE: "Reverse transaction",
};

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function TransactionOperationDialog({
  open,
  operation,
  transactionPublicId,
  reason,
  onReasonChange,
  submitting = false,
  reasonError,
  onClose,
  onConfirm,
}: TransactionOperationDialogProps) {
  if (!operation) return null;

  const title = operationLabels[operation];

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen && !submitting) {
      onClose();
    }
  }

  function handleConfirm() {
    const trimmedReason = reason.trim();

    if (!trimmedReason || submitting) return;

    onConfirm(trimmedReason);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
      title={title}
      description="Review the transaction and provide a reason for the audit record."
      size="md"
      closeOnBackdropClick={!submitting}
      closeOnEscape={!submitting}
      showCloseButton={!submitting}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="inline-flex min-h-10 items-center justify-center rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--background-subtle)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Keep transaction
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={submitting || !reason.trim()}
            className="inline-flex min-h-10 items-center justify-center rounded-lg bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Processing…" : "Confirm operation"}
          </button>
        </>
      }
    >
      <div className="space-y-5">
        <div className="rounded-lg border border-[var(--border)] bg-[var(--background-subtle)] p-4">
          <p className="text-sm text-[var(--foreground-muted)]">
            Transaction public ID
          </p>

          <p className="mt-1 break-all font-mono text-sm font-medium text-[var(--foreground)]">
            {transactionPublicId}
          </p>

          <p className="mt-3 text-sm text-[var(--foreground-secondary)]">
            You are about to perform: <strong>{title}</strong>. The operation
            will be subject to backend validation and permissions.
          </p>
        </div>

        <TransactionOperationReasonField
          value={reason}
          onChange={onReasonChange}
          required
          error={reasonError}
          disabled={submitting}
        />
      </div>
    </Dialog>
  );
}

export default TransactionOperationDialog;
