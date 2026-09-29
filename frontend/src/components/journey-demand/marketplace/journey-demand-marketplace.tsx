// -----------------------------------------------------------------------------
// Path: src/features/journey-demand/components/journey-demand-marketplace.tsx
// -----------------------------------------------------------------------------
//
// sisiMove — Journey Demand Marketplace
//
// Journey Demand marketplace composition component.
//
// Responsibilities:
// - own committed marketplace filter state;
// - execute the Journey Demand collection query;
// - connect filters to the query boundary;
// - render loading, error, empty, and populated states;
// - compose the marketplace filters, list, and state components;
// - expose public presentation actions to the Journey Demand list.
//
// Non-responsibilities:
// - no API calls directly;
// - no response mapping;
// - no domain lifecycle logic;
// - no sorting or filtering of returned data in memory;
// - no reconstruction of backend state;
// - no route construction;
// - no Journey Demand mutation handling.
//
// Presentation flow:
//
//     LandingPage
//         ↓
//     JourneyDemandMarketplace
//         ↓
//     JourneyDemandList
//         ↓
//     JourneyDemandCard
//         ↓
//     JourneyDemandActions
//
// The marketplace does not know how navigation, sharing, or authentication
// is implemented. It only forwards the supplied public Journey Demand ID.
//
// -----------------------------------------------------------------------------
//
// FILTER LIFECYCLE
// ----------------
//
// JourneyDemandMarketplace owns the committed query state.
//
// JourneyDemandMarketplaceFilters owns the temporary typing state.
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
//     useJourneyDemands()
//          │
//          ▼
//     backend query
//
// IMPORTANT
// ---------
//
// The marketplace MUST NOT disable or unmount JourneyDemandMarketplaceFilters
// while the query is loading.
//
// The user must be able to continue typing while results are loading.
//
// Loading belongs to the result area, not the input controls.
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
// Journey Demand Query
// -----------------------------------------------------------------------------

import { useJourneyDemands } from "@/features/journey-demand/hooks";

// -----------------------------------------------------------------------------
// Components
// -----------------------------------------------------------------------------

import { JourneyDemandEmptyState } from "./journey-demand-empty-state";
import { JourneyDemandErrorState } from "./journey-demand-error-state";
import { JourneyDemandList } from "./journey-demand-list";
import {
  JourneyDemandMarketplaceFilters,
  type JourneyDemandMarketplaceFiltersValue,
} from "./journey-demand-marketplace-filters";

// =============================================================================
// Props
// =============================================================================

export interface JourneyDemandMarketplaceProps {
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
   * Controls the density of Journey Demand cards.
   *
   * Compact is the default public marketplace presentation so multiple
   * cards remain visible while browsing and filtering.
   */
  readonly emphasis?: "compact" | "default";

  /**
   * Optional action supplied by the parent for creating a Journey Demand.
   */
  readonly onCreateDemand?: () => void;

  /**
   * Optional public Journey Demand presentation action.
   */
  readonly onView?: (
    demandPublicId: string,
  ) => void;

  /**
   * Optional public Journey Demand sharing action.
   */
  readonly onShare?: (
    demandPublicId: string,
  ) => void;

  /**
   * Optional authenticated Journey Demand participation action.
   */
  readonly onJoin?: (
    demandPublicId: string,
  ) => void;

  /**
   * Optional disabled state for View actions.
   */
  readonly viewDisabled?: boolean;

  /**
   * Optional disabled state for Share actions.
   */
  readonly shareDisabled?: boolean;

  /**
   * Optional disabled state for Join actions.
   */
  readonly joinDisabled?: boolean;

  /**
   * Optional View action label.
   */
  readonly viewLabel?: string;

  /**
   * Optional Share action label.
   */
  readonly shareLabel?: string;

  /**
   * Optional Join action label.
   */
  readonly joinLabel?: string;

  /**
   * Optional Join loading label.
   */
  readonly joiningLabel?: string;

  /**
   * Public ID of the Journey Demand currently being joined.
   *
   * Only the matching card receives its joining state.
   */
  readonly joiningDemandPublicId?: string | null;
}

// =============================================================================
// Constants
// =============================================================================

const EMPTY_FILTER_VALUES: JourneyDemandMarketplaceFiltersValue = {
  from: "",
  to: "",
  date: "",
};

// =============================================================================
// Component
// =============================================================================

export function JourneyDemandMarketplace({
  initialFrom = "",
  initialTo = "",
  initialDate = "",
  className,
  emphasis = "compact",
  onCreateDemand,
  onView,
  onShare,
  onJoin,
  viewDisabled = false,
  shareDisabled = false,
  joinDisabled = false,
  viewLabel = "View",
  shareLabel = "Share",
  joinLabel = "Join Demand",
  joiningLabel = "Joining…",
  joiningDemandPublicId = null,
}: JourneyDemandMarketplaceProps) {
  // ===========================================================================
  // Marketplace Filter State
  // ===========================================================================
  //
  // IMPORTANT:
  //
  // This is the committed marketplace query state.
  //
  // JourneyDemandMarketplaceFilters maintains its own temporary draft state
  // while the user types and calls this handler only after its debounce period.
  //
  // Do NOT synchronize this state back into the filter inputs.
  //

  const [filters, setFilters] =
    useState<JourneyDemandMarketplaceFiltersValue>(
      () => ({
        from: initialFrom,
        to: initialTo,
        date: initialDate,
      }),
    );

  // ===========================================================================
  // Journey Demand Query
  // ===========================================================================
  //
  // The backend remains authoritative for:
  //
  // - matching;
  // - filtering;
  // - returned Journey Demand projections.
  //
  // No client-side filtering is performed here.
  //

  const {
    data: demands,
    isLoading,
    error,
    refetch,
  } = useJourneyDemands({
    from:
      filters.from.trim() || undefined,

    to:
      filters.to.trim() || undefined,

    date:
      filters.date || undefined,
  });

  // ===========================================================================
  // Filter Changes
  // ===========================================================================
  //
  // Stable callback is important because JourneyDemandMarketplaceFilters uses
  // this callback as the dependency of its debounce effect.
  //
  // Keeping this callback stable prevents the debounce timer from restarting
  // because the parent recreated the callback during every render.
  //

  const handleFiltersChange = useCallback(
    (
      nextFilters: JourneyDemandMarketplaceFiltersValue,
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
  // Public Journey Demand Actions
  // ===========================================================================

  const handleViewDemand = useCallback(
    (demandPublicId: string): void => {
      onView?.(demandPublicId);
    },
    [onView],
  );

  const handleShareDemand = useCallback(
    (demandPublicId: string): void => {
      onShare?.(demandPublicId);
    },
    [onShare],
  );

  const handleJoinDemand = useCallback(
    (demandPublicId: string): void => {
      onJoin?.(demandPublicId);
    },
    [onJoin],
  );

  // ===========================================================================
  // Result State
  // ===========================================================================

  const hasError =
    error !== null;

  const isEmpty =
    !isLoading &&
    !hasError &&
    demands.length === 0;

  const hasResults =
    !isLoading &&
    !hasError &&
    demands.length > 0;

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
      aria-label="Journey Demand marketplace"
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
            "gap-[clamp(0.5rem,1.5vw,1rem)]",
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
              The Travel Needs Market
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
              Travel needs
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
              See where people are looking to travel and discover opportunities
              to match their plans.
            </p>
          </div>

          {onCreateDemand && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onCreateDemand}
              className={cn(
                "shrink-0",
                "whitespace-nowrap",
                "text-[clamp(0.65rem,0.85vw,0.8rem)]",
              )}
            >
              Create demand
            </Button>
          )}
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Marketplace Filters                                               */}
        {/* ----------------------------------------------------------------- */}
        {/*
          IMPORTANT:
          Do NOT pass `disabled={isLoading}` here.

          JourneyDemandMarketplaceFilters deliberately keeps its controls
          editable while the query is running.

          This prevents the first keystroke from disabling the input and
          allows the user to continue typing naturally.
        */}

        <div className="min-w-0">
          <JourneyDemandMarketplaceFilters
            value={filters}
            onChange={handleFiltersChange}
            onClear={handleClearFilters}
            disabled={false}
          />
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Loading State                                                      */}
        {/* ----------------------------------------------------------------- */}

        {isLoading && (
          <div
            className={cn(
              "w-full",
              "min-w-0",
              "rounded-[var(--radius-lg)]",
              "border",
              "border-[var(--border)]",
              "bg-[var(--surface)]",
              "px-[clamp(0.625rem,1.5vw,1rem)]",
              "py-[clamp(0.875rem,2vw,1.5rem)]",
              "text-center",
              "text-[clamp(0.7rem,0.9vw,0.875rem)]",
              "text-[var(--foreground-muted)]",
            )}
            role="status"
            aria-live="polite"
          >
            Loading travel needs…
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* Error State                                                        */}
        {/* ----------------------------------------------------------------- */}

        {hasError && !isLoading && (
          <div className="min-w-0">
            <JourneyDemandErrorState
              onRetry={() => {
                void refetch();
              }}
            />
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* Empty State                                                        */}
        {/* ----------------------------------------------------------------- */}

        {isEmpty && (
          <div className="min-w-0">
            <JourneyDemandEmptyState
              primaryAction={
                onCreateDemand
                  ? {
                      label: "Create a demand",
                      onClick: onCreateDemand,
                    }
                  : undefined
              }
            />
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* Results                                                            */}
        {/* ----------------------------------------------------------------- */}

        {hasResults && (
          <div className="min-w-0">
            <JourneyDemandList
              demands={demands}
              emphasis={emphasis}
              onView={handleViewDemand}
              onShare={handleShareDemand}
              onJoin={handleJoinDemand}
              viewDisabled={
                viewDisabled ||
                onView === undefined
              }
              shareDisabled={
                shareDisabled ||
                onShare === undefined
              }
              joinDisabled={
                joinDisabled ||
                onJoin === undefined
              }
              joiningDemandPublicId={
                joiningDemandPublicId
              }
              viewLabel={viewLabel}
              shareLabel={shareLabel}
              joinLabel={joinLabel}
              joiningLabel={joiningLabel}
            />
          </div>
        )}
      </div>
    </section>
  );
}