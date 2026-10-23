// src/features/admin/boardings/directory/BoardingFilters.tsx
// -----------------------------------------------------------------------------
// sisiMove — Admin Boarding Filters
// -----------------------------------------------------------------------------

'use client';

import {
  BoardingFilterBar,
  BoardingFilterChips,
} from '../filters';

import type { AdminBoardingFilters } from '@/features/admin/boardings';
import { cn } from '@/foundation/utils/cn';

export interface BoardingFiltersProps {
  filters: AdminBoardingFilters;
  onFiltersChange: (filters: AdminBoardingFilters) => void;
  onReset?: () => void;
  disabled?: boolean;
  showActiveChips?: boolean;
  className?: string;
}

export function BoardingFilters({
  filters,
  onFiltersChange,
  onReset,
  disabled = false,
  showActiveChips = true,
  className,
}: BoardingFiltersProps) {
  function handleReset() {
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

  return (
    <section
      aria-label="Manage boarding filters"
      className={cn('space-y-3', className)}
    >
      <BoardingFilterBar
        filters={filters}
        onFiltersChange={onFiltersChange}
        onReset={handleReset}
        disabled={disabled}
      />

      {showActiveChips && !disabled && (
        <BoardingFilterChips
          filters={filters}
          onFiltersChange={onFiltersChange}
        />
      )}
    </section>
  );
}

