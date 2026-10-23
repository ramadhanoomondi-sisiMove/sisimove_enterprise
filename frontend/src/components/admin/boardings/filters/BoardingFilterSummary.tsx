// src/features/admin/boardings/filters/BoardingFilterSummary.tsx

import { Filter } from 'lucide-react';

import { AdminBoardingStatus } from '@/features/admin/boardings';

import type {
  AdminBoardingFilters,
} from '@/features/admin/boardings';
export interface BoardingFilterSummaryProps  {
  filters: AdminBoardingFilters;
  totalResults: number;
  className?: string;
}

export function BoardingFilterSummary({
  filters,
  totalResults,
  className,
}: BoardingFilterSummaryProps) {
  const activeFilterCount = [
    Boolean(filters.search?.trim()),
    Boolean(filters.status && filters.status !== 'ALL'),
    Boolean(filters.providerPublicId),
    Boolean(filters.journeyId),
    Boolean(filters.startedFrom),
    Boolean(filters.startedTo),
    Boolean(filters.createdFrom),
    Boolean(filters.createdTo),
  ].filter(Boolean).length;

  const statusLabel =
    filters.status && filters.status !== 'ALL'
      ? filters.status === AdminBoardingStatus.NOT_STARTED
        ? 'Not started'
        : filters.status === AdminBoardingStatus.BOARDING
          ? 'Boarding'
          : filters.status === AdminBoardingStatus.STARTED
            ? 'Started'
            : 'Cancelled'
      : null;

  return (
    <div
      className={[
        'flex',
        'flex-wrap',
        'items-center',
        'justify-between',
        'gap-3',
        className ?? '',
      ].join(' ')}
    >
      <p
        aria-live="polite"
        className="text-sm text-[var(--foreground-secondary)]"
      >
        <span className="font-semibold text-[var(--foreground)]">
          {totalResults.toLocaleString()}
        </span>{' '}
        {totalResults === 1 ? 'boarding record' : 'boarding records'}
      </p>

      <div className="flex flex-wrap items-center gap-2">
        {activeFilterCount > 0 && (
          <span className="inline-flex items-center gap-1.5 rounded-[var(--radius-full)] bg-[var(--brand-soft)] px-3 py-1 text-xs font-medium text-[var(--brand)]">
            <Filter aria-hidden="true" className="h-3.5 w-3.5" />
            {activeFilterCount}{' '}
            {activeFilterCount === 1 ? 'filter' : 'filters'} applied
          </span>
        )}

        {statusLabel && (
          <span className="text-xs text-[var(--foreground-muted)]">
            Status: {statusLabel}
          </span>
        )}
      </div>
    </div>
  );
}
