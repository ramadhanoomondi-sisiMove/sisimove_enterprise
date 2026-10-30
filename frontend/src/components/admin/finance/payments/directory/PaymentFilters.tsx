'use client';

// ============================================================
// Financial Payments — Filters
// ============================================================

import { Filter, RotateCcw } from 'lucide-react';

import type {
  AdminFinancialPaymentFilters,
  AdminFinancialPaymentStatus,
} from '@/features/admin/finance/payments';

const PAYMENT_STATUSES: AdminFinancialPaymentStatus[] = [
  'pending',
  'processing',
  'succeeded',
  'failed',
  'cancelled',
  'expired',
];

export interface PaymentFiltersProps {
  filters: AdminFinancialPaymentFilters;
  onChange: (filters: AdminFinancialPaymentFilters) => void;
  onClear?: () => void;
  disabled?: boolean;
  className?: string;
}

function fieldClassName() {
  return [
    'mt-1.5 min-h-10 w-full rounded-lg border border-[var(--border)]',
    'bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)]',
    'outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]',
    'disabled:cursor-not-allowed disabled:opacity-60',
  ].join(' ');
}

function labelClassName() {
  return 'block text-sm font-medium text-[var(--foreground-secondary)]';
}

function statusLabel(status: AdminFinancialPaymentStatus) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function PaymentFilters({
  filters,
  onChange,
  onClear,
  disabled = false,
  className,
}: PaymentFiltersProps) {
  function update<K extends keyof AdminFinancialPaymentFilters>(
    key: K,
    value: AdminFinancialPaymentFilters[K],
  ) {
    onChange({ ...filters, [key]: value });
  }

  function toggleStatus(status: AdminFinancialPaymentStatus) {
    const selected = filters.statuses ?? [];
    const next = selected.includes(status)
      ? selected.filter((item) => item !== status)
      : [...selected, status];

    update('statuses', next);
  }

  return (
    <section
      aria-label="Payment filters"
      className={[
        'rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4',
        className ?? '',
      ].join(' ')}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Filter aria-hidden="true" className="h-4 w-4 text-[var(--foreground-muted)]" />
          <h2 className="text-sm font-semibold text-[var(--foreground)]">
            Filters
          </h2>
        </div>

        {onClear ? (
          <button
            type="button"
            onClick={onClear}
            disabled={disabled}
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium text-[var(--foreground-secondary)] hover:bg-[var(--background-subtle)] disabled:opacity-50"
          >
            <RotateCcw aria-hidden="true" className="h-3.5 w-3.5" />
            Clear filters
          </button>
        ) : null}
      </div>

      <fieldset className="mt-4" disabled={disabled}>
        <legend className={labelClassName()}>Payment status</legend>

        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-3">
          {PAYMENT_STATUSES.map((status) => (
            <label
              key={status}
              className="inline-flex cursor-pointer items-center gap-2 text-sm text-[var(--foreground-secondary)]"
            >
              <input
                type="checkbox"
                checked={(filters.statuses ?? []).includes(status)}
                onChange={() => toggleStatus(status)}
                className="h-4 w-4 rounded border-[var(--border)] accent-[var(--brand)]"
              />
              {statusLabel(status)}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <label className={labelClassName()}>
          Created from
          <input
            type="date"
            value={filters.createdFrom ?? ''}
            onChange={(event) => update('createdFrom', event.currentTarget.value)}
            className={fieldClassName()}
          />
        </label>

        <label className={labelClassName()}>
          Created to
          <input
            type="date"
            value={filters.createdTo ?? ''}
            min={filters.createdFrom || undefined}
            onChange={(event) => update('createdTo', event.currentTarget.value)}
            className={fieldClassName()}
          />
        </label>

        <label className={labelClassName()}>
          Account ID
          <input
            type="text"
            value={filters.accountId ?? ''}
            onChange={(event) => update('accountId', event.currentTarget.value)}
            placeholder="Account public ID"
            className={fieldClassName()}
          />
        </label>

        <label className={labelClassName()}>
          Payment method ID
          <input
            type="text"
            value={filters.methodId ?? ''}
            onChange={(event) => update('methodId', event.currentTarget.value)}
            placeholder="Method public ID"
            className={fieldClassName()}
          />
        </label>

        <label className={labelClassName()}>
          Transaction public ID
          <input
            type="text"
            value={filters.transactionPublicId ?? ''}
            onChange={(event) =>
              update('transactionPublicId', event.currentTarget.value)
            }
            placeholder="Transaction public ID"
            className={fieldClassName()}
          />
        </label>
      </div>
    </section>
  );
}

export default PaymentFilters;