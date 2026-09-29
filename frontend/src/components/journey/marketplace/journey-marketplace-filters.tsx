// -----------------------------------------------------------------------------
// Path: src/features/journey/components/journey-marketplace-filters.tsx
// -----------------------------------------------------------------------------
//
// sisiMove — Journey Marketplace Filters
//
// Public marketplace discovery filters.
//
// PRODUCT MEANING
// ---------------
//
// Journey is the SUPPLY side of the SisiMove marketplace.
//
// A published Journey represents:
//
//     "I'm travelling this route and I have seats available."
//
// This filter therefore helps members discover AVAILABLE JOURNEYS:
//
//     REAL JOURNEY SUPPLY
//     Find available journeys by route and date.
//
// The complementary Journey Demand marketplace represents unmet demand:
//
//     "I want to travel this route, but I haven't found a suitable journey."
//
// Together:
//
//     JOURNEY                         JOURNEY DEMAND
//     Supply                          Demand
//     "I have seats."                 "I need a journey."
//
// -----------------------------------------------------------------------------
//
// Backend contract:
//
//     GET /journeys/public
//
// Optional query parameters:
//
//     from
//     to
//     date
//
// Interaction model:
//
//     User types
//          │
//          ▼
//     Local draft state
//          │
//          ▼
//     300ms debounce
//          │
//          ▼
//     onChange(committed values)
//          │
//          ▼
//     Marketplace query
//
// IMPORTANT
// ---------
//
// The input controls are locally owned.
//
// The parent must NOT feed its changing query state back into the input
// controls while the user is typing.
//
// This prevents:
//
// - cursor jumping;
// - input replacement;
// - characters disappearing;
// - inability to continue typing.
//
// -----------------------------------------------------------------------------
//
// IMPORTANT PARENT CONTRACT
// -------------------------
//
// The parent should:
//
// 1. render this component without a changing `key`;
// 2. keep `onChange` stable with useCallback when possible;
// 3. not conditionally unmount this component during loading;
// 4. not rewrite the supplied `values` from query results;
// 5. treat onChange() as the committed marketplace filter state.
//
// -----------------------------------------------------------------------------
//
// RESPONSIVE CONTRACT
// ------------------
//
// The primary controls always remain one proportional row:
//
//     From | To | Date | Clear
//
// All four columns use equal fractional space.
//
// Controls use:
//
// - min-w-0;
// - max-w-full;
// - overflow-hidden;
// - scalable typography;
// - scalable padding;
// - scalable icon dimensions.
//
// Native input intrinsic sizing must not be allowed to force a column wider
// than its proportional share.
//
// -----------------------------------------------------------------------------
//
// SEARCH CONTRACT
// ---------------
//
// This component commits the text exactly as entered after trimming.
//
// Partial-search behavior is determined by the backend implementation of:
//
//     GET /journeys/public
//
// For example:
//
//     "N"
//     "Na"
//     "Nai"
//     "Nair"
//     "Nairobi"
//
// will all be sent progressively after the debounce.
//
// The backend supports partial matching for public marketplace discovery.
//
// This component does not perform client-side filtering.
//
// -----------------------------------------------------------------------------
//
// Copyright © sisiMove
// -----------------------------------------------------------------------------

"use client";

// -----------------------------------------------------------------------------
// React
// -----------------------------------------------------------------------------

import {
  useEffect,
  useState,
} from "react";

// -----------------------------------------------------------------------------
// UI
// -----------------------------------------------------------------------------

import { Button, Input } from "@/components/ui";

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { cn } from "@/foundation/utils/cn";

// =============================================================================
// Types
// =============================================================================

export interface JourneyMarketplaceFilterValues {
  readonly from: string;
  readonly to: string;
  readonly date: string;
}

export interface JourneyMarketplaceFiltersProps {
  /**
   * Currently committed marketplace filter values.
   *
   * These values are used as the initial local draft.
   *
   * They must not be used to control the inputs after the component
   * has mounted.
   */
  readonly values: JourneyMarketplaceFilterValues;

  /**
   * Called after the user pauses typing.
   *
   * The parent owns the marketplace query lifecycle.
   */
  readonly onChange: (
    values: JourneyMarketplaceFilterValues,
  ) => void;

  /**
   * Optional callback for additional filters.
   */
  readonly onFiltersClick?: () => void;

  /**
   * Indicates that additional filters are active.
   */
  readonly hasActiveFilters?: boolean;

  /**
   * Indicates that marketplace results are loading.
   *
   * Primary text/date inputs remain enabled while loading.
   */
  readonly isLoading?: boolean;

  /**
   * Optional additional classes.
   */
  readonly className?: string;
}

// =============================================================================
// Constants
// =============================================================================

const EMPTY_FILTER_VALUES: JourneyMarketplaceFilterValues = {
  from: "",
  to: "",
  date: "",
};

const FILTER_DEBOUNCE_MS = 300;

// =============================================================================
// Icons
// =============================================================================

function SearchRouteIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="size-[clamp(0.75rem,1.35vw,1.1rem)]"
    >
      <circle
        cx="11"
        cy="11"
        r="6.5"
      />

      <path d="m16 16 4.5 4.5" />

      <path d="M8.5 11h5" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="size-[clamp(0.7rem,1.15vw,1rem)]"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 7h10M18 7h2M4 17h2M10 17h10M14 4v6M8 14v6"
      />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="size-[clamp(0.65rem,1vw,0.9rem)]"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m6 6 12 12M18 6 6 18"
      />
    </svg>
  );
}

function LocationIcon({
  destination = false,
}: {
  readonly destination?: boolean;
}) {
  return destination ? (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="size-[clamp(0.6rem,1vw,0.85rem)]"
    >
      <path d="M12 21s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12Z" />

      <path d="m9.5 9.5 2 2 3-3" />
    </svg>
  ) : (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="size-[clamp(0.6rem,1vw,0.85rem)]"
    >
      <circle
        cx="12"
        cy="10"
        r="2.5"
      />

      <path d="M12 21s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12Z" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="size-[clamp(0.6rem,1vw,0.85rem)]"
    >
      <rect
        x="3.5"
        y="5"
        width="17"
        height="16"
        rx="2"
      />

      <path d="M7 3v4M17 3v4M3.5 10h17" />
    </svg>
  );
}

// =============================================================================
// Helpers
// =============================================================================

function commitFilterValues(
  values: JourneyMarketplaceFilterValues,
): JourneyMarketplaceFilterValues {
  return {
    from: values.from.trim(),
    to: values.to.trim(),
    date: values.date,
  };
}

function hasFilterValues(
  values: JourneyMarketplaceFilterValues,
): boolean {
  return Boolean(
    values.from.trim() ||
      values.to.trim() ||
      values.date,
  );
}

// =============================================================================
// Component
// =============================================================================

export function JourneyMarketplaceFilters({
  values,
  onChange,
  onFiltersClick,
  hasActiveFilters = false,
  isLoading = false,
  className,
}: JourneyMarketplaceFiltersProps) {
  // ===========================================================================
  // Local Draft State
  // ===========================================================================
  //
  // This is the ONLY state controlling the input values.
  //
  // The parent query state never replaces the user's current draft while
  // typing.
  //
  // ===========================================================================

  const [draftValues, setDraftValues] =
    useState<JourneyMarketplaceFilterValues>(
      values,
    );

  // ===========================================================================
  // Debounced Commit
  // ===========================================================================
  //
  // Every keystroke updates only local state.
  //
  // After 300ms without another change, the current draft is committed to the
  // parent marketplace.
  //
  // ===========================================================================

  useEffect(() => {
    const timer = window.setTimeout(() => {
      onChange(
        commitFilterValues(
          draftValues,
        ),
      );
    }, FILTER_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [
    draftValues,
    onChange,
  ]);

  // ===========================================================================
  // Input Change
  // ===========================================================================

  const handleInputChange =
    (
      field: keyof JourneyMarketplaceFilterValues,
    ) =>
    (
      event: React.ChangeEvent<HTMLInputElement>,
    ): void => {
      const fieldValue =
        event.target.value;

      setDraftValues((current) => ({
        ...current,
        [field]: fieldValue,
      }));
    };

  // ===========================================================================
  // Clear
  // ===========================================================================
  //
  // Clear bypasses the debounce so the marketplace returns to its default
  // unfiltered state immediately.
  //
  // ===========================================================================

  const handleClear = (): void => {
    setDraftValues(
      EMPTY_FILTER_VALUES,
    );

    onChange(
      EMPTY_FILTER_VALUES,
    );
  };

  // ===========================================================================
  // Active Draft State
  // ===========================================================================

  const hasDraftFilters =
    hasFilterValues(
      draftValues,
    );

  // ===========================================================================
  // Render
  // ===========================================================================

  return (
    <section
      aria-label="Journey marketplace filters"
      aria-busy={isLoading}
      className={cn(
        "relative",
        "w-full",
        "min-w-0",
        "overflow-hidden",
        "rounded-[clamp(0.7rem,1.5vw,1.15rem)]",
        "border",
        "border-[var(--border)]",
        "border-l-4",
        "border-l-[var(--brand)]",
        "bg-[var(--surface)]",
        "shadow-[var(--shadow-md)]",
        className,
      )}
    >
      {/* --------------------------------------------------------------------- */}
      {/* Visual Header                                                         */}
      {/* --------------------------------------------------------------------- */}

      <div
        className={cn(
          "flex",
          "w-full",
          "min-w-0",
          "items-center",
          "justify-between",
          "gap-[clamp(0.35rem,1vw,0.8rem)]",
          "border-b",
          "border-[var(--border-subtle)]",
          "bg-[var(--background-brand)]",
          "px-[clamp(0.6rem,1.6vw,1.25rem)]",
          "py-[clamp(0.45rem,1vw,0.8rem)]",
        )}
      >
        <div
          className={cn(
            "flex",
            "min-w-0",
            "items-center",
            "gap-[clamp(0.3rem,0.7vw,0.55rem)]",
          )}
        >
          <span
            className={cn(
              "flex",
              "size-[clamp(1.35rem,2.8vw,2.1rem)]",
              "shrink-0",
              "items-center",
              "justify-center",
              "rounded-[clamp(0.35rem,0.7vw,0.6rem)]",
              "bg-[var(--brand)]",
              "text-[var(--brand-foreground)]",
              "shadow-[var(--shadow-sm)]",
            )}
          >
            <SearchRouteIcon />
          </span>

          <div className="min-w-0">
            <p
              className={cn(
                "truncate",
                "text-[clamp(0.58rem,1vw,0.82rem)]",
                "font-bold",
                "leading-tight",
                "text-[var(--foreground)]",
              )}
            >
              Find available journeys
            </p>

            <p
              className={cn(
                "mt-[clamp(0.08rem,0.2vw,0.16rem)]",
                "truncate",
                "text-[clamp(0.4rem,0.65vw,0.55rem)]",
                "leading-tight",
                "text-[var(--foreground-muted)]",
              )}
            >
              Discover journey supply by route and date
            </p>
          </div>
        </div>

        {hasDraftFilters && (
          <span
            className={cn(
              "shrink-0",
              "rounded-full",
              "bg-[var(--brand-soft)]",
              "px-[clamp(0.3rem,0.7vw,0.55rem)]",
              "py-[clamp(0.14rem,0.3vw,0.24rem)]",
              "text-[clamp(0.36rem,0.58vw,0.5rem)]",
              "font-semibold",
              "uppercase",
              "tracking-wide",
              "text-[var(--brand)]",
            )}
          >
            Active
          </span>
        )}
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* Primary Discovery Controls                                            */}
      {/* --------------------------------------------------------------------- */}

      <div
        className={cn(
          "w-full",
          "min-w-0",
          "p-[clamp(0.4rem,1.1vw,0.9rem)]",
        )}
      >
        <div
          className={cn(
            "grid",
            "w-full",
            "min-w-0",
            "grid-cols-[repeat(4,minmax(0,1fr))]",
            "items-stretch",
            "gap-[clamp(0.2rem,0.65vw,0.65rem)]",
          )}
        >
          {/* ----------------------------------------------------------------- */}
          {/* From                                                              */}
          {/* ----------------------------------------------------------------- */}

          <div
            className={cn(
              "min-w-0",
              "max-w-full",
              "overflow-hidden",
              "rounded-[clamp(0.45rem,1vw,0.8rem)]",
              "border",
              "border-[var(--border)]",
              "bg-[var(--background)]",
              "p-[clamp(0.18rem,0.5vw,0.45rem)]",
              "shadow-[var(--shadow-sm)]",
            )}
          >
            <div
              className={cn(
                "mb-[clamp(0.08rem,0.25vw,0.2rem)]",
                "flex",
                "min-w-0",
                "items-center",
                "gap-[clamp(0.15rem,0.4vw,0.35rem)]",
                "px-[clamp(0.14rem,0.4vw,0.35rem)]",
                "text-[clamp(0.34rem,0.58vw,0.5rem)]",
                "font-semibold",
                "uppercase",
                "tracking-[0.08em]",
                "text-[var(--foreground-muted)]",
              )}
            >
              <LocationIcon />

              <span className="min-w-0 truncate">
                From
              </span>
            </div>

            <div className="min-w-0 max-w-full overflow-hidden">
              <Input
                id="journey-marketplace-from"
                name="from"
                type="text"
                value={draftValues.from}
                onChange={handleInputChange("from")}
                placeholder="Origin"
                autoComplete="off"
                className={cn(
                  "block",
                  "h-auto",
                  "w-full",
                  "min-w-0",
                  "max-w-full",
                  "overflow-hidden",
                  "border-0",
                  "bg-transparent",
                  "shadow-none",
                  "px-[clamp(0.14rem,0.35vw,0.3rem)]",
                  "py-[clamp(0.18rem,0.4vw,0.35rem)]",
                  "text-[clamp(0.52rem,0.9vw,0.88rem)]",
                  "font-semibold",
                  "leading-tight",
                  "focus-visible:ring-0",
                )}
              />
            </div>
          </div>

          {/* ----------------------------------------------------------------- */}
          {/* To                                                                */}
          {/* ----------------------------------------------------------------- */}

          <div
            className={cn(
              "min-w-0",
              "max-w-full",
              "overflow-hidden",
              "rounded-[clamp(0.45rem,1vw,0.8rem)]",
              "border",
              "border-[var(--border)]",
              "bg-[var(--background)]",
              "p-[clamp(0.18rem,0.5vw,0.45rem)]",
              "shadow-[var(--shadow-sm)]",
            )}
          >
            <div
              className={cn(
                "mb-[clamp(0.08rem,0.25vw,0.2rem)]",
                "flex",
                "min-w-0",
                "items-center",
                "gap-[clamp(0.15rem,0.4vw,0.35rem)]",
                "px-[clamp(0.14rem,0.4vw,0.35rem)]",
                "text-[clamp(0.34rem,0.58vw,0.5rem)]",
                "font-semibold",
                "uppercase",
                "tracking-[0.08em]",
                "text-[var(--foreground-muted)]",
              )}
            >
              <LocationIcon destination />

              <span className="min-w-0 truncate">
                To
              </span>
            </div>

            <div className="min-w-0 max-w-full overflow-hidden">
              <Input
                id="journey-marketplace-to"
                name="to"
                type="text"
                value={draftValues.to}
                onChange={handleInputChange("to")}
                placeholder="Destination"
                autoComplete="off"
                className={cn(
                  "block",
                  "h-auto",
                  "w-full",
                  "min-w-0",
                  "max-w-full",
                  "overflow-hidden",
                  "border-0",
                  "bg-transparent",
                  "shadow-none",
                  "px-[clamp(0.14rem,0.35vw,0.3rem)]",
                  "py-[clamp(0.18rem,0.4vw,0.35rem)]",
                  "text-[clamp(0.52rem,0.9vw,0.88rem)]",
                  "font-semibold",
                  "leading-tight",
                  "focus-visible:ring-0",
                )}
              />
            </div>
          </div>

          {/* ----------------------------------------------------------------- */}
          {/* Date                                                              */}
          {/* ----------------------------------------------------------------- */}

          <div
            className={cn(
              "min-w-0",
              "max-w-full",
              "overflow-hidden",
              "rounded-[clamp(0.45rem,1vw,0.8rem)]",
              "border",
              "border-[var(--border)]",
              "bg-[var(--background)]",
              "p-[clamp(0.18rem,0.5vw,0.45rem)]",
              "shadow-[var(--shadow-sm)]",
            )}
          >
            <div
              className={cn(
                "mb-[clamp(0.08rem,0.25vw,0.2rem)]",
                "flex",
                "min-w-0",
                "items-center",
                "gap-[clamp(0.15rem,0.4vw,0.35rem)]",
                "px-[clamp(0.14rem,0.4vw,0.35rem)]",
                "text-[clamp(0.34rem,0.58vw,0.5rem)]",
                "font-semibold",
                "uppercase",
                "tracking-[0.08em]",
                "text-[var(--foreground-muted)]",
              )}
            >
              <CalendarIcon />

              <span className="min-w-0 truncate">
                Date
              </span>
            </div>

            <div className="min-w-0 max-w-full overflow-hidden">
              <Input
                id="journey-marketplace-date"
                name="date"
                type="date"
                value={draftValues.date}
                onChange={handleInputChange("date")}
                className={cn(
                  "block",
                  "h-auto",
                  "w-full",
                  "min-w-0",
                  "max-w-full",
                  "overflow-hidden",
                  "border-0",
                  "bg-transparent",
                  "shadow-none",
                  "px-[clamp(0.1rem,0.25vw,0.25rem)]",
                  "py-[clamp(0.18rem,0.4vw,0.35rem)]",
                  "text-[clamp(0.48rem,0.82vw,0.8rem)]",
                  "font-semibold",
                  "leading-tight",
                  "focus-visible:ring-0",
                )}
              />
            </div>
          </div>

          {/* ----------------------------------------------------------------- */}
          {/* Clear                                                             */}
          {/* ----------------------------------------------------------------- */}

          <div
            className={cn(
              "min-w-0",
              "max-w-full",
              "overflow-hidden",
            )}
          >
            <Button
              type="button"
              variant="outline"
              size="md"
              leadingIcon={<XIcon />}
              onClick={handleClear}
              disabled={!hasDraftFilters}
              aria-label="Clear Journey marketplace filters"
              className={cn(
                "h-full",
                "w-full",
                "min-w-0",
                "max-w-full",
                "overflow-hidden",
                "rounded-[clamp(0.45rem,1vw,0.75rem)]",
                "px-[clamp(0.25rem,0.7vw,0.85rem)]",
                "text-[clamp(0.44rem,0.76vw,0.7rem)]",
                "font-semibold",
              )}
            >
              <span className="min-w-0 truncate">
                Clear
              </span>
            </Button>
          </div>
        </div>

        {/* ------------------------------------------------------------------- */}
        {/* Secondary Controls                                                  */}
        {/* ------------------------------------------------------------------- */}

        {onFiltersClick && (
          <div
            className={cn(
              "mt-[clamp(0.35rem,0.9vw,0.7rem)]",
              "flex",
              "min-w-0",
              "items-center",
              "justify-between",
              "gap-[clamp(0.3rem,0.8vw,0.7rem)]",
            )}
          >
            <div
              className={cn(
                "min-w-0",
                "truncate",
                "text-[clamp(0.34rem,0.58vw,0.52rem)]",
                "leading-tight",
                "text-[var(--foreground-muted)]",
              )}
            >
              Refine your journey search
            </div>

            <Button
              type="button"
              variant={
                hasActiveFilters
                  ? "primary"
                  : "outline"
              }
              size="sm"
              leadingIcon={<FilterIcon />}
              onClick={onFiltersClick}
              disabled={isLoading}
              aria-label="Open additional Journey filters"
              aria-pressed={hasActiveFilters}
              className={cn(
                "h-[clamp(1.55rem,2.8vw,2.25rem)]",
                "w-auto",
                "min-w-0",
                "max-w-full",
                "shrink-0",
                "overflow-hidden",
                "whitespace-nowrap",
                "rounded-[clamp(0.4rem,0.8vw,0.65rem)]",
                "px-[clamp(0.35rem,0.8vw,0.8rem)]",
                "text-[clamp(0.42rem,0.68vw,0.64rem)]",
                "font-semibold",
              )}
            >
              <span className="min-w-0 truncate">
                Filters
              </span>

              {hasActiveFilters && (
                <span
                  aria-hidden="true"
                  className={cn(
                    "ml-0.5",
                    "size-[clamp(0.25rem,0.45vw,0.375rem)]",
                    "shrink-0",
                    "rounded-full",
                    "bg-current",
                  )}
                />
              )}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

// =============================================================================
// Default Export
// =============================================================================

export default JourneyMarketplaceFilters;