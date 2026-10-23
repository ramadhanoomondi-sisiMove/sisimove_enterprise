
import { Route } from 'lucide-react';

import { cn } from '@/foundation/utils/cn';

interface JourneyDirectoryHeaderProps {
  totalItems?: number;
  className?: string;
}

export default function JourneyDirectoryHeader({
  totalItems,
  className,
}: JourneyDirectoryHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
    >
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-sm">
          <Route
            aria-hidden="true"
            className="size-5 text-[var(--brand)]"
          />
        </div>

        <div className="min-w-0">
          <h2 className="text-lg font-semibold tracking-tight text-[var(--foreground)]">
            Journey directory
          </h2>

          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            Search, inspect, and manage journey records.
          </p>
        </div>
      </div>

      {totalItems !== undefined && (
        <div
          className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--background-subtle)] px-3 py-1.5"
          aria-live="polite"
        >
          <span className="size-2 rounded-full bg-[var(--brand)]" />

          <span className="text-sm font-medium tabular-nums text-[var(--foreground)]">
            {totalItems.toLocaleString()}
          </span>

          <span className="text-sm text-[var(--foreground-muted)]">
            {totalItems === 1 ? 'journey' : 'journeys'}
          </span>
        </div>
      )}
    </div>
  );
}
