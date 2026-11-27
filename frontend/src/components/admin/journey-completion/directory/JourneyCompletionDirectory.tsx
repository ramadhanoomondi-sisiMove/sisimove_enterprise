
'use client';

import { useMemo, useState } from 'react';

import {
  useAdminJourneyCompletions,
  useAdminJourneyCompletionFilters,
} from '@/features/admin/journey-completion/hooks';

import type {
  AdminJourneyCompletion,
} from '@/features/admin/journey-completion/models';

import { JourneyCompletionDirectoryHeader } from './JourneyCompletionDirectoryHeader';
import { JourneyCompletionSearch } from './JourneyCompletionSearch';
import { JourneyCompletionFilters } from './JourneyCompletionFilters';
import { JourneyCompletionFilterChips } from './JourneyCompletionFilterChips';
import { JourneyCompletionTable } from './JourneyCompletionTable';
import { JourneyCompletionPagination } from './JourneyCompletionPagination';

export interface JourneyCompletionDirectoryProps {
  onOpenCompletion?: (completion: AdminJourneyCompletion) => void;
  className?: string;
}

const PAGE_SIZE = 10;

export function JourneyCompletionDirectory({
  onOpenCompletion,
  className,
}: JourneyCompletionDirectoryProps) {
  const {
    filters,
    updateFilters,
    clearFilters,
  } = useAdminJourneyCompletionFilters();

  const {
    completions,
    isLoading,
    error,
    refetch,
  } = useAdminJourneyCompletions(filters);

  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredCompletions = useMemo(() => {
    const search = searchValue.trim().toLowerCase();

    if (!search) return completions;

    return completions.filter((completion) =>
      [
        completion.publicId,
        completion.journeyPublicId,
        completion.providerPublicId,
      ].some((value) => value.toLowerCase().includes(search)),
    );
  }, [completions, searchValue]);

  const totalItems = filteredCompletions.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedCompletions = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;

    return filteredCompletions.slice(start, start + PAGE_SIZE);
  }, [filteredCompletions, safePage]);

  const page = useMemo(() => ({
    items: paginatedCompletions,
    page: safePage,
    pageSize: PAGE_SIZE,
    totalItems,
    totalPages,
    hasPreviousPage: safePage > 1,
    hasNextPage: safePage < totalPages,
  }), [paginatedCompletions, safePage, totalItems, totalPages]);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    setCurrentPage(1);
  };

  const handleFiltersChange = (nextFilters: typeof filters) => {
    updateFilters(nextFilters);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    clearFilters();
    setCurrentPage(1);
  };

  const handleRemoveFilter = (key: keyof typeof filters) => {
    handleFiltersChange({
      ...filters,
      [key]: undefined,
    });
  };

  const handlePageChange = (nextPage: number) => {
    setCurrentPage(Math.max(1, Math.min(nextPage, totalPages)));
  };

  const handleOpenCompletion = (completion: AdminJourneyCompletion) => {
    onOpenCompletion?.(completion);
  };

  return (
    <section
      className={`space-y-5 ${className ?? ''}`}
      aria-label="Journey completion directory"
    >
      <JourneyCompletionDirectoryHeader
        totalCount={totalItems}
        actions={
          <button
            type="button"
            onClick={() => void refetch()}
            disabled={isLoading}
            className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-medium text-[var(--foreground-secondary)] transition hover:bg-[var(--background-subtle)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Refresh
          </button>
        }
      />

      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
        <div className="space-y-4">
          <JourneyCompletionSearch
            value={searchValue}
            onChange={handleSearchChange}
          />

          <JourneyCompletionFilters
            filters={filters}
            onChange={handleFiltersChange}
            onClear={handleClearFilters}
          />

          <JourneyCompletionFilterChips
            filters={filters}
            onRemove={handleRemoveFilter}
            onClear={handleClearFilters}
          />
        </div>
      </div>

      {error ? (
        <div
          role="alert"
          className="rounded-lg border border-[var(--danger)] bg-[var(--danger-soft)] p-4 text-sm text-[var(--foreground)]"
        >
          <p>Unable to load journey completions.</p>
          <button
            type="button"
            onClick={() => void refetch()}
            className="mt-2 font-medium text-[var(--danger)] underline"
          >
            Try again
          </button>
        </div>
      ) : (
        <>
          <JourneyCompletionTable
            completions={paginatedCompletions}
            isLoading={isLoading}
            onOpen={handleOpenCompletion}
          />

          {!isLoading && totalItems > 0 ? (
            <JourneyCompletionPagination
              page={page}
              onPageChange={handlePageChange}
            />
          ) : null}
        </>
      )}
    </section>
  );
}
