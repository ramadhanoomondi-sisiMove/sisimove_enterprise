// -----------------------------------------------------------------------------
// sisiMove — Journey Marketplace Filters
// -----------------------------------------------------------------------------
//
// Compact marketplace filter controls for Journey discovery.
//
// Responsibilities:
// - Capture the user's Journey marketplace search criteria.
// - Present From, To, Date, and additional Filters controls.
// - Keep the marketplace visually compact and mobile-first.
// - Make the active filter state visually obvious.
// - Notify the parent when filter values change.
//
// This component does NOT:
// - fetch Journeys;
// - perform marketplace queries;
// - own URL/search-param state;
// - apply backend filtering rules;
// - interpret locations or coordinates;
// - mutate Journey data.
//
// The parent marketplace component remains responsible for connecting these
// controls to the Journey query boundary.
//
// -----------------------------------------------------------------------------

"use client";

import type { ChangeEvent } from "react";

import { Button, Input } from "@/components/ui";
import { cn } from "@/foundation/utils/cn";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface JourneyMarketplaceFilterValues {
  /**
   * Origin search value.
   *
   * This remains a primitive marketplace query value. The component does not
   * resolve it into coordinates or a Journey corridor.
   */
  readonly from: string;

  /**
   * Destination search value.
   */
  readonly to: string;

  /**
   * Optional Journey date in the native date-input representation:
   *
   *     YYYY-MM-DD
   */
  readonly date: string;
}

export interface JourneyMarketplaceFiltersProps {
  /**
   * Current marketplace filter values.
   */
  readonly values: JourneyMarketplaceFilterValues;

  /**
   * Called whenever a filter value changes.
   */
  readonly onChange: (
    values: JourneyMarketplaceFilterValues,
  ) => void;

  /**
   * Called when the additional Filters control is activated.
   *
   * The parent owns the advanced-filter experience.
   */
  readonly onFiltersClick?: () => void;

  /**
   * Indicates that one or more advanced filters are currently active.
   */
  readonly hasActiveFilters?: boolean;

  /**
   * Disables the controls while the marketplace query is being processed.
   */
  readonly isLoading?: boolean;

  /**
   * Optional additional CSS classes.
   */
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Icons
// -----------------------------------------------------------------------------

function FilterIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="size-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 7h10M18 7h2M4 17h2M10 17h10M14 4v6M8 14v6"
      />
    </svg>
  );
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyMarketplaceFilters({
  values,
  onChange,
  onFiltersClick,
  hasActiveFilters = false,
  isLoading = false,
  className,
}: JourneyMarketplaceFiltersProps) {
  /**
   * Creates a controlled input handler for one marketplace filter field.
   *
   * The component deliberately passes the primitive value through unchanged.
   * Location interpretation and query construction belong to the marketplace
   * parent/query boundary.
   */
  const handleChange =
    (field: keyof JourneyMarketplaceFilterValues) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      onChange({
        ...values,
        [field]: event.target.value,
      });
    };

  return (
    <section
      aria-label="Journey marketplace filters"
      className={cn(
        "rounded-[var(--radius-xl)]",
        "border",
        "border-[var(--border)]",
        "bg-[var(--surface)]",
        "p-3",
        "shadow-[var(--shadow-sm)]",
        className,
      )}
    >
      <div
        className={cn(
          "grid",
          "gap-2",
          "sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(9rem,auto)_auto]",
          "sm:items-end",
        )}
      >
        {/* -------------------------------------------------------------------
            From
            ------------------------------------------------------------------ */}
        <Input
          id="journey-marketplace-from"
          label="From"
          name="from"
          value={values.from}
          onChange={handleChange("from")}
          placeholder="Origin"
          autoComplete="off"
          disabled={isLoading}
        />

        {/* -------------------------------------------------------------------
            To
            ------------------------------------------------------------------ */}
        <Input
          id="journey-marketplace-to"
          label="To"
          name="to"
          value={values.to}
          onChange={handleChange("to")}
          placeholder="Destination"
          autoComplete="off"
          disabled={isLoading}
        />

        {/* -------------------------------------------------------------------
            Date
            ------------------------------------------------------------------ */}
        <Input
          id="journey-marketplace-date"
          label="Date"
          name="date"
          type="date"
          value={values.date}
          onChange={handleChange("date")}
          disabled={isLoading}
        />

        {/* -------------------------------------------------------------------
            Advanced filters
            ------------------------------------------------------------------ */}
        <div className="pt-0 sm:pb-0">
          <Button
            type="button"
            variant={hasActiveFilters ? "primary" : "outline"}
            size="md"
            leadingIcon={<FilterIcon />}
            onClick={onFiltersClick}
            disabled={!onFiltersClick || isLoading}
            aria-label="Open additional Journey filters"
            aria-pressed={hasActiveFilters}
            className="w-full sm:w-auto"
          >
            Filters

            {hasActiveFilters && (
              <span
                aria-hidden="true"
                className={cn(
                  "ml-0.5",
                  "size-1.5",
                  "rounded-full",
                  "bg-current",
                )}
              />
            )}
          </Button>
        </div>
      </div>
    </section>
  );
}