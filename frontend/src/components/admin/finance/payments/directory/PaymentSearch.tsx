'use client';

// ============================================================
// Financial Payments — Search
// ============================================================

import { Search, X } from 'lucide-react';

export interface PaymentSearchProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export function PaymentSearch({
  value,
  onChange,
  disabled = false,
  placeholder = 'Search by payment or transaction reference…',
  className,
}: PaymentSearchProps) {
  return (
    <div className={['relative', className ?? ''].join(' ')}>
      <label htmlFor="payment-directory-search" className="sr-only">
        Search payments
      </label>

      <Search
        aria-hidden="true"
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--foreground-muted)]"
      />

      <input
        id="payment-directory-search"
        type="search"
        value={value}
        onChange={(event) => onChange(event.currentTarget.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={[
          'min-h-11 w-full rounded-xl border border-[var(--border)]',
          'bg-[var(--surface)] py-2 pl-10 pr-10 text-sm text-[var(--foreground)]',
          'outline-none placeholder:text-[var(--foreground-muted)]',
          'focus-visible:ring-2 focus-visible:ring-[var(--brand)]',
          'disabled:cursor-not-allowed disabled:opacity-60',
        ].join(' ')}
      />

      {value ? (
        <button
          type="button"
          aria-label="Clear payment search"
          disabled={disabled}
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-[var(--foreground-muted)] hover:bg-[var(--background-subtle)] hover:text-[var(--foreground)] disabled:opacity-50"
        >
          <X aria-hidden="true" className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  );
}

export default PaymentSearch;