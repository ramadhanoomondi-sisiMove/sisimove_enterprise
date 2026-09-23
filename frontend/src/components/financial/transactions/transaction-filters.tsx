// =============================================================================
// sisiMove — Financial Transaction Filters
// =============================================================================
//
// Presentation-only transaction filter controls.
//
// Available member-facing views:
// - All;
// - Money in;
// - Money out.
//
// Direction is supplied by the transaction feature/container. This component
// does not inspect transaction entries or implement accounting logic.
//
// =============================================================================

'use client';

import type { ReactNode } from 'react';

// =============================================================================
// Types
// =============================================================================

export type TransactionFilter =
  | 'ALL'
  | 'MONEY_IN'
  | 'MONEY_OUT';

export interface TransactionFiltersProps {
  readonly value: TransactionFilter;
  readonly onChange: (
    value: TransactionFilter,
  ) => void;
  readonly disabled?: boolean;
}

// =============================================================================
// Options
// =============================================================================

const FILTERS: readonly {
  value: TransactionFilter;
  label: string;
}[] = [
  {
    value: 'ALL',
    label: 'All',
  },
  {
    value: 'MONEY_IN',
    label: 'Money in',
  },
  {
    value: 'MONEY_OUT',
    label: 'Money out',
  },
];

// =============================================================================
// Component
// =============================================================================

export function TransactionFilters({
  value,
  onChange,
  disabled = false,
}: TransactionFiltersProps): ReactNode {
  return (
    <div
      className="flex w-full overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-1"
      role="tablist"
      aria-label="Transaction filters"
    >
      {FILTERS.map((filter) => {
        const selected =
          value === filter.value;

        return (
          <button
            key={filter.value}
            type="button"
            role="tab"
            aria-selected={selected}
            disabled={disabled}
            onClick={() =>
              onChange(filter.value)
            }
            className={[
              'min-h-9 shrink-0 rounded-[var(--radius-md)] px-3.5',
              'text-sm font-medium transition',
              'focus-visible:outline-none',
              'focus-visible:ring-2',
              'focus-visible:ring-[var(--brand)]',
              'focus-visible:ring-offset-1',
              selected
                ? 'bg-[var(--brand)] text-[var(--brand-foreground)]'
                : 'text-[var(--foreground-secondary)] hover:bg-[var(--background-subtle)] hover:text-[var(--foreground)]',
              disabled
                ? 'cursor-not-allowed opacity-50'
                : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}