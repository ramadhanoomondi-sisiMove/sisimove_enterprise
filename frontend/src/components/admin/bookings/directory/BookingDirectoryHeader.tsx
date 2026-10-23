
'use client';

import { RefreshCw } from 'lucide-react';

interface BookingDirectoryHeaderProps {
  totalBookings?: number;
  isLoading?: boolean;
  isRefreshing?: boolean;
  onRefresh?: () => void;
  className?: string;
}

export function BookingDirectoryHeader({
  totalBookings,
  isLoading = false,
  isRefreshing = false,
  onRefresh,
  className = '',
}: BookingDirectoryHeaderProps) {
  const hasTotal = totalBookings != null && Number.isFinite(totalBookings);

  return (
    <header
      className={`flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between ${className}`}
    >
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">
          Bookings
        </h1>

        <p className="mt-1 max-w-2xl text-sm text-[var(--foreground-secondary)]">
          Review and manage journey bookings, booking statuses, and payment records.
        </p>

        {hasTotal && (
          <p
            aria-live="polite"
            className="mt-2 text-xs text-[var(--foreground-muted)]"
          >
            {isLoading
              ? 'Updating booking records…'
              : `${Math.max(0, totalBookings)} ${
                  totalBookings === 1 ? 'booking' : 'bookings'
                } found`}
          </p>
        )}
      </div>

      {onRefresh && (
        <button
          type="button"
          onClick={onRefresh}
          disabled={isLoading || isRefreshing}
          className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 self-start rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-sm font-medium text-[var(--foreground-secondary)] transition hover:bg-[var(--background-subtle)] hover:text-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-50 sm:self-center"
        >
          <RefreshCw
            size={16}
            aria-hidden="true"
            className={isRefreshing ? 'animate-spin' : ''}
          />
          {isRefreshing ? 'Refreshing…' : 'Refresh'}
        </button>
      )}
    </header>
  );
}

export type { BookingDirectoryHeaderProps };
