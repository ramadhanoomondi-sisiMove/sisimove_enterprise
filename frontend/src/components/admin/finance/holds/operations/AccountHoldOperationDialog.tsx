'use client';

import { useState, type FormEvent } from 'react';
import {
  AdminAccountHoldOperation,
  type AdminAccountHold,
  type CaptureAdminAccountHoldRequest,
  type ReleaseAdminAccountHoldRequest,
  type CancelAdminAccountHoldRequest,
} from '@/features/admin/finance/holds/models';
import { Button } from '@/components/ui/button';
import { cn } from '@/foundation/utils/cn';

type OperationRequest =
  | CaptureAdminAccountHoldRequest
  | ReleaseAdminAccountHoldRequest
  | CancelAdminAccountHoldRequest;

export interface AccountHoldOperationDialogProps {
  open: boolean;
  hold: AdminAccountHold;
  operation: AdminAccountHoldOperation | null;
  onClose: () => void;
  onSubmit: (
    operation: AdminAccountHoldOperation,
    request: OperationRequest,
  ) => void | Promise<void>;
  isSubmitting?: boolean;
  errorMessage?: string;
  className?: string;
}

const OPERATION_COPY = {
  [AdminAccountHoldOperation.CAPTURE]: {
    title: 'Capture account hold',
    description: 'Record the transaction that captures funds from this hold.',
    fieldLabel: 'Capture transaction ID',
    fieldName: 'captureTransactionPublicId',
    submitLabel: 'Capture hold',
  },
  [AdminAccountHoldOperation.RELEASE]: {
    title: 'Release account hold',
    description: 'Record the transaction used to release the held funds.',
    fieldLabel: 'Release transaction ID',
    fieldName: 'releaseTransactionPublicId',
    submitLabel: 'Release hold',
  },
  [AdminAccountHoldOperation.CANCEL]: {
    title: 'Cancel account hold',
    description: 'Confirm the transaction reference associated with cancelling this hold.',
    fieldLabel: 'Release transaction ID',
    fieldName: 'releaseTransactionPublicId',
    submitLabel: 'Cancel hold',
  },
} as const;

function toIsoTimestamp(value: string): string | undefined {
  if (!value) return undefined;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

export function AccountHoldOperationDialog({
  open,
  hold,
  operation,
  onClose,
  onSubmit,
  isSubmitting = false,
  errorMessage,
  className,
}: AccountHoldOperationDialogProps) {
  const [transactionPublicId, setTransactionPublicId] = useState('');
  const [timestamp, setTimestamp] = useState('');

  if (!open || !operation) return null;

  const copy = OPERATION_COPY[operation];

  const handleClose = () => {
    if (isSubmitting) return;

    setTransactionPublicId('');
    setTimestamp('');
    onClose();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const transactionId = transactionPublicId.trim();
    if (!transactionId) return;

    const isoTimestamp = toIsoTimestamp(timestamp);

    if (operation === AdminAccountHoldOperation.CAPTURE) {
      const request: CaptureAdminAccountHoldRequest = {
        captureTransactionPublicId: transactionId,
        ...(isoTimestamp ? { capturedAt: isoTimestamp } : {}),
      };

      await onSubmit(operation, request);
      return;
    }

    if (operation === AdminAccountHoldOperation.RELEASE) {
      const request: ReleaseAdminAccountHoldRequest = {
        releaseTransactionPublicId: transactionId,
        ...(isoTimestamp ? { releasedAt: isoTimestamp } : {}),
      };

      await onSubmit(operation, request);
      return;
    }

    const request: CancelAdminAccountHoldRequest = {
      releaseTransactionPublicId: transactionId,
      ...(isoTimestamp ? { cancelledAt: isoTimestamp } : {}),
    };

    await onSubmit(operation, request);
  };

  const timestampLabel =
    operation === AdminAccountHoldOperation.CAPTURE
      ? 'Capture date and time (optional)'
      : operation === AdminAccountHoldOperation.RELEASE
        ? 'Release date and time (optional)'
        : 'Cancellation date and time (optional)';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) handleClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="account-hold-operation-dialog-title"
        className={cn(
          'my-auto w-full max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xl',
          className,
        )}
      >
        <div className="mb-5">
          <h2
            id="account-hold-operation-dialog-title"
            className="text-lg font-semibold text-[var(--foreground)]"
          >
            {copy.title}
          </h2>
          <p className="mt-2 text-sm text-[var(--foreground-secondary)]">
            {copy.description}
          </p>
        </div>

        <div className="mb-5 rounded-lg bg-[var(--background-subtle)] p-3">
          <p className="text-xs text-[var(--foreground-muted)]">Hold ID</p>
          <p className="mt-1 break-all text-sm font-medium text-[var(--foreground)]">
            {hold.publicId}
          </p>
          <p className="mt-2 text-sm text-[var(--foreground-secondary)]">
            Amount: {new Intl.NumberFormat('en-KE', {
              style: 'currency',
              currency: hold.currency || 'KES',
            }).format(hold.amount)}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="account-hold-operation-transaction-id"
              className="block text-sm font-medium text-[var(--foreground)]"
            >
              {copy.fieldLabel}
            </label>
            <input
              id="account-hold-operation-transaction-id"
              name={copy.fieldName}
              value={transactionPublicId}
              onChange={(event) => setTransactionPublicId(event.target.value)}
              required
              autoComplete="off"
              disabled={isSubmitting}
              placeholder="Enter transaction public ID"
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--foreground)] outline-none focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/20 disabled:opacity-60"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="account-hold-operation-timestamp"
              className="block text-sm font-medium text-[var(--foreground)]"
            >
              {timestampLabel}
            </label>
            <input
              id="account-hold-operation-timestamp"
              type="datetime-local"
              value={timestamp}
              onChange={(event) => setTimestamp(event.target.value)}
              disabled={isSubmitting}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--foreground)] outline-none focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/20 disabled:opacity-60"
            />
          </div>

          {errorMessage ? (
            <p role="alert" className="text-sm text-[var(--danger)]">
              {errorMessage}
            </p>
          ) : null}

          <div className="flex flex-wrap justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant={operation === AdminAccountHoldOperation.CANCEL ? 'danger' : 'primary'}
              loading={isSubmitting}
              disabled={!transactionPublicId.trim()}
            >
              {copy.submitLabel}
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}