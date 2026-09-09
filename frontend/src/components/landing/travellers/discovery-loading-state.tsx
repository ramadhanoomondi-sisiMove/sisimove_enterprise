// -----------------------------------------------------------------------------
// sisiMove — Traveller Discovery Loading State
// -----------------------------------------------------------------------------
//
// Presentation component for the loading state of public traveller discovery.
//
// Responsibilities:
// - Render a responsive grid of discovery skeletons.
// - Provide an accessible loading status.
// - Keep the skeleton structure aligned with the traveller discovery card.
// - Remain independent of API, authentication, routing, and business logic.
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
    Math.max(Math.floor(count), MIN_LOADING_COUNT),
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
        {/* Traveller Summary                                                 */}
        {/* ----------------------------------------------------------------- */}

        <div className="flex items-start gap-3">
          <Skeleton
            radius="full"
            className="h-10 w-10 shrink-0"
          />

          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton
              radius="sm"
              className="h-4 w-32"
            />

            <div className="flex flex-wrap gap-2">
              <Skeleton
                radius="sm"
                className="h-3 w-16"
              />

              <Skeleton
                radius="sm"
                className="h-3 w-20"
              />

              <Skeleton
                radius="sm"
                className="h-3 w-24"
              />
            </div>
          </div>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Activity                                                          */}
        {/* ----------------------------------------------------------------- */}

        <div className="border-t border-[var(--border-subtle)] pt-4">
          <div className="space-y-4">
            <Skeleton
              radius="sm"
              className="h-4 w-20"
            />

            {/* Route */}
            <div className="space-y-2">
              <Skeleton
                radius="sm"
                className="h-5 w-full"
              />

              <Skeleton
                radius="sm"
                className="h-5 w-3/4"
              />
            </div>

            {/* Schedule / vehicle / availability */}
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
          </div>
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
      aria-label="Loading travellers"
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
        Loading travellers.
      </span>
    </div>
  );
}