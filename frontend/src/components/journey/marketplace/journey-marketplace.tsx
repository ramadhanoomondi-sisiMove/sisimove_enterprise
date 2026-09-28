// -----------------------------------------------------------------------------
// sisiMove — Journey Marketplace
// -----------------------------------------------------------------------------
//
// Public Journey marketplace composition component.
//
// Responsibilities:
// - own marketplace filter state;
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

"use client";

import { useCallback, useState } from "react";

import { Button } from "@/components/ui";
import { cn } from "@/foundation";

import { usePublicJourneys } from "@/features/journey/hooks/queries/use-public-journeys";

import { JourneyEmptyState } from "./journey-empty-state";
import { JourneyErrorState } from "./journey-error-state";
import { JourneyList } from "./journey-list";
import {
  JourneyMarketplaceFilters,
  type JourneyMarketplaceFilterValues,
} from "./journey-marketplace-filters";

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

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
   * Optional additional classes for the marketplace surface.
   */
  readonly className?: string;

  /**
   * Controls the density of Journey cards.
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
  readonly onView?: (journeyPublicId: string) => void;

  /**
   * Optional Book Journey action.
   *
   * Booking behavior remains owned by the parent.
   */
  readonly onBook?: (journeyPublicId: string) => void;

  /**
   * Public ID of the Journey currently being booked.
   */
  readonly bookingJourneyPublicId?: string | null;

  /**
   * Allows the parent to disable Journey View actions.
   */
  readonly viewDisabled?: boolean;

  /**
   * Allows the parent to disable Journey Book actions.
   */
  readonly bookDisabled?: boolean;

  /**
   * Optional action labels.
   */
  readonly viewLabel?: string;
  readonly bookLabel?: string;
  readonly bookingLabel?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyMarketplace({
  initialFrom = "",
  initialTo = "",
  initialDate = "",
  className,
  emphasis = "default",
  onCreateJourney,
  onView,
  onBook,
  bookingJourneyPublicId = null,
  viewDisabled = false,
  bookDisabled = false,
  viewLabel = "View Journey",
  bookLabel = "Book Journey",
  bookingLabel = "Booking…",
}: JourneyMarketplaceProps) {
  // ---------------------------------------------------------------------------
  // Marketplace filter state
  // ---------------------------------------------------------------------------
  //
  // Initial values establish the marketplace's initial UI state.
  //
  // The marketplace owns subsequent user interaction with these filters.
  // We intentionally do not synchronize them back from props with useEffect.
  // ---------------------------------------------------------------------------

  const [filters, setFilters] =
    useState<JourneyMarketplaceFilterValues>(() => ({
      from: initialFrom,
      to: initialTo,
      date: initialDate,
    }));

  // ---------------------------------------------------------------------------
  // Public Journey query
  // ---------------------------------------------------------------------------
  //
  // The query hook owns:
  // - HTTP execution;
  // - request lifecycle;
  // - server-state management;
  // - stale-request protection;
  // - error state;
  // - explicit refetch capability.
  //
  // The marketplace supplies only the current filter values.
  //
  // The hook exposes `journeys` directly. It does not use a React Query-style
  // `data` property.
  // ---------------------------------------------------------------------------

  const {
    journeys,
    isLoading,
    error,
    refetch,
  } = usePublicJourneys({
    from: filters.from.trim() || undefined,
    to: filters.to.trim() || undefined,
    date: filters.date || undefined,
  });

  // ---------------------------------------------------------------------------
  // Filter changes
  // ---------------------------------------------------------------------------

  const handleFiltersChange = useCallback(
    (nextFilters: JourneyMarketplaceFilterValues): void => {
      setFilters(nextFilters);
    },
    [],
  );

  // ---------------------------------------------------------------------------
  // Clear filters
  // ---------------------------------------------------------------------------

  const handleClearFilters = useCallback((): void => {
    setFilters({
      from: "",
      to: "",
      date: "",
    });
  }, []);

  // ---------------------------------------------------------------------------
  // Result state
  // ---------------------------------------------------------------------------

  const hasError = error !== null;

  const isEmpty =
    !isLoading &&
    !hasError &&
    journeys.length === 0;

  const hasResults =
    !isLoading &&
    !hasError &&
    journeys.length > 0;

  const hasActiveFilters =
    filters.from.trim().length > 0 ||
    filters.to.trim().length > 0 ||
    filters.date.length > 0;

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <section
      className={cn("w-full", className)}
      aria-label="Journey marketplace"
    >
      <div className="space-y-4">
        {/* ----------------------------------------------------------------- */}
        {/* Marketplace heading                                               */}
        {/* ----------------------------------------------------------------- */}

        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand)]">
              The Journey Market
            </p>

            <h2 className="mt-1 text-lg font-semibold text-[var(--foreground)]">
              Journeys
            </h2>

            <p className="mt-1 text-sm text-[var(--foreground-muted)]">
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
              className="shrink-0"
            >
              Create Journey
            </Button>
          )}
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Marketplace filters                                                */}
        {/* ----------------------------------------------------------------- */}

        <JourneyMarketplaceFilters
          values={filters}
          onChange={handleFiltersChange}
          hasActiveFilters={hasActiveFilters}
          isLoading={isLoading}
        />

        {/* ----------------------------------------------------------------- */}
        {/* Loading state                                                      */}
        {/* ----------------------------------------------------------------- */}

        {isLoading && (
          <div
            className={cn(
              "rounded-[var(--radius-lg)]",
              "border",
              "border-[var(--border)]",
              "bg-[var(--surface)]",
              "px-4",
              "py-8",
              "text-center",
              "text-sm",
              "text-[var(--foreground-muted)]",
            )}
            role="status"
            aria-live="polite"
          >
            Loading Journeys…
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* Error state                                                        */}
        {/* ----------------------------------------------------------------- */}

        {hasError && !isLoading && (
          <JourneyErrorState
            onRetry={() => {
              void refetch();
            }}
            onSecondaryAction={
              hasActiveFilters
                ? handleClearFilters
                : undefined
            }
          />
        )}

        {/* ----------------------------------------------------------------- */}
        {/* Empty state                                                        */}
        {/* ----------------------------------------------------------------- */}

        {isEmpty && (
          <JourneyEmptyState
            hasActiveFilters={hasActiveFilters}
            onClearFilters={
              hasActiveFilters
                ? handleClearFilters
                : undefined
            }
          />
        )}

        {/* ----------------------------------------------------------------- */}
        {/* Results                                                            */}
        {/* ----------------------------------------------------------------- */}

        {hasResults && (
          <JourneyList
            journeys={journeys}
            emphasis={emphasis}
            onView={
              onView
                ? (journey) => {
                    onView(journey.publicId);
                  }
                : undefined
            }
            onBook={
              onBook
                ? (journey) => {
                    onBook(journey.publicId);
                  }
                : undefined
            }
            bookingJourneyPublicId={bookingJourneyPublicId}
            viewDisabled={viewDisabled}
            bookDisabled={bookDisabled}
            viewLabel={viewLabel}
            bookLabel={bookLabel}
            bookingLabel={bookingLabel}
          />
        )}
      </div>
    </section>
  );
}