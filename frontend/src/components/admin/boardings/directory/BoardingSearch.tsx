// src/features/admin/boardings/directory/BoardingSearch.tsx
// -----------------------------------------------------------------------------
// sisiMove — Admin Boarding Search
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Provide an accessible boarding search input
// - Support controlled search state
// - Allow the user to clear the search
// - Keep filtering logic in the parent component
//
// -----------------------------------------------------------------------------

'use client';

import { useId } from 'react';
import { Search, X } from 'lucide-react';

import { cn } from '@/foundation/utils/cn';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface BoardingSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function BoardingSearch({
  value,
  onChange,
  placeholder = 'Search boarding ID, journey, or provider…',
  label = 'Search boarding records',
  disabled = false,
  className,
}: BoardingSearchProps) {
  const generatedId = useId();
  const inputId = `boarding-directory-search-${generatedId}`;

  return (
    <div className={cn('w-full', className)}>
      <label
        htmlFor={inputId}
        className="mb-1.5 block text-sm font-medium text-[var(--foreground)]"
      >
        {label}
      </label>

      <div className="relative">
        <Search
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute left-3 top-1/2',
            'h-4 w-4 -translate-y-1/2',
            'text-[var(--foreground-muted)]',
          )}
        />

        <input
          id={inputId}
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          aria-label={label}
          className={cn(
            'min-h-11 w-full rounded-[var(--radius-md)] border',
            'border-[var(--border)] bg-[var(--surface)]',
            'py-2 pl-10 pr-10 text-sm text-[var(--foreground)]',
            'placeholder:text-[var(--foreground-muted)]',
            'outline-none transition-colors',
            'hover:border-[var(--border-strong)]',
            'focus:border-[var(--brand)]',
            'focus:ring-2 focus:ring-[var(--brand)]/10',
            'disabled:cursor-not-allowed',
            'disabled:bg-[var(--background-muted)]',
            'disabled:opacity-60',
          )}
        />

        {value.length > 0 && !disabled && (
          <button
            type="button"
            onClick={() => onChange('')}
            aria-label="Clear boarding search"
            title="Clear search"
            className={cn(
              'absolute right-2 top-1/2',
              '-translate-y-1/2',
              'inline-flex h-7 w-7 items-center justify-center',
              'rounded-[var(--radius-sm)]',
              'text-[var(--foreground-muted)]',
              'transition-colors',
              'hover:bg-[var(--background-muted)]',
              'hover:text-[var(--foreground)]',
              'focus-visible:outline-none',
              'focus-visible:ring-2',
              'focus-visible:ring-[var(--brand)]/30',
            )}
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
