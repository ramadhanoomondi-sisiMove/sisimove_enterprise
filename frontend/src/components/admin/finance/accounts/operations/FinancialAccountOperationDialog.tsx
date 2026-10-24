'use client';

// -----------------------------------------------------------------------------
// sisiMove Admin — Financial Account Operation Dialog
// -----------------------------------------------------------------------------
//
// Uses the shared Dialog, Button and Textarea primitives.
// Captures the effective date and optional operator context.
// Does not perform API requests or contain domain mutation logic.
// -----------------------------------------------------------------------------

import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Ban,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

import { Button, Dialog, Textarea } from '@/components/ui';

import type { AdminFinancialAccount } from '@/features/admin/finance/accounts/models';

import type { FinancialAccountOperation } from './FinancialAccountActionsMenu';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface FinancialAccountOperationDialogProps {
  account: AdminFinancialAccount;
  operation: FinancialAccountOperation | null;
  isPending?: boolean;
  onCancel: () => void;
  onConfirm: (details: {
    effectiveAt: string;
    reason?: string;
  }) => void;
}

// -----------------------------------------------------------------------------
// Operation Configuration
// -----------------------------------------------------------------------------

const OPERATION_COPY = {
  activate: {
    title: 'Activate financial account',
    description: 'This will request that the account be activated.',
    confirmLabel: 'Activate account',
    icon: CheckCircle2,
    iconTone: 'text-[var(--success)]',
    caution: false,
  },
  suspend: {
    title: 'Suspend financial account',
    description: 'This will request that the account be suspended.',
    confirmLabel: 'Suspend account',
    icon: Ban,
    iconTone: 'text-[var(--warning)]',
    caution: true,
  },
  close: {
    title: 'Close financial account',
    description:
      'Closing may be irreversible under the backend business rules. Confirm the account and policy before proceeding.',
    confirmLabel: 'Close account',
    icon: XCircle,
    iconTone: 'text-[var(--danger)]',
    caution: true,
  },
} as const;

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function toLocalDateTimeValue(date: Date): string {
  const offsetMs = date.getTimezoneOffset() * 60_000;

  return new Date(date.getTime() - offsetMs)
    .toISOString()
    .slice(0, 16);
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function FinancialAccountOperationDialog({
  account,
  operation,
  isPending = false,
  onCancel,
  onConfirm,
}: FinancialAccountOperationDialogProps) {
  const [effectiveAt, setEffectiveAt] = useState(() =>
    toLocalDateTimeValue(new Date()),
  );

  const [reason, setReason] = useState('');

  const config = operation ? OPERATION_COPY[operation] : null;
  const Icon = config?.icon;

  const isValid = useMemo(() => {
    if (!effectiveAt) {
      return false;
    }

    return !Number.isNaN(new Date(effectiveAt).getTime());
  }, [effectiveAt]);

  const handleOpenChange = (open: boolean) => {
    if (!open && !isPending) {
      onCancel();
    }
  };

  const handleConfirm = () => {
    if (!operation || !isValid || isPending) {
      return;
    }

    onConfirm({
      effectiveAt: new Date(effectiveAt).toISOString(),
      reason: reason.trim() || undefined,
    });
  };

  return (
    <Dialog
      open={Boolean(operation)}
      onOpenChange={handleOpenChange}
      title={config?.title ?? 'Account operation'}
      description={config?.description ?? ''}
      size="lg"
      closeOnBackdropClick={!isPending}
      closeOnEscape={!isPending}
      showCloseButton={!isPending}
    >
      {operation && config && Icon && (
        <div className="space-y-5">
          {/* Target account */}

          <div className="rounded-xl border border-[var(--border)] bg-[var(--background-muted)] p-4">
            <div className="flex items-start gap-3">
              <span className={`mt-0.5 shrink-0 ${config.iconTone}`}>
                <Icon size={20} aria-hidden="true" />
              </span>

              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--foreground-muted)]">
                  Target account
                </p>

                <p className="mt-1 break-all font-mono text-sm text-[var(--foreground)]">
                  {account.publicId}
                </p>

                <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
                  Current status: {account.status}
                </p>
              </div>
            </div>
          </div>

          {/* Caution */}

          {config.caution && (
            <div className="flex items-start gap-2 rounded-xl border border-[var(--warning)]/30 bg-[var(--background-muted)] p-3 text-sm text-[var(--foreground-secondary)]">
              <AlertTriangle
                size={17}
                className="mt-0.5 shrink-0 text-[var(--warning)]"
                aria-hidden="true"
              />

              <p>
                {operation === 'close'
                  ? 'Verify there are no outstanding balances or operational dependencies, and confirm backend closure rules before continuing.'
                  : 'Suspending the account may interrupt account activity. Confirm this action is appropriate.'}
              </p>
            </div>
          )}

          {/* Effective date */}

          <div>
            <label
              htmlFor="financial-account-operation-effective-at"
              className="mb-1.5 block text-sm font-medium text-[var(--foreground)]"
            >
              Effective date and time
            </label>

            <input
              id="financial-account-operation-effective-at"
              type="datetime-local"
              value={effectiveAt}
              onChange={(event) => setEffectiveAt(event.target.value)}
              required
              disabled={isPending}
              aria-invalid={!isValid || undefined}
              className="h-11 w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--foreground)] outline-none transition-colors focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/10 disabled:cursor-not-allowed disabled:opacity-60"
            />

            <p className="mt-1 text-xs leading-5 text-[var(--foreground-muted)]">
              Uses your browser&apos;s local time. The submitted value is
              converted to an ISO timestamp. Confirm that this matches the
              backend&apos;s expected timezone convention.
            </p>
          </div>

          {/* Optional operator context */}

          <Textarea
            id="financial-account-operation-reason"
            label="Internal reason (optional)"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="Add context for the operator."
            helperText="The current API request does not include this reason."
            rows={3}
            disabled={isPending}
          />

          {/* Actions */}

          <div className="flex flex-col-reverse gap-2 border-t border-[var(--border)] pt-4 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={isPending}
            >
              Cancel
            </Button>

            <Button
              variant={operation === 'close' ? 'danger' : 'primary'}
              onClick={handleConfirm}
              disabled={!isValid || isPending}
              loading={isPending}
              leadingIcon={
                !isPending ? (
                  <Icon size={16} aria-hidden="true" />
                ) : undefined
              }
            >
              {config.confirmLabel}
            </Button>
          </div>
        </div>
      )}
    </Dialog>
  );
}

export default FinancialAccountOperationDialog;
