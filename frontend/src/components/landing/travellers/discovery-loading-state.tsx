// -----------------------------------------------------------------------------
// sisiMove — Traveller Discovery Loading State
// -----------------------------------------------------------------------------
//
// Presentation component for the loading state of public Journey discovery.
//
// Public discovery is Journey-first. The discovery layer may contain:
// - published Journeys;
// - open Journey Demands.
//
// The loading state therefore represents discovery activity rather than a
// resolved traveller profile.
//
// Responsibilities:
// - Render a responsive grid of discovery skeletons.
// - Provide an accessible loading status.
// - Keep the skeleton structure aligned with discovery activity cards.
// - Remain independent of API, authentication, routing, and business logic.
//
// This component does not:
// - fetch discovery data;
// - resolve traveller identity;
// - determine Journey or Demand state;
// - perform filtering or matching.
//
// -----------------------------------------------------------------------------

import type { HTMLAttributes } from 'react';

import { Card, Skeleton } from '../../ui';

import { cn } from '../../../foundation/utils/cn';

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const DEFAULT_LOADING_COUNT = 3;
const MIN_LOADING_COUNT = 1;
const MAX_LOADING_COUNT = 8;

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface DiscoveryLoadingStateProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /**
   * Number of loading cards to display.
   *
   * Values are normalized to the supported range.
   */
  readonly count?: number;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function normalizeCount(count: number): number {
  if (!Number.isFinite(count)) {
    return DEFAULT_LOADING_COUNT;
  }

  return Math.min(
    Math.max(
      Math.floor(count),
      MIN_LOADING_COUNT,
    ),
    MAX_LOADING_COUNT,
  );
}

// -----------------------------------------------------------------------------
// Loading Card
// -----------------------------------------------------------------------------

function TravellerDiscoveryLoadingCard() {
  return (
    <Card
      padding="md"
      aria-hidden="true"
    >
      <div className="space-y-5">
        {/* ----------------------------------------------------------------- */}
        {/* Activity Type                                                     */}
        {/* ----------------------------------------------------------------- */}

        <div className="flex items-center justify-between gap-3">
          <Skeleton
            radius="sm"
            className="h-4 w-20"
          />

          <Skeleton
            radius="full"
            className="h-6 w-16"
          />
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Route                                                              */}
        {/* ----------------------------------------------------------------- */}

        <div className="space-y-3">
          <Skeleton
            radius="sm"
            className="h-5 w-4/5"
          />

          <Skeleton
            radius="sm"
            className="h-5 w-3/5"
          />
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Journey Details                                                    */}
        {/* ----------------------------------------------------------------- */}

        <div className="flex flex-wrap gap-3">
          <Skeleton
            radius="sm"
            className="h-4 w-28"
          />

          <Skeleton
            radius="sm"
            className="h-4 w-24"
          />

          <Skeleton
            radius="sm"
            className="h-4 w-20"
          />
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Availability / Price                                               */}
        {/* ----------------------------------------------------------------- */}

        <div className="flex items-center justify-between gap-4 border-t border-[var(--border-subtle)] pt-4">
          <Skeleton
            radius="sm"
            className="h-4 w-28"
          />

          <Skeleton
            radius="sm"
            className="h-5 w-20"
          />
        </div>
      </div>
    </Card>
  );
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function DiscoveryLoadingState({
  count = DEFAULT_LOADING_COUNT,
  className,
  ...props
}: DiscoveryLoadingStateProps) {
  const normalizedCount = normalizeCount(count);

  return (
    <div
      {...props}
      role="status"
      aria-busy="true"
      aria-label="Loading journeys"
      className={cn(
        'grid',
        'grid-cols-1',
        'gap-4',
        'md:grid-cols-2',
        'xl:grid-cols-3',
        className,
      )}
    >
      {Array.from(
        { length: normalizedCount },
        (_, index) => (
          <TravellerDiscoveryLoadingCard
            key={`traveller-discovery-loading-${index}`}
          />
        ),
      )}

      <span className="sr-only">
        Loading journeys.
      </span>
    </div>
  );
}