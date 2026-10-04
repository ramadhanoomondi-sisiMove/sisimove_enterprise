// -----------------------------------------------------------------------------
// Path: src/features/journey/components/journey-marketplace.tsx
// -----------------------------------------------------------------------------
//
// sisiMove — Journey Marketplace
//
// Public Journey marketplace composition component.
//
// Responsive philosophy:
// - The marketplace is fluid from edge to edge.
// - JourneyCard owns its internal rubber-band scaling.
// - JourneyList owns collection spacing only.
// - Marketplace chrome contracts naturally with the available width.
// - No mobile-only reconstruction of the marketplace hierarchy.
// - Existing results remain visible while a new filter query is loading.
//
// Responsibilities:
// - own committed marketplace filter state;
// - execute the public Journey collection query;
// - connect filters to the query boundary;
// - render loading, error, empty, and populated states;
// - compose the marketplace filters, list, and state components.
//
// Non-responsibilities:
// - no API calls directly;
// - no response mapping;
// - no domain lifecycle logic;
// - no sorting or filtering of returned data in memory;
// - no reconstruction of backend state;
// - no route construction;
// - no Journey mutation handling.
//
// The public Journey query hook remains the server-state boundary.
// The backend remains authoritative for the returned PublicJourney
// projections.
//
// Component hierarchy:
//
//   Route
//      ↓
//   JourneyMarketplace
//      ├── JourneyMarketplaceFilters
//      ├── JourneyList
//      │      └── JourneyCard
//      ├── JourneyEmptyState
//      └── JourneyErrorState
//
// -----------------------------------------------------------------------------
//
// FILTER LIFECYCLE
// ----------------
//
// JourneyMarketplace owns the committed query state.
//
// JourneyMarketplaceFilters owns the temporary typing state.
//
//     User types
//          │
//          ▼
//     Filter local draft
//          │
//          ▼
//     300ms debounce
//          │
//          ▼
//     handleFiltersChange()
//          │
//          ▼
//     committed `filters`
//          │
//          ▼
//     usePublicJourneys()
//          │
//          ▼
//     backend query
//
// IMPORTANT
// ---------
//
// The marketplace MUST NOT disable or unmount JourneyMarketplaceFilters
// while the query is loading.
//
// The user must be able to continue typing while results are loading.
//
// Loading belongs to the result area, not the input controls.
//
// During a filter transition, previously returned journeys remain visible
// whenever the query hook provides them. This prevents the marketplace from
// flashing an empty state between keystrokes.
//
// -----------------------------------------------------------------------------
//
// QUERY STATE CONTRACT
// -------------------
//
// `filters` is the committed marketplace query.
//
// `JourneyMarketplaceFilters` owns the temporary draft.
//
// `usePublicJourneys` owns asynchronous request state.
//
// This component does not attempt to reproduce request lifecycle logic.
//
// -----------------------------------------------------------------------------
//
// PRICE FILTER CONTRACT
// --------------------
//
// Price filters are committed as part of the same marketplace query state:
//
//     minPrice
//     maxPrice
//
// Price is a per-seat Journey marketplace price in KES.
//
// Both boundaries are inclusive:
//
//     minPrice <= Journey price <= maxPrice
//
// Either boundary may be supplied independently.
//
// The backend remains authoritative for applying the price range.
//
// -----------------------------------------------------------------------------
//
// REFETCH CONTRACT
// ----------------
//
// `usePublicJourneys().refetch()` schedules a new request for the current
// normalized query.
//
// It does not return a Promise.
//
// The marketplace therefore invokes it directly:
//
//     refetch();
//
// -----------------------------------------------------------------------------
//
// -----------------------------------------------------------------------------

"use client";

// -----------------------------------------------------------------------------
// React
// -----------------------------------------------------------------------------

import {
  useCallback,
  useState,
} from "react";

// -----------------------------------------------------------------------------
// UI
// -----------------------------------------------------------------------------

import { Button } from "@/components/ui";

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { cn } from "@/foundation";

// -----------------------------------------------------------------------------
// Journey Queries
// -----------------------------------------------------------------------------

import { usePublicJourneys } from "@/features/journey/hooks/queries/use-public-journeys";

// -----------------------------------------------------------------------------
// Components
// -----------------------------------------------------------------------------

import { JourneyEmptyState } from "./journey-empty-state";
import { JourneyErrorState } from "./journey-error-state";
import { JourneyList } from "./journey-list";
import {
  JourneyMarketplaceFilters,
  type JourneyMarketplaceFilterValues,
} from "./journey-marketplace-filters";

// =============================================================================
// Types
// =============================================================================

export interface JourneyMarketplaceProps {
  /**
   * Optional initial origin filter.
   */
  readonly initialFrom?: string;

  /**
   * Optional initial destination filter.
   */
  readonly initialTo?: string;

  /**
   * Optional initial departure date filter.
   */
  readonly initialDate?: string;

  /**
   * Optional initial minimum Journey price per seat.
   */
  readonly initialMinPrice?: number | null;

  /**
   * Optional initial maximum Journey price per seat.
   */
  readonly initialMaxPrice?: number | null;

  /**
   * Optional additional classes for the marketplace surface.
   */
  readonly className?: string;

  /**
   * Controls the density of Journey cards.
   *
   * Compact is the default because the public marketplace is designed to
   * display multiple Journeys at once and make filtering useful.
   */
  readonly emphasis?: "compact" | "default";

  /**
   * Optional action supplied by the parent for creating a Journey.
   *
   * The marketplace does not perform Journey creation itself.
   */
  readonly onCreateJourney?: () => void;

  /**
   * Optional View Journey action.
   *
   * Navigation remains owned by the parent.
   */
  readonly onView?: (
    journeyPublicId: string,
  ) => void;

  /**
   * Optional Share Journey action.
   *
   * Sharing behavior remains owned by the parent.
   */
  readonly onShare?: (
    journeyPublicId: string,
  ) => void;

  /**
   * Optional Book Journey action.
   *
   * Booking behavior remains owned by the parent.
   */
  readonly onBook?: (
    journeyPublicId: string,
  ) => void;

  /**
   * Public ID of the Journey currently being booked.
   */
  readonly bookingJourneyPublicId?: string | null;

  /**
   * Allows the parent to disable Journey View actions.
   */
  readonly viewDisabled?: boolean;

  /**
   * Allows the parent to disable Journey Share actions.
   */
  readonly shareDisabled?: boolean;

  /**
   * Allows the parent to disable Journey Book actions.
   */
  readonly bookDisabled?: boolean;

  /**
   * Optional action labels.
   */
  readonly viewLabel?: string;
  readonly shareLabel?: string;
  readonly bookLabel?: string;
  readonly bookingLabel?: string;
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

// =============================================================================
// Component
// =============================================================================

export function JourneyMarketplace({
  initialFrom = "",
  initialTo = "",
  initialDate = "",
  initialMinPrice = null,
  initialMaxPrice = null,
  className,
  emphasis = "compact",
  onCreateJourney,
  onView,
  onShare,
  onBook,
  bookingJourneyPublicId = null,
  viewDisabled = false,
  shareDisabled = false,
  bookDisabled = false,
  viewLabel = "View",
  shareLabel = "Share",
  bookLabel = "Book",
  bookingLabel = "Booking…",
}: JourneyMarketplaceProps) {
  // ===========================================================================
  // Marketplace Filter State
  // ===========================================================================
  //
  // This is the committed marketplace query state.
  //
  // JourneyMarketplaceFilters owns the temporary typing state.
  //
  // Price boundaries are part of the same committed query state as route/date.
  //
  // ===========================================================================

  const [filters, setFilters] =
    useState<JourneyMarketplaceFilterValues>(() => ({
      from: initialFrom,
      to: initialTo,
      date: initialDate,
      minPrice: initialMinPrice,
      maxPrice: initialMaxPrice,
    }));

  // ===========================================================================
  // Public Journey Query
  // ===========================================================================
  //
  // The backend remains authoritative for:
  //
  // - matching;
  // - filtering;
  // - price-range filtering;
  // - returned Journey projections.
  //
  // No client-side filtering is performed here.
  //
  // Price values are omitted when their local value is null.
  //
  // ===========================================================================

  const {
    journeys,
    isLoading,
    error,
    refetch,
  } = usePublicJourneys({
    from:
      filters.from.trim() || undefined,

    to:
      filters.to.trim() || undefined,

    date:
      filters.date || undefined,

    minPrice:
      filters.minPrice !== null
        ? filters.minPrice
        : undefined,

    maxPrice:
      filters.maxPrice !== null
        ? filters.maxPrice
        : undefined,
  });

  // ===========================================================================
  // Filter Changes
  // ===========================================================================
  //
  // JourneyMarketplaceFilters debounces changes before invoking this callback.
  //
  // The callback is stable so the parent does not unnecessarily recreate the
  // committed filter transition handler.
  //
  // ===========================================================================

  const handleFiltersChange = useCallback(
    (
      nextFilters: JourneyMarketplaceFilterValues,
    ): void => {
      setFilters(nextFilters);
    },
    [],
  );

  // ===========================================================================
  // Clear Filters
  // ===========================================================================

  const handleClearFilters = useCallback(
    (): void => {
      setFilters(
        EMPTY_FILTER_VALUES,
      );
    },
    [],
  );

  // ===========================================================================
  // Filter State
  // ===========================================================================
  //
  // Price is an active marketplace filter whenever either price boundary
  // exists.
  //
  // ===========================================================================

  const hasActiveFilters =
    filters.from.trim().length > 0 ||
    filters.to.trim().length > 0 ||
    filters.date.length > 0 ||
    filters.minPrice !== null ||
    filters.maxPrice !== null;

  // ===========================================================================
  // Result State
  // ===========================================================================
  //
  // A loading transition is NOT an empty marketplace.
  //
  // Existing journeys remain visible while the next query is loading.
  //
  // This is particularly important for live filtering:
  //
  //     typing "N"
  //          ↓
  //     request starts
  //          ↓
  //     existing results remain visible
  //          ↓
  //     new response arrives
  //
  // ===========================================================================

  const hasError =
    error !== null;

  const hasResults =
    journeys.length > 0;

  const showLoadingState =
    isLoading &&
    !hasResults &&
    !hasError;

  const showUpdatingState =
    isLoading &&
    hasResults;

  const showErrorState =
    hasError &&
    !isLoading;

  const showEmptyState =
    !isLoading &&
    !hasError &&
    !hasResults;

  // ===========================================================================
  // Render
  // ===========================================================================

  return (
    <section
      className={cn(
        "w-full",
        "min-w-0",
        className,
      )}
      aria-label="Journey marketplace"
    >
      <div
        className={cn(
          "w-full",
          "min-w-0",
          "space-y-[clamp(0.625rem,1.4vw,0.875rem)]",
        )}
      >
        {/* ----------------------------------------------------------------- */}
        {/* Marketplace Heading                                               */}
        {/* ----------------------------------------------------------------- */}

        <div
          className={cn(
            "flex",
            "min-w-0",
            "items-center",
            "justify-between",
            "gap-[clamp(0.4rem,1.2vw,1rem)]",
          )}
        >
          <div className="min-w-0 flex-1">
            <p
              className={cn(
                "truncate",
                "text-[clamp(0.55rem,0.75vw,0.7rem)]",
                "font-semibold",
                "uppercase",
                "tracking-[0.14em]",
                "text-[var(--brand)]",
              )}
            >
              The Journey Market
            </p>

            <h2
              className={cn(
                "mt-0.5",
                "truncate",
                "text-[clamp(0.95rem,1.7vw,1.2rem)]",
                "font-semibold",
                "leading-tight",
                "text-[var(--foreground)]",
              )}
            >
              Journeys
            </h2>

            <p
              className={cn(
                "mt-0.5",
                "max-w-2xl",
                "truncate",
                "text-[clamp(0.65rem,0.9vw,0.8rem)]",
                "leading-relaxed",
                "text-[var(--foreground-muted)]",
              )}
            >
              See where people are going and find a Journey that matches your
              plans.
            </p>
          </div>

          {onCreateJourney && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onCreateJourney}
              className={cn(
                "min-w-0",
                "max-w-full",
                "shrink-0",
                "overflow-hidden",
                "whitespace-nowrap",
                "text-[clamp(0.55rem,0.8vw,0.8rem)]",
                "px-[clamp(0.55rem,1vw,0.85rem)]",
              )}
            >
              <span className="truncate">
                Create Journey
              </span>
            </Button>
          )}
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Marketplace Filters                                               */}
        {/* ----------------------------------------------------------------- */}
        {/*
          The filter component remains mounted and editable during loading.
          Loading state belongs to the result area.
        */}

        <div
          className={cn(
            "w-full",
            "min-w-0",
          )}
        >
          <JourneyMarketplaceFilters
            values={filters}
            onChange={handleFiltersChange}
            hasActiveFilters={hasActiveFilters}
            isLoading={isLoading}
          />
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Background Loading Indicator                                      */}
        {/* ----------------------------------------------------------------- */}
        {/*
          Existing results remain visible while the next query is resolving.
        */}

        {showUpdatingState && (
          <div
            className={cn(
              "flex",
              "w-full",
              "min-w-0",
              "items-center",
              "justify-center",
              "gap-[clamp(0.3rem,0.6vw,0.45rem)]",
              "rounded-[var(--radius-md)]",
              "border",
              "border-[var(--border-subtle)]",
              "bg-[var(--background-subtle)]",
              "px-[clamp(0.5rem,1vw,0.75rem)]",
              "py-[clamp(0.35rem,0.7vw,0.5rem)]",
              "text-[clamp(0.55rem,0.75vw,0.7rem)]",
              "text-[var(--foreground-muted)]",
            )}
            role="status"
            aria-live="polite"
          >
            Updating journeys…
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* Initial Loading State                                             */}
        {/* ----------------------------------------------------------------- */}

        {showLoadingState && (
          <div
            className={cn(
              "flex",
              "w-full",
              "min-w-0",
              "items-center",
              "justify-center",
              "rounded-[var(--radius-lg)]",
              "border",
              "border-[var(--border)]",
              "bg-[var(--surface)]",
              "px-[clamp(0.625rem,1.5vw,1rem)]",
              "py-[clamp(1rem,2.5vw,1.5rem)]",
              "text-center",
              "text-[clamp(0.65rem,0.9vw,0.875rem)]",
              "text-[var(--foreground-muted)]",
            )}
            role="status"
            aria-live="polite"
          >
            Loading Journeys…
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* Error State                                                       */}
        {/* ----------------------------------------------------------------- */}

        {showErrorState && (
          <div
            className={cn(
              "w-full",
              "min-w-0",
            )}
          >
            <JourneyErrorState
              onRetry={refetch}
              onSecondaryAction={
                hasActiveFilters
                  ? handleClearFilters
                  : undefined
              }
            />
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* Empty State                                                       */}
        {/* ----------------------------------------------------------------- */}

        {showEmptyState && (
          <div
            className={cn(
              "w-full",
              "min-w-0",
            )}
          >
            <JourneyEmptyState
              hasActiveFilters={
                hasActiveFilters
              }
              onClearFilters={
                hasActiveFilters
                  ? handleClearFilters
                  : undefined
              }
            />
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* Results                                                           */}
        {/* ----------------------------------------------------------------- */}

        {hasResults && (
          <div
            className={cn(
              "relative",
              "w-full",
              "min-w-0",
            )}
          >
            <JourneyList
              journeys={journeys}
              emphasis={emphasis}
              onView={
                onView
                  ? (journey) => {
                      onView(
                        journey.publicId,
                      );
                    }
                  : undefined
              }
              onShare={
                onShare
                  ? (journey) => {
                      onShare(
                        journey.publicId,
                      );
                    }
                  : undefined
              }
              onBook={
                onBook
                  ? (journey) => {
                      onBook(
                        journey.publicId,
                      );
                    }
                  : undefined
              }
              bookingJourneyPublicId={
                bookingJourneyPublicId
              }
              viewDisabled={
                viewDisabled
              }
              shareDisabled={
                shareDisabled
              }
              bookDisabled={
                bookDisabled
              }
              viewLabel={
                viewLabel
              }
              shareLabel={
                shareLabel
              }
              bookLabel={
                bookLabel
              }
              bookingLabel={
                bookingLabel
              }
            />
          </div>
        )}
      </div>
    </section>
  );
}