
'use client';

import { Search, X } from 'lucide-react';
import type { ChangeEvent, HTMLAttributes } from 'react';

import { cn } from '@/foundation/utils/cn';

export interface AssetSearchProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly placeholder?: string;
  readonly disabled?: boolean;
  readonly inputId?: string;
}

export function AssetSearch({
  value,
  onChange,
  placeholder = 'Search assets by name, ID, or file type...',
  disabled = false,
  inputId = 'asset-directory-search',
  className,
  ...props
}: AssetSearchProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  const handleClear = () => {
    onChange('');
  };

  return (
    <div
      {...props}
      className={cn('w-full', className)}
    >
      <label
        htmlFor={inputId}
        className="sr-only"
      >
        Search assets
      </label>

      <div
        className={cn(
          'group flex h-11 w-full items-center gap-3 rounded-xl border',
          'border-[var(--border)] bg-[var(--background)] px-3.5',
          'transition-colors',
          'focus-within:border-[var(--brand)]',
          'focus-within:ring-2 focus-within:ring-[var(--brand-soft)]',
          disabled && 'cursor-not-allowed opacity-60',
        )}
      >
        <Search
          aria-hidden="true"
          className="size-[18px] shrink-0 text-[var(--muted-foreground)]"
        />

        <input
          id={inputId}
          type="search"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          className={cn(
            'h-full min-w-0 flex-1 bg-transparent text-sm',
            'text-[var(--foreground)] outline-none',
            'placeholder:text-[var(--muted-foreground)]',
            'disabled:cursor-not-allowed',
          )}
        />

        {value.length > 0 && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear asset search"
            className={cn(
              'inline-flex size-7 shrink-0 items-center justify-center',
              'rounded-lg text-[var(--muted-foreground)]',
              'transition-colors hover:bg-[var(--muted)]',
              'hover:text-[var(--foreground)]',
              'focus-visible:outline-none focus-visible:ring-2',
              'focus-visible:ring-[var(--brand)]',
            )}
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        )}
      </div>
    </div>
  );
}

export default AssetSearch;
