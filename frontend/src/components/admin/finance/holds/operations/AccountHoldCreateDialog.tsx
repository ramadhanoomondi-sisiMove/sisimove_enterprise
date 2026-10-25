'use client';

import { useState, type FormEvent } from 'react';

import {
  AdminAccountHoldReferenceType,
  type CreateAdminAccountHoldRequest,
} from '@/features/admin/finance/holds/models';
import { Button } from '@/components/ui/button';
import { cn } from '@/foundation/utils/cn';

export interface AccountHoldCreateDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (
    request: CreateAdminAccountHoldRequest,
  ) => void | Promise<void>;
  isSubmitting?: boolean;
  errorMessage?: string;
  className?: string;
}

const REFERENCE_TYPES = [
  {
    value: AdminAccountHoldReferenceType.JOURNEY_BOOKING,
    label: 'Journey booking',
  },
  {
    value: AdminAccountHoldReferenceType.JOURNEY_COMPLETION,
    label: 'Journey completion',
  },
  {
    value: AdminAccountHoldReferenceType.COMMERCIAL_BOOKING,
    label: 'Commercial booking',
  },
];

function toIsoTimestamp(value: string): string | undefined {
  if (!value) return undefined;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

const inputClassName =
  'w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--foreground)] outline-none focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/20 disabled:opacity-60';

const labelClassName =
  'block text-sm font-medium text-[var(--foreground)]';

export function AccountHoldCreateDialog({
  open,
  onClose,
  onSubmit,
  isSubmitting = false,
  errorMessage,
  className,
}: AccountHoldCreateDialogProps) {
  const [accountPublicId, setAccountPublicId] = useState('');
  const [amount, setAmount] = useState('');
  const [referenceType, setReferenceType] = useState('');
  const [referencePublicId, setReferencePublicId] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [correlationId, setCorrelationId] = useState('');
  const [causationId, setCausationId] = useState('');

  if (!open) return null;

  const resetForm = () => {
    setAccountPublicId('');
    setAmount('');
    setReferenceType('');
    setReferencePublicId('');
    setExpiresAt('');
    setCorrelationId('');
    setCausationId('');
  };

  const handleClose = () => {
    if (isSubmitting) return;

    resetForm();
    onClose();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsedAmount = Number(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) return;

    const expiry = toIsoTimestamp(expiresAt);

    const request: CreateAdminAccountHoldRequest = {
      accountPublicId: accountPublicId.trim(),
      amount: parsedAmount,
      ...(referenceType ? { referenceType } : {}),
      ...(referencePublicId.trim()
        ? { referencePublicId: referencePublicId.trim() }
        : {}),
      ...(expiry ? { expiresAt: expiry } : {}),
      ...(correlationId.trim()
        ? { correlationId: correlationId.trim() }
        : {}),
      ...(causationId.trim() ? { causationId: causationId.trim() } : {}),
    };

    await onSubmit(request);
  };

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
        aria-labelledby="account-hold-create-title"
        className={cn(
          'my-auto w-full max-w-2xl rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xl',
          className,
        )}
      >
        <div className="mb-5">
          <h2
            id="account-hold-create-title"
            className="text-lg font-semibold text-[var(--foreground)]"
          >
            Create account hold
          </h2>
          <p className="mt-2 text-sm text-[var(--foreground-secondary)]">
            Record the account and amount to place on hold. Reference and audit
            fields are optional.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="new-hold-account-id" className={labelClassName}>
              Account public ID
            </label>
            <input
              id="new-hold-account-id"
              value={accountPublicId}
              onChange={(event) => setAccountPublicId(event.target.value)}
              required
              autoComplete="off"
              disabled={isSubmitting}
              placeholder="Enter the existing account public ID"
              className={inputClassName}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="new-hold-amount" className={labelClassName}>
              Amount
            </label>
            <input
              id="new-hold-amount"
              type="number"
              min="0.01"
              step="any"
              inputMode="decimal"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              required
              disabled={isSubmitting}
              placeholder="Enter amount to hold"
              className={inputClassName}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="new-hold-reference-type" className={labelClassName}>
                Reference type
              </label>
              <select
                id="new-hold-reference-type"
                value={referenceType}
                onChange={(event) => setReferenceType(event.target.value)}
                disabled={isSubmitting}
                className={inputClassName}
              >
                <option value="">No reference type</option>
                {REFERENCE_TYPES.map((reference) => (
                  <option key={reference.value} value={reference.value}>
                    {reference.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="new-hold-reference-id" className={labelClassName}>
                Reference public ID
              </label>
              <input
                id="new-hold-reference-id"
                value={referencePublicId}
                onChange={(event) => setReferencePublicId(event.target.value)}
                autoComplete="off"
                disabled={isSubmitting}
                placeholder="Optional"
                className={inputClassName}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="new-hold-expiry" className={labelClassName}>
              Expiry date and time (optional)
            </label>
            <input
              id="new-hold-expiry"
              type="datetime-local"
              value={expiresAt}
              onChange={(event) => setExpiresAt(event.target.value)}
              disabled={isSubmitting}
              className={inputClassName}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="new-hold-correlation" className={labelClassName}>
                Correlation ID (optional)
              </label>
              <input
                id="new-hold-correlation"
                value={correlationId}
                onChange={(event) => setCorrelationId(event.target.value)}
                autoComplete="off"
                disabled={isSubmitting}
                className={inputClassName}
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="new-hold-causation" className={labelClassName}>
                Causation ID (optional)
              </label>
              <input
                id="new-hold-causation"
                value={causationId}
                onChange={(event) => setCausationId(event.target.value)}
                autoComplete="off"
                disabled={isSubmitting}
                className={inputClassName}
              />
            </div>
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
              variant="primary"
              loading={isSubmitting}
              disabled={
                !accountPublicId.trim() ||
                !amount.trim() ||
                !Number.isFinite(Number(amount)) ||
                Number(amount) <= 0
              }
            >
              Create hold
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}