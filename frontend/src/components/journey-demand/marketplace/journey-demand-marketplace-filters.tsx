// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Marketplace Filters
// -----------------------------------------------------------------------------
//
// Filter controls for the public Journey Demand marketplace.
//
// Responsibilities:
//
// - render supported marketplace filters;
// - expose the current filter values;
// - notify the parent when a filter changes;
// - provide a clear action when filters are active.
//
// Non-responsibilities:
//
// - no data fetching;
// - no query hooks;
// - no URL manipulation;
// - no route navigation;
// - no backend/domain filtering logic.
//
// The marketplace container owns the filter state and query lifecycle.
// -----------------------------------------------------------------------------

'use client';

import { Button, Input } from '@/components/ui';
import { cn } from '@/foundation/utils/cn';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface JourneyDemandMarketplaceFiltersValue {
  /**
   * Origin filter entered by the marketplace user.
   */
  readonly from: string;

  /**
   * Destination filter entered by the marketplace user.
   */
  readonly to: string;

  /**
   * Departure date filter in the controlled input's native date format.
   */
  readonly date: string;
}

export interface JourneyDemandMarketplaceFiltersProps {
  /**
   * Current marketplace filter values.
   *
   * The component remains fully controlled by its parent.
   */
  readonly value: JourneyDemandMarketplaceFiltersValue;

  /**
   * Called whenever one of the filter values changes.
   */
  readonly onChange: (
    value: JourneyDemandMarketplaceFiltersValue,
  ) => void;

  /**
   * Optional explicit clear handler.
   *
   * When supplied, the parent owns the clear operation.
   * When omitted, the component clears the controlled values through
   * onChange().
   */
  readonly onClear?: () => void;

  /**
   * Prevents interaction while the marketplace is busy.
   */
  readonly disabled?: boolean;

  /**
   * Optional additional classes for the filter surface.
   */
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const EMPTY_FILTERS: JourneyDemandMarketplaceFiltersValue = {
  from: '',
  to: '',
  date: '',
};

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyDemandMarketplaceFilters({
  value,
  onChange,
  onClear,
  disabled = false,
  className,
}: JourneyDemandMarketplaceFiltersProps) {
  const hasActiveFilters =
    value.from.trim().length > 0 ||
    value.to.trim().length > 0 ||
    value.date.trim().length > 0;

  /**
   * Updates exactly one controlled field while preserving the other values.
   *
   * No normalization, validation, or backend filtering is performed here.
   */
  const handleFieldChange = (
    field: keyof JourneyDemandMarketplaceFiltersValue,
    fieldValue: string,
  ): void => {
    onChange({
      ...value,
      [field]: fieldValue,
    });
  };

  /**
   * Clears the filters through the explicit parent callback when supplied.
   *
   * Otherwise, the component emits the canonical empty filter value through
   * its controlled onChange contract.
   */
  const handleClear = (): void => {
    if (onClear) {
      onClear();
      return;
    }

    onChange(EMPTY_FILTERS);
  };

  return (
    <section
      aria-label="Journey demand marketplace filters"
      className={cn(
        'w-full',
        'rounded-[var(--radius-lg)]',
        'border',
        'border-[var(--border)]',
        'bg-[var(--surface)]',
        'p-3',
        'sm:p-4',
        className,
      )}
    >
      <div
        className={cn(
          'grid',
          'grid-cols-1',
          'gap-3',
          'sm:grid-cols-2',
          'lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,auto)_auto]',
          'lg:items-end',
        )}
      >
        <Input
          id="journey-demand-filter-from"
          label="From"
          type="text"
          value={value.from}
          onChange={(event) =>
            handleFieldChange('from', event.target.value)
          }
          placeholder="Origin"
          autoComplete="off"
          disabled={disabled}
        />

        <Input
          id="journey-demand-filter-to"
          label="To"
          type="text"
          value={value.to}
          onChange={(event) =>
            handleFieldChange('to', event.target.value)
          }
          placeholder="Destination"
          autoComplete="off"
          disabled={disabled}
        />

        <Input
          id="journey-demand-filter-date"
          label="Date"
          type="date"
          value={value.date}
          onChange={(event) =>
            handleFieldChange('date', event.target.value)
          }
          disabled={disabled}
        />

        <Button
          type="button"
          variant="outline"
          size="md"
          onClick={handleClear}
          disabled={disabled || !hasActiveFilters}
          className="w-full lg:w-auto"
        >
          Clear
        </Button>
      </div>
    </section>
  );
}