// src/components/admin/finance/account-holds/directory/AccountHoldDirectoryHeader.tsx

import { ListFilter } from 'lucide-react';

import { cn } from '@/foundation/utils/cn';

export interface AccountHoldDirectoryHeaderProps {
  totalCount: number;
  filteredCount: number;
  className?: string;
}

export function AccountHoldDirectoryHeader({
  totalCount,
  filteredCount,
  className,
}: AccountHoldDirectoryHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
    >
      <div>
        <h2 className="text-base font-semibold text-[var(--foreground)]">
          Account hold directory
        </h2>
        <p className="mt-1 text-sm text-[var(--foreground-muted)]">
          Search and review financial holds across accounts.
        </p>
      </div>

      <div className="inline-flex w-fit items-center gap-2 rounded-[var(--radius-full)] border border-[var(--border)] bg-[var(--background-subtle)] px-3 py-2 text-sm">
        <ListFilter
          aria-hidden="true"
          className="size-4 text-[var(--foreground-muted)]"
        />
        <span className="text-[var(--foreground-secondary)]">
          Showing
        </span>
        <span className="font-semibold tabular-nums text-[var(--foreground)]">
          {filteredCount.toLocaleString('en-KE')}
        </span>
        <span className="text-[var(--foreground-muted)]">
          of {totalCount.toLocaleString('en-KE')}
        </span>
      </div>
    </div>
  );
}