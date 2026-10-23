
'use client';

import { Filter, RotateCcw } from 'lucide-react';

import { cn } from '@/foundation/utils/cn';
import type { JourneyFilters } from '@/features/admin/journeys/models/journey-filters.model';

interface JourneyFilterSummaryProps {
  filters: JourneyFilters;
  resultCount?: number;
  onReset?: () => void;
  className?: string;
}

function getActiveFilterCount(filters: JourneyFilters): number {
  return [
    filters.search.trim().length > 0,
    filters.status !== 'ALL',
    filters.providerPublicId.trim().length > 0,
    filters.departureFrom.length > 0,
    filters.departureTo.length > 0,
  ].filter(Boolean).length;
}

export default function JourneyFilterSummary({
  filters,
  resultCount,
  onReset,
  className,
}: JourneyFilterSummaryProps) {
  const activeFilterCount = getActiveFilterCount(filters);

  const hasActiveFilters = activeFilterCount > 0;

  return (
    <div
      className={cn(
        'flex flex-col gap-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--background-subtle)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
      aria-live="polite"
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)]">
          <Filter
            aria-hidden="true"
            className="size-4 text-[var(--foreground-secondary)]"
          />
        </div>

        <div className="min-w-0">
          <p className="text-sm font-medium text-[var(--foreground)]">
            {hasActiveFilters
              ? `${activeFilterCount} active ${activeFilterCount === 1 ? 'filter' : 'filters'}`
              : 'No filters applied'}
          </p>

          <p className="mt-0.5 text-xs text-[var(--foreground-muted)]">
            {resultCount === undefined
              ? hasActiveFilters
                ? 'Journey results reflect the current filter selections.'
                : 'Showing journeys using the current directory settings.'
              : `${resultCount.toLocaleString()} ${resultCount === 1 ? 'journey' : 'journeys'}${hasActiveFilters ? ' matching your filters' : ' found'}.`}
          </p>
        </div>
      </div>

      {hasActiveFilters && onReset && (
        <button
          type="button"
          onClick={onReset}
          className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-lg px-3 py-2 text-sm font-medium text-[var(--foreground-secondary)] transition-colors hover:bg-[var(--surface)] hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] sm:self-center"
        >
          <RotateCcw aria-hidden="true" className="size-3.5" />
          Clear all
        </button>
      )}
    </div>
  );
}
