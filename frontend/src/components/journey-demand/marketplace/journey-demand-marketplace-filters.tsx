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
// The filter is therefore not framed as:
//
//     "I'm looking for a journey"
//
// It is framed around:
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
//     [ REAL TRAVEL DEMAND ] [ FROM → TO ] [ DATE ] [ CLEAR ]
//
// Design priorities:
//
// - elevated marketplace surface
// - strong brand rail
// - clear demand identity
// - route treated as the primary discovery interaction
// - date treated as a secondary journey constraint
// - clear action deliberately quiet
// - copy explains WHY demand exists
// - no "Active" badge; the entered route/date is self-explanatory
//
// Only frozen sisiMove design tokens are used.
//
// -----------------------------------------------------------------------------
//
// INTERACTION
// -----------
//
// - Inputs remain editable while marketplace results are loading.
// - Text/date changes are debounced by 300ms.
// - Input values are not trimmed while typing.
// - Values are trimmed only when committed.
// - Clear is immediate.
// - No parent → local synchronization effect.
// - No loading-driven remounting or disabling of primary controls.
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
  useState,
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
}

export interface JourneyDemandMarketplaceFiltersProps {
  /**
   * Committed marketplace filter values.
   *
   * Used to initialize the local filter draft.
   */
  readonly value: JourneyDemandMarketplaceFiltersValue;

  /**
   * Called after the user pauses typing.
   *
   * The marketplace container owns the query lifecycle.
   */
  readonly onChange: (
    value: JourneyDemandMarketplaceFiltersValue,
  ) => void;

  /**
   * Optional explicit clear handler.
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

// =============================================================================
// Helpers
// =============================================================================

function commitFilterValues(
  value: JourneyDemandMarketplaceFiltersValue,
): JourneyDemandMarketplaceFiltersValue {
  return {
    from: value.from.trim(),
    to: value.to.trim(),
    date: value.date,
  };
}

function hasActiveFilters(
  value: JourneyDemandMarketplaceFiltersValue,
): boolean {
  return Boolean(
    value.from.trim() ||
      value.to.trim() ||
      value.date,
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
  // Local draft state
  // ===========================================================================

  const [draftValue, setDraftValue] =
    useState<JourneyDemandMarketplaceFiltersValue>(
      value,
    );

  // ===========================================================================
  // Debounced marketplace commit
  // ===========================================================================

  useEffect(() => {
    const timer = window.setTimeout(() => {
      onChange(
        commitFilterValues(draftValue),
      );
    }, FILTER_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [
    draftValue,
    onChange,
  ]);

  // ===========================================================================
  // Field change
  // ===========================================================================

  const handleFieldChange = (
    field: keyof JourneyDemandMarketplaceFiltersValue,
    fieldValue: string,
  ): void => {
    setDraftValue((current) => ({
      ...current,
      [field]: fieldValue,
    }));
  };

  // ===========================================================================
  // Clear
  // ===========================================================================

  const handleClear = (): void => {
    setDraftValue(
      EMPTY_FILTERS,
    );

    if (onClear) {
      onClear();
      return;
    }

    onChange(
      EMPTY_FILTERS,
    );
  };

  // ===========================================================================
  // Active state
  // ===========================================================================

  const hasDraftFilters =
    hasActiveFilters(draftValue);

  // ===========================================================================
  // Render
  // ===========================================================================

  return (
    <section
      aria-label="Real travel demand filters"
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
        {/* ------------------------------------------------------------------- */}
        {/* Identity Icon                                                       */}
        {/* ------------------------------------------------------------------- */}

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

        {/* ------------------------------------------------------------------- */}
        {/* Identity Copy                                                       */}
        {/* ------------------------------------------------------------------- */}

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

        {/* ------------------------------------------------------------------- */}
        {/* Marketplace Explanation                                             */}
        {/* ------------------------------------------------------------------- */}

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
      {/* Filter Body                                                           */}
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
        {/* Route Search                                                         */}
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
            {/* ----------------------------------------------------------------- */}
            {/* From                                                              */}
            {/* ----------------------------------------------------------------- */}

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

            {/* ----------------------------------------------------------------- */}
            {/* Route Connector                                                   */}
            {/* ----------------------------------------------------------------- */}

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

            {/* ----------------------------------------------------------------- */}
            {/* To                                                                */}
            {/* ----------------------------------------------------------------- */}

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
        {/* Date                                                                 */}
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
        {/* Clear                                                                */}
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
    </section>
  );
}

// =============================================================================
// Default Export
// =============================================================================

export default JourneyDemandMarketplaceFilters;