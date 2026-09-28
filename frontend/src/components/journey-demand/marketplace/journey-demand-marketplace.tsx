// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Marketplace
// -----------------------------------------------------------------------------
//
// Journey Demand marketplace composition component.
//
// Responsibilities:
// - own marketplace filter state;
// - execute the Journey Demand collection query;
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
// - no Journey Demand mutation handling.
//
// The Journey Demand query hook remains the server-state boundary.
// The backend remains authoritative for the returned public Journey Demand
// projections.
//
// -----------------------------------------------------------------------------

'use client';

import { useCallback, useState } from 'react';

import { Button } from '@/components/ui';
import { cn } from '@/foundation';

import { useJourneyDemands } from '@/features/journey-demand/hooks';

import {
  JourneyDemandEmptyState,
} from './journey-demand-empty-state';

import {
  JourneyDemandErrorState,
} from './journey-demand-error-state';

import {
  JourneyDemandList,
} from './journey-demand-list';

import {
  JourneyDemandMarketplaceFilters,
} from './journey-demand-marketplace-filters';

import type {
  JourneyDemandMarketplaceFiltersValue,
} from './journey-demand-marketplace-filters';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

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
   */
  readonly emphasis?: 'compact' | 'default';

  /**
   * Optional action supplied by the parent for creating a Journey Demand.
   */
  readonly onCreateDemand?: () => void;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyDemandMarketplace({
  initialFrom = '',
  initialTo = '',
  initialDate = '',
  className,
  emphasis = 'default',
  onCreateDemand,
}: JourneyDemandMarketplaceProps) {
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
    useState<JourneyDemandMarketplaceFiltersValue>(() => ({
      from: initialFrom,
      to: initialTo,
      date: initialDate,
    }));

  // ---------------------------------------------------------------------------
  // Journey Demand query
  // ---------------------------------------------------------------------------
  //
  // The hook owns:
  // - HTTP execution;
  // - request lifecycle;
  // - cancellation/stale-request protection;
  // - error state;
  // - explicit refetch capability.
  //
  // The marketplace supplies only the current query values and decides when
  // the hook's refetch capability should be invoked.
  // ---------------------------------------------------------------------------

  const {
    data: demands,
    isLoading,
    error,
    refetch,
  } = useJourneyDemands({
    from: filters.from.trim() || undefined,
    to: filters.to.trim() || undefined,
    date: filters.date || undefined,
  });

  // ---------------------------------------------------------------------------
  // Filter changes
  // ---------------------------------------------------------------------------

  const handleFiltersChange = useCallback(
    (
      nextFilters: JourneyDemandMarketplaceFiltersValue,
    ): void => {
      setFilters(nextFilters);
    },
    [],
  );

  // ---------------------------------------------------------------------------
  // Clear filters
  // ---------------------------------------------------------------------------

  const handleClearFilters = useCallback((): void => {
    setFilters({
      from: '',
      to: '',
      date: '',
    });
  }, []);

  // ---------------------------------------------------------------------------
  // Result state
  // ---------------------------------------------------------------------------

  const hasError = error !== null;

  const isEmpty =
    !isLoading &&
    !hasError &&
    demands.length === 0;

  const hasResults =
    !isLoading &&
    !hasError &&
    demands.length > 0;

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <section
      className={cn('w-full', className)}
      aria-label="Journey Demand marketplace"
    >
      <div className="space-y-4">
        {/* ----------------------------------------------------------------- */}
        {/* Marketplace heading                                               */}
        {/* ----------------------------------------------------------------- */}

        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-[var(--foreground)]">
              Travel needs
            </h2>

            <p className="mt-1 text-sm text-[var(--foreground-muted)]">
              See where people are looking to travel.
            </p>
          </div>

          {onCreateDemand && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onCreateDemand}
              className="shrink-0"
            >
              Create demand
            </Button>
          )}
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Marketplace filters                                                */}
        {/* ----------------------------------------------------------------- */}

        <JourneyDemandMarketplaceFilters
          value={filters}
          onChange={handleFiltersChange}
          onClear={handleClearFilters}
          disabled={isLoading}
        />

        {/* ----------------------------------------------------------------- */}
        {/* Loading state                                                      */}
        {/* ----------------------------------------------------------------- */}

        {isLoading && (
          <div
            className={cn(
              'rounded-[var(--radius-lg)]',
              'border border-[var(--border)]',
              'bg-[var(--surface)]',
              'px-4 py-8',
              'text-center text-sm',
              'text-[var(--foreground-muted)]',
            )}
            role="status"
            aria-live="polite"
          >
            Loading travel needs…
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* Error state                                                        */}
        {/* ----------------------------------------------------------------- */}

        {hasError && !isLoading && (
          <JourneyDemandErrorState
            onRetry={refetch}
          />
        )}

        {/* ----------------------------------------------------------------- */}
        {/* Empty state                                                        */}
        {/* ----------------------------------------------------------------- */}

        {isEmpty && (
          <JourneyDemandEmptyState
            primaryAction={
              onCreateDemand
                ? {
                    label: 'Create a demand',
                    onClick: onCreateDemand,
                  }
                : undefined
            }
          />
        )}

        {/* ----------------------------------------------------------------- */}
        {/* Results                                                            */}
        {/* ----------------------------------------------------------------- */}

        {hasResults && (
          <JourneyDemandList
            demands={demands}
            emphasis={emphasis}
          />
        )}
      </div>
    </section>
  );
}

