"use client";

// -----------------------------------------------------------------------------
// Path: src/features/journey/components/journey-marketplace-filters.tsx
// -----------------------------------------------------------------------------
//
// sisiMove — Journey Marketplace Filters
//
// Responsive marketplace discovery filters.
//
// Responsive behavior:
// - primary controls remain proportional;
// - every column can shrink below intrinsic input width;
// - typography, padding, gaps, icons and radii scale with clamp();
// - long values cannot force the component wider;
// - price controls remain compact when expanded.
//
// -----------------------------------------------------------------------------

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from "react";

import {
  Button,
  Input,
} from "@/components/ui";

import { cn } from "@/foundation/utils/cn";

// =============================================================================
// Types
// =============================================================================

export interface JourneyMarketplaceFilterValues {
  readonly from: string;
  readonly to: string;
  readonly date: string;
  readonly minPrice: number | null;
  readonly maxPrice: number | null;
}

export interface JourneyMarketplaceFiltersProps {
  readonly values: JourneyMarketplaceFilterValues;

  readonly onChange: (
    values: JourneyMarketplaceFilterValues,
  ) => void;

  readonly onFiltersClick?: () => void;

  readonly hasActiveFilters?: boolean;

  readonly isLoading?: boolean;

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
      className="size-[clamp(0.55rem,1.35vw,1.1rem)]"
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
      className="size-[clamp(0.5rem,1.15vw,1rem)]"
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
      className="size-[clamp(0.45rem,1vw,0.9rem)]"
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
        "size-[clamp(0.42rem,1vw,0.85rem)]",
        "shrink-0",
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
      className="size-[clamp(0.42rem,1vw,0.85rem)] shrink-0"
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
      className="size-[clamp(0.42rem,1vw,0.85rem)] shrink-0"
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
      className="size-[clamp(0.42rem,1vw,0.85rem)] shrink-0"
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
      className="size-[clamp(0.42rem,1vw,0.85rem)] shrink-0"
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
    committed.minPrice > committed.maxPrice
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
  const [draftValues, setDraftValues] =
    useState<JourneyMarketplaceFilterValues>(
      values,
    );

  const [minPriceInput, setMinPriceInput] =
    useState<string>(
      priceToInputValue(values.minPrice),
    );

  const [maxPriceInput, setMaxPriceInput] =
    useState<string>(
      priceToInputValue(values.maxPrice),
    );

  const [showFilters, setShowFilters] =
    useState<boolean>(
      hasPriceFilterValues(values),
    );

  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // ---------------------------------------------------------------------------
  // Debounced marketplace commit
  // ---------------------------------------------------------------------------

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const committedValues =
        commitFilterValues(draftValues);

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

  // ---------------------------------------------------------------------------
  // Primary inputs
  // ---------------------------------------------------------------------------

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

  // ---------------------------------------------------------------------------
  // Price inputs
  // ---------------------------------------------------------------------------

  const handleMinPriceChange = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    const inputValue =
      event.target.value;

    setMinPriceInput(inputValue);

    setDraftValues((current) => ({
      ...current,
      minPrice:
        normalizePrice(inputValue),
    }));
  };

  const handleMaxPriceChange = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    const inputValue =
      event.target.value;

    setMaxPriceInput(inputValue);

    setDraftValues((current) => ({
      ...current,
      maxPrice:
        normalizePrice(inputValue),
    }));
  };

  // ---------------------------------------------------------------------------
  // Price validation
  // ---------------------------------------------------------------------------

  const hasInvalidPriceRange =
    draftValues.minPrice !== null &&
    draftValues.maxPrice !== null &&
    draftValues.minPrice >
      draftValues.maxPrice;

  // ---------------------------------------------------------------------------
  // Clear
  // ---------------------------------------------------------------------------

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

  // ---------------------------------------------------------------------------
  // Filters toggle
  // ---------------------------------------------------------------------------

  const handleFiltersClick = (): void => {
    setShowFilters(
      (current) => !current,
    );

    onFiltersClick?.();
  };

  // ---------------------------------------------------------------------------
  // Active state
  // ---------------------------------------------------------------------------

  const hasDraftFilters =
    hasFilterValues(draftValues);

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
        "max-w-full",
        "overflow-hidden",
        "rounded-[clamp(0.42rem,1.5vw,1.15rem)]",
        "border",
        "border-[var(--border)]",
        "border-l-[clamp(0.12rem,0.3vw,0.25rem)]",
        "border-l-[var(--brand)]",
        "bg-[var(--surface)]",
        "shadow-[var(--shadow-md)]",
        className,
      )}
    >
      {/* ---------------------------------------------------------------------
          Header
          --------------------------------------------------------------------- */}

      <div
        className={cn(
          "flex",
          "w-full",
          "min-w-0",
          "max-w-full",
          "items-center",
          "justify-between",
          "gap-[clamp(0.18rem,1vw,0.8rem)]",
          "overflow-hidden",
          "border-b",
          "border-[var(--border-subtle)]",
          "bg-[var(--background-brand)]",
          "px-[clamp(0.35rem,1.6vw,1.25rem)]",
          "py-[clamp(0.28rem,1vw,0.8rem)]",
        )}
      >
        <div
          className={cn(
            "flex",
            "min-w-0",
            "max-w-full",
            "items-center",
            "gap-[clamp(0.18rem,0.7vw,0.55rem)]",
          )}
        >
          <span
            className={cn(
              "flex",
              "size-[clamp(0.9rem,2.8vw,2.1rem)]",
              "shrink-0",
              "items-center",
              "justify-center",
              "rounded-[clamp(0.25rem,0.7vw,0.6rem)]",
              "bg-[var(--brand)]",
              "text-[var(--brand-foreground)]",
              "shadow-[var(--shadow-sm)]",
            )}
          >
            <SearchRouteIcon />
          </span>

          <div className="min-w-0 max-w-full">
            <p
              className={cn(
                "truncate",
                "text-[clamp(0.42rem,1vw,0.82rem)]",
                "font-bold",
                "leading-tight",
                "text-[var(--foreground)]",
              )}
            >
              Find available journeys
            </p>

            <p
              className={cn(
                "mt-[clamp(0.04rem,0.2vw,0.16rem)]",
                "truncate",
                "text-[clamp(0.3rem,0.65vw,0.55rem)]",
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
              "px-[clamp(0.18rem,0.7vw,0.55rem)]",
              "py-[clamp(0.08rem,0.3vw,0.24rem)]",
              "text-[clamp(0.26rem,0.58vw,0.5rem)]",
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

      {/* ---------------------------------------------------------------------
          Primary discovery controls
          --------------------------------------------------------------------- */}

      <div
        className={cn(
          "w-full",
          "min-w-0",
          "max-w-full",
          "p-[clamp(0.22rem,1.1vw,0.9rem)]",
        )}
      >
        <div
          className={cn(
            "grid",
            "w-full",
            "min-w-0",
            "max-w-full",
            "grid-cols-[repeat(4,minmax(0,1fr))]",
            "items-stretch",
            "gap-[clamp(0.1rem,0.65vw,0.65rem)]",
          )}
        >
          {/* -----------------------------------------------------------------
              From
              ----------------------------------------------------------------- */}

          <div
            className={cn(
              "min-w-0",
              "max-w-full",
              "overflow-hidden",
              "rounded-[clamp(0.3rem,1vw,0.8rem)]",
              "border",
              "border-[var(--border)]",
              "bg-[var(--background)]",
              "p-[clamp(0.1rem,0.5vw,0.45rem)]",
              "shadow-[var(--shadow-sm)]",
            )}
          >
            <div
              className={cn(
                "mb-[clamp(0.03rem,0.25vw,0.2rem)]",
                "flex",
                "min-w-0",
                "items-center",
                "gap-[clamp(0.08rem,0.4vw,0.35rem)]",
                "px-[clamp(0.08rem,0.4vw,0.35rem)]",
                "text-[clamp(0.24rem,0.58vw,0.5rem)]",
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
                  "px-[clamp(0.08rem,0.35vw,0.3rem)]",
                  "py-[clamp(0.1rem,0.4vw,0.35rem)]",
                  "text-[clamp(0.38rem,0.9vw,0.88rem)]",
                  "font-semibold",
                  "leading-tight",
                  "focus-visible:ring-0",
                )}
              />
            </div>
          </div>

          {/* -----------------------------------------------------------------
              To
              ----------------------------------------------------------------- */}

          <div
            className={cn(
              "min-w-0",
              "max-w-full",
              "overflow-hidden",
              "rounded-[clamp(0.3rem,1vw,0.8rem)]",
              "border",
              "border-[var(--border)]",
              "bg-[var(--background)]",
              "p-[clamp(0.1rem,0.5vw,0.45rem)]",
              "shadow-[var(--shadow-sm)]",
            )}
          >
            <div
              className={cn(
                "mb-[clamp(0.03rem,0.25vw,0.2rem)]",
                "flex",
                "min-w-0",
                "items-center",
                "gap-[clamp(0.08rem,0.4vw,0.35rem)]",
                "px-[clamp(0.08rem,0.4vw,0.35rem)]",
                "text-[clamp(0.24rem,0.58vw,0.5rem)]",
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
                  "px-[clamp(0.08rem,0.35vw,0.3rem)]",
                  "py-[clamp(0.1rem,0.4vw,0.35rem)]",
                  "text-[clamp(0.38rem,0.9vw,0.88rem)]",
                  "font-semibold",
                  "leading-tight",
                  "focus-visible:ring-0",
                )}
              />
            </div>
          </div>

          {/* -----------------------------------------------------------------
              Date
              ----------------------------------------------------------------- */}

          <div
            className={cn(
              "min-w-0",
              "max-w-full",
              "overflow-hidden",
              "rounded-[clamp(0.3rem,1vw,0.8rem)]",
              "border",
              "border-[var(--border)]",
              "bg-[var(--background)]",
              "p-[clamp(0.1rem,0.5vw,0.45rem)]",
              "shadow-[var(--shadow-sm)]",
            )}
          >
            <div
              className={cn(
                "mb-[clamp(0.03rem,0.25vw,0.2rem)]",
                "flex",
                "min-w-0",
                "items-center",
                "gap-[clamp(0.08rem,0.4vw,0.35rem)]",
                "px-[clamp(0.08rem,0.4vw,0.35rem)]",
                "text-[clamp(0.24rem,0.58vw,0.5rem)]",
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
                  "px-[clamp(0.06rem,0.25vw,0.25rem)]",
                  "py-[clamp(0.1rem,0.4vw,0.35rem)]",
                  "text-[clamp(0.34rem,0.82vw,0.8rem)]",
                  "font-semibold",
                  "leading-tight",
                  "focus-visible:ring-0",
                )}
              />
            </div>
          </div>

          {/* -----------------------------------------------------------------
              Clear
              ----------------------------------------------------------------- */}

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
                "rounded-[clamp(0.3rem,1vw,0.75rem)]",
                "px-[clamp(0.12rem,0.7vw,0.85rem)]",
                "text-[clamp(0.32rem,0.76vw,0.7rem)]",
                "font-semibold",
              )}
            >
              <span className="min-w-0 truncate">
                Clear
              </span>
            </Button>
          </div>
        </div>

        {/* -------------------------------------------------------------------
            Secondary controls
            ------------------------------------------------------------------- */}

        <div
          className={cn(
            "mt-[clamp(0.16rem,0.7vw,0.55rem)]",
            "flex",
            "min-w-0",
            "max-w-full",
            "items-center",
            "justify-between",
            "gap-[clamp(0.16rem,0.8vw,0.7rem)]",
            "overflow-hidden",
          )}
        >
          <div
            className={cn(
              "min-w-0",
              "truncate",
              "text-[clamp(0.26rem,0.58vw,0.52rem)]",
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
              "h-[clamp(1.05rem,2.5vw,2rem)]",
              "w-auto",
              "min-w-0",
              "max-w-full",
              "shrink-0",
              "overflow-hidden",
              "whitespace-nowrap",
              "rounded-[clamp(0.28rem,0.8vw,0.65rem)]",
              "px-[clamp(0.18rem,0.75vw,0.7rem)]",
              "text-[clamp(0.3rem,0.68vw,0.64rem)]",
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
                  "size-[clamp(0.14rem,0.4vw,0.32rem)]",
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

        {/* -------------------------------------------------------------------
            Price filters
            ------------------------------------------------------------------- */}

        {showFilters && (
          <div
            className={cn(
              "mt-[clamp(0.16rem,0.7vw,0.55rem)]",
              "flex",
              "w-full",
              "min-w-0",
              "max-w-full",
              "items-center",
              "gap-[clamp(0.12rem,0.6vw,0.5rem)]",
              "overflow-hidden",
              "rounded-[clamp(0.28rem,0.8vw,0.65rem)]",
              "border",
              "border-[var(--border-subtle)]",
              "bg-[var(--background)]",
              "px-[clamp(0.18rem,0.8vw,0.65rem)]",
              "py-[clamp(0.16rem,0.6vw,0.5rem)]",
            )}
          >
            {/* Price label */}

            <div
              className={cn(
                "flex",
                "min-w-0",
                "shrink-0",
                "items-center",
                "gap-[clamp(0.08rem,0.35vw,0.3rem)]",
                "text-[clamp(0.28rem,0.62vw,0.56rem)]",
                "font-semibold",
                "text-[var(--foreground-muted)]",
              )}
            >
              <PriceIcon />

              <span className="truncate">
                Price
              </span>
            </div>

            {/* Minimum */}

            <div
              className={cn(
                "flex",
                "min-w-0",
                "flex-1",
                "items-center",
                "gap-[clamp(0.06rem,0.25vw,0.2rem)]",
                "overflow-hidden",
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "shrink-0",
                  "text-[clamp(0.26rem,0.55vw,0.5rem)]",
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
                  "max-w-full",
                  "overflow-hidden",
                  "border-0",
                  "bg-transparent",
                  "shadow-none",
                  "px-[clamp(0.05rem,0.25vw,0.2rem)]",
                  "py-[clamp(0.08rem,0.3vw,0.25rem)]",
                  "text-[clamp(0.3rem,0.7vw,0.68rem)]",
                  "font-semibold",
                  "focus-visible:ring-0",
                )}
              />
            </div>

            {/* Separator */}

            <span
              aria-hidden="true"
              className={cn(
                "shrink-0",
                "text-[clamp(0.28rem,0.65vw,0.58rem)]",
                "font-semibold",
                "text-[var(--foreground-muted)]",
              )}
            >
              —
            </span>

            {/* Maximum */}

            <div
              className={cn(
                "flex",
                "min-w-0",
                "flex-1",
                "items-center",
                "gap-[clamp(0.06rem,0.25vw,0.2rem)]",
                "overflow-hidden",
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "shrink-0",
                  "text-[clamp(0.26rem,0.55vw,0.5rem)]",
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
                  "max-w-full",
                  "overflow-hidden",
                  "border-0",
                  "bg-transparent",
                  "shadow-none",
                  "px-[clamp(0.05rem,0.25vw,0.2rem)]",
                  "py-[clamp(0.08rem,0.3vw,0.25rem)]",
                  "text-[clamp(0.3rem,0.7vw,0.68rem)]",
                  "font-semibold",
                  "focus-visible:ring-0",
                )}
              />
            </div>

            {hasInvalidPriceRange && (
              <span
                role="alert"
                className={cn(
                  "hidden",
                  "shrink-0",
                  "text-[clamp(0.24rem,0.55vw,0.5rem)]",
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

export default JourneyMarketplaceFilters;
