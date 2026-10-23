
'use client';

import {
  AlertTriangle,
  LoaderCircle,
  ShieldAlert,
} from 'lucide-react';
import type { ReactNode } from 'react';

import { Dialog } from '@/components/ui/dialog';
import { cn } from '@/foundation/utils/cn';

export type JourneyOperationConfirmVariant = 'primary' | 'danger';

export interface JourneyOperationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  pendingLabel?: string;
  variant?: JourneyOperationConfirmVariant;
  pending?: boolean;
  warning?: string;
  errorMessage?: string;
  children?: ReactNode;
  onConfirm: () => void;
}

export function JourneyOperationDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirm action',
  cancelLabel = 'Cancel',
  pendingLabel = 'Processing...',
  variant = 'primary',
  pending = false,
  warning,
  errorMessage,
  children,
  onConfirm,
}: JourneyOperationDialogProps) {
  const isDangerous = variant === 'danger';

  function handleConfirm() {
    if (pending) return;

    onConfirm();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (pending && !nextOpen) return;
        onOpenChange(nextOpen);
      }}
      title={title}
      description={description}
      size="md"
      closeOnBackdropClick={!pending}
      closeOnEscape={!pending}
      showCloseButton={!pending}
      footer={
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={pending}
            className="inline-flex min-h-10 items-center justify-center rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--foreground)] transition-colors hover:bg-[var(--background-subtle)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={pending}
            className={cn(
              'inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60',
              isDangerous
                ? 'bg-[var(--danger)] hover:opacity-90 focus-visible:outline-[var(--danger)]'
                : 'bg-[var(--brand)] hover:opacity-90 focus-visible:outline-[var(--brand)]',
            )}
          >
            {pending ? (
              <LoaderCircle
                className="h-4 w-4 animate-spin"
                aria-hidden="true"
              />
            ) : isDangerous ? (
              <ShieldAlert className="h-4 w-4" aria-hidden="true" />
            ) : null}

            <span>{pending ? pendingLabel : confirmLabel}</span>
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        {warning ? (
          <div
            role="note"
            className={cn(
              'flex items-start gap-3 rounded-xl border p-3',
              isDangerous
                ? 'border-[var(--danger)]/25 bg-[var(--danger-soft)]'
                : 'border-[var(--warning)]/25 bg-[var(--warning-soft)]',
            )}
          >
            <AlertTriangle
              className={cn(
                'mt-0.5 h-5 w-5 shrink-0',
                isDangerous
                  ? 'text-[var(--danger)]'
                  : 'text-[var(--warning)]',
              )}
              aria-hidden="true"
            />

            <p className="text-sm leading-5 text-[var(--foreground-secondary)]">
              {warning}
            </p>
          </div>
        ) : null}

        {children ? (
          <div className="text-sm text-[var(--foreground-secondary)]">
            {children}
          </div>
        ) : null}

        {errorMessage ? (
          <div
            role="alert"
            aria-live="assertive"
            className="rounded-xl border border-[var(--danger)]/25 bg-[var(--danger-soft)] p-3 text-sm text-[var(--danger)]"
          >
            {errorMessage}
          </div>
        ) : null}
      </div>
    </Dialog>
  );
}

export default JourneyOperationDialog;
