
'use client';

import { cn } from '@/foundation/utils/cn';
import type { JourneyFilters as JourneyFiltersModel } from '@/features/admin/journeys/models/journey-filters.model';

import {
  JourneyFilterBar,
  JourneyFilterChips,
  JourneyFilterSummary,
} from '@/components/admin/journeys/filters';

interface JourneyFiltersProps {
  filters: JourneyFiltersModel;
  onFiltersChange: (filters: JourneyFiltersModel) => void;
  resultCount?: number;
  onReset?: () => void;
  className?: string;
  disabled?: boolean;
}

export default function JourneyFilters({
  filters,
  onFiltersChange,
  resultCount,
  onReset,
  className,
  disabled = false,
}: JourneyFiltersProps) {
  return (
    <section
      aria-label="Journey directory filters"
      className={cn('space-y-3', className)}
    >
      <JourneyFilterBar
        filters={filters}
        onFiltersChange={onFiltersChange}
        onReset={onReset}
      />

      <JourneyFilterChips
        filters={filters}
        onFiltersChange={onFiltersChange}
      />

      <JourneyFilterSummary
        filters={filters}
        resultCount={resultCount}
        onReset={onReset}
      />

      {disabled && (
        <p className="text-xs text-[var(--foreground-muted)]" role="status">
          Filtering is temporarily unavailable.
        </p>
      )}
    </section>
  );
}
