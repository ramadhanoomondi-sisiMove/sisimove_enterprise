// src/features/admin/boardings/directory/BoardingDirectoryHeader.tsx
// -----------------------------------------------------------------------------
// sisiMove — Admin Boarding Directory Header
// -----------------------------------------------------------------------------

'use client';

import { CalendarClock, ClipboardList, RefreshCw } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/foundation/utils/cn';

export interface BoardingDirectoryHeaderProps {
  title?: string;
  description?: string;
  totalBoardings?: number;
  lastUpdatedAt?: string | null;
  isLoading?: boolean;
  isRefreshing?: boolean;
  onRefresh?: () => void | Promise<void>;
  className?: string;
}

function formatDateTime(value?: string | null): string | null {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

export function BoardingDirectoryHeader({
  title = 'Boarding Management',
  description = 'Review boarding records, monitor participant progress, and inspect journey boarding activity.',
  totalBoardings,
  lastUpdatedAt,
  isLoading = false,
  isRefreshing = false,
  onRefresh,
  className,
}: BoardingDirectoryHeaderProps) {
  const formattedLastUpdated = formatDateTime(lastUpdatedAt);
  const refreshDisabled = isLoading || isRefreshing;

  return (
    <header
      className={cn(
        'flex flex-col gap-5',
        'sm:flex-row sm:items-start sm:justify-between',
        className,
      )}
    >
      <div className="flex min-w-0 items-start gap-3">
        <div
          aria-hidden="true"
          className={cn(
            'flex h-11 w-11 shrink-0 items-center justify-center',
            'rounded-[var(--radius-lg)]',
            'bg-[var(--brand-soft)] text-[var(--brand)]',
          )}
        >
          <ClipboardList className="h-5 w-5" />
        </div>

        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl">
            {title}
          </h1>

          <p className="mt-1.5 max-w-3xl text-sm leading-6 text-[var(--foreground-secondary)] sm:text-base">
            {description}
          </p>

          {(typeof totalBoardings === 'number' ||
            formattedLastUpdated ||
            isRefreshing) && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {typeof totalBoardings === 'number' && (
                <Badge variant="outline">
                  {totalBoardings.toLocaleString()}{' '}
                  {totalBoardings === 1
                    ? 'boarding record'
                    : 'boarding records'}
                </Badge>
              )}

              {formattedLastUpdated && (
                <span className="inline-flex items-center gap-1.5 text-xs text-[var(--foreground-muted)]">
                  <CalendarClock
                    aria-hidden="true"
                    className="h-3.5 w-3.5"
                  />
                  Updated {formattedLastUpdated}
                </span>
              )}

              {isRefreshing && (
                <span role="status" className="text-xs text-[var(--foreground-muted)]">
                  Refreshing records…
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {onRefresh && (
        <button
          type="button"
          onClick={() => void onRefresh()}
          disabled={refreshDisabled}
          className={cn(
            'inline-flex min-h-10 shrink-0 items-center justify-center gap-2',
            'rounded-[var(--radius-md)] border border-[var(--border)]',
            'bg-[var(--surface)] px-3 py-2 text-sm font-medium',
            'text-[var(--foreground)] transition-colors',
            'hover:bg-[var(--background-subtle)]',
            'focus-visible:outline-none focus-visible:ring-2',
            'focus-visible:ring-[var(--brand)]/30',
            'disabled:cursor-not-allowed disabled:opacity-50',
          )}
        >
          <RefreshCw
            aria-hidden="true"
            className={cn('h-4 w-4', isRefreshing && 'animate-spin')}
          />
          Refresh
        </button>
      )}
    </header>
  );
}
