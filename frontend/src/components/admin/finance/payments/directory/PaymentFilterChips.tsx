'use client';

// ============================================================
// Financial Payments — Active Filter Chips
// ============================================================

import { X } from 'lucide-react';

import type { AdminFinancialPaymentFilters } from '@/features/admin/finance/payments';

type FilterKey = keyof AdminFinancialPaymentFilters;

export interface PaymentFilterChipsProps {
  filters: AdminFinancialPaymentFilters;
  onRemove: (key: FilterKey) => void;
  onClear?: () => void;
  className?: string;
}

function formatDate(value: string) {
  if (!value) return value;

  const date = new Date(`${value}T00:00:00`);

  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(date);
}

export function PaymentFilterChips({
  filters,
  onRemove,
  onClear,
  className,
}: PaymentFilterChipsProps) {
  const chips: { key: FilterKey; label: string }[] = [];

  if (filters.search?.trim()) {
    chips.push({ key: 'search', label: `Search: ${filters.search.trim()}` });
  }

  for (const status of filters.statuses ?? []) {
    chips.push({
      key: 'statuses',
      label: `Status: ${status}`,
    });
  }

  const fields: { key: FilterKey; label: string; value?: string }[] = [
    { key: 'accountId', label: 'Account', value: filters.accountId },
    { key: 'methodId', label: 'Method', value: filters.methodId },
    {
      key: 'transactionPublicId',
      label: 'Transaction',
      value: filters.transactionPublicId,
    },
    { key: 'referenceType', label: 'Reference type', value: filters.referenceType },
    {
      key: 'referencePublicId',
      label: 'Reference',
      value: filters.referencePublicId,
    },
    {
      key: 'initiatedFrom',
      label: 'Initiated from',
      value: filters.initiatedFrom,
    },
    {
      key: 'initiatedTo',
      label: 'Initiated to',
      value: filters.initiatedTo,
    },
    {
      key: 'createdFrom',
      label: 'Created from',
      value: filters.createdFrom,
    },
    {
      key: 'createdTo',
      label: 'Created to',
      value: filters.createdTo,
    },
  ];

  for (const field of fields) {
    if (field.value?.trim()) {
      const value =
        field.key === 'createdFrom' ||
        field.key === 'createdTo' ||
        field.key === 'initiatedFrom' ||
        field.key === 'initiatedTo'
          ? formatDate(field.value)
          : field.value;

      chips.push({
        key: field.key,
        label: `${field.label}: ${value}`,
      });
    }
  }

  if (chips.length === 0) return null;

  return (
    <div
      className={['flex flex-wrap items-center gap-2', className ?? ''].join(' ')}
      aria-label="Active payment filters"
    >
      {chips.map((chip, index) => (
        <span
          key={`${chip.key}-${chip.label}-${index}`}
          className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--background-subtle)] py-1 pl-3 pr-1 text-xs text-[var(--foreground-secondary)]"
        >
          <span className="break-all">{chip.label}</span>

          <button
            type="button"
            aria-label={`Remove ${chip.label} filter`}
            onClick={() => onRemove(chip.key)}
            className="shrink-0 rounded-full p-1 hover:bg-[var(--surface)] hover:text-[var(--foreground)]"
          >
            <X aria-hidden="true" className="h-3 w-3" />
          </button>
        </span>
      ))}

      {onClear ? (
        <button
          type="button"
          onClick={onClear}
          className="px-2 py-1 text-xs font-medium text-[var(--foreground-muted)] underline underline-offset-4 hover:text-[var(--foreground)]"
        >
          Clear all
        </button>
      ) : null}
    </div>
  );
}

export default PaymentFilterChips;