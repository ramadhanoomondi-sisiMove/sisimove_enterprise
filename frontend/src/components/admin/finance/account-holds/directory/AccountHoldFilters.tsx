// src/components/admin/finance/account-holds/directory/AccountHoldFilters.tsx

import { RotateCcw, SlidersHorizontal } from 'lucide-react';

import {
  AdminAccountHoldReferenceType,
  AdminAccountHoldStatus,
} from '@/features/admin/finance/account-holds/models';
import type { AdminAccountHoldFilters as HoldFilters } from '@/features/admin/finance/account-holds/models';
import { cn } from '@/foundation/utils/cn';

export interface AccountHoldFiltersProps {
  filters: HoldFilters;
  onChange: (filters: Partial<HoldFilters>) => void;
  onReset: () => void;
  currencies?: string[];
  className?: string;
}

const selectClassName = cn(
  'h-10 w-full min-w-0 rounded-[var(--radius-md)]',
  'border border-[var(--border)] bg-[var(--surface)] px-3',
  'text-sm text-[var(--foreground)] outline-none',
  'focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/15',
);

const STATUS_OPTIONS = [
  { value: 'ALL', label: 'All statuses' },
  { value: AdminAccountHoldStatus.ACTIVE, label: 'Active' },
  { value: AdminAccountHoldStatus.RELEASED, label: 'Released' },
  { value: AdminAccountHoldStatus.CAPTURED, label: 'Captured' },
  { value: AdminAccountHoldStatus.CANCELLED, label: 'Cancelled' },
] as const;

const REFERENCE_OPTIONS = [
  { value: '', label: 'All reference types' },
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
] as const;

export function AccountHoldFilters({
  filters,
  onChange,
  onReset,
  currencies = [],
  className,
}: AccountHoldFiltersProps) {
  const hasActiveFilters =
    (filters.status !== undefined && filters.status !== 'ALL') ||
    Boolean(filters.referenceType) ||
    Boolean(filters.currency) ||
    filters.expired !== undefined;

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center gap-2 text-sm font-medium text-[var(--foreground-secondary)]">
        <SlidersHorizontal aria-hidden="true" className="size-4" />
        Filters
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div>
          <label
            htmlFor="account-hold-status-filter"
            className="mb-1.5 block text-xs font-medium text-[var(--foreground-muted)]"
          >
            Status
          </label>
          <select
            id="account-hold-status-filter"
            value={filters.status ?? 'ALL'}
            onChange={(event) =>
              onChange({
                status: event.target.value as HoldFilters['status'],
                page: 1,
              })
            }
            className={selectClassName}
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="account-hold-reference-filter"
            className="mb-1.5 block text-xs font-medium text-[var(--foreground-muted)]"
          >
            Reference type
          </label>
          <select
            id="account-hold-reference-filter"
            value={filters.referenceType ?? ''}
            onChange={(event) =>
              onChange({
                referenceType: event.target.value || undefined,
                page: 1,
              })
            }
            className={selectClassName}
          >
            {REFERENCE_OPTIONS.map((option) => (
              <option key={option.value || 'all'} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="account-hold-currency-filter"
            className="mb-1.5 block text-xs font-medium text-[var(--foreground-muted)]"
          >
            Currency
          </label>
          <select
            id="account-hold-currency-filter"
            value={filters.currency ?? ''}
            onChange={(event) =>
              onChange({
                currency: event.target.value || undefined,
                page: 1,
              })
            }
            className={selectClassName}
          >
            <option value="">All currencies</option>
            {currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="account-hold-expiry-filter"
            className="mb-1.5 block text-xs font-medium text-[var(--foreground-muted)]"
          >
            Expiry
          </label>
          <select
            id="account-hold-expiry-filter"
            value={
              filters.expired === undefined
                ? 'ALL'
                : filters.expired
                  ? 'EXPIRED'
                  : 'NOT_EXPIRED'
            }
            onChange={(event) => {
              const value = event.target.value;

              onChange({
                expired:
                  value === 'ALL'
                    ? undefined
                    : value === 'EXPIRED',
                page: 1,
              });
            }}
            className={selectClassName}
          >
            <option value="ALL">All holds</option>
            <option value="EXPIRED">Expired</option>
            <option value="NOT_EXPIRED">Not expired</option>
          </select>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 rounded-[var(--radius-md)] px-2 py-1.5 text-sm font-medium text-[var(--foreground-secondary)] hover:bg-[var(--background-muted)] hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
          >
            <RotateCcw aria-hidden="true" className="size-3.5" />
            Reset filters
          </button>
        </div>
      )}
    </div>
  );
}