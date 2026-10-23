// src/features/admin/boardings/filters/BoardingFilterChips.tsx

'use client';

import { X } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { AdminBoardingStatus } from '@/features/admin/boardings';
import type { AdminBoardingFilters } from '@/features/admin/boardings';

export interface BoardingFilterChipsProps {
  filters: AdminBoardingFilters;
  onFiltersChange: (filters: AdminBoardingFilters) => void;
  className?: string;
}

type RemovableFilterKey =
  | 'search'
  | 'status'
  | 'providerPublicId'
  | 'journeyId'
  | 'startedFrom'
  | 'startedTo'
  | 'createdFrom'
  | 'createdTo';

interface FilterChip {
  key: RemovableFilterKey;
  label: string;
  value: string;
}

const statusLabels: Record<AdminBoardingStatus, string> = {
  [AdminBoardingStatus.NOT_STARTED]: 'Not started',
  [AdminBoardingStatus.BOARDING]: 'Boarding',
  [AdminBoardingStatus.STARTED]: 'Started',
  [AdminBoardingStatus.CANCELLED]: 'Cancelled',
};

export function BoardingFilterChips({
  filters,
  onFiltersChange,
  className,
}: BoardingFilterChipsProps) {
  const chips: FilterChip[] = [];

  if (filters.search?.trim()) {
    chips.push({
      key: 'search',
      label: 'Search',
      value: filters.search.trim(),
    });
  }

  if (filters.status && filters.status !== 'ALL') {
    chips.push({
      key: 'status',
      label: 'Status',
      value: statusLabels[filters.status],
    });
  }

  const simpleFilters: Array<{
    key: Exclude<RemovableFilterKey, 'search' | 'status'>;
    label: string;
    value?: string;
  }> = [
    {
      key: 'providerPublicId',
      label: 'Provider',
      value: filters.providerPublicId,
    },
    {
      key: 'journeyId',
      label: 'Journey',
      value: filters.journeyId,
    },
    {
      key: 'startedFrom',
      label: 'Started from',
      value: filters.startedFrom,
    },
    {
      key: 'startedTo',
      label: 'Started to',
      value: filters.startedTo,
    },
    {
      key: 'createdFrom',
      label: 'Created from',
      value: filters.createdFrom,
    },
    {
      key: 'createdTo',
      label: 'Created to',
      value: filters.createdTo,
    },
  ];

  for (const filter of simpleFilters) {
    if (filter.value) {
      chips.push({
        key: filter.key,
        label: filter.label,
        value: filter.value,
      });
    }
  }

  if (chips.length === 0) {
    return null;
  }

  function removeFilter(key: RemovableFilterKey) {
    const nextFilters: AdminBoardingFilters = {
      ...filters,
      page: 1,
    };

    switch (key) {
      case 'search':
        nextFilters.search = '';
        break;
      case 'status':
        nextFilters.status = 'ALL';
        break;
      case 'providerPublicId':
        nextFilters.providerPublicId = '';
        break;
      case 'journeyId':
        nextFilters.journeyId = '';
        break;
      case 'startedFrom':
        nextFilters.startedFrom = '';
        break;
      case 'startedTo':
        nextFilters.startedTo = '';
        break;
      case 'createdFrom':
        nextFilters.createdFrom = '';
        break;
      case 'createdTo':
        nextFilters.createdTo = '';
        break;
    }

    onFiltersChange(nextFilters);
  }

  return (
    <div
      role="group"
      aria-label="Active boarding filters"
      className={[
        'flex flex-wrap items-center gap-2',
        className ?? '',
      ].join(' ')}
    >
      {chips.map((chip) => (
        <Badge
          key={chip.key}
          variant="outline"
          className="inline-flex max-w-full items-center gap-1.5 py-1"
        >
          <span className="shrink-0 text-[var(--foreground-muted)]">
            {chip.label}:
          </span>

          <span className="max-w-48 truncate" title={chip.value}>
            {chip.value}
          </span>

          <button
            type="button"
            aria-label={`Remove ${chip.label} filter: ${chip.value}`}
            title={`Remove ${chip.label} filter`}
            onClick={() => removeFilter(chip.key)}
            className={[
              'ml-0.5 inline-flex h-5 w-5 shrink-0',
              'items-center justify-center rounded-full',
              'transition-colors',
              'hover:bg-[var(--background-muted)]',
              'focus-visible:outline-none focus-visible:ring-2',
              'focus-visible:ring-[var(--brand)]/30',
            ].join(' ')}
          >
            <X aria-hidden="true" className="h-3 w-3" />
          </button>
        </Badge>
      ))}
    </div>
  );
}

export type { RemovableFilterKey };
