
'use client';

import { Search, X } from 'lucide-react';

interface BookingSearchProps {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function BookingSearch({
  value,
  onChange,
  onClear,
  placeholder = 'Search booking, passenger, or journey ID...',
  className = '',
  disabled = false,
}: BookingSearchProps) {
  const handleClear = () => {
    onChange('');
    onClear?.();
  };

  return (
    <div className={`w-full ${className}`}>
      <label
        htmlFor="admin-booking-search"
        className="sr-only"
      >
        Search bookings
      </label>

      <div className="relative">
        <Search
          size={18}
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]"
        />

        <input
          id="admin-booking-search"
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          className="h-11 w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--background)] py-2 pl-10 pr-10 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--foreground-muted)] focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/20 disabled:cursor-not-allowed disabled:opacity-50"
        />

        {value.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            disabled={disabled}
            aria-label="Clear booking search"
            title="Clear search"
            className="absolute right-2 top-1/2 inline-flex size-7 -translate-y-1/2 items-center justify-center rounded-[var(--radius-md)] text-[var(--foreground-muted)] transition hover:bg-[var(--background-subtle)] hover:text-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={16} aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}
