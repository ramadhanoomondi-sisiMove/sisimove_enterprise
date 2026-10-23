
'use client';

import { Search, X } from 'lucide-react';

import { cn } from '@/foundation/utils/cn';

interface JourneySearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export default function JourneySearch({
  value,
  onChange,
  placeholder = 'Search by route or journey ID...',
  className,
  disabled = false,
}: JourneySearchProps) {
  return (
    <div className={cn('w-full', className)}>
      <label
        htmlFor="journey-directory-search"
        className="mb-1.5 block text-xs font-medium text-[var(--foreground-secondary)]"
      >
        Search journeys
      </label>

      <div className="relative">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--foreground-muted)]"
        />

        <input
          id="journey-directory-search"
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          className={cn(
            'h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] pl-10 pr-10 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--foreground-subtle)] focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/15',
            'disabled:cursor-not-allowed disabled:opacity-50',
          )}
        />

        {value.length > 0 && (
          <button
            type="button"
            onClick={() => onChange('')}
            disabled={disabled}
            aria-label="Clear journey search"
            className="absolute right-2 top-1/2 inline-flex size-7 -translate-y-1/2 items-center justify-center rounded-lg text-[var(--foreground-muted)] transition hover:bg-[var(--background-muted)] hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] disabled:cursor-not-allowed"
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        )}
      </div>
    </div>
  );
}
