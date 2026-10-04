// -----------------------------------------------------------------------------
// Path: src/features/journey-demand/components/journey-demand-marketplace-filters.tsx
// -----------------------------------------------------------------------------
//
// sisiMove — Journey Demand Marketplace Filters
//
// Public Journey Demand marketplace filters.
//
// Backend:
//
//     GET /journey-demands/public
//
// Supported filters:
//
//     from
//     to
//     date
//     minPrice
//     maxPrice
//
// Example:
//
//     GET /journey-demands/public
//         ?from=Nairobi
//         &to=Mombasa
//         &date=2026-10-10
//         &minPrice=500
//         &maxPrice=1500
//
// -----------------------------------------------------------------------------
//
// PRODUCT MEANING
// ---------------
//
// Journey Demand is the marketplace's visible signal of REAL TRAVEL DEMAND.
//
// A Journey says:
//
//     "I'm travelling this route and I have seats available."
//
// A Journey Demand says:
//
//     "I want to travel this route, but I haven't found a suitable journey."
//
// This marketplace therefore serves both sides:
//
// - Drivers/providers can see where members want to travel.
// - Members can see where other members are expressing travel demand.
// - SisiMove can expose routes where real travel demand exists.
//
// This marketplace filter is therefore framed around:
//
//     "REAL TRAVEL DEMAND"
//
//     "See where members want to travel."
//
// -----------------------------------------------------------------------------
//
// VISUAL DIRECTION
// ---------------
//
// The component is intentionally more prominent than a normal filter bar:
//
//     [ REAL TRAVEL DEMAND ]
//     [ FROM → TO ] [ DATE ] [ CLEAR ]
//
// Additional refinement:
//
//     [ PRICE RANGE ]
//     [ MIN KES ] — [ MAX KES ]
//
// Design priorities:
//
// - elevated marketplace surface
// - strong brand rail
// - clear demand identity
// - route treated as the primary discovery interaction
// - date treated as a secondary journey constraint
// - price treated as an additional refinement
// - clear action deliberately quiet
// - copy explains WHY demand exists
// - no "Active" badge
//
// Only frozen sisiMove design tokens are used.
//
// -----------------------------------------------------------------------------
//
// INTERACTION
// -----------
//
// - Inputs remain editable while marketplace results are loading.
// - Text/date/price changes are debounced by 300ms.
// - The debounce is stable even when the parent recreates `onChange`.
// - Input values are not trimmed while typing.
// - Text values are trimmed only when committed.
// - Price values remain strings locally while typing.
// - Empty price inputs commit as null.
// - Clear is immediate.
// - Invalid price ranges are not committed.
// - Invalid price ranges remain visible locally so they can be corrected.
// - No parent → local synchronization effect.
// - No loading-driven remounting or disabling of primary controls.
//
// -----------------------------------------------------------------------------
//
// PRICE CONTRACT
// -------------
//
// Price is expressed in KES.
//
// Empty:
//
//     null
//
// Valid:
//
//     minPrice >= 0
//     maxPrice >= 0
//
// Invalid:
//
//     minPrice > maxPrice
//
// Invalid ranges remain visible locally so the user can correct them.
//
// Invalid ranges MUST NOT be committed to the marketplace query.
//
// -----------------------------------------------------------------------------
//
// Copyright © sisiMove
// -----------------------------------------------------------------------------

'use client';

// -----------------------------------------------------------------------------
// React
// -----------------------------------------------------------------------------

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from 'react';

// -----------------------------------------------------------------------------
// UI
// -----------------------------------------------------------------------------

import {
  Button,
  Input,
} from '@/components/ui';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { cn } from '@/foundation/utils/cn';

// =============================================================================
// Types
// =============================================================================

export interface JourneyDemandMarketplaceFiltersValue {
  readonly from: string;
  readonly to: string;
  readonly date: string;

  /**
   * Minimum acceptable Journey Demand price in KES.
   *
   * `null` means no lower price boundary.
   */
  readonly minPrice: number | null;

  /**
   * Maximum acceptable Journey Demand price in KES.
   *
   * `null` means no upper price boundary.
   */
  readonly maxPrice: number | null;
}

export interface JourneyDemandMarketplaceFiltersProps {
  /**
   * Committed marketplace filter values.
   *
   * Used to initialize the local filter draft.
   */
  readonly value: JourneyDemandMarketplaceFiltersValue;

  /**
   * Called after the user pauses changing filters.
   *
   * The marketplace container owns the query lifecycle.
   */
  readonly onChange: (
    value: JourneyDemandMarketplaceFiltersValue,
  ) => void;

  /**
   * Optional explicit clear handler.
   *
   * When supplied, the parent owns any additional clear behavior.
   */
  readonly onClear?: () => void;

  /**
   * Prevents interaction with the controls.
   */
  readonly disabled?: boolean;

  /**
   * Optional additional classes.
   */
  readonly className?: string;
}

// =============================================================================
// Constants
// =============================================================================

const EMPTY_FILTERS: JourneyDemandMarketplaceFiltersValue = {
  from: '',
  to: '',
  date: '',
  minPrice: null,
  maxPrice: null,
};

const FILTER_DEBOUNCE_MS = 300;

// =============================================================================
// Icons
// =============================================================================

function XIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="size-[clamp(0.7rem,1vw,0.9rem)]"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m6 6 12 12M18 6 6 18"
      />
    </svg>
  );
}

function RouteDemandIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="size-[clamp(1rem,1.4vw,1.2rem)]"
    >
      <circle
        cx="6"
        cy="6"
        r="2.25"
      />

      <circle
        cx="18"
        cy="18"
        r="2.25"
      />

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7.8 7.7 16.2 16.3"
      />

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14.2 5.4h4.2v4.2"
      />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="size-[clamp(0.7rem,1vw,0.9rem)]"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 12h13"
      />

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m14 7 5 5-5 5"
      />
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
      strokeWidth="1.7"
      className="size-[clamp(0.8rem,1vw,1rem)]"
    >
      <rect
        x="3.5"
        y="5"
        width="17"
        height="15.5"
        rx="2.25"
      />

      <path
        strokeLinecap="round"
        d="M7.5 3.5v3M16.5 3.5v3M3.5 9.5h17"
      />
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
      strokeWidth="1.7"
      className="size-[clamp(0.7rem,1vw,0.9rem)]"
    >
      <path
        strokeLinecap="round"
        d="M12 3v18"
      />

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 7.5c-.8-1-2.1-1.5-4-1.5-2.2 0-4 1.1-4 2.8 0 4.4 8 1.8 8 6 0 1.7-1.6 2.7-4 2.7-1.9 0-3.4-.6-4.3-1.7"
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
        'size-[clamp(0.6rem,1vw,0.85rem)]',
        'transition-transform',
        open && 'rotate-180',
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

// =============================================================================
// Helpers
// =============================================================================

/**
 * Converts a local price input into the marketplace price representation.
 *
 * Empty or invalid values become null.
 *
 * Negative prices are rejected.
 */
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

/**
 * Converts the committed numeric price into a local input string.
 */
function priceToInputValue(
  value: number | null,
): string {
  return value === null
    ? ''
    : String(value);
}

/**
 * Normalizes values only at the commit boundary.
 *
 * Text inputs remain untouched while the user is typing.
 */
function commitFilterValues(
  value: JourneyDemandMarketplaceFiltersValue,
): JourneyDemandMarketplaceFiltersValue {
  return {
    from: value.from.trim(),
    to: value.to.trim(),
    date: value.date,
    minPrice: value.minPrice,
    maxPrice: value.maxPrice,
  };
}

/**
 * Determines whether any marketplace filter is currently populated.
 */
function hasActiveFilters(
  value: JourneyDemandMarketplaceFiltersValue,
): boolean {
  return Boolean(
    value.from.trim() ||
      value.to.trim() ||
      value.date ||
      value.minPrice !== null ||
      value.maxPrice !== null,
  );
}

/**
 * Determines whether either price boundary is currently populated.
 */
function hasPriceFilters(
  value: JourneyDemandMarketplaceFiltersValue,
): boolean {
  return (
    value.minPrice !== null ||
    value.maxPrice !== null
  );
}

/**
 * Determines whether the local price range is valid.
 *
 * Both boundaries may be supplied independently.
 *
 * Invalid only when:
 *
 *     minPrice > maxPrice
 */
function hasInvalidPriceRange(
  value: JourneyDemandMarketplaceFiltersValue,
): boolean {
  return (
    value.minPrice !== null &&
    value.maxPrice !== null &&
    value.minPrice >
      value.maxPrice
  );
}

// =============================================================================
// Component
// =============================================================================

export function JourneyDemandMarketplaceFilters({
  value,
  onChange,
  onClear,
  disabled = false,
  className,
}: JourneyDemandMarketplaceFiltersProps) {
  // ===========================================================================
  // Parent callback reference
  // ===========================================================================

  /**
   * The marketplace parent may recreate `onChange` whenever its query state
   * changes.
   *
   * The debounce must NOT depend on the callback identity because doing so
   * would restart the 300ms timer during parent rerenders and can make typing
   * feel unstable.
   *
   * The latest callback is therefore stored in a ref while the debounce effect
   * depends only on the local draft.
   */
  const onChangeRef =
    useRef(onChange);

  useEffect(() => {
    onChangeRef.current =
      onChange;
  }, [onChange]);

  // ===========================================================================
  // Local draft state
  // ===========================================================================

  /**
   * The filter draft intentionally initializes once from the committed value.
   *
   * There is deliberately NO parent → local synchronization effect.
   *
   * This prevents marketplace query results or parent rerenders from
   * overwriting text the user is currently editing.
   */
  const [draftValue, setDraftValue] =
    useState<JourneyDemandMarketplaceFiltersValue>(
      value,
    );

  // ===========================================================================
  // Local price input state
  // ===========================================================================

  /**
   * Price inputs remain strings locally.
   *
   * This allows the user to temporarily enter an empty value while editing.
   */
  const [minPriceInput, setMinPriceInput] =
    useState<string>(
      priceToInputValue(
        value.minPrice,
      ),
    );

  const [maxPriceInput, setMaxPriceInput] =
    useState<string>(
      priceToInputValue(
        value.maxPrice,
      ),
    );

  // ===========================================================================
  // Additional filter visibility
  // ===========================================================================

  const [showFilters, setShowFilters] =
    useState<boolean>(
      hasPriceFilters(value),
    );

  // ===========================================================================
  // Derived validation
  // ===========================================================================

  const invalidPriceRange =
    hasInvalidPriceRange(
      draftValue,
    );

  // ===========================================================================
  // Debounced marketplace commit
  // ===========================================================================

  useEffect(() => {
    const timer = window.setTimeout(() => {
      /**
       * Invalid price ranges remain entirely local.
       *
       * The parent therefore retains the last valid marketplace query while
       * the user sees and corrects the invalid range in this component.
       */
      if (
        hasInvalidPriceRange(
          draftValue,
        )
      ) {
        return;
      }

      const committedValues =
        commitFilterValues(
          draftValue,
        );

      onChangeRef.current(
        committedValues,
      );
    }, FILTER_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [draftValue]);

  // ===========================================================================
  // Field change
  // ===========================================================================

  const handleFieldChange = (
    field:
      | 'from'
      | 'to'
      | 'date',
    fieldValue: string,
  ): void => {
    setDraftValue((current) => ({
      ...current,
      [field]: fieldValue,
    }));
  };

  // ===========================================================================
  // Minimum price change
  // ===========================================================================

  const handleMinPriceChange = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    const inputValue =
      event.target.value;

    setMinPriceInput(
      inputValue,
    );

    setDraftValue((current) => ({
      ...current,
      minPrice:
        normalizePrice(
          inputValue,
        ),
    }));
  };

  // ===========================================================================
  // Maximum price change
  // ===========================================================================

  const handleMaxPriceChange = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    const inputValue =
      event.target.value;

    setMaxPriceInput(
      inputValue,
    );

    setDraftValue((current) => ({
      ...current,
      maxPrice:
        normalizePrice(
          inputValue,
        ),
    }));
  };

  // ===========================================================================
  // Clear
  // ===========================================================================

  const handleClear = (): void => {
    setDraftValue(
      EMPTY_FILTERS,
    );

    setMinPriceInput('');

    setMaxPriceInput('');

    setShowFilters(false);

    /**
     * Clear intentionally bypasses the debounce.
     *
     * If the parent owns additional clear behavior, it receives that callback
     * instead of the component issuing the marketplace change itself.
     */
    if (onClear) {
      onClear();
      return;
    }

    onChangeRef.current(
      EMPTY_FILTERS,
    );
  };

  // ===========================================================================
  // Toggle additional filters
  // ===========================================================================

  const handleFiltersToggle = (): void => {
    setShowFilters(
      (current) => !current,
    );
  };

  // ===========================================================================
  // Active state
  // ===========================================================================

  const hasDraftFilters =
    hasActiveFilters(
      draftValue,
    );

  const hasDraftPriceFilters =
    hasPriceFilters(
      draftValue,
    );

  // ===========================================================================
  // Render
  // ===========================================================================

  return (
    <section
      aria-label="Real travel demand filters"
      aria-busy={disabled}
      className={cn(
        'relative',
        'w-full',
        'min-w-0',
        'overflow-hidden',
        'rounded-[var(--radius-xl)]',
        'border',
        'border-[var(--border)]',
        'border-l-4',
        'border-l-[var(--brand)]',
        'bg-[var(--surface)]',
        'shadow-[var(--shadow-lg)]',
        className,
      )}
    >
      {/* ===================================================================== */}
      {/* Demand Identity Bar                                                   */}
      {/* ===================================================================== */}

      <div
        className={cn(
          'flex',
          'min-w-0',
          'items-center',
          'gap-[clamp(0.55rem,1vw,0.8rem)]',
          'border-b',
          'border-[var(--border-subtle)]',
          'bg-[var(--background-brand)]',
          'px-[clamp(0.75rem,1.25vw,1.1rem)]',
          'py-[clamp(0.6rem,0.9vw,0.8rem)]',
        )}
      >
        <span
          className={cn(
            'flex',
            'size-[clamp(1.9rem,2.6vw,2.25rem)]',
            'shrink-0',
            'items-center',
            'justify-center',
            'rounded-[var(--radius-md)]',
            'bg-[var(--brand)]',
            'text-[var(--brand-foreground)]',
            'shadow-[var(--shadow-sm)]',
          )}
        >
          <RouteDemandIcon />
        </span>

        <div className="min-w-0">
          <span
            className={cn(
              'block',
              'truncate',
              'text-[clamp(0.68rem,0.82vw,0.78rem)]',
              'font-bold',
              'uppercase',
              'tracking-[0.1em]',
              'text-[var(--brand)]',
            )}
          >
            Real travel demand
          </span>

          <p
            className={cn(
              'mt-0.5',
              'truncate',
              'text-[clamp(0.58rem,0.7vw,0.68rem)]',
              'text-[var(--foreground-secondary)]',
            )}
          >
            See where members want to travel.
          </p>
        </div>

        <div
          className={cn(
            'ml-auto',
            'hidden',
            'max-w-[34rem]',
            'min-w-0',
            'text-right',
            'lg:block',
          )}
        >
          <p
            className={cn(
              'truncate',
              'text-[clamp(0.55rem,0.68vw,0.65rem)]',
              'leading-relaxed',
              'text-[var(--foreground-muted)]',
            )}
          >
            Members express demand when they can&apos;t find
            a suitable journey.
          </p>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* Primary Filters                                                       */}
      {/* ===================================================================== */}

      <div
        className={cn(
          'flex',
          'w-full',
          'min-w-0',
          'items-stretch',
          'gap-[clamp(0.4rem,0.8vw,0.7rem)]',
          'p-[clamp(0.5rem,0.85vw,0.7rem)]',
        )}
      >
        {/* =================================================================== */}
        {/* Route                                                               */}
        {/* =================================================================== */}

        <div
          className={cn(
            'flex',
            'min-w-0',
            'flex-1',
            'items-end',
            'rounded-[var(--radius-lg)]',
            'border',
            'border-[var(--border)]',
            'bg-[var(--background-subtle)]',
            'px-[clamp(0.45rem,0.8vw,0.7rem)]',
            'py-[clamp(0.2rem,0.45vw,0.35rem)]',
          )}
        >
          <div
            className={cn(
              'grid',
              'w-full',
              'min-w-0',
              'grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]',
              'items-end',
              'gap-[clamp(0.25rem,0.6vw,0.5rem)]',
            )}
          >
            <div className="min-w-0">
              <Input
                id="journey-demand-filter-from"
                label="From"
                name="from"
                type="text"
                value={draftValue.from}
                onChange={(event) =>
                  handleFieldChange(
                    'from',
                    event.target.value,
                  )
                }
                placeholder="Origin"
                autoComplete="off"
                disabled={disabled}
                className={cn(
                  'min-w-0',
                  'border-transparent',
                  'bg-[var(--surface)]',
                  'text-[clamp(0.65rem,0.9vw,0.875rem)]',
                )}
              />
            </div>

            <span
              aria-hidden="true"
              className={cn(
                'mb-[clamp(0.45rem,0.7vw,0.6rem)]',
                'flex',
                'size-[clamp(1.5rem,2vw,1.8rem)]',
                'shrink-0',
                'items-center',
                'justify-center',
                'rounded-[var(--radius-full)]',
                'bg-[var(--brand-soft)]',
                'text-[var(--brand)]',
              )}
            >
              <ArrowRightIcon />
            </span>

            <div className="min-w-0">
              <Input
                id="journey-demand-filter-to"
                label="To"
                name="to"
                type="text"
                value={draftValue.to}
                onChange={(event) =>
                  handleFieldChange(
                    'to',
                    event.target.value,
                  )
                }
                placeholder="Destination"
                autoComplete="off"
                disabled={disabled}
                className={cn(
                  'min-w-0',
                  'border-transparent',
                  'bg-[var(--surface)]',
                  'text-[clamp(0.65rem,0.9vw,0.875rem)]',
                )}
              />
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/* Date                                                                */}
        {/* =================================================================== */}

        <div
          className={cn(
            'w-[clamp(7rem,13vw,10.5rem)]',
            'shrink-0',
            'rounded-[var(--radius-lg)]',
            'border',
            'border-[var(--border)]',
            'bg-[var(--background-subtle)]',
            'px-[clamp(0.35rem,0.6vw,0.55rem)]',
            'py-[clamp(0.2rem,0.45vw,0.35rem)]',
          )}
        >
          <div
            className={cn(
              'flex',
              'items-center',
              'gap-1',
              'px-1',
              'pb-0.5',
              'text-[var(--foreground-muted)]',
            )}
          >
            <CalendarIcon />

            <span
              className={cn(
                'text-[clamp(0.55rem,0.68vw,0.65rem)]',
                'font-semibold',
                'uppercase',
                'tracking-[0.06em]',
              )}
            >
              Travel date
            </span>
          </div>

          <Input
            id="journey-demand-filter-date"
            aria-label="Travel date"
            name="date"
            type="date"
            value={draftValue.date}
            onChange={(event) =>
              handleFieldChange(
                'date',
                event.target.value,
              )
            }
            disabled={disabled}
            className={cn(
              'min-w-0',
              'border-transparent',
              'bg-[var(--surface)]',
              'text-[clamp(0.6rem,0.85vw,0.875rem)]',
            )}
          />
        </div>

        {/* =================================================================== */}
        {/* Clear                                                               */}
        {/* =================================================================== */}

        <div
          className={cn(
            'flex',
            'shrink-0',
            'items-end',
          )}
        >
          <Button
            type="button"
            variant="outline"
            size="md"
            leadingIcon={<XIcon />}
            onClick={handleClear}
            disabled={
              disabled ||
              !hasDraftFilters
            }
            aria-label="Clear travel demand filters"
            className={cn(
              'h-full',
              'max-w-full',
              'whitespace-nowrap',
              'border-[var(--border)]',
              'bg-[var(--surface)]',
              'px-[clamp(0.55rem,1vw,0.875rem)]',
              'text-[clamp(0.62rem,0.85vw,0.8rem)]',
              'text-[var(--foreground-secondary)]',
            )}
          >
            <span className="truncate">
              Clear
            </span>
          </Button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* Additional Filters                                                    */}
      {/* ===================================================================== */}

      <div
        className={cn(
          'flex',
          'min-w-0',
          'items-center',
          'justify-between',
          'gap-[clamp(0.35rem,0.8vw,0.7rem)]',
          'border-t',
          'border-[var(--border-subtle)]',
          'px-[clamp(0.5rem,0.85vw,0.7rem)]',
          'py-[clamp(0.35rem,0.65vw,0.55rem)]',
        )}
      >
        <span
          className={cn(
            'min-w-0',
            'truncate',
            'text-[clamp(0.42rem,0.6vw,0.55rem)]',
            'text-[var(--foreground-muted)]',
          )}
        >
          Refine demand by acceptable price
        </span>

        <Button
          type="button"
          variant={
            hasDraftPriceFilters
              ? 'primary'
              : 'outline'
          }
          size="sm"
          leadingIcon={<PriceIcon />}
          onClick={handleFiltersToggle}
          disabled={disabled}
          aria-label="Open price filters"
          aria-expanded={showFilters}
          aria-pressed={hasDraftPriceFilters}
          className={cn(
            'h-[clamp(1.55rem,2.8vw,2.15rem)]',
            'shrink-0',
            'rounded-[clamp(0.4rem,0.8vw,0.65rem)]',
            'px-[clamp(0.4rem,0.8vw,0.75rem)]',
            'text-[clamp(0.42rem,0.68vw,0.64rem)]',
            'font-semibold',
          )}
        >
          <span>Price</span>

          {hasDraftPriceFilters && (
            <span
              aria-hidden="true"
              className={cn(
                'ml-0.5',
                'size-[clamp(0.25rem,0.45vw,0.375rem)]',
                'rounded-full',
                'bg-current',
              )}
            />
          )}

          <ChevronIcon
            open={showFilters}
          />
        </Button>
      </div>

      {/* ===================================================================== */}
      {/* Price Range                                                           */}
      {/* ===================================================================== */}

      {showFilters && (
        <div
          className={cn(
            'border-t',
            'border-[var(--border-subtle)]',
            'bg-[var(--background-subtle)]',
            'px-[clamp(0.5rem,0.85vw,0.7rem)]',
            'py-[clamp(0.45rem,0.8vw,0.7rem)]',
          )}
        >
          <div
            className={cn(
              'mb-[clamp(0.3rem,0.6vw,0.5rem)]',
              'flex',
              'items-center',
              'gap-[clamp(0.2rem,0.45vw,0.35rem)]',
            )}
          >
            <PriceIcon />

            <div className="min-w-0">
              <p
                className={cn(
                  'truncate',
                  'text-[clamp(0.48rem,0.68vw,0.62rem)]',
                  'font-bold',
                  'text-[var(--foreground)]',
                )}
              >
                Price range
              </p>

              <p
                className={cn(
                  'truncate',
                  'text-[clamp(0.36rem,0.55vw,0.5rem)]',
                  'text-[var(--foreground-muted)]',
                )}
              >
                Filter demand by acceptable Journey price in KES.
              </p>
            </div>
          </div>

          <div
            className={cn(
              'grid',
              'w-full',
              'min-w-0',
              'grid-cols-[repeat(2,minmax(0,1fr))]',
              'gap-[clamp(0.3rem,0.7vw,0.55rem)]',
            )}
          >
            {/* ----------------------------------------------------------------- */}
            {/* Minimum                                                           */}
            {/* ----------------------------------------------------------------- */}

            <div
              className={cn(
                'min-w-0',
                'rounded-[var(--radius-md)]',
                'border',
                'border-[var(--border)]',
                'bg-[var(--surface)]',
                'p-[clamp(0.2rem,0.45vw,0.35rem)]',
              )}
            >
              <label
                htmlFor="journey-demand-filter-min-price"
                className={cn(
                  'mb-0.5',
                  'block',
                  'px-1',
                  'text-[clamp(0.35rem,0.55vw,0.5rem)]',
                  'font-semibold',
                  'uppercase',
                  'tracking-[0.06em]',
                  'text-[var(--foreground-muted)]',
                )}
              >
                Minimum
              </label>

              <div
                className={cn(
                  'flex',
                  'min-w-0',
                  'items-center',
                  'gap-1',
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    'shrink-0',
                    'px-1',
                    'text-[clamp(0.4rem,0.65vw,0.58rem)]',
                    'font-semibold',
                    'text-[var(--foreground-muted)]',
                  )}
                >
                  KES
                </span>

                <Input
                  id="journey-demand-filter-min-price"
                  name="minPrice"
                  type="number"
                  inputMode="numeric"
                  min="0"
                  step="1"
                  value={minPriceInput}
                  onChange={handleMinPriceChange}
                  placeholder="No minimum"
                  disabled={disabled}
                  aria-label="Minimum acceptable Journey price"
                  aria-invalid={invalidPriceRange}
                  className={cn(
                    'min-w-0',
                    'border-transparent',
                    'bg-transparent',
                    'px-1',
                    'text-[clamp(0.48rem,0.75vw,0.7rem)]',
                    'font-semibold',
                  )}
                />
              </div>
            </div>

            {/* ----------------------------------------------------------------- */}
            {/* Maximum                                                           */}
            {/* ----------------------------------------------------------------- */}

            <div
              className={cn(
                'min-w-0',
                'rounded-[var(--radius-md)]',
                'border',
                'border-[var(--border)]',
                'bg-[var(--surface)]',
                'p-[clamp(0.2rem,0.45vw,0.35rem)]',
              )}
            >
              <label
                htmlFor="journey-demand-filter-max-price"
                className={cn(
                  'mb-0.5',
                  'block',
                  'px-1',
                  'text-[clamp(0.35rem,0.55vw,0.5rem)]',
                  'font-semibold',
                  'uppercase',
                  'tracking-[0.06em]',
                  'text-[var(--foreground-muted)]',
                )}
              >
                Maximum
              </label>

              <div
                className={cn(
                  'flex',
                  'min-w-0',
                  'items-center',
                  'gap-1',
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    'shrink-0',
                    'px-1',
                    'text-[clamp(0.4rem,0.65vw,0.58rem)]',
                    'font-semibold',
                    'text-[var(--foreground-muted)]',
                  )}
                >
                  KES
                </span>

                <Input
                  id="journey-demand-filter-max-price"
                  name="maxPrice"
                  type="number"
                  inputMode="numeric"
                  min="0"
                  step="1"
                  value={maxPriceInput}
                  onChange={handleMaxPriceChange}
                  placeholder="No maximum"
                  disabled={disabled}
                  aria-label="Maximum acceptable Journey price"
                  aria-invalid={invalidPriceRange}
                  className={cn(
                    'min-w-0',
                    'border-transparent',
                    'bg-transparent',
                    'px-1',
                    'text-[clamp(0.48rem,0.75vw,0.7rem)]',
                    'font-semibold',
                  )}
                />
              </div>
            </div>
          </div>

          {/* ----------------------------------------------------------------- */}
          {/* Validation                                                         */}
          {/* ----------------------------------------------------------------- */}

          {invalidPriceRange && (
            <p
              role="alert"
              className={cn(
                'mt-2',
                'text-[clamp(0.36rem,0.58vw,0.52rem)]',
                'font-medium',
                'text-[var(--destructive)]',
              )}
            >
              Minimum price cannot be greater than maximum price.
            </p>
          )}
        </div>
      )}
    </section>
  );
}

// =============================================================================
// Default Export
// =============================================================================

export default JourneyDemandMarketplaceFilters;