
'use client';

import { RotateCcw, Search, SlidersHorizontal } from 'lucide-react';

import { cn } from '@/foundation/utils/cn';
import type { JourneyFilters } from '@/features/admin/journeys/models/journey-filters.model';
import { JourneyStatus } from '@/features/admin/journeys/models/journey.enums';

interface JourneyFilterBarProps {
  filters: JourneyFilters;
  onFiltersChange: (filters: JourneyFilters) => void;
  onReset?: () => void;
  className?: string;
}


const STATUS_OPTIONS: Array<{
  value: JourneyStatus | 'ALL';
  label: string;
}> = [
  { value: 'ALL', label: 'All statuses' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'PUBLISHED', label: 'Published' },
  { value: 'FULL', label: 'Full' },
  { value: 'BOARDING', label: 'Boarding' },
  { value: 'IN_PROGRESS', label: 'In progress' },
  { value: 'COMPLETION_PENDING', label: 'Completion pending' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
  { value: 'EXPIRED', label: 'Expired' },
];


export default function JourneyFilterBar({
  filters,
  onFiltersChange,
  onReset,
  className,
}: JourneyFilterBarProps) {
  const updateFilter = <K extends keyof JourneyFilters>(
    key: K,
    value: JourneyFilters[K],
  ) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const hasFilters =
    filters.search.trim() !== '' ||
    filters.status !== 'ALL' ||
    filters.providerPublicId.trim() !== '' ||
    filters.departureFrom !== '' ||
    filters.departureTo !== '';

  const resetFilters = () => {
    if (onReset) {
      onReset();
      return;
    }

    onFiltersChange({
      search: '',
      status: 'ALL',
      providerPublicId: '',
      departureFrom: '',
      departureTo: '',
    });
  };

  return (
    <section
      aria-label="Filter journeys"
      className={cn(
        'rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm sm:p-5',
        className,
      )}
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-xl bg-[var(--brand-soft)]">
            <SlidersHorizontal
              aria-hidden="true"
              className="size-4 text-[var(--brand)]"
            />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-[var(--foreground)]">
              Filter journeys
            </h2>
            <p className="mt-0.5 text-xs text-[var(--foreground-muted)]">
              Narrow results by status, provider, or departure date.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={resetFilters}
          disabled={!hasFilters}
          className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-medium text-[var(--foreground-secondary)] transition-colors hover:bg-[var(--background-subtle)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <RotateCcw aria-hidden="true" className="size-3.5" />
          Reset filters
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <div className="relative sm:col-span-2 xl:col-span-1">
          <label
            htmlFor="journey-filter-search"
            className="mb-1.5 block text-xs font-medium text-[var(--foreground-secondary)]"
          >
            Search
          </label>

          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-[2.35rem] size-4 text-[var(--foreground-muted)]"
          />

          <input
            id="journey-filter-search"
            type="search"
            value={filters.search}
            onChange={(event) => updateFilter('search', event.target.value)}
            placeholder="Journey or route..."
            className="h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] pl-9 pr-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/15"
          />
        </div>

        <div>
          <label
            htmlFor="journey-filter-status"
            className="mb-1.5 block text-xs font-medium text-[var(--foreground-secondary)]"
          >
            Status
          </label>

          <select
            id="journey-filter-status"
            value={filters.status}
            onChange={(event) =>
              updateFilter(
                'status',
                event.target.value as JourneyStatus | 'ALL',
              )
            }
            className="h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/15"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="journey-filter-provider"
            className="mb-1.5 block text-xs font-medium text-[var(--foreground-secondary)]"
          >
            Provider public ID
          </label>

          <input
            id="journey-filter-provider"
            type="text"
            value={filters.providerPublicId}
            onChange={(event) =>
              updateFilter('providerPublicId', event.target.value)
            }
            placeholder="Enter provider ID"
            className="h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/15"
          />
        </div>

        <div>
          <label
            htmlFor="journey-filter-departure-from"
            className="mb-1.5 block text-xs font-medium text-[var(--foreground-secondary)]"
          >
            Departure from
          </label>

          <input
            id="journey-filter-departure-from"
            type="date"
            value={filters.departureFrom}
            onChange={(event) =>
              updateFilter('departureFrom', event.target.value)
            }
            className="h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/15"
          />
        </div>

        <div>
          <label
            htmlFor="journey-filter-departure-to"
            className="mb-1.5 block text-xs font-medium text-[var(--foreground-secondary)]"
          >
            Departure to
          </label>

          <input
            id="journey-filter-departure-to"
            type="date"
            min={filters.departureFrom || undefined}
            value={filters.departureTo}
            onChange={(event) =>
              updateFilter('departureTo', event.target.value)
            }
            className="h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/15"
          />
        </div>
      </div>
    </section>
  );
}
