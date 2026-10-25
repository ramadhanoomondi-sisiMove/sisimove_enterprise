// src/components/admin/finance/account-holds/directory/AccountHoldSearch.tsx

import { Search, X } from 'lucide-react';

import { cn } from '@/foundation/utils/cn';

export interface AccountHoldSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function AccountHoldSearch({
  value,
  onChange,
  placeholder = 'Search hold ID, account ID or reference...',
  className,
}: AccountHoldSearchProps) {
  return (
    <div className={cn('relative min-w-0', className)}>
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--foreground-muted)]"
      />

      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label="Search account holds"
        className={cn(
          'h-11 w-full rounded-[var(--radius-md)] border border-[var(--border)]',
          'bg-[var(--surface)] py-2 pl-10 pr-10 text-sm text-[var(--foreground)]',
          'placeholder:text-[var(--foreground-subtle)]',
          'outline-none transition focus:border-[var(--brand)]',
          'focus:ring-2 focus:ring-[var(--brand)]/15',
        )}
      />

      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear search"
          className={cn(
            'absolute right-2 top-1/2 flex size-7 -translate-y-1/2',
            'items-center justify-center rounded-[var(--radius-sm)]',
            'text-[var(--foreground-muted)] hover:bg-[var(--background-muted)]',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]',
          )}
        >
          <X aria-hidden="true" className="size-4" />
        </button>
      )}
    </div>
  );
}