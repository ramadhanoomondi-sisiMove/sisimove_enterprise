// src/features/admin/boardings/filters/BoardingFilterBar.tsx

'use client';

import { Search, X } from 'lucide-react';

import { Select } from '@/components/ui/select';

import { AdminBoardingStatus } from '@/features/admin/boardings';
import type { AdminBoardingFilters } from '@/features/admin/boardings';

export interface BoardingFilterBarProps {
  filters: AdminBoardingFilters;
  onFiltersChange: (filters: AdminBoardingFilters) => void;
  onReset?: () => void;
  disabled?: boolean;
  providerOptions?: Array<{
    value: string;
    label: string;
  }>;
  journeyOptions?: Array<{
    value: string;
    label: string;
  }>;
  className?: string;
}

const statusOptions = [
  { value: 'ALL', label: 'All statuses' },
  { value: AdminBoardingStatus.NOT_STARTED, label: 'Not started' },
  { value: AdminBoardingStatus.BOARDING, label: 'Boarding' },
  { value: AdminBoardingStatus.STARTED, label: 'Started' },
  { value: AdminBoardingStatus.CANCELLED, label: 'Cancelled' },
];

export function BoardingFilterBar({
  filters,
  onFiltersChange,
  onReset,
  disabled = false,
  providerOptions = [],
  journeyOptions = [],
  className,
}: BoardingFilterBarProps) {
  function updateFilter<K extends keyof AdminBoardingFilters>(
    key: K,
    value: AdminBoardingFilters[K],
  ) {
    onFiltersChange({
      ...filters,
      [key]: value,
      page: 1,
    });
  }

  function clearFilters() {
    if (onReset) {
      onReset();
      return;
    }

    onFiltersChange({
      search: '',
      status: 'ALL',
      providerPublicId: '',
      journeyId: '',
      startedFrom: '',
      startedTo: '',
      createdFrom: '',
      createdTo: '',
      page: 1,
      limit: filters.limit,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
    });
  }

  const hasActiveFilters = Boolean(
    filters.search?.trim() ||
      (filters.status && filters.status !== 'ALL') ||
      filters.providerPublicId ||
      filters.journeyId ||
      filters.startedFrom ||
      filters.startedTo ||
      filters.createdFrom ||
      filters.createdTo,
  );

  const inputClassName = [
    'min-h-10 w-full rounded-[var(--radius-md)]',
    'border border-[var(--border)] bg-[var(--surface)]',
    'px-3 text-sm text-[var(--foreground)]',
    'placeholder:text-[var(--foreground-muted)]',
    'outline-none transition-colors',
    'focus:border-[var(--brand)]',
    'focus:ring-2 focus:ring-[var(--brand)]/10',
    'disabled:cursor-not-allowed disabled:opacity-60',
  ].join(' ');

  return (
    <section
      aria-label="Filter boarding records"
      className={[
        'w-full rounded-[var(--radius-xl)]',
        'border border-[var(--border)]',
        'bg-[var(--surface)] p-4 sm:p-5',
        className ?? '',
      ].join(' ')}
    >
      <fieldset disabled={disabled} className="min-w-0">
        <legend className="sr-only">Boarding record filters</legend>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="boarding-search"
              className="text-sm font-medium text-[var(--foreground)]"
            >
              Search
            </label>

            <div className="relative">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--foreground-muted)]"
              />

              <input
                id="boarding-search"
                type="search"
                value={filters.search ?? ''}
                onChange={(event) =>
                  updateFilter('search', event.target.value)
                }
                placeholder="Search public IDs…"
                autoComplete="off"
                className={[
                  inputClassName,
                  'pl-9 pr-3',
                ].join(' ')}
              />
            </div>
          </div>

          <Select
            id="boarding-status-filter"
            label="Boarding status"
            value={filters.status ?? 'ALL'}
            onChange={(event) =>
              updateFilter(
                'status',
                event.target.value as AdminBoardingFilters['status'],
              )
            }
            options={statusOptions}
            disabled={disabled}
          />

          <Select
            id="boarding-provider-filter"
            label="Provider"
            value={filters.providerPublicId ?? ''}
            onChange={(event) =>
              updateFilter('providerPublicId', event.target.value)
            }
            options={[
              { value: '', label: 'All providers' },
              ...providerOptions,
            ]}
            disabled={disabled}
          />

          <Select
            id="boarding-journey-filter"
            label="Journey"
            value={filters.journeyId ?? ''}
            onChange={(event) =>
              updateFilter('journeyId', event.target.value)
            }
            options={[
              { value: '', label: 'All journeys' },
              ...journeyOptions,
            ]}
            disabled={disabled}
          />

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="boarding-started-from"
              className="text-sm font-medium text-[var(--foreground)]"
            >
              Journey started from
            </label>

            <input
              id="boarding-started-from"
              type="date"
              value={filters.startedFrom ?? ''}
              max={filters.startedTo || undefined}
              onChange={(event) =>
                updateFilter('startedFrom', event.target.value)
              }
              className={inputClassName}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="boarding-started-to"
              className="text-sm font-medium text-[var(--foreground)]"
            >
              Journey started to
            </label>

            <input
              id="boarding-started-to"
              type="date"
              min={filters.startedFrom || undefined}
              value={filters.startedTo ?? ''}
              onChange={(event) =>
                updateFilter('startedTo', event.target.value)
              }
              className={inputClassName}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="boarding-created-from"
              className="text-sm font-medium text-[var(--foreground)]"
            >
              Record created from
            </label>

            <input
              id="boarding-created-from"
              type="date"
              max={filters.createdTo || undefined}
              value={filters.createdFrom ?? ''}
              onChange={(event) =>
                updateFilter('createdFrom', event.target.value)
              }
              className={inputClassName}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="boarding-created-to"
              className="text-sm font-medium text-[var(--foreground)]"
            >
              Record created to
            </label>

            <input
              id="boarding-created-to"
              type="date"
              min={filters.createdFrom || undefined}
              value={filters.createdTo ?? ''}
              onChange={(event) =>
                updateFilter('createdTo', event.target.value)
              }
              className={inputClassName}
            />
          </div>
        </div>
      </fieldset>

      {hasActiveFilters && (
        <div className="mt-4 flex justify-end border-t border-[var(--border-subtle)] pt-4">
          <button
            type="button"
            onClick={clearFilters}
            disabled={disabled}
            className={[
              'inline-flex min-h-9 items-center gap-2',
              'rounded-[var(--radius-md)] px-3 text-sm font-medium',
              'text-[var(--foreground-secondary)] transition-colors',
              'hover:bg-[var(--background-muted)]',
              'hover:text-[var(--foreground)]',
              'focus-visible:outline-none focus-visible:ring-2',
              'focus-visible:ring-[var(--brand)]/30',
              'disabled:cursor-not-allowed disabled:opacity-50',
            ].join(' ')}
          >
            <X aria-hidden="true" className="h-4 w-4" />
            Clear filters
          </button>
        </div>
      )}
    </section>
  );
}
