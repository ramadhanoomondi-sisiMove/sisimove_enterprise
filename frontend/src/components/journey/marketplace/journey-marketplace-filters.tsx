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
// Primary discovery:
//
//     From | To | Date
//
// Secondary refinement:
//
//     Price range
//
// The complementary Journey Demand marketplace represents unmet demand:
//
//     "I want to travel this route, but I haven't found a suitable journey."
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
//     minPrice
//     maxPrice
//
// Example:
//
//     GET /journeys/public
//         ?from=Nairobi
//         &to=Mombasa
//         &date=2026-10-10
//         &minPrice=500
//         &maxPrice=1500
//
// -----------------------------------------------------------------------------
//
// PRODUCT PRIORITY
// ---------------
//
// Primary filters:
//
//     From
//     To
//     Date
//
// Secondary filter:
//
//     Price range
//
// Price is intentionally hidden behind the compact "Filters" control so it
// does not make the main marketplace discovery surface unnecessarily large.
//
// -----------------------------------------------------------------------------
//
// Interaction model:
//
//     User types / changes filters
//              │
//              ▼
//     Local draft state
//              │
//              ▼
//     300ms debounce
//              │
//              ▼
//     onChange(committed values)
//              │
//              ▼
//     Marketplace query
//
// Clear bypasses the debounce and immediately commits the empty state.
//
// -----------------------------------------------------------------------------
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
// The debounce itself does not require `onChange` to be stable.
//
// The latest callback is retained in a ref so parent callback identity changes
// cannot interrupt an active typing debounce.
//
// -----------------------------------------------------------------------------
//
// PRICE CONTRACT
// -------------
//
// Price is a per-seat Journey marketplace price.
//
// Currency:
//
//     KES
//
// Price filters:
//
//     minPrice
//     maxPrice
//
// Empty price inputs are represented as:
//
//     null
//
// Invalid ranges are not committed:
//
//     minPrice > maxPrice
//
// The invalid draft remains visible so the user can correct it.
//
// -----------------------------------------------------------------------------
//
// RESPONSIVE CONTRACT
// ------------------
//
// The primary controls remain one proportional row:
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
// The secondary price control is compact and may use its own responsive
// two-field layout when expanded.
//
// -----------------------------------------------------------------------------
//
// SEARCH CONTRACT
// ---------------
//
// This component commits text exactly as entered after trimming.
//
// Partial-search behavior is determined by the backend implementation of:
//
//     GET /journeys/public
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
  useRef,
  useState,
  type ChangeEvent,
} from "react";

// -----------------------------------------------------------------------------
// UI
// -----------------------------------------------------------------------------

import {
  Button,
  Input,
} from "@/components/ui";

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

  /**
   * Minimum acceptable Journey price per seat.
   *
   * `null` means no lower price boundary.
   */
  readonly minPrice: number | null;

  /**
   * Maximum acceptable Journey price per seat.
   *
   * `null` means no upper price boundary.
   */
  readonly maxPrice: number | null;
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
   * Called after the user pauses changing filters.
   *
   * The parent owns the marketplace query lifecycle.
   */
  readonly onChange: (
    values: JourneyMarketplaceFilterValues,
  ) => void;

  /**
   * Optional callback for additional filters.
   *
   * This remains available for future marketplace filters beyond price.
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
  minPrice: null,
  maxPrice: null,
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

function ChevronIcon({
  open,
}: {
  readonly open: boolean;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={cn(
        "size-[clamp(0.6rem,1vw,0.85rem)]",
        "transition-transform",
        open && "rotate-180",
      )}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m6 9 6 6 6-6"
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

function PriceIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="size-[clamp(0.6rem,1vw,0.85rem)]"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3v18M16 7.5c-.8-1-2.1-1.5-4-1.5-2.2 0-4 1.1-4 2.8 0 4.4 8 1.8 8 6 0 1.7-1.6 2.7-4 2.7-1.9 0-3.4-.6-4.3-1.7"
      />
    </svg>
  );
}

// =============================================================================
// Helpers
// =============================================================================

function normalizePrice(
  value: string,
): number | null {
  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  const parsed = Number(trimmed);

  if (!Number.isFinite(parsed)) {
    return null;
  }

  if (parsed < 0) {
    return null;
  }

  return parsed;
}

function priceToInputValue(
  value: number | null,
): string {
  return value === null
    ? ""
    : String(value);
}

function commitFilterValues(
  values: JourneyMarketplaceFilterValues,
): JourneyMarketplaceFilterValues | null {
  const committed: JourneyMarketplaceFilterValues = {
    from: values.from.trim(),
    to: values.to.trim(),
    date: values.date,
    minPrice: values.minPrice,
    maxPrice: values.maxPrice,
  };

  if (
    committed.minPrice !== null &&
    committed.maxPrice !== null &&
    committed.minPrice >
      committed.maxPrice
  ) {
    return null;
  }

  return committed;
}

function hasFilterValues(
  values: JourneyMarketplaceFilterValues,
): boolean {
  return Boolean(
    values.from.trim() ||
      values.to.trim() ||
      values.date ||
      values.minPrice !== null ||
      values.maxPrice !== null,
  );
}

function hasPriceFilterValues(
  values: JourneyMarketplaceFilterValues,
): boolean {
  return (
    values.minPrice !== null ||
    values.maxPrice !== null
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

  const [draftValues, setDraftValues] =
    useState<JourneyMarketplaceFilterValues>(
      values,
    );

  // ===========================================================================
  // Price Input State
  // ===========================================================================
  //
  // Price inputs remain strings locally so intermediate typing is preserved.
  //
  // ===========================================================================

  const [minPriceInput, setMinPriceInput] =
    useState<string>(
      priceToInputValue(
        values.minPrice,
      ),
    );

  const [maxPriceInput, setMaxPriceInput] =
    useState<string>(
      priceToInputValue(
        values.maxPrice,
      ),
    );

  // ===========================================================================
  // Advanced Filter Visibility
  // ===========================================================================

  const [showFilters, setShowFilters] =
    useState<boolean>(
      hasPriceFilterValues(values),
    );

  // ===========================================================================
  // Latest onChange Reference
  // ===========================================================================
  //
  // The parent may recreate its onChange callback when its own marketplace
  // state changes.
  //
  // The debounce must NOT restart merely because the callback identity changed.
  //
  // We therefore keep the latest callback in a ref while allowing the debounce
  // itself to depend only on the local draft values.
  //
  // This gives us the desired interaction:
  //
  //     type
  //       ↓
  //     draft updates immediately
  //       ↓
  //     wait 300ms
  //       ↓
  //     commit latest draft
  //
  // The parent callback identity cannot interrupt this debounce.
  //
  // ===========================================================================

  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // ===========================================================================
  // Debounced Commit
  // ===========================================================================
  //
  // Every local filter change schedules a marketplace query.
  //
  // The timer is intentionally dependent ONLY on draftValues.
  //
  // This means:
  //
  //     "N"
  //     "Na"
  //     "Nai"
  //     "Nair"
  //     "Nairo"
  //     "Nairob"
  //     "Nairobi"
  //
  // produces one committed query after the user pauses typing for 300ms.
  //
  // The parent callback identity cannot interrupt this debounce.
  //
  // ===========================================================================

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const committedValues =
        commitFilterValues(
          draftValues,
        );

      if (committedValues !== null) {
        onChangeRef.current(
          committedValues,
        );
      }
    }, FILTER_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [draftValues]);

  // ===========================================================================
  // Primary Input Change
  // ===========================================================================

  const handleInputChange =
    (
      field:
        | "from"
        | "to"
        | "date",
    ) =>
    (
      event: ChangeEvent<HTMLInputElement>,
    ): void => {
      const fieldValue =
        event.target.value;

      setDraftValues((current) => ({
        ...current,
        [field]: fieldValue,
      }));
    };

  // ===========================================================================
  // Minimum Price Change
  // ===========================================================================

  const handleMinPriceChange = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    const inputValue =
      event.target.value;

    setMinPriceInput(
      inputValue,
    );

    setDraftValues((current) => ({
      ...current,
      minPrice:
        normalizePrice(
          inputValue,
        ),
    }));
  };

  // ===========================================================================
  // Maximum Price Change
  // ===========================================================================

  const handleMaxPriceChange = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    const inputValue =
      event.target.value;

    setMaxPriceInput(
      inputValue,
    );

    setDraftValues((current) => ({
      ...current,
      maxPrice:
        normalizePrice(
          inputValue,
        ),
    }));
  };

  // ===========================================================================
  // Price Range Validation
  // ===========================================================================

  const hasInvalidPriceRange =
    draftValues.minPrice !== null &&
    draftValues.maxPrice !== null &&
    draftValues.minPrice >
      draftValues.maxPrice;

  // ===========================================================================
  // Clear
  // ===========================================================================

  const handleClear = (): void => {
    setDraftValues(
      EMPTY_FILTER_VALUES,
    );

    setMinPriceInput("");

    setMaxPriceInput("");

    setShowFilters(false);

    onChange(
      EMPTY_FILTER_VALUES,
    );
  };

  // ===========================================================================
  // Filters Toggle
  // ===========================================================================

  const handleFiltersClick = (): void => {
    setShowFilters(
      (current) => !current,
    );

    onFiltersClick?.();
  };

  // ===========================================================================
  // Active Draft State
  // ===========================================================================

  const hasDraftFilters =
    hasFilterValues(
      draftValues,
    );

  const hasDraftPriceFilters =
    hasPriceFilterValues(
      draftValues,
    );

  const filtersActive =
    hasActiveFilters ||
    hasDraftPriceFilters;

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
              Discover journey supply by route, date, and price
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

        <div
          className={cn(
            "mt-[clamp(0.3rem,0.7vw,0.55rem)]",
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
              filtersActive
                ? "primary"
                : "outline"
            }
            size="sm"
            leadingIcon={<FilterIcon />}
            onClick={handleFiltersClick}
            disabled={isLoading}
            aria-label="Open additional Journey filters"
            aria-expanded={showFilters}
            aria-pressed={showFilters}
            className={cn(
              "h-[clamp(1.45rem,2.5vw,2rem)]",
              "w-auto",
              "min-w-0",
              "max-w-full",
              "shrink-0",
              "overflow-hidden",
              "whitespace-nowrap",
              "rounded-[clamp(0.4rem,0.8vw,0.65rem)]",
              "px-[clamp(0.35rem,0.75vw,0.7rem)]",
              "text-[clamp(0.42rem,0.68vw,0.64rem)]",
              "font-semibold",
            )}
          >
            <span className="min-w-0 truncate">
              Filters
            </span>

            {filtersActive && (
              <span
                aria-hidden="true"
                className={cn(
                  "ml-0.5",
                  "size-[clamp(0.22rem,0.4vw,0.32rem)]",
                  "shrink-0",
                  "rounded-full",
                  "bg-current",
                )}
              />
            )}

            <ChevronIcon
              open={showFilters}
            />
          </Button>
        </div>

        {/* ------------------------------------------------------------------- */}
        {/* Compact Secondary Price Filter                                      */}
        {/* ------------------------------------------------------------------- */}

        {showFilters && (
          <div
            className={cn(
              "mt-[clamp(0.3rem,0.7vw,0.55rem)]",
              "flex",
              "w-full",
              "min-w-0",
              "items-center",
              "gap-[clamp(0.25rem,0.6vw,0.5rem)]",
              "rounded-[clamp(0.4rem,0.8vw,0.65rem)]",
              "border",
              "border-[var(--border-subtle)]",
              "bg-[var(--background)]",
              "px-[clamp(0.35rem,0.8vw,0.65rem)]",
              "py-[clamp(0.3rem,0.6vw,0.5rem)]",
            )}
          >
            {/* ----------------------------------------------------------------- */}
            {/* Price Label                                                       */}
            {/* ----------------------------------------------------------------- */}

            <div
              className={cn(
                "flex",
                "shrink-0",
                "items-center",
                "gap-[clamp(0.15rem,0.35vw,0.3rem)]",
                "text-[clamp(0.4rem,0.62vw,0.56rem)]",
                "font-semibold",
                "text-[var(--foreground-muted)]",
              )}
            >
              <PriceIcon />

              <span>
                Price
              </span>
            </div>

            {/* ----------------------------------------------------------------- */}
            {/* Minimum                                                           */}
            {/* ----------------------------------------------------------------- */}

            <div
              className={cn(
                "flex",
                "min-w-0",
                "flex-1",
                "items-center",
                "gap-[clamp(0.1rem,0.25vw,0.2rem)]",
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "shrink-0",
                  "text-[clamp(0.36rem,0.55vw,0.5rem)]",
                  "font-medium",
                  "text-[var(--foreground-muted)]",
                )}
              >
                KES
              </span>

              <Input
                id="journey-marketplace-min-price"
                name="minPrice"
                type="number"
                inputMode="numeric"
                min="0"
                step="1"
                value={minPriceInput}
                onChange={handleMinPriceChange}
                placeholder="Min"
                aria-label="Minimum Journey price in Kenyan shillings"
                className={cn(
                  "block",
                  "h-auto",
                  "w-full",
                  "min-w-0",
                  "border-0",
                  "bg-transparent",
                  "shadow-none",
                  "px-[clamp(0.1rem,0.25vw,0.2rem)]",
                  "py-[clamp(0.12rem,0.3vw,0.25rem)]",
                  "text-[clamp(0.44rem,0.7vw,0.68rem)]",
                  "font-semibold",
                  "focus-visible:ring-0",
                )}
              />
            </div>

            {/* ----------------------------------------------------------------- */}
            {/* Range Separator                                                   */}
            {/* ----------------------------------------------------------------- */}

            <span
              aria-hidden="true"
              className={cn(
                "shrink-0",
                "text-[clamp(0.4rem,0.65vw,0.58rem)]",
                "font-semibold",
                "text-[var(--foreground-muted)]",
              )}
            >
              —
            </span>

            {/* ----------------------------------------------------------------- */}
            {/* Maximum                                                           */}
            {/* ----------------------------------------------------------------- */}

            <div
              className={cn(
                "flex",
                "min-w-0",
                "flex-1",
                "items-center",
                "gap-[clamp(0.1rem,0.25vw,0.2rem)]",
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "shrink-0",
                  "text-[clamp(0.36rem,0.55vw,0.5rem)]",
                  "font-medium",
                  "text-[var(--foreground-muted)]",
                )}
              >
                KES
              </span>

              <Input
                id="journey-marketplace-max-price"
                name="maxPrice"
                type="number"
                inputMode="numeric"
                min="0"
                step="1"
                value={maxPriceInput}
                onChange={handleMaxPriceChange}
                placeholder="Max"
                aria-label="Maximum Journey price in Kenyan shillings"
                aria-invalid={
                  hasInvalidPriceRange
                }
                className={cn(
                  "block",
                  "h-auto",
                  "w-full",
                  "min-w-0",
                  "border-0",
                  "bg-transparent",
                  "shadow-none",
                  "px-[clamp(0.1rem,0.25vw,0.2rem)]",
                  "py-[clamp(0.12rem,0.3vw,0.25rem)]",
                  "text-[clamp(0.44rem,0.7vw,0.68rem)]",
                  "font-semibold",
                  "focus-visible:ring-0",
                )}
              />
            </div>

            {/* ----------------------------------------------------------------- */}
            {/* Invalid Range                                                     */}
            {/* ----------------------------------------------------------------- */}

            {hasInvalidPriceRange && (
              <span
                role="alert"
                className={cn(
                  "hidden",
                  "shrink-0",
                  "text-[clamp(0.34rem,0.55vw,0.5rem)]",
                  "font-medium",
                  "text-[var(--destructive)]",
                  "sm:inline",
                )}
              >
                Invalid range
              </span>
            )}
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