// -----------------------------------------------------------------------------
// sisiMove — Journey Demand List
// -----------------------------------------------------------------------------
//
// Authenticated management collection for the current traveller's
// Journey Demands.
//
// Responsibilities:
// - Consume the authenticated Journey Demand collection hook.
// - Render loading, error, and empty states.
// - Render Journey Demand cards.
// - Provide pagination controls when additional records are available.
//
// This component does NOT:
// - construct HTTP requests,
// - manage authentication,
// - determine the current identity,
// - mutate Journey Demands,
// - publish/cancel/modify a demand,
// - duplicate Journey Demand API logic.
//
// -----------------------------------------------------------------------------

'use client';

import {
  Button,
  EmptyState,
  ErrorState,
  Spinner,
} from '@/components/ui';

import {
  useMyJourneyDemands,
} from '@/features/journey-demand/hooks';

import {
  JourneyDemandCard,
} from './journey-demand-card';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyDemandListProps {
  limit?: number;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyDemandList({
  limit = 20,
}: JourneyDemandListProps) {
  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useMyJourneyDemands({
    limit,
    offset: 0,
  });

  // ---------------------------------------------------------------------------
  // Loading
  // ---------------------------------------------------------------------------

  if (isLoading) {
    return (
      <div
        className="flex min-h-48 items-center justify-center"
        aria-live="polite"
        aria-busy="true"
      >
        <Spinner size="md" />
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Error
  // ---------------------------------------------------------------------------

  if (isError) {
    return (
      <ErrorState
        title="We couldn't load your journey demands"
        description={
          error instanceof Error
            ? error.message
            : 'Something went wrong while loading your journey demands.'
        }
        action={{
          label: 'Try again',
          onClick: () => {
            void refetch();
          },
        }}
      />
    );
  }

  // ---------------------------------------------------------------------------
  // Normalize collection
  // ---------------------------------------------------------------------------
  //
  // The hook owns the API response contract. The component only needs the
  // collection itself.
  //
  // The common collection shape is supported here without leaking HTTP
  // response details into the presentation layer.
  //
  // ---------------------------------------------------------------------------

  const demands = Array.isArray(data)
    ? data
    : data?.items ?? [];

  // ---------------------------------------------------------------------------
  // Empty
  // ---------------------------------------------------------------------------

  if (demands.length === 0) {
    return (
      <EmptyState
        title="No journey demands yet"
        description="Tell the sisiMove community where you need to go and when you want to travel."
        action={{
          label: 'Create a journey demand',
          href: '/journey-demands/create',
        }}
      />
    );
  }

  // ---------------------------------------------------------------------------
  // Collection
  // ---------------------------------------------------------------------------

  return (
    <div className="space-y-4">
      {/* ------------------------------------------------------------------- */}
      {/* Collection header                                                   */}
      {/* ------------------------------------------------------------------- */}

      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-900">
            Your journey demands
          </p>

          <p className="mt-0.5 text-sm text-slate-500">
            {demands.length}{' '}
            {demands.length === 1
              ? 'demand'
              : 'demands'}
          </p>
        </div>

        {isFetching && !isLoading ? (
          <Spinner
            size="sm"
          />
        ) : null}
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Cards                                                               */}
      {/* ------------------------------------------------------------------- */}

      <div
        className="space-y-3"
        aria-live="polite"
      >
        {demands.map((demand) => (
          <JourneyDemandCard
            key={demand.publicId}
            demand={demand}
          />
        ))}
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Pagination                                                          */}
      {/* ------------------------------------------------------------------- */}
      {/*
       * The current authenticated API contract exposes limit/offset.
       *
       * The initial management surface intentionally starts at offset 0.
       * Pagination can be expanded once the hook exposes total/hasNext
       * metadata from the backend response.
       *
       * We do not manufacture pagination state here without authoritative
       * collection metadata.
       */}
      {demands.length >= limit ? (
        <div className="flex justify-center pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled
            aria-label="More journey demands"
          >
            More demands
          </Button>
        </div>
      ) : null}
    </div>
  );
}