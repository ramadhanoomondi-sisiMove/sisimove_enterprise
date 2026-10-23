
'use client';

import { X } from 'lucide-react';

import { cn } from '@/foundation/utils/cn';
import {
  DEFAULT_JOURNEY_FILTERS,
  type JourneyFilters,
} from '@/features/admin/journeys/models/journey-filters.model';

interface JourneyFilterChipsProps {
  filters: JourneyFilters;
  onFiltersChange: (filters: JourneyFilters) => void;
  className?: string;
}

interface ActiveFilter {
  key: keyof JourneyFilters;
  label: string;
  value: string;
}

const STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Draft',
  PUBLISHED: 'Published',
  FULL: 'Full',
  BOARDING: 'Boarding',
  IN_PROGRESS: 'In progress',
  COMPLETION_PENDING: 'Completion pending',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  EXPIRED: 'Expired',
};

function formatDate(value: string): string {
  if (!value) return value;

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
  }).format(date);
}

export default function JourneyFilterChips({
  filters,
  onFiltersChange,
  className,
}: JourneyFilterChipsProps) {
  const activeFilters: ActiveFilter[] = [];

  if (filters.search.trim()) {
    activeFilters.push({
      key: 'search',
      label: 'Search',
      value: filters.search.trim(),
    });
  }

  if (filters.status !== 'ALL') {
    activeFilters.push({
      key: 'status',
      label: 'Status',
      value: STATUS_LABELS[filters.status] ?? filters.status,
    });
  }

  if (filters.providerPublicId.trim()) {
    activeFilters.push({
      key: 'providerPublicId',
      label: 'Provider',
      value: filters.providerPublicId.trim(),
    });
  }

  if (filters.departureFrom) {
    activeFilters.push({
      key: 'departureFrom',
      label: 'Departure from',
      value: formatDate(filters.departureFrom),
    });
  }

  if (filters.departureTo) {
    activeFilters.push({
      key: 'departureTo',
      label: 'Departure to',
      value: formatDate(filters.departureTo),
    });
  }

  const removeFilter = (key: keyof JourneyFilters) => {
    onFiltersChange({
      ...filters,
      [key]: DEFAULT_JOURNEY_FILTERS[key],
    });
  };

  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <div
      aria-label="Active journey filters"
      className={cn('flex flex-wrap items-center gap-2', className)}
    >
      <span className="mr-1 text-xs font-medium text-[var(--foreground-muted)]">
        Active filters
      </span>

      {activeFilters.map((filter) => (
        <span
          key={filter.key}
          className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-[var(--brand)]/20 bg-[var(--brand-soft)] py-1 pl-3 pr-1.5 text-xs text-[var(--foreground)]"
        >
          <span className="shrink-0 text-[var(--foreground-muted)]">
            {filter.label}:
          </span>

          <span className="max-w-48 truncate font-medium" title={filter.value}>
            {filter.value}
          </span>

          <button
            type="button"
            onClick={() => removeFilter(filter.key)}
            aria-label={`Remove ${filter.label} filter`}
            title={`Remove ${filter.label} filter`}
            className="ml-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full text-[var(--foreground-muted)] transition-colors hover:bg-[var(--brand)]/10 hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
          >
            <X aria-hidden="true" className="size-3.5" />
          </button>
        </span>
      ))}
    </div>
  );
}
